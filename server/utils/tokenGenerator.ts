import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import type { JWTPayload } from '~/types/api'

export class TokenGenerator {
  private static secret: string

  /**
   * 设置JWT密钥
   * @param secret JWT密钥
   */
  public static setSecret(secret: string): void {
    this.secret = secret
  }

  /**
   * 生成JWT令牌
   * @param payload 载荷数据
   * @param expiresIn 过期时间（默认7天）
   * @returns JWT令牌
   */
  public static generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string = '7d'): string {
    if (!this.secret) {
      throw new Error('JWT密钥未设置')
    }

    return jwt.sign(payload, this.secret, {
      expiresIn,
      algorithm: 'HS256'
    })
  }

  /**
   * 验证JWT令牌
   * @param token JWT令牌
   * @returns 解码后的载荷数据
   */
  public static verifyJWT(token: string): JWTPayload {
    if (!this.secret) {
      throw new Error('JWT密钥未设置')
    }

    try {
      return jwt.verify(token, this.secret) as JWTPayload
    } catch (error) {
      throw new Error('无效的JWT令牌')
    }
  }

  /**
   * 生成授权令牌（用于游戏脚本授权）
   * @param activationCode 激活码
   * @param userId 用户ID
   * @param deviceFingerprint 设备指纹
   * @param expiryTime 过期时间
   * @returns 加密的授权令牌
   */
  public static generateAuthToken(
    activationCode: string,
    userId: number,
    deviceFingerprint: string,
    expiryTime: Date
  ): string {
    const tokenData = {
      code: activationCode,
      userId,
      device: deviceFingerprint,
      exp: Math.floor(expiryTime.getTime() / 1000),
      iat: Math.floor(Date.now() / 1000)
    }

    // 使用AES-256-GCM加密
    const key = crypto.scryptSync(this.secret, 'salt', 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher('aes-256-gcm', key)
    
    let encrypted = cipher.update(JSON.stringify(tokenData), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    // 将IV、认证标签和加密数据组合
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  /**
   * 验证授权令牌
   * @param token 授权令牌
   * @returns 解码后的令牌数据
   */
  public static verifyAuthToken(token: string): any {
    if (!this.secret) {
      throw new Error('JWT密钥未设置')
    }

    try {
      const [ivHex, authTagHex, encrypted] = token.split(':')
      
      if (!ivHex || !authTagHex || !encrypted) {
        throw new Error('令牌格式错误')
      }

      const key = crypto.scryptSync(this.secret, 'salt', 32)
      const iv = Buffer.from(ivHex, 'hex')
      const authTag = Buffer.from(authTagHex, 'hex')
      
      const decipher = crypto.createDecipher('aes-256-gcm', key)
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      const tokenData = JSON.parse(decrypted)
      
      // 检查过期时间
      if (tokenData.exp && tokenData.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('令牌已过期')
      }
      
      return tokenData
    } catch (error) {
      throw new Error('无效的授权令牌')
    }
  }

  /**
   * 生成API签名
   * @param data 要签名的数据
   * @param timestamp 时间戳
   * @returns 签名
   */
  public static generateSignature(data: string, timestamp: number): string {
    const signData = `${data}${timestamp}${this.secret}`
    return crypto.createHash('sha256').update(signData).digest('hex')
  }

  /**
   * 验证API签名
   * @param data 原始数据
   * @param timestamp 时间戳
   * @param signature 签名
   * @returns 是否有效
   */
  public static verifySignature(data: string, timestamp: number, signature: string): boolean {
    // 检查时间戳是否在5分钟内
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - timestamp) > 300) {
      return false
    }

    const expectedSignature = this.generateSignature(data, timestamp)
    return expectedSignature === signature
  }
}
