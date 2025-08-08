import { defineEventHandler, getMethod, readBody, createError } from 'h3'
import Database from '~/server/utils/database'
import { getClientIP } from '~/server/utils/clientInfo'
import type { RevokeCodeRequest, ApiResponse } from '~/types/api'
import { ActivationCodeStatus, OperationType } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  try {
    // 只允许POST请求
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        message: '方法不允许'
      })
    }

    // 解析请求体
    const body = await readBody<RevokeCodeRequest>(event)
    
    // 验证输入参数
    if (!body.codes || !Array.isArray(body.codes) || body.codes.length === 0) {
      throw createError({
        statusCode: 400,
        message: '请提供要吊销的激活码列表'
      })
    }

    if (body.codes.length > 1000) {
      throw createError({
        statusCode: 400,
        message: '单次最多吊销1000个激活码'
      })
    }

    if (!body.reason || body.reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: '请提供吊销原因'
      })
    }

    const db = Database
    const ANONYMOUS_OPERATOR_ID = 1 // 无认证模式下的操作员ID常量
    // const clientIP = getClientIP(event) || '127.0.0.1'
    
    // 查询存在的激活码
    const placeholders = body.codes.map(() => '?').join(',')
    const existingCodes = await db.query<any>(
      `SELECT activationCode, status FROM activation_code WHERE activationCode IN (${placeholders})`,
      body.codes
    )

    if (existingCodes.length === 0) {
      throw createError({
        statusCode: 404,
        message: '未找到任何指定的激活码'
      })
    }

    // 检查哪些激活码可以被吊销（排除已经吊销的）
    const revokableCodes = existingCodes.filter(code => 
      code.status !== ActivationCodeStatus.REVOKED
    )

    if (revokableCodes.length === 0) {
      return {
        success: false,
        message: '所有指定的激活码都已被吊销',
        data: {
          processedCount: 0,
          skippedCount: existingCodes.length
        }
      }
    }

    // 使用事务处理吊销操作
    await db.transaction(async (connection) => {
      // 批量更新激活码状态
      const revokePromises = revokableCodes.map(code =>
        connection.query(
          `UPDATE activation_code 
           SET status = ?, lastModifiedTime = NOW() 
           WHERE activationCode = ?`,
          [ActivationCodeStatus.REVOKED, code.activationCode]
        )
      )

      await Promise.all(revokePromises)

      // 记录操作日志 - 无认证模式（跳过日志记录）
      console.log(`无认证模式：成功吊销${revokableCodes.length}个激活码`)

      // 将吊销的激活码添加到黑名单
      const blacklistPromises = revokableCodes.map(code =>
        connection.query(
          `INSERT INTO blacklist_code (activationCode, reason, createdTime) 
           VALUES (?, ?, NOW()) 
           ON DUPLICATE KEY UPDATE reason = VALUES(reason)`,
          [code.activationCode, `吊销: ${body.reason}`]
        )
      )

      await Promise.all(blacklistPromises)
    })

    return {
      success: true,
      data: {
        processedCount: revokableCodes.length,
        skippedCount: existingCodes.length - revokableCodes.length,
        totalRequested: body.codes.length,
        notFound: body.codes.length - existingCodes.length
      },
      message: `成功吊销${revokableCodes.length}个激活码`
    }

  } catch (error: any) {
    console.error('吊销激活码失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: '服务器内部错误'
    })
  }
})
