import mysql from 'mysql2/promise'
import type { DatabaseConfig } from '~/types/database'

class Database {
  private static instance: Database
  private pool: mysql.Pool | null = null

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  public async connect(config: DatabaseConfig): Promise<void> {
    try {
      this.pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: '+08:00',
        charset: 'utf8mb4'
      })

      // 测试连接
      const connection = await this.pool.getConnection()
      await connection.ping()
      connection.release()
      
      console.log('数据库连接成功')
    } catch (error) {
      console.error('数据库连接失败:', error)
      throw error
    }
  }

  public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.pool) {
      throw new Error('数据库未连接')
    }

    try {
      const [rows] = await this.pool.execute(sql, params)
      return rows as T[]
    } catch (error) {
      console.error('SQL执行错误:', error)
      throw error
    }
  }

  public async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params)
    return results.length > 0 ? results[0] : null
  }

  public async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('数据库未连接')
    }

    const connection = await this.pool.getConnection()
    await connection.beginTransaction()

    try {
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }
}

// 初始化数据库连接
export async function initDatabase(): Promise<Database> {
  const config = useRuntimeConfig()
  const db = Database.getInstance()
  
  try {
    console.log('正在初始化数据库连接...')
    await db.connect({
      host: config.dbHost,
      port: parseInt(config.dbPort),
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName
    })
    return db
  } catch (error) {
    console.error('数据库连接失败:', error)
    console.log('🔄 切换到模拟数据库模式')
    
    // 导入并使用模拟数据库
    const { MockDatabase } = await import('./mockDatabase')
    const mockDb = MockDatabase.getInstance()
    await mockDb.connect()
    
    // 返回一个适配器让MockDatabase兼容Database接口
    return {
      query: mockDb.query.bind(mockDb),
      queryOne: mockDb.queryOne.bind(mockDb),
      transaction: mockDb.transaction.bind(mockDb),
      close: mockDb.close.bind(mockDb)
    } as any
  }
}

export { Database }
export default Database.getInstance()
