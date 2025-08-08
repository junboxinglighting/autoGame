import { d as defineEventHandler, r as readBody, c as createError, b as getQuery, D as Database, g as getMethod, e as getRouterParam } from '../../../_/nitro.mjs';
import { B as BlacklistChecker } from '../../../_/blacklistChecker.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';
import 'node:url';

async function addToBlacklist(event) {
  try {
    const body = await readBody(event);
    if (!body.type || !["code", "device", "ip"].includes(body.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u65E0\u6548\u7684\u9ED1\u540D\u5355\u7C7B\u578B"
      });
    }
    if (!body.value || body.value.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u9ED1\u540D\u5355\u503C\u4E0D\u80FD\u4E3A\u7A7A"
      });
    }
    if (!body.reason || body.reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u5C01\u7981\u539F\u56E0\u4E0D\u80FD\u4E3A\u7A7A"
      });
    }
    switch (body.type) {
      case "code":
        await BlacklistChecker.addCodeToBlacklist(body.value, body.reason);
        break;
      case "device":
        await BlacklistChecker.addDeviceToBlacklist(body.value, body.reason);
        break;
      case "ip":
        await BlacklistChecker.addIPToBlacklist(body.value, body.reason);
        break;
    }
    return {
      success: true,
      message: `${body.type}\u5DF2\u6210\u529F\u6DFB\u52A0\u5230\u9ED1\u540D\u5355`
    };
  } catch (error) {
    console.error("\u6DFB\u52A0\u9ED1\u540D\u5355\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
}
async function checkBlacklist(event) {
  try {
    const query = getQuery(event);
    const { code, device, ip } = query;
    if (!code && !device && !ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8BF7\u63D0\u4F9B\u8981\u68C0\u67E5\u7684\u6FC0\u6D3B\u7801\u3001\u8BBE\u5907\u6307\u7EB9\u6216IP\u5730\u5740"
      });
    }
    const results = {};
    if (code) {
      results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code);
    }
    if (device) {
      results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(device);
    }
    if (ip) {
      results.ipBlocked = await BlacklistChecker.isIPBlacklisted(ip);
    }
    const isBlocked = Object.values(results).some((blocked) => blocked === true);
    return {
      success: true,
      data: {
        blocked: isBlocked,
        details: results
      },
      message: isBlocked ? "\u53D1\u73B0\u9ED1\u540D\u5355\u9879\u76EE" : "\u672A\u53D1\u73B0\u9ED1\u540D\u5355\u9879\u76EE"
    };
  } catch (error) {
    console.error("\u68C0\u67E5\u9ED1\u540D\u5355\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
}
async function listBlacklist(event) {
  try {
    const query = getQuery(event);
    const page = Math.max(1, parseInt(String(query.page)) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize)) || 20));
    const offset = (page - 1) * pageSize;
    const db = Database;
    let tableName = "";
    let valueColumn = "";
    switch (query.type) {
      case "code":
        tableName = "blacklist_code";
        valueColumn = "activationCode";
        break;
      case "device":
        tableName = "blacklist_device";
        valueColumn = "deviceFingerprint";
        break;
      case "ip":
        tableName = "blacklist_ip";
        valueColumn = "ip";
        break;
      default:
        throw createError({
          statusCode: 400,
          statusMessage: "\u8BF7\u6307\u5B9A\u9ED1\u540D\u5355\u7C7B\u578B (code, device, ip)"
        });
    }
    const conditions = [];
    const params = [];
    if (query.value) {
      conditions.push(`${valueColumn} LIKE ?`);
      params.push(`%${query.value}%`);
    }
    if (query.startDate) {
      conditions.push("createdTime >= ?");
      params.push(query.startDate);
    }
    if (query.endDate) {
      conditions.push("createdTime <= ?");
      params.push(query.endDate);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countSql = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`;
    const countResult = await db.queryOne(countSql, params);
    const total = (countResult == null ? void 0 : countResult.total) || 0;
    const dataSql = `
      SELECT 
        blacklistId,
        ${valueColumn} as value,
        reason,
        createdTime
      FROM ${tableName} 
      ${whereClause}
      ORDER BY createdTime DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, pageSize, offset];
    const items = await db.query(dataSql, dataParams);
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
    console.error("\u67E5\u8BE2\u9ED1\u540D\u5355\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
}
const _action_ = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const url = getRouterParam(event, "action") || "";
  try {
    if (method === "POST" && url === "add") {
      return await addToBlacklist(event);
    } else if (method === "GET" && url === "check") {
      return await checkBlacklist(event);
    } else if (method === "GET" && url === "list") {
      return await listBlacklist(event);
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: "\u63A5\u53E3\u4E0D\u5B58\u5728"
      });
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

export { addToBlacklist, checkBlacklist, _action_ as default, listBlacklist };
//# sourceMappingURL=_action_.mjs.map
