import { BlacklistChecker } from '~/server/utils/blacklistChecker'
import type { ApiResponse } from '~/types/api'

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  try {
    const method = getMethod(event)
    
    if (method === 'POST') {
      // POST请求从请求体获取参数
      const body = await readBody(event)
      const { code, deviceFingerprint, ip } = body
      
      if (!code && !deviceFingerprint && !ip) {
        throw createError({
          statusCode: 400,
          statusMessage: '请提供要检查的激活码、设备指纹或IP地址'
        })
      }

      const results: any = {}

      if (code) {
        results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code)
      }

      if (deviceFingerprint) {
        results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(deviceFingerprint)
      }

      if (ip) {
        results.ipBlocked = await BlacklistChecker.isIPBlacklisted(ip)
      }

      const isBlocked = Object.values(results).some(blocked => blocked === true)

      return {
        success: true,
        data: {
          blocked: isBlocked,
          details: results
        },
        message: isBlocked ? '发现黑名单项目' : '未发现黑名单项目'
      }
      
    } else if (method === 'GET') {
      // GET请求从查询参数获取
      const query = getQuery(event)
      const { code, deviceFingerprint, ip } = query as { code?: string; deviceFingerprint?: string; ip?: string }

      if (!code && !deviceFingerprint && !ip) {
        throw createError({
          statusCode: 400,
          statusMessage: '请提供要检查的激活码、设备指纹或IP地址'
        })
      }

      const results: any = {}

      if (code) {
        results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code)
      }

      if (deviceFingerprint) {
        results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(deviceFingerprint)
      }

      if (ip) {
        results.ipBlocked = await BlacklistChecker.isIPBlacklisted(ip)
      }

      const isBlocked = Object.values(results).some(blocked => blocked === true)

      return {
        success: true,
        data: {
          blocked: isBlocked,
          details: results
        },
        message: isBlocked ? '发现黑名单项目' : '未发现黑名单项目'
      }
      
    } else {
      throw createError({
        statusCode: 405,
        statusMessage: '方法不允许，支持GET和POST'
      })
    }

  } catch (error: any) {
    console.error('检查黑名单失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})