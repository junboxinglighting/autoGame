import { d as defineEventHandler, g as getMethod, c as createError, r as readBody, D as Database } from '../../../_/nitro.mjs';
import { g as getClientIP } from '../../../_/clientInfo.mjs';
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

const revoke = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.codes || !Array.isArray(body.codes) || body.codes.length === 0) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u8981\u540A\u9500\u7684\u6FC0\u6D3B\u7801\u5217\u8868"
      });
    }
    if (body.codes.length > 1e3) {
      throw createError({
        statusCode: 400,
        message: "\u5355\u6B21\u6700\u591A\u540A\u95001000\u4E2A\u6FC0\u6D3B\u7801"
      });
    }
    if (!body.reason || body.reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u540A\u9500\u539F\u56E0"
      });
    }
    const db = Database;
    const operatorId = 1;
    const clientIP = getClientIP(event) || "127.0.0.1";
    const placeholders = body.codes.map(() => "?").join(",");
    const existingCodes = await db.query(
      `SELECT activationCode, status FROM activation_code WHERE activationCode IN (${placeholders})`,
      body.codes
    );
    if (existingCodes.length === 0) {
      throw createError({
        statusCode: 404,
        message: "\u672A\u627E\u5230\u4EFB\u4F55\u6307\u5B9A\u7684\u6FC0\u6D3B\u7801"
      });
    }
    const revokableCodes = existingCodes.filter(
      (code) => code.status !== ActivationCodeStatus.REVOKED
    );
    if (revokableCodes.length === 0) {
      return {
        success: false,
        message: "\u6240\u6709\u6307\u5B9A\u7684\u6FC0\u6D3B\u7801\u90FD\u5DF2\u88AB\u540A\u9500",
        data: {
          processedCount: 0,
          skippedCount: existingCodes.length
        }
      };
    }
    await db.transaction(async (connection) => {
      const revokePromises = revokableCodes.map(
        (code) => connection.query(
          `UPDATE activation_code 
           SET status = ?, lastModifiedTime = NOW() 
           WHERE activationCode = ?`,
          [ActivationCodeStatus.REVOKED, code.activationCode]
        )
      );
      await Promise.all(revokePromises);
      console.log(`\u65E0\u8BA4\u8BC1\u6A21\u5F0F\uFF1A\u6210\u529F\u540A\u9500${revokableCodes.length}\u4E2A\u6FC0\u6D3B\u7801`);
      const blacklistPromises = revokableCodes.map(
        (code) => connection.query(
          `INSERT INTO blacklist_code (activationCode, reason, createdTime) 
           VALUES (?, ?, NOW()) 
           ON DUPLICATE KEY UPDATE reason = VALUES(reason)`,
          [code.activationCode, `\u540A\u9500: ${body.reason}`]
        )
      );
      await Promise.all(blacklistPromises);
    });
    return {
      success: true,
      data: {
        processedCount: revokableCodes.length,
        skippedCount: existingCodes.length - revokableCodes.length,
        totalRequested: body.codes.length,
        notFound: body.codes.length - existingCodes.length
      },
      message: `\u6210\u529F\u540A\u9500${revokableCodes.length}\u4E2A\u6FC0\u6D3B\u7801`
    };
  } catch (error) {
    console.error("\u540A\u9500\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

export { revoke as default };
//# sourceMappingURL=revoke.mjs.map
