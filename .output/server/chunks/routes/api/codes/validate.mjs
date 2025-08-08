import { d as defineEventHandler, g as getMethod, c as createError, r as readBody, D as Database } from '../../../_/nitro.mjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { B as BlacklistChecker } from '../../../_/blacklistChecker.mjs';
import { C as CodeGenerator } from '../../../_/codeGenerator.mjs';
import { A as ActivationCodeStatus } from '../../../_/database.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';
import 'node:url';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class TokenGenerator {
  /**
   * 设置JWT密钥
   * @param secret JWT密钥
   */
  static setSecret(secret) {
    this.secret = secret;
  }
  /**
   * 生成JWT令牌
   * @param payload 载荷数据
   * @param expiresIn 过期时间（默认7天）
   * @returns JWT令牌
   */
  static generateJWT(payload, expiresIn = "7d") {
    if (!this.secret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u8BBE\u7F6E");
    }
    return jwt.sign(payload, this.secret, {
      expiresIn,
      algorithm: "HS256"
    });
  }
  /**
   * 验证JWT令牌
   * @param token JWT令牌
   * @returns 解码后的载荷数据
   */
  static verifyJWT(token) {
    if (!this.secret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u8BBE\u7F6E");
    }
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error("\u65E0\u6548\u7684JWT\u4EE4\u724C");
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
  static generateAuthToken(activationCode, userId, deviceFingerprint, expiryTime) {
    const tokenData = {
      code: activationCode,
      userId,
      device: deviceFingerprint,
      exp: Math.floor(expiryTime.getTime() / 1e3),
      iat: Math.floor(Date.now() / 1e3)
    };
    const key = crypto.scryptSync(this.secret, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher("aes-256-gcm", key);
    let encrypted = cipher.update(JSON.stringify(tokenData), "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }
  /**
   * 验证授权令牌
   * @param token 授权令牌
   * @returns 解码后的令牌数据
   */
  static verifyAuthToken(token) {
    if (!this.secret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u8BBE\u7F6E");
    }
    try {
      const [ivHex, authTagHex, encrypted] = token.split(":");
      if (!ivHex || !authTagHex || !encrypted) {
        throw new Error("\u4EE4\u724C\u683C\u5F0F\u9519\u8BEF");
      }
      const key = crypto.scryptSync(this.secret, "salt", 32);
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const decipher = crypto.createDecipher("aes-256-gcm", key);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      const tokenData = JSON.parse(decrypted);
      if (tokenData.exp && tokenData.exp < Math.floor(Date.now() / 1e3)) {
        throw new Error("\u4EE4\u724C\u5DF2\u8FC7\u671F");
      }
      return tokenData;
    } catch (error) {
      throw new Error("\u65E0\u6548\u7684\u6388\u6743\u4EE4\u724C");
    }
  }
  /**
   * 生成API签名
   * @param data 要签名的数据
   * @param timestamp 时间戳
   * @returns 签名
   */
  static generateSignature(data, timestamp) {
    const signData = `${data}${timestamp}${this.secret}`;
    return crypto.createHash("sha256").update(signData).digest("hex");
  }
  /**
   * 验证API签名
   * @param data 原始数据
   * @param timestamp 时间戳
   * @param signature 签名
   * @returns 是否有效
   */
  static verifySignature(data, timestamp, signature) {
    const now = Math.floor(Date.now() / 1e3);
    if (Math.abs(now - timestamp) > 300) {
      return false;
    }
    const expectedSignature = this.generateSignature(data, timestamp);
    return expectedSignature === signature;
  }
}
__publicField(TokenGenerator, "secret");

const validate = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.code || !CodeGenerator.validateFormat(body.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u6FC0\u6D3B\u7801\u683C\u5F0F\u65E0\u6548"
      });
    }
    if (!body.deviceFingerprint || !body.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570"
      });
    }
    const effectiveUserId = body.userId || 0;
    const db = Database;
    const blacklistResult = await BlacklistChecker.checkBlacklist(
      body.code,
      body.deviceFingerprint,
      body.ip
    );
    if (blacklistResult.blocked) {
      return {
        success: false,
        data: {
          valid: false,
          message: blacklistResult.reason,
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    const activationCode = await db.queryOne(
      "SELECT * FROM activation_code WHERE activationCode = ?",
      [body.code]
    );
    if (!activationCode) {
      await recordFailedActivation(db, body, "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728",
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    if (activationCode.status === ActivationCodeStatus.ACTIVATED) {
      if (activationCode.ip && activationCode.ip !== body.ip) {
        await recordFailedActivation(db, body, "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6IP\u4F7F\u7528");
        return {
          success: false,
          data: {
            valid: false,
            message: "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6IP\u4F7F\u7528",
            statusCode: 3
          },
          message: "\u9A8C\u8BC1\u5931\u8D25",
          code: 3
        };
      }
      const authInfo = await db.queryOne(
        "SELECT tokenContent, expiryTime FROM authorization_info WHERE activationCode = ? ORDER BY createdTime DESC LIMIT 1",
        [body.code]
      );
      return {
        success: true,
        data: {
          valid: true,
          token: authInfo == null ? void 0 : authInfo.tokenContent,
          expiryTime: (authInfo == null ? void 0 : authInfo.expiryTime) ? new Date(authInfo.expiryTime) : void 0,
          message: "\u9A8C\u8BC1\u6210\u529F",
          statusCode: 1
        },
        message: "\u9A8C\u8BC1\u6210\u529F",
        code: 1
      };
    } else if (activationCode.status !== ActivationCodeStatus.UNUSED) {
      let message = "\u6FC0\u6D3B\u7801\u65E0\u6548";
      switch (activationCode.status) {
        case ActivationCodeStatus.EXPIRED:
          message = "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F";
          break;
        case ActivationCodeStatus.REVOKED:
          message = "\u6FC0\u6D3B\u7801\u5DF2\u88AB\u540A\u9500";
          break;
      }
      await recordFailedActivation(db, body, message);
      return {
        success: false,
        data: {
          valid: false,
          message,
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    if (activationCode.expirationDate && new Date(activationCode.expirationDate) < /* @__PURE__ */ new Date()) {
      await db.query(
        "UPDATE activation_code SET status = ?, lastModifiedTime = NOW() WHERE activationCode = ?",
        [ActivationCodeStatus.EXPIRED, body.code]
      );
      await recordFailedActivation(db, body, "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F",
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    if (activationCode.deviceFingerprint && activationCode.deviceFingerprint !== body.deviceFingerprint) {
      await recordFailedActivation(db, body, "\u8BBE\u5907\u4E0D\u5339\u914D");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u7ED1\u5B9A\u5176\u4ED6\u8BBE\u5907",
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    const expiryTime = activationCode.expirationDate ? new Date(activationCode.expirationDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3);
    await db.query(
      `UPDATE activation_code 
       SET status = ?, deviceFingerprint = ?, ip = ?, 
           activationDate = NOW(), lastModifiedTime = NOW() 
       WHERE activationCode = ?`,
      [
        ActivationCodeStatus.ACTIVATED,
        body.deviceFingerprint,
        body.ip,
        body.code
      ]
    );
    const authToken = TokenGenerator.generateAuthToken(
      body.code,
      effectiveUserId,
      body.deviceFingerprint,
      expiryTime
    );
    await db.query(
      `INSERT INTO authorization_info 
       (activationCode, tokenContent, effectiveTime, expiryTime, createdTime) 
       VALUES (?, ?, NOW(), ?, NOW())`,
      [body.code, authToken, expiryTime]
    );
    return {
      success: true,
      data: {
        valid: true,
        token: authToken,
        expiryTime,
        message: "\u6FC0\u6D3B\u6210\u529F",
        statusCode: 1
      },
      message: "\u9A8C\u8BC1\u6210\u529F",
      code: 1
    };
  } catch (error) {
    console.error("\u9A8C\u8BC1\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});
async function recordFailedActivation(db, request, errorMessage) {
  try {
    console.log("\u8BB0\u5F55\u5931\u8D25\u6FC0\u6D3B:", errorMessage);
  } catch (error) {
    console.error("\u8BB0\u5F55\u5931\u8D25\u6FC0\u6D3B\u5931\u8D25:", error);
  }
}

export { validate as default };
//# sourceMappingURL=validate.mjs.map
