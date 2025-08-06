import Database from './database'
import type { BlacklistCode, BlacklistDevice, BlacklistIP } from '~/types/database'

export class BlacklistChecker {
  private static db = Database

  /**
   * 检查激活码是否在黑名单中
   * @param code 激活码
   * @returns 是否在黑名单
   */
  public static async isCodeBlacklisted(code: string): Promise<boolean> {
    try {
      const result = await this.db.queryOne<BlacklistCode>(
        'SELECT * FROM blacklist_code WHERE activationCode = ?',
        [code]
      )
      return result !== null
    } catch (error) {
      console.error('检查激活码黑名单失败:', error)
      return false
    }
  }

  /**
   * 检查设备是否在黑名单中
   * @param deviceFingerprint 设备指纹
   * @returns 是否在黑名单
   */
  public static async isDeviceBlacklisted(deviceFingerprint: string): Promise<boolean> {
    try {
      const result = await this.db.queryOne<BlacklistDevice>(
        'SELECT * FROM blacklist_device WHERE deviceFingerprint = ?',
        [deviceFingerprint]
      )
      return result !== null
    } catch (error) {
      console.error('检查设备黑名单失败:', error)
      return false
    }
  }

  /**
   * 检查IP是否在黑名单中
   * @param ip IP地址
   * @returns 是否在黑名单
   */
  public static async isIPBlacklisted(ip: string): Promise<boolean> {
    try {
      const result = await this.db.queryOne<BlacklistIP>(
        'SELECT * FROM blacklist_ip WHERE ip = ?',
        [ip]
      )
      return result !== null
    } catch (error) {
      console.error('检查IP黑名单失败:', error)
      return false
    }
  }

  /**
   * 综合检查是否被黑名单拦截
   * @param code 激活码
   * @param deviceFingerprint 设备指纹
   * @param ip IP地址
   * @returns 检查结果
   */
  public static async checkBlacklist(
    code: string,
    deviceFingerprint: string,
    ip: string
  ): Promise<{
    blocked: boolean;
    reason?: string;
    type?: 'code' | 'device' | 'ip';
  }> {
    try {
      // 并发检查所有黑名单
      const [codeBlocked, deviceBlocked, ipBlocked] = await Promise.all([
        this.isCodeBlacklisted(code),
        this.isDeviceBlacklisted(deviceFingerprint),
        this.isIPBlacklisted(ip)
      ])

      if (codeBlocked) {
        return {
          blocked: true,
          reason: '激活码已被加入黑名单',
          type: 'code'
        }
      }

      if (deviceBlocked) {
        return {
          blocked: true,
          reason: '设备已被加入黑名单',
          type: 'device'
        }
      }

      if (ipBlocked) {
        return {
          blocked: true,
          reason: 'IP地址已被加入黑名单',
          type: 'ip'
        }
      }

      return { blocked: false }
    } catch (error) {
      console.error('黑名单检查失败:', error)
      // 安全起见，检查失败时不拦截
      return { blocked: false }
    }
  }

  /**
   * 添加激活码到黑名单
   * @param code 激活码
   * @param reason 原因
   */
  public static async addCodeToBlacklist(code: string, reason: string): Promise<void> {
    try {
      await this.db.query(
        'INSERT INTO blacklist_code (activationCode, reason, createdTime) VALUES (?, ?, NOW())',
        [code, reason]
      )
    } catch (error) {
      console.error('添加激活码黑名单失败:', error)
      throw error
    }
  }

  /**
   * 添加设备到黑名单
   * @param deviceFingerprint 设备指纹
   * @param reason 原因
   */
  public static async addDeviceToBlacklist(deviceFingerprint: string, reason: string): Promise<void> {
    try {
      await this.db.query(
        'INSERT INTO blacklist_device (deviceFingerprint, reason, createdTime) VALUES (?, ?, NOW())',
        [deviceFingerprint, reason]
      )
    } catch (error) {
      console.error('添加设备黑名单失败:', error)
      throw error
    }
  }

  /**
   * 添加IP到黑名单
   * @param ip IP地址
   * @param reason 原因
   */
  public static async addIPToBlacklist(ip: string, reason: string): Promise<void> {
    try {
      await this.db.query(
        'INSERT INTO blacklist_ip (ip, reason, createdTime) VALUES (?, ?, NOW())',
        [ip, reason]
      )
    } catch (error) {
      console.error('添加IP黑名单失败:', error)
      throw error
    }
  }

  /**
   * 从黑名单移除激活码
   * @param code 激活码
   */
  public static async removeCodeFromBlacklist(code: string): Promise<void> {
    try {
      await this.db.query(
        'DELETE FROM blacklist_code WHERE activationCode = ?',
        [code]
      )
    } catch (error) {
      console.error('移除激活码黑名单失败:', error)
      throw error
    }
  }

  /**
   * 从黑名单移除设备
   * @param deviceFingerprint 设备指纹
   */
  public static async removeDeviceFromBlacklist(deviceFingerprint: string): Promise<void> {
    try {
      await this.db.query(
        'DELETE FROM blacklist_device WHERE deviceFingerprint = ?',
        [deviceFingerprint]
      )
    } catch (error) {
      console.error('移除设备黑名单失败:', error)
      throw error
    }
  }

  /**
   * 从黑名单移除IP
   * @param ip IP地址
   */
  public static async removeIPFromBlacklist(ip: string): Promise<void> {
    try {
      await this.db.query(
        'DELETE FROM blacklist_ip WHERE ip = ?',
        [ip]
      )
    } catch (error) {
      console.error('移除IP黑名单失败:', error)
      throw error
    }
  }

  /**
   * 获取黑名单统计信息
   * @returns 统计信息
   */
  public static async getBlacklistStats(): Promise<{
    codeCount: number;
    deviceCount: number;
    ipCount: number;
  }> {
    try {
      const [codeCount, deviceCount, ipCount] = await Promise.all([
        this.db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM blacklist_code'),
        this.db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM blacklist_device'),
        this.db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM blacklist_ip')
      ])

      return {
        codeCount: codeCount?.count || 0,
        deviceCount: deviceCount?.count || 0,
        ipCount: ipCount?.count || 0
      }
    } catch (error) {
      console.error('获取黑名单统计失败:', error)
      return {
        codeCount: 0,
        deviceCount: 0,
        ipCount: 0
      }
    }
  }
}
