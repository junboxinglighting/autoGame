import { createError } from 'h3'
import { Database } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = Database.getInstance();
  
  // 支持GET和POST请求
  const method = getMethod(event)
  if (method !== 'GET' && method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: '方法不允许，支持GET和POST'
    })
  }

  try {
    let params;
    
    // 根据请求方法获取参数
    if (method === 'GET') {
      // GET请求从URL参数获取
      const query = getQuery(event)
      params = {
        code: query.code,
        userId: parseInt(query.userId as string),
        deviceFingerprint: query.deviceFingerprint,
        ip: query.ip
      }
    } else {
      // POST请求从请求体获取
      params = await readBody(event)
    }

    // 参数验证
    if (!params.code || !params.userId || !params.deviceFingerprint || !params.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: '参数不完整'
      })
    }

    // 激活码格式验证（32位字母数字）
    if (!/^[A-Z0-9]{32}$/.test(params.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: '激活码格式无效'
      })
    }

    console.log('🔍 开始验证激活码:', params.code, '- 请求方式:', method)

    // 查询激活码信息
    const rows = await db.query(
      'SELECT activationCode, status, deviceFingerprint, expirationDate FROM activation_code WHERE activationCode = ?',
      [params.code]
    )

    console.log('🔍 数据库查询结果:', rows)

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
      
      // 更新激活码状态和设备指纹
      await db.query(
        'UPDATE activation_code SET status = ?, deviceFingerprint = ?, userId = ?, activationDate = NOW() WHERE activationCode = ?',
        ['已激活', params.deviceFingerprint, params.userId, params.code]
      )

      console.log('✅ 激活成功，设备指纹已绑定:', params.deviceFingerprint)
      
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
      
      if (codeInfo.deviceFingerprint === params.deviceFingerprint) {
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
          请求设备指纹: params.deviceFingerprint
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
