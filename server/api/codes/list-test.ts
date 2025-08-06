import Database from '~/server/utils/database'
import type { ApiResponse } from '~/types/api'

export default defineEventHandler(async (event): Promise<ApiResponse<any>> => {
  try {
    const db = Database
    
    // 最简单的查询，不使用参数
    const sql = `SELECT activationCode, status, price FROM activation_code LIMIT 5`
    const codes = await db.query(sql)

    return {
      success: true,
      data: codes,
      message: '测试成功'
    }

  } catch (error: any) {
    console.error('测试查询失败:', error)
    
    return {
      success: false,
      message: error.message || '查询失败'
    }
  }
})
