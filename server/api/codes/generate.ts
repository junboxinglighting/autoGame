import { defineEventHandler, getMethod, readBody, createError } from 'h3'
import { CodeGenerator } from '~/server/utils/codeGenerator'
import Database from '~/server/utils/database'
import { getClientIP } from '~/server/utils/clientInfo'
import type { GenerateCodeRequest, GenerateCodeResponse, ApiResponse } from '~/types/api'
import { ActivationCodeStatus, OperationType } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<GenerateCodeResponse>> => {
  try {
    // 只允许POST请求
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        message: '方法不允许'
      })
    }

    // 解析请求体
    const body = await readBody<GenerateCodeRequest>(event)
    
    // 验证输入参数
    if (!body.count || body.count <= 0 || body.count > 10000) {
      throw createError({
        statusCode: 400,
        message: '生成数量必须在1-10000之间'
      })
    }

    if (!body.price || body.price <= 0) {
      throw createError({
        statusCode: 400,
        message: '价格必须大于0'
      })
    }

    // 计算过期时间
    let expirationDate: Date | null = null
    if (body.expirationDays && body.expirationDays > 0) {
      expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + body.expirationDays)
    }

    // 生成激活码
    const codes = CodeGenerator.generateBatch(body.count)
    
    // 批量插入数据库
    const db = Database
    const insertPromises = codes.map(code => 
      db.query(
        `INSERT INTO activation_code 
         (activationCode, status, userId, expirationDate, createdTime, lastModifiedTime) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          code,
          ActivationCodeStatus.UNUSED,
          body.userId || null,
          expirationDate
        ]
      )
    )

    await Promise.all(insertPromises)

    // 记录操作日志
    const operatorId = event.context.user?.userId || 0
    const clientIP = getClientIP(event)
    
    await db.query(
      `INSERT INTO operation_log 
       (operatorId, operationType, target, detail, ip, createdTime) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        operatorId,
        OperationType.GENERATE,
        `批量生成${body.count}个激活码`,
        JSON.stringify({
          count: body.count,
          price: body.price,
          expirationDays: body.expirationDays
        }),
        clientIP
      ]
    )

    return {
      success: true,
      data: {
        codes,
        totalCount: codes.length
      },
      message: `成功生成${codes.length}个激活码`
    }

  } catch (error: any) {
    console.error('生成激活码失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: '服务器内部错误'
    })
  }
})
