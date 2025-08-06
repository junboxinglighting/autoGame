// Nitro server plugin for database initialization
import { initDatabase } from '../utils/database'

export default async () => {
  try {
    console.log('正在初始化数据库连接...')
    await initDatabase()
    console.log('数据库连接初始化成功')
  } catch (error) {
    console.error('数据库连接初始化失败:', error)
    // 不抛出错误，避免服务器启动失败
  }
}
