import Database from '~/server/utils/database'
import { BlacklistChecker } from '~/server/utils/blacklistChecker'
import type { BlacklistAddRequest, BlacklistQueryParams, ApiResponse, PaginationResponse } from '~/types/api'

// 添加到黑名单
export async function addToBlacklist(event: any): Promise<ApiResponse<any>> {
  try {
    const body = await readBody<BlacklistAddRequest>(event)
    
    // 验证输入参数
    if (!body.type || !['code', 'device', 'ip'].includes(body.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: '无效的黑名单类型'
      })
    }

    if (!body.value || body.value.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '黑名单值不能为空'
      })
    }

    if (!body.reason || body.reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '封禁原因不能为空'
      })
    }

    // 根据类型添加到相应的黑名单
    switch (body.type) {
      case 'code':
        await BlacklistChecker.addCodeToBlacklist(body.value, body.reason)
        break
      case 'device':
        await BlacklistChecker.addDeviceToBlacklist(body.value, body.reason)
        break
      case 'ip':
        await BlacklistChecker.addIPToBlacklist(body.value, body.reason)
        break
    }

    return {
      success: true,
      message: `${body.type}已成功添加到黑名单`
    }

  } catch (error: any) {
    console.error('添加黑名单失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
}

// 检查是否在黑名单中
export async function checkBlacklist(event: any): Promise<ApiResponse<any>> {
  try {
    const query = getQuery(event)
    const { code, device, ip } = query as { code?: string; device?: string; ip?: string }

    if (!code && !device && !ip) {
      throw createError({
        statusCode: 400,
        statusMessage: '请提供要检查的激活码、设备指纹或IP地址'
      })
    }

    const results: any = {}

    if (code) {
      results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code)
    }

    if (device) {
      results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(device)
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
}

// 查询黑名单列表
export async function listBlacklist(event: any): Promise<ApiResponse<PaginationResponse<any>>> {
  try {
    const query = getQuery(event) as BlacklistQueryParams
    
    // 设置默认分页参数
    const page = Math.max(1, parseInt(String(query.page)) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize)) || 20))
    const offset = (page - 1) * pageSize

    const db = Database
    
    let tableName = ''
    let valueColumn = ''
    
    switch (query.type) {
      case 'code':
        tableName = 'blacklist_code'
        valueColumn = 'activationCode'
        break
      case 'device':
        tableName = 'blacklist_device'
        valueColumn = 'deviceFingerprint'
        break
      case 'ip':
        tableName = 'blacklist_ip'
        valueColumn = 'ip'
        break
      default:
        throw createError({
          statusCode: 400,
          statusMessage: '请指定黑名单类型 (code, device, ip)'
        })
    }

    // 构建查询条件
    const conditions: string[] = []
    const params: any[] = []

    if (query.value) {
      conditions.push(`${valueColumn} LIKE ?`)
      params.push(`%${query.value}%`)
    }

    if (query.startDate) {
      conditions.push('createdTime >= ?')
      params.push(query.startDate)
    }

    if (query.endDate) {
      conditions.push('createdTime <= ?')
      params.push(query.endDate)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`
    const countResult = await db.queryOne<{ total: number }>(countSql, params)
    const total = countResult?.total || 0

    // 查询数据
    const dataSql = `
      SELECT 
        blacklistId,
        ${valueColumn} as value,
        reason,
        createdTime
      FROM ${tableName} 
      ${whereClause}
      ORDER BY createdTime DESC
      LIMIT ? OFFSET ?
    `
    
    const dataParams = [...params, pageSize, offset]
    const items = await db.query<any>(dataSql, dataParams)

    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      message: '查询成功'
    }

  } catch (error: any) {
    console.error('查询黑名单失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
}

// 路由处理器
export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  const method = getMethod(event)
  const url = getRouterParam(event, 'action') || ''

  try {
    if (method === 'POST' && url === 'add') {
      return await addToBlacklist(event)
    } else if (method === 'GET' && url === 'check') {
      return await checkBlacklist(event)
    } else if (method === 'GET' && url === 'list') {
      return await listBlacklist(event)
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: '接口不存在'
      })
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})
