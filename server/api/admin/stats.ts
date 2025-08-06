import { defineEventHandler, getMethod, createError } from 'h3'
import Database from '~/server/utils/database'
import type { StatsResponse, ApiResponse, DailyStats } from '~/types/api'
import { ActivationCodeStatus } from '~/types/database'

export default defineEventHandler(async (event): Promise<ApiResponse<StatsResponse>> => {
  try {
    // 只允许GET请求
    if (getMethod(event) !== 'GET') {
      throw createError({
        statusCode: 405,
        message: '方法不允许'
      })
    }

    const db = Database
    
    // 获取激活码统计
    const codeStats = await db.query<any>(`
      SELECT 
        status,
        COUNT(*) as count
      FROM activation_code 
      GROUP BY status
    `)

    // 初始化统计数据
    let totalCodes = 0
    let activatedCodes = 0
    let expiredCodes = 0
    let revokedCodes = 0

    codeStats.forEach(stat => {
      totalCodes += stat.count
      switch (stat.status) {
        case ActivationCodeStatus.ACTIVATED:
          activatedCodes = stat.count
          break
        case ActivationCodeStatus.EXPIRED:
          expiredCodes = stat.count
          break
        case ActivationCodeStatus.REVOKED:
          revokedCodes = stat.count
          break
      }
    })

    // 计算激活率
    const activationRate = totalCodes > 0 ? (activatedCodes / totalCodes) * 100 : 0

    // 获取总收入统计
    const revenueResult = await db.queryOne<{ totalRevenue: number }>(`
      SELECT COALESCE(SUM(amount), 0) as totalRevenue 
      FROM payment_record 
      WHERE paymentStatus = '成功'
    `)
    const totalRevenue = revenueResult?.totalRevenue || 0

    // 获取最近30天的每日统计
    const dailyStatsResult = await db.query<any>(`
      SELECT 
        DATE(ac.createdTime) as date,
        COUNT(ac.activationCode) as total_generated,
        COUNT(CASE WHEN ac.status = '已激活' THEN 1 END) as activated,
        COALESCE(SUM(pr.amount), 0) as revenue
      FROM activation_code ac
      LEFT JOIN payment_record pr ON pr.activationCodeId = ac.activationCode 
        AND pr.paymentStatus = '成功'
      WHERE ac.createdTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(ac.createdTime)
      ORDER BY date DESC
    `)

    const dailyStats: DailyStats[] = dailyStatsResult.map(row => ({
      date: row.date,
      generated: row.total_generated,
      activated: row.activated,
      revenue: parseFloat(row.revenue) || 0
    }))

    // 填充缺失的日期
    const filledDailyStats = fillMissingDates(dailyStats, 30)

    return {
      success: true,
      data: {
        totalCodes,
        activatedCodes,
        expiredCodes,
        revokedCodes,
        activationRate: Math.round(activationRate * 100) / 100,
        totalRevenue,
        dailyStats: filledDailyStats
      },
      message: '统计数据获取成功'
    }

  } catch (error: any) {
    console.error('获取统计数据失败:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: '服务器内部错误'
    })
  }
})

// 填充缺失的日期数据
function fillMissingDates(dailyStats: DailyStats[], days: number): DailyStats[] {
  const result: DailyStats[] = []
  const statsMap = new Map<string, DailyStats>()
  
  // 将现有数据存入Map
  dailyStats.forEach(stat => {
    statsMap.set(stat.date, stat)
  })

  // 生成最近N天的完整日期列表
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const existingStat = statsMap.get(dateStr)
    if (existingStat) {
      result.unshift(existingStat)
    } else {
      result.unshift({
        date: dateStr,
        generated: 0,
        activated: 0,
        revenue: 0
      })
    }
  }

  return result
}
