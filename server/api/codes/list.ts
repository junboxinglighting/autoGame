import Database from '~/server/utils/database'
import type { CodeQueryParams, ApiResponse, PaginationResponse, CodeDetailResponse } from '~/types/api'
import { ActivationCodeStatus } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<PaginationResponse<CodeDetailResponse>>> => {
  try {
    // 设置响应头
    setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
    
    // 只允许GET请求
    if (getMethod(event) !== 'GET') {
      throw createError({
        statusCode: 405,
        statusMessage: '方法不允许'
      })
    }

    // 验证认证 - 更宽松的检查
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '') || ''
    console.log('收到的令牌:', token.substring(0, 20) + '...')
    
    if (!token) {
      console.log('未提供认证令牌')
      throw createError({
        statusCode: 401,
        statusMessage: '未提供认证令牌'
      })
    }

    // 解析查询参数
    const query = getQuery(event) as CodeQueryParams
    
    // 设置默认分页参数
    const page = Math.max(1, parseInt(String(query.page)) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize)) || 20))
    const offset = (page - 1) * pageSize

    const db = Database
    
    // 构建查询条件
    const conditions: string[] = []
    let whereClause = ''

    if (query.code && String(query.code).trim()) {
      conditions.push(`activationCode LIKE '%${String(query.code).trim()}%'`)
    }

    if (query.status && String(query.status).trim()) {
      conditions.push(`status = '${String(query.status).trim()}'`)
    }

    if (query.userId && Number(query.userId) > 0) {
      conditions.push(`userId = ${Number(query.userId)}`)
    }

    if (query.deviceFingerprint && String(query.deviceFingerprint).trim()) {
      conditions.push(`deviceFingerprint LIKE '%${String(query.deviceFingerprint).trim()}%'`)
    }

    if (query.startDate && String(query.startDate).trim()) {
      conditions.push(`createdTime >= '${String(query.startDate).trim()}'`)
    }

    if (query.endDate && String(query.endDate).trim()) {
      conditions.push(`createdTime <= '${String(query.endDate).trim()}'`)
    }

    whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM activation_code ${whereClause}`
    const countResult = await db.queryOne<{ total: number }>(countSql)
    const total = countResult?.total || 0

    // 查询数据
    const dataSql = `
      SELECT 
        activationCode,
        status,
        price,
        userId,
        deviceFingerprint,
        ip,
        activationDate,
        expirationDate,
        createdTime,
        lastModifiedTime
      FROM activation_code 
      ${whereClause}
      ORDER BY createdTime DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
    
    const codes = await db.query<any>(dataSql)

    // 转换数据格式
    const items: CodeDetailResponse[] = codes.map(code => ({
      activationCode: code.activationCode,
      status: code.status as ActivationCodeStatus,
      price: code.price ? parseFloat(code.price) : 0,
      userId: code.userId,
      deviceFingerprint: code.deviceFingerprint,
      ip: code.ip,
      activationDate: code.activationDate,
      expirationDate: code.expirationDate,
      createdTime: code.createdTime,
      lastModifiedTime: code.lastModifiedTime
    }))

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
    console.error('查询激活码列表失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})
