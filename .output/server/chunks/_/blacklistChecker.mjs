import { D as Database } from './nitro.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class BlacklistChecker {
  /**
   * 检查激活码是否在黑名单中
   * @param code 激活码
   * @returns 是否在黑名单
   */
  static async isCodeBlacklisted(code) {
    try {
      const result = await this.db.queryOne(
        "SELECT * FROM blacklist_code WHERE activationCode = ?",
        [code]
      );
      return result !== null;
    } catch (error) {
      console.error("\u68C0\u67E5\u6FC0\u6D3B\u7801\u9ED1\u540D\u5355\u5931\u8D25:", error);
      return false;
    }
  }
  /**
   * 检查设备是否在黑名单中
   * @param deviceFingerprint 设备指纹
   * @returns 是否在黑名单
   */
  static async isDeviceBlacklisted(deviceFingerprint) {
    try {
      const result = await this.db.queryOne(
        "SELECT * FROM blacklist_device WHERE deviceFingerprint = ?",
        [deviceFingerprint]
      );
      return result !== null;
    } catch (error) {
      console.error("\u68C0\u67E5\u8BBE\u5907\u9ED1\u540D\u5355\u5931\u8D25:", error);
      return false;
    }
  }
  /**
   * 检查IP是否在黑名单中
   * @param ip IP地址
   * @returns 是否在黑名单
   */
  static async isIPBlacklisted(ip) {
    try {
      const result = await this.db.queryOne(
        "SELECT * FROM blacklist_ip WHERE ip = ?",
        [ip]
      );
      return result !== null;
    } catch (error) {
      console.error("\u68C0\u67E5IP\u9ED1\u540D\u5355\u5931\u8D25:", error);
      return false;
    }
  }
  /**
   * 综合检查是否被黑名单拦截
   * @param code 激活码
   * @param deviceFingerprint 设备指纹
   * @param ip IP地址
   * @returns 检查结果
   */
  static async checkBlacklist(code, deviceFingerprint, ip) {
    try {
      const [codeBlocked, deviceBlocked, ipBlocked] = await Promise.all([
        this.isCodeBlacklisted(code),
        this.isDeviceBlacklisted(deviceFingerprint),
        this.isIPBlacklisted(ip)
      ]);
      if (codeBlocked) {
        return {
          blocked: true,
          reason: "\u6FC0\u6D3B\u7801\u5DF2\u88AB\u52A0\u5165\u9ED1\u540D\u5355",
          type: "code"
        };
      }
      if (deviceBlocked) {
        return {
          blocked: true,
          reason: "\u8BBE\u5907\u5DF2\u88AB\u52A0\u5165\u9ED1\u540D\u5355",
          type: "device"
        };
      }
      if (ipBlocked) {
        return {
          blocked: true,
          reason: "IP\u5730\u5740\u5DF2\u88AB\u52A0\u5165\u9ED1\u540D\u5355",
          type: "ip"
        };
      }
      return { blocked: false };
    } catch (error) {
      console.error("\u9ED1\u540D\u5355\u68C0\u67E5\u5931\u8D25:", error);
      return { blocked: false };
    }
  }
  /**
   * 添加激活码到黑名单
   * @param code 激活码
   * @param reason 原因
   */
  static async addCodeToBlacklist(code, reason) {
    try {
      await this.db.query(
        "INSERT INTO blacklist_code (activationCode, reason, createdTime) VALUES (?, ?, NOW())",
        [code, reason]
      );
    } catch (error) {
      console.error("\u6DFB\u52A0\u6FC0\u6D3B\u7801\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 添加设备到黑名单
   * @param deviceFingerprint 设备指纹
   * @param reason 原因
   */
  static async addDeviceToBlacklist(deviceFingerprint, reason) {
    try {
      await this.db.query(
        "INSERT INTO blacklist_device (deviceFingerprint, reason, createdTime) VALUES (?, ?, NOW())",
        [deviceFingerprint, reason]
      );
    } catch (error) {
      console.error("\u6DFB\u52A0\u8BBE\u5907\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 添加IP到黑名单
   * @param ip IP地址
   * @param reason 原因
   */
  static async addIPToBlacklist(ip, reason) {
    try {
      await this.db.query(
        "INSERT INTO blacklist_ip (ip, reason, createdTime) VALUES (?, ?, NOW())",
        [ip, reason]
      );
    } catch (error) {
      console.error("\u6DFB\u52A0IP\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 从黑名单移除激活码
   * @param code 激活码
   */
  static async removeCodeFromBlacklist(code) {
    try {
      await this.db.query(
        "DELETE FROM blacklist_code WHERE activationCode = ?",
        [code]
      );
    } catch (error) {
      console.error("\u79FB\u9664\u6FC0\u6D3B\u7801\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 从黑名单移除设备
   * @param deviceFingerprint 设备指纹
   */
  static async removeDeviceFromBlacklist(deviceFingerprint) {
    try {
      await this.db.query(
        "DELETE FROM blacklist_device WHERE deviceFingerprint = ?",
        [deviceFingerprint]
      );
    } catch (error) {
      console.error("\u79FB\u9664\u8BBE\u5907\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 从黑名单移除IP
   * @param ip IP地址
   */
  static async removeIPFromBlacklist(ip) {
    try {
      await this.db.query(
        "DELETE FROM blacklist_ip WHERE ip = ?",
        [ip]
      );
    } catch (error) {
      console.error("\u79FB\u9664IP\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 获取黑名单统计信息
   * @returns 统计信息
   */
  static async getBlacklistStats() {
    try {
      const [codeCount, deviceCount, ipCount] = await Promise.all([
        this.db.queryOne("SELECT COUNT(*) as count FROM blacklist_code"),
        this.db.queryOne("SELECT COUNT(*) as count FROM blacklist_device"),
        this.db.queryOne("SELECT COUNT(*) as count FROM blacklist_ip")
      ]);
      return {
        codeCount: (codeCount == null ? void 0 : codeCount.count) || 0,
        deviceCount: (deviceCount == null ? void 0 : deviceCount.count) || 0,
        ipCount: (ipCount == null ? void 0 : ipCount.count) || 0
      };
    } catch (error) {
      console.error("\u83B7\u53D6\u9ED1\u540D\u5355\u7EDF\u8BA1\u5931\u8D25:", error);
      return {
        codeCount: 0,
        deviceCount: 0,
        ipCount: 0
      };
    }
  }
}
__publicField(BlacklistChecker, "db", Database);

export { BlacklistChecker as B };
//# sourceMappingURL=blacklistChecker.mjs.map
