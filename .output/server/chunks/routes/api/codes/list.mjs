import { d as defineEventHandler, s as setHeader, g as getMethod, c as createError, b as getQuery, D as Database } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';
import 'node:url';

const list = defineEventHandler(async (event) => {
  try {
    setHeader(event, "Content-Type", "application/json; charset=utf-8");
    if (getMethod(event) !== "GET") {
      throw createError({
        statusCode: 405,
        statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    console.log("\u65E0\u8BA4\u8BC1\u6A21\u5F0F - \u76F4\u63A5\u5904\u7406\u8BF7\u6C42");
    const query = getQuery(event);
    const page = Math.max(1, parseInt(String(query.page)) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize)) || 20));
    const offset = (page - 1) * pageSize;
    const db = Database;
    const conditions = [];
    let whereClause = "";
    if (query.code && String(query.code).trim()) {
      conditions.push(`activationCode LIKE '%${String(query.code).trim()}%'`);
    }
    if (query.status && String(query.status).trim()) {
      conditions.push(`status = '${String(query.status).trim()}'`);
    }
    if (query.userId && Number(query.userId) > 0) {
      conditions.push(`userId = ${Number(query.userId)}`);
    }
    if (query.deviceFingerprint && String(query.deviceFingerprint).trim()) {
      conditions.push(`deviceFingerprint LIKE '%${String(query.deviceFingerprint).trim()}%'`);
    }
    if (query.startDate && String(query.startDate).trim()) {
      conditions.push(`createdTime >= '${String(query.startDate).trim()}'`);
    }
    if (query.endDate && String(query.endDate).trim()) {
      conditions.push(`createdTime <= '${String(query.endDate).trim()}'`);
    }
    whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countSql = `SELECT COUNT(*) as total FROM activation_code ${whereClause}`;
    const countResult = await db.queryOne(countSql);
    const total = (countResult == null ? void 0 : countResult.total) || 0;
    const dataSql = `
      SELECT 
        activationCode,
        status,
        price,
        userId,
        deviceFingerprint,
        ip,
        activationDate,
        expirationDate,
        createdTime,
        lastModifiedTime
      FROM activation_code 
      ${whereClause}
      ORDER BY createdTime DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    const codes = await db.query(dataSql);
    const items = codes.map((code) => ({
      activationCode: code.activationCode,
      status: code.status,
      price: code.price ? parseFloat(code.price) : 0,
      userId: code.userId,
      deviceFingerprint: code.deviceFingerprint,
      ip: code.ip,
      activationDate: code.activationDate,
      expirationDate: code.expirationDate,
      createdTime: code.createdTime,
      lastModifiedTime: code.lastModifiedTime
    }));
    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      message: "\u67E5\u8BE2\u6210\u529F"
    };
  } catch (error) {
    console.error("\u67E5\u8BE2\u6FC0\u6D3B\u7801\u5217\u8868\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

export { list as default };
//# sourceMappingURL=list.mjs.map
