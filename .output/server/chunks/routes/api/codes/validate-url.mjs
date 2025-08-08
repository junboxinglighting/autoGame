import { d as defineEventHandler, f as Database, g as getMethod, c as createError, b as getQuery, r as readBody } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';
import 'node:url';

const validateUrl = defineEventHandler(async (event) => {
  const db = Database.getInstance();
  const method = getMethod(event);
  if (method !== "GET" && method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8\uFF0C\u652F\u6301GET\u548CPOST"
    });
  }
  try {
    let params;
    if (method === "GET") {
      const query = getQuery(event);
      params = {
        code: query.code,
        userId: parseInt(query.userId),
        deviceFingerprint: query.deviceFingerprint,
        ip: query.ip
      };
    } else {
      params = await readBody(event);
    }
    if (!params.code || !params.deviceFingerprint || !params.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u53C2\u6570\u4E0D\u5B8C\u6574"
      });
    }
    const effectiveUserId = params.userId || 0;
    if (!/^[A-Z2-9]{16,}$/.test(params.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u6FC0\u6D3B\u7801\u683C\u5F0F\u65E0\u6548"
      });
    }
    console.log("\u{1F50D} \u5F00\u59CB\u9A8C\u8BC1\u6FC0\u6D3B\u7801:", params.code, "- \u8BF7\u6C42\u65B9\u5F0F:", method);
    const rows = await db.query(
      "SELECT activationCode, status, deviceFingerprint, expirationDate FROM activation_code WHERE activationCode = ?",
      [params.code]
    );
    console.log("\u{1F50D} \u6570\u636E\u5E93\u67E5\u8BE2\u7ED3\u679C:", rows);
    if (!rows || rows.length === 0) {
      console.log("\u274C \u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
    const codeInfo = rows[0];
    console.log("\u{1F4CB} \u6FC0\u6D3B\u7801\u4FE1\u606F:", {
      activationCode: codeInfo.activationCode,
      status: codeInfo.status,
      deviceFingerprint: codeInfo.deviceFingerprint,
      expires_at: codeInfo.expirationDate
    });
    if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) < /* @__PURE__ */ new Date()) {
      console.log("\u23F0 \u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
    if (codeInfo.status === "\u672A\u4F7F\u7528") {
      console.log("\u{1F195} \u9996\u6B21\u6FC0\u6D3B - \u7ED1\u5B9A\u8BBE\u5907\u6307\u7EB9");
      await db.query(
        "UPDATE activation_code SET status = ?, deviceFingerprint = ?, userId = ?, activationDate = NOW() WHERE activationCode = ?",
        ["\u5DF2\u6FC0\u6D3B", params.deviceFingerprint, effectiveUserId, params.code]
      );
      console.log("\u2705 \u6FC0\u6D3B\u6210\u529F\uFF0C\u8BBE\u5907\u6307\u7EB9\u5DF2\u7ED1\u5B9A:", params.deviceFingerprint);
      return {
        success: true,
        data: {
          valid: true,
          message: "\u6FC0\u6D3B\u6210\u529F",
          statusCode: 1
        },
        message: "\u9A8C\u8BC1\u6210\u529F"
      };
    } else if (codeInfo.status === "\u5DF2\u6FC0\u6D3B") {
      console.log("\u{1F50D} \u5DF2\u6FC0\u6D3B\u72B6\u6001 - \u9A8C\u8BC1\u8BBE\u5907\u6307\u7EB9");
      if (codeInfo.deviceFingerprint === params.deviceFingerprint) {
        console.log("\u2705 \u8BBE\u5907\u6307\u7EB9\u5339\u914D\uFF0C\u9A8C\u8BC1\u901A\u8FC7");
        return {
          success: true,
          data: {
            valid: true,
            message: "\u9A8C\u8BC1\u901A\u8FC7",
            statusCode: 1
          },
          message: "\u9A8C\u8BC1\u6210\u529F"
        };
      } else {
        console.log("\u274C \u8BBE\u5907\u6307\u7EB9\u4E0D\u5339\u914D", {
          \u5B58\u50A8\u8BBE\u5907\u6307\u7EB9: codeInfo.deviceFingerprint,
          \u8BF7\u6C42\u8BBE\u5907\u6307\u7EB9: params.deviceFingerprint
        });
        return {
          success: false,
          data: {
            valid: false,
            message: "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6\u8BBE\u5907\u4F7F\u7528",
            statusCode: 3
          },
          message: "\u8BBE\u5907\u6307\u7EB9\u51B2\u7A81"
        };
      }
    } else {
      console.log("\u274C \u6FC0\u6D3B\u7801\u72B6\u6001\u65E0\u6548:", codeInfo.status);
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u72B6\u6001\u65E0\u6548",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
  } catch (error) {
    console.error("\u{1F4A5} \u9A8C\u8BC1\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    console.error("\u9519\u8BEF\u5806\u6808:", error.stack);
    console.error("\u9519\u8BEF\u6D88\u606F:", error.message);
    console.error("\u9519\u8BEF\u4EE3\u7801:", error.code);
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF: " + error.message
    });
  }
});

export { validateUrl as default };
//# sourceMappingURL=validate-url.mjs.map
