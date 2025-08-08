import { createError } from 'h3'
import { Database } from '~/server/utils/database'
import type { ValidateCodeRequest } from '~/types/api'

export default defineEventHandler(async (event) => {
  const db = Database.getInstance();
  
  // 只接受POST请求
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: '方法不允许'
    })
  }

  try {
    const body: ValidateCodeRequest = await readBody(event)

    // 参数验证 - 无认证模式下允许userId为空，使用默认用户ID
    if (!body.code || !body.deviceFingerprint || !body.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: '参数不完整'
      })
    }
    
    // 无认证模式：如果没有提供userId或为null，使用默认用户ID 0
    const effectiveUserId = body.userId || 0;

    // 激活码格式验证 - 使用统一的格式规则
    if (!/^[A-Z2-9]{16,}$/.test(body.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: '激活码格式无效'
      })
    }

    console.log('🔍 开始验证激活码:', body.code)

    // 查询激活码信息
    const rows = await db.query(
      'SELECT activationCode, status, deviceFingerprint, expirationDate FROM activation_code WHERE activationCode = ?',
      [body.code]
    )

    console.log('🔍 数据库查询结果:', rows)
    console.log('🔍 查询返回行数:', rows ? rows.length : 0)

    if (!rows || rows.length === 0) {
      console.log('❌ 激活码不存在')
      return {
        success: false,
        data: {
          valid: false,
          message: '激活码不存在',
          statusCode: 2
        },
        message: '激活码验证失败'
      }
    }

    const codeInfo = rows[0]
    console.log('📋 激活码信息:', codeInfo)
    console.log('📋 激活码信息:', {
      activationCode: codeInfo.activationCode,
      status: codeInfo.status,
      deviceFingerprint: codeInfo.deviceFingerprint,
      expires_at: codeInfo.expirationDate
    })

    // 检查激活码是否过期
    if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) < new Date()) {
      console.log('⏰ 激活码已过期')
      return {
        success: false,
        data: {
          valid: false,
          message: '激活码已过期',
          statusCode: 2
        },
        message: '激活码验证失败'
      }
    }

    // 设备指纹验证逻辑
    if (codeInfo.status === '未使用') {
      console.log('🆕 首次激活 - 绑定设备指纹')
      
      // 更新激活码状态和设备指纹 - 使用有效的用户ID
      await db.query(
        'UPDATE activation_code SET status = ?, deviceFingerprint = ?, userId = ?, activationDate = NOW() WHERE activationCode = ?',
        ['已激活', body.deviceFingerprint, effectiveUserId, body.code]
      )

      console.log('✅ 激活成功，设备指纹已绑定:', body.deviceFingerprint)
      
      return {
        success: true,
        data: {
          valid: true,
          message: '激活成功',
          statusCode: 1
        },
        message: '验证成功'
      }

    } else if (codeInfo.status === '已激活') {
      console.log('🔍 已激活状态 - 验证设备指纹')
      
      if (codeInfo.deviceFingerprint === body.deviceFingerprint) {
        console.log('✅ 设备指纹匹配，验证通过')
        return {
          success: true,
          data: {
            valid: true,
            message: '验证通过',
            statusCode: 1
          },
          message: '验证成功'
        }
      } else {
        console.log('❌ 设备指纹不匹配', {
          存储设备指纹: codeInfo.deviceFingerprint,
          请求设备指纹: body.deviceFingerprint
        })
        return {
          success: false,
          data: {
            valid: false,
            message: '该激活码已被其他设备使用',
            statusCode: 3
          },
          message: '设备指纹冲突'
        }
      }

    } else {
      console.log('❌ 激活码状态无效:', codeInfo.status)
      return {
        success: false,
        data: {
          valid: false,
          message: '激活码状态无效',
          statusCode: 2
        },
        message: '激活码验证失败'
      }
    }

  } catch (error: any) {
    console.error('💥 验证激活码失败:', error)
    console.error('错误堆栈:', error.stack)
    console.error('错误消息:', error.message)
    console.error('错误代码:', error.code)
    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误: ' + error.message
    })
  }
})
