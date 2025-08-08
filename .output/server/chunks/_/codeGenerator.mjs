import crypto from 'crypto';

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const native = {
  randomUUID: crypto.randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  return unsafeStringify(rnds);
}

class CodeGenerator {
  /**
   * 生成安全的激活码
   * @param length 激活码长度，默认32位
   * @returns 激活码字符串
   */
  static generateCode(length = 32) {
    const randomBytes = crypto.randomBytes(24);
    const uuid = v4().replace(/-/g, "");
    const combined = randomBytes.toString("base64") + uuid;
    const cleanCode = combined.replace(/[+/=]/g, "").replace(/[0OoIl1]/g, "").toUpperCase().substring(0, length);
    if (cleanCode.length < length) {
      const additional = crypto.randomBytes(Math.ceil((length - cleanCode.length) / 2)).toString("hex").toUpperCase().substring(0, length - cleanCode.length);
      return cleanCode + additional;
    }
    return cleanCode;
  }
  /**
   * 批量生成激活码
   * @param count 生成数量
   * @param length 激活码长度
   * @returns 激活码数组
   */
  static generateBatch(count, length = 32) {
    const codes = [];
    const codeSet = /* @__PURE__ */ new Set();
    while (codeSet.size < count) {
      const code = this.generateCode(length);
      if (!codeSet.has(code)) {
        codeSet.add(code);
        codes.push(code);
      }
    }
    return codes;
  }
  /**
   * 验证激活码格式
   * @param code 激活码
   * @returns 是否有效
   */
  static validateFormat(code) {
    if (code.length < 16) {
      return false;
    }
    const validPattern = /^[A-Z2-9]{16,}$/;
    return validPattern.test(code);
  }
  /**
   * 生成设备指纹
   * @param userAgent 用户代理
   * @param ip IP地址
   * @param additionalInfo 额外信息
   * @returns 设备指纹
   */
  static generateDeviceFingerprint(userAgent, ip, additionalInfo = {}) {
    const fingerprintData = {
      userAgent,
      ip,
      ...additionalInfo,
      timestamp: Date.now()
    };
    const dataString = JSON.stringify(fingerprintData);
    return crypto.createHash("sha256").update(dataString).digest("hex");
  }
  /**
   * 生成哈希值（用于安全存储）
   * @param data 原始数据
   * @param salt 盐值
   * @returns 哈希值
   */
  static generateHash(data, salt) {
    const saltValue = salt || crypto.randomBytes(16).toString("hex");
    return crypto.pbkdf2Sync(data, saltValue, 1e4, 64, "sha512").toString("hex");
  }
  /**
   * 验证哈希值
   * @param data 原始数据
   * @param hash 哈希值
   * @param salt 盐值
   * @returns 是否匹配
   */
  static verifyHash(data, hash, salt) {
    const computedHash = crypto.pbkdf2Sync(data, salt, 1e4, 64, "sha512").toString("hex");
    return computedHash === hash;
  }
}

export { CodeGenerator as C };
//# sourceMappingURL=codeGenerator.mjs.map
