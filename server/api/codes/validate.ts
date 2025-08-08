import Database from '~/server/utils/database'
import { TokenGenerator } from '~/server/utils/tokenGenerator'
import { BlacklistChecker } from '~/server/utils/blacklistChecker'
import { CodeGenerator } from '~/server/utils/codeGenerator'
import type { ValidateCodeRequest, ValidateCodeResponse, ApiResponse } from '~/types/api'
import { ActivationCodeStatus, ActivationResult } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<ValidateCodeResponse>> => {
  try {
    // 只允许POST请求
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: '方法不允许'
      })
    }

    // 解析请求体
    const body = await readBody<ValidateCodeRequest>(event)
    
    // 验证输入参数
    if (!body.code || !CodeGenerator.validateFormat(body.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: '激活码格式无效'
      })
    }

    if (!body.deviceFingerprint || !body.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必要参数'
      })
    }
    
    // 无认证模式：如果没有提供userId或为null，使用默认用户ID 0
    const effectiveUserId = body.userId || 0;

    const db = Database
    
    // 检查黑名单
    const blacklistResult = await BlacklistChecker.checkBlacklist(
      body.code,
      body.deviceFingerprint,
      body.ip
    )
    
    if (blacklistResult.blocked) {
      // 记录失败的激活尝试 - 暂时注释掉数据库记录
      /* 
      await db.query(
        `INSERT INTO activation_record 
         (activationCode, userId, deviceFingerprint, ip, activationTime, result, errorMessage) 
         VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [
          body.code,
          body.userId,
          body.deviceFingerprint,
          body.ip,
          ActivationResult.FAILED,
          blacklistResult.reason
        ]
      )
      */

      return {
        success: false,
        data: {
          valid: false,
          message: blacklistResult.reason,
          statusCode: 2
        },
        message: '验证失败',
        code: 2
      }
    }

    // 查询激活码
    const activationCode = await db.queryOne<any>(
      'SELECT * FROM activation_code WHERE activationCode = ?',
      [body.code]
    )

    if (!activationCode) {
      await recordFailedActivation(db, body, '激活码不存在')
      return {
        success: false,
        data: {
          valid: false,
          message: '激活码不存在',
          statusCode: 2
        },
        message: '验证失败',
        code: 2
      }
    }

    // 检查激活码状态
    if (activationCode.status === ActivationCodeStatus.ACTIVATED) {
      // 激活码已被激活，验证IP是否匹配
      if (activationCode.ip && activationCode.ip !== body.ip) {
        await recordFailedActivation(db, body, '该激活码已被其他IP使用')
        return {
          success: false,
          data: {
            valid: false,
            message: '该激活码已被其他IP使用',
            statusCode: 3
          },
          message: '验证失败',
          code: 3
        }
      }
      
      // IP匹配，返回现有的激活信息
      const authInfo = await db.queryOne<any>(
        'SELECT tokenContent, expiryTime FROM authorization_info WHERE activationCode = ? ORDER BY createdTime DESC LIMIT 1',
        [body.code]
      )
      
      return {
        success: true,
        data: {
          valid: true,
          token: authInfo?.tokenContent,
          expiryTime: authInfo?.expiryTime ? new Date(authInfo.expiryTime) : undefined,
          message: '验证成功',
          statusCode: 1
        },
        message: '验证成功',
        code: 1
      }
    } else if (activationCode.status !== ActivationCodeStatus.UNUSED) {
      let message = '激活码无效'
      switch (activationCode.status) {
        case ActivationCodeStatus.EXPIRED:
          message = '激活码已过期'
          break
        case ActivationCodeStatus.REVOKED:
          message = '激活码已被吊销'
          break
      }
      
      await recordFailedActivation(db, body, message)
      return {
        success: false,
        data: {
          valid: false,
          message,
          statusCode: 2
        },
        message: '验证失败',
        code: 2
      }
    }

    // 检查过期时间
    if (activationCode.expirationDate && new Date(activationCode.expirationDate) < new Date()) {
      // 更新状态为已过期
      await db.query(
        'UPDATE activation_code SET status = ?, lastModifiedTime = NOW() WHERE activationCode = ?',
        [ActivationCodeStatus.EXPIRED, body.code]
      )
      
      await recordFailedActivation(db, body, '激活码已过期')
      return {
        success: false,
        data: {
          valid: false,
          message: '激活码已过期',
          statusCode: 2
        },
        message: '验证失败',
        code: 2
      }
    }

    // 检查设备绑定（如果已有绑定信息）
    if (activationCode.deviceFingerprint && 
        activationCode.deviceFingerprint !== body.deviceFingerprint) {
      await recordFailedActivation(db, body, '设备不匹配')
      return {
        success: false,
        data: {
          valid: false,
          message: '激活码已绑定其他设备',
          statusCode: 2
        },
        message: '验证失败',
        code: 2
      }
    }

    // 激活成功 - 更新激活码状态
    const expiryTime = activationCode.expirationDate ? 
      new Date(activationCode.expirationDate) : 
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 默认1年

    await db.query(
      `UPDATE activation_code 
       SET status = ?, deviceFingerprint = ?, ip = ?, 
           activationDate = NOW(), lastModifiedTime = NOW() 
       WHERE activationCode = ?`,
      [
        ActivationCodeStatus.ACTIVATED,
        body.deviceFingerprint,
        body.ip,
        body.code
      ]
    )

    // 记录成功的激活 - 暂时注释掉数据库记录
    /*
    await db.query(
      `INSERT INTO activation_record 
       (activationCode, userId, deviceFingerprint, ip, activationTime, result) 
       VALUES (?, ?, ?, ?, NOW(), ?)`,
      [
        body.code,
        body.userId,
        body.deviceFingerprint,
        body.ip,
        ActivationResult.SUCCESS
      ]
    )
    */

    // 生成授权令牌 - 使用有效的用户ID
    const authToken = TokenGenerator.generateAuthToken(
      body.code,
      effectiveUserId,
      body.deviceFingerprint,
      expiryTime
    )

    // 保存授权信息
    await db.query(
      `INSERT INTO authorization_info 
       (activationCode, tokenContent, effectiveTime, expiryTime, createdTime) 
       VALUES (?, ?, NOW(), ?, NOW())`,
      [body.code, authToken, expiryTime]
    )

    return {
      success: true,
      data: {
        valid: true,
        token: authToken,
        expiryTime,
        message: '激活成功',
        statusCode: 1
      },
      message: '验证成功',
      code: 1
    }

  } catch (error: any) {
    console.error('验证激活码失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})

// 记录失败的激活尝试
async function recordFailedActivation(
  db: any,
  request: ValidateCodeRequest,
  errorMessage: string
): Promise<void> {
  try {
    // 暂时注释掉数据库记录
    /*
    await db.query(
      `INSERT INTO activation_record 
       (activationCode, userId, deviceFingerprint, ip, activationTime, result, errorMessage) 
       VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
      [
        request.code,
        1, // 默认userId，因为记录失败函数中没有userId
        request.deviceFingerprint,
        request.ip,
        ActivationResult.FAILED,
        errorMessage
      ]
    )
    */
    console.log('记录失败激活:', errorMessage)
  } catch (error) {
    console.error('记录失败激活失败:', error)
  }
}
