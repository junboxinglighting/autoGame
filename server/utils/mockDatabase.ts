// Mock数据库模拟器 - 用于演示和开发
export class MockDatabase {
  private static instance: MockDatabase
  private mockData: any[] = []

  private constructor() {
    // 初始化一些模拟数据 - 使用严格符合[A-Z2-9]格式的激活码（16位以上）
    this.mockData = [
      {
        activationCode: 'ABCD248A7B3F9C2E5D6H',
        status: '未使用',
        price: 99.00,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
        createdTime: new Date('2024-08-01'),
        updatedTime: new Date('2024-08-01'),
        revokeReason: null
      },
      {
        activationCode: 'EFGH49B6C8F2G3A7E9K2',
        status: '已激活',
        price: 149.00,
        userId: 1001,
        deviceFingerprint: 'demo-device-001',
        activationDate: new Date('2024-08-05'),
        expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdTime: new Date('2024-08-01'),
        updatedTime: new Date('2024-08-05'),
        revokeReason: null
      },
      {
        activationCode: 'IJKL5A8C9E2F4B7D3H6P',
        status: '未使用',
        price: 199.00,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60天后
        createdTime: new Date('2024-08-02'),
        updatedTime: new Date('2024-08-02'),
        revokeReason: null
      },
      {
        activationCode: 'MNOP3C6F8A2E9B5D4H7Q',
        status: '已过期',
        price: 99.00,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 昨天过期
        createdTime: new Date('2024-07-01'),
        updatedTime: new Date('2024-07-01'),
        revokeReason: null
      },
      {
        activationCode: 'RSTU7D9F2A4C8E6B3H5V',
        status: '已吊销',
        price: 149.00,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdTime: new Date('2024-08-03'),
        updatedTime: new Date('2024-08-06'),
        revokeReason: '演示吊销'
      }
    ]
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase()
    }
    return MockDatabase.instance
  }

  public async connect(): Promise<void> {
    console.log('MockDatabase: 使用模拟数据库')
    return Promise.resolve()
  }

  public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    console.log('MockDatabase query:', sql, params)
    
    // 更健壮的SQL命令解析
    const selectRegex = /^\s*SELECT\b/i
    const insertRegex = /^\s*INSERT\b/i
    const updateRegex = /^\s*UPDATE\b/i
    const activationCodeRegex = /\bactivation_code\b/i

    // 模拟查询激活码列表
    if (selectRegex.test(sql) && activationCodeRegex.test(sql)) {
      let result = [...this.mockData]
      
      // 模拟筛选
      if (params && params.length > 0) {
        // 这里可以根据参数进行筛选，简化处理
        console.log('MockDatabase: 应用筛选参数', params)
      }
      
      return result as T[]
    }
    
    // 模拟插入激活码
    if (insertRegex.test(sql) && activationCodeRegex.test(sql)) {
      const newCode = {
        activationCode: `DEMO-${Date.now()}`,
        status: '未使用',
        price: params?.[1] || 99.00,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdTime: new Date(),
        updatedTime: new Date(),
        revokeReason: null
      }
      this.mockData.push(newCode)
      return [{ insertId: this.mockData.length, affectedRows: 1 }] as T[]
    }
    
    // 模拟更新激活码状态
    if (updateRegex.test(sql) && activationCodeRegex.test(sql)) {
      // 尝试从SQL语句中定位激活码参数位置
      let codeToUpdate: string | undefined;
      const match = sql.match(/where\s+activation_code\s*=\s*\?/i);
      if (match && params && params.length > 0) {
        // 假设 WHERE activation_code = ?，找到 ? 的索引
        const whereIndex = sql
          .substring(0, match.index)
          .split('?').length - 1;
        codeToUpdate = params[whereIndex];
      } else if (params && params.length > 0) {
        // 回退：如果无法解析，尝试最后一个参数
        codeToUpdate = params[params.length - 1];
      }
      const index = this.mockData.findIndex(item => item.activationCode === codeToUpdate);
      if (index !== -1) {
        this.mockData[index].status = '已吊销';
        this.mockData[index].revokeReason = params?.[0] || '已吊销';
        this.mockData[index].updatedTime = new Date();
        return [{ affectedRows: 1 }] as T[];
      }
    }
    
    return [] as T[]
  }

  public async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params)
    return results.length > 0 ? results[0] : null
  }

  public async transaction<T>(callback: any): Promise<T> {
    // 模拟事务，直接执行回调
    return callback({
      execute: (sql: string, params?: any[]) => this.query(sql, params),
      query: (sql: string, params?: any[]) => this.query(sql, params)
    })
  }

  public async close(): Promise<void> {
    console.log('MockDatabase: 关闭模拟数据库连接')
    return Promise.resolve()
  }
}

// 导出模拟数据库实例
export default MockDatabase.getInstance()
