import { d as defineEventHandler, g as getMethod, c as createError, r as readBody, D as Database } from '../../../_/nitro.mjs';
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
import 'crypto';

const generate = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.count || body.count <= 0 || body.count > 1e4) {
      throw createError({
        statusCode: 400,
        message: "\u751F\u6210\u6570\u91CF\u5FC5\u987B\u57281-10000\u4E4B\u95F4"
      });
    }
    if (!body.price || body.price <= 0) {
      throw createError({
        statusCode: 400,
        message: "\u4EF7\u683C\u5FC5\u987B\u5927\u4E8E0"
      });
    }
    let expirationDate = null;
    if (body.expirationDays && body.expirationDays > 0) {
      expirationDate = /* @__PURE__ */ new Date();
      expirationDate.setDate(expirationDate.getDate() + body.expirationDays);
    }
    const codes = CodeGenerator.generateBatch(body.count);
    const db = Database;
    const insertPromises = codes.map(
      (code) => db.query(
        `INSERT INTO activation_code 
         (activationCode, status, userId, expirationDate, createdTime, lastModifiedTime) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          code,
          ActivationCodeStatus.UNUSED,
          body.userId || null,
          expirationDate
        ]
      )
    );
    await Promise.all(insertPromises);
    console.log(`\u65E0\u8BA4\u8BC1\u6A21\u5F0F\uFF1A\u6210\u529F\u751F\u6210${codes.length}\u4E2A\u6FC0\u6D3B\u7801`);
    return {
      success: true,
      data: {
        codes,
        totalCount: codes.length
      },
      message: `\u6210\u529F\u751F\u6210${codes.length}\u4E2A\u6FC0\u6D3B\u7801`
    };
  } catch (error) {
    console.error("\u751F\u6210\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

export { generate as default };
//# sourceMappingURL=generate.mjs.map
