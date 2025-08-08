import { d as defineEventHandler, g as getMethod, r as readBody, c as createError, b as getQuery } from '../../../_/nitro.mjs';
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

const check = defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);
    if (method === "POST") {
      const body = await readBody(event);
      const { code, deviceFingerprint, ip } = body;
      if (!code && !deviceFingerprint && !ip) {
        throw createError({
          statusCode: 400,
          statusMessage: "\u8BF7\u63D0\u4F9B\u8981\u68C0\u67E5\u7684\u6FC0\u6D3B\u7801\u3001\u8BBE\u5907\u6307\u7EB9\u6216IP\u5730\u5740"
        });
      }
      const results = {};
      if (code) {
        results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code);
      }
      if (deviceFingerprint) {
        results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(deviceFingerprint);
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
    } else if (method === "GET") {
      const query = getQuery(event);
      const { code, deviceFingerprint, ip } = query;
      if (!code && !deviceFingerprint && !ip) {
        throw createError({
          statusCode: 400,
          statusMessage: "\u8BF7\u63D0\u4F9B\u8981\u68C0\u67E5\u7684\u6FC0\u6D3B\u7801\u3001\u8BBE\u5907\u6307\u7EB9\u6216IP\u5730\u5740"
        });
      }
      const results = {};
      if (code) {
        results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code);
      }
      if (deviceFingerprint) {
        results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(deviceFingerprint);
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
    } else {
      throw createError({
        statusCode: 405,
        statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8\uFF0C\u652F\u6301GET\u548CPOST"
      });
    }
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
});

export { check as default };
//# sourceMappingURL=check.mjs.map
