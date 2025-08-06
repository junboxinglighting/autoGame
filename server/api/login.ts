import { defineEventHandler, getMethod, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import Database from '~/server/utils/database'
import { TokenGenerator } from '~/server/utils/tokenGenerator'
import { getClientIP } from '~/server/utils/clientInfo'
import bcrypt from 'bcryptjs'
import type { LoginRequest, LoginResponse, ApiResponse } from '~/types/api'
import type { User } from '~/types/database'
import { OperationType } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<LoginResponse>> => {
  try {
    // 只允许POST请求
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        message: '方法不允许'
      })
    }

    // 解析请求体
    const body = await readBody<LoginRequest>(event)
    
    // 验证输入参数
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: '用户名和密码不能为空'
      })
    }

    // 初始化JWT密钥
    const config = useRuntimeConfig()
    TokenGenerator.setSecret(config.jwtSecret)

    const db = Database
    
    // 查询用户
    const user = await db.queryOne<User>(
      'SELECT * FROM user WHERE username = ? OR email = ?',
      [body.username, body.username]
    )

    if (!user) {
      // 记录登录失败日志
      const clientIP = getClientIP(event) || '127.0.0.1'
      await db.query(
        `INSERT INTO operation_log 
         (operatorId, operationType, target, detail, ip, createdTime) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          0, // 系统操作
          OperationType.LOGIN,
          body.username,
          JSON.stringify({
            result: 'failed',
            reason: '用户不存在'
          }),
          clientIP
        ]
      )

      throw createError({
        statusCode: 401,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const passwordValid = await bcrypt.compare(body.password, user.passwordHash)

    if (!passwordValid) {
      // 记录登录失败日志
      const clientIP = getClientIP(event) || '127.0.0.1'
      await db.query(
        `INSERT INTO operation_log 
         (operatorId, operationType, target, detail, ip, createdTime) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          user.userId,
          OperationType.LOGIN,
          body.username,
          JSON.stringify({
            result: 'failed',
            reason: '密码错误'
          }),
          clientIP
        ]
      )

      throw createError({
        statusCode: 401,
        message: '用户名或密码错误'
      })
    }

    // 生成JWT令牌
    const token = TokenGenerator.generateJWT({
      userId: user.userId,
      username: user.username
    })

    // 记录登录成功日志
    const clientIP = getClientIP(event) || '127.0.0.1'
    await db.query(
      `INSERT INTO operation_log 
       (operatorId, operationType, target, detail, ip, createdTime) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        user.userId,
        OperationType.LOGIN,
        body.username,
        JSON.stringify({
          result: 'success'
        }),
        clientIP
      ]
    )

    return {
      success: true,
      data: {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email
        }
      },
      message: '登录成功'
    }

  } catch (error: any) {
    console.error('登录失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: '服务器内部错误'
    })
  }
})
