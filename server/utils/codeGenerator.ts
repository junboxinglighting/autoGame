import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

export class CodeGenerator {
  /**
   * 生成安全的激活码
   * @param length 激活码长度，默认32位
   * @returns 激活码字符串
   */
  public static generateCode(length: number = 32): string {
    // 使用 SHA-256 + Base64 生成安全随机激活码
    const randomBytes = crypto.randomBytes(24) // 24字节 = 32个Base64字符
    const uuid = uuidv4().replace(/-/g, '')
    const combined = randomBytes.toString('base64') + uuid
    
    // 移除可能引起混淆的字符
    const cleanCode = combined
      .replace(/[+/=]/g, '')
      .replace(/[0OoIl1]/g, '')
      .toUpperCase()
      .substring(0, length)
    
    // 确保长度足够，如果不够则补充
    if (cleanCode.length < length) {
      const additional = crypto.randomBytes(Math.ceil((length - cleanCode.length) / 2))
        .toString('hex')
        .toUpperCase()
        .substring(0, length - cleanCode.length)
      return cleanCode + additional
    }
    
    return cleanCode
  }

  /**
   * 批量生成激活码
   * @param count 生成数量
   * @param length 激活码长度
   * @returns 激活码数组
   */
  public static generateBatch(count: number, length: number = 32): string[] {
    const codes: string[] = []
    const codeSet = new Set<string>()
    
    while (codeSet.size < count) {
      const code = this.generateCode(length)
      if (!codeSet.has(code)) {
        codeSet.add(code)
        codes.push(code)
      }
    }
    
    return codes
  }

  /**
   * 验证激活码格式
   * @param code 激活码
   * @returns 是否有效
   */
  public static validateFormat(code: string): boolean {
    // 检查长度（最少16位）
    if (code.length < 16) {
      return false
    }
    
    // 检查字符集（只允许字母和数字，排除易混淆字符）
    const validPattern = /^[A-Z2-9]{16,}$/
    return validPattern.test(code)
  }

  /**
   * 生成设备指纹
   * @param userAgent 用户代理
   * @param ip IP地址
   * @param additionalInfo 额外信息
   * @returns 设备指纹
   */
  public static generateDeviceFingerprint(
    userAgent: string,
    ip: string,
    additionalInfo: Record<string, any> = {}
  ): string {
    const fingerprintData = {
      userAgent,
      ip,
      ...additionalInfo,
      timestamp: Date.now()
    }
    
    const dataString = JSON.stringify(fingerprintData)
    return crypto.createHash('sha256').update(dataString).digest('hex')
  }

  /**
   * 生成哈希值（用于安全存储）
   * @param data 原始数据
   * @param salt 盐值
   * @returns 哈希值
   */
  public static generateHash(data: string, salt?: string): string {
    const saltValue = salt || crypto.randomBytes(16).toString('hex')
    return crypto.pbkdf2Sync(data, saltValue, 10000, 64, 'sha512').toString('hex')
  }

  /**
   * 验证哈希值
   * @param data 原始数据
   * @param hash 哈希值
   * @param salt 盐值
   * @returns 是否匹配
   */
  public static verifyHash(data: string, hash: string, salt: string): boolean {
    const computedHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex')
    return computedHash === hash
  }
}
