import { d as defineEventHandler, g as getMethod, c as createError, D as Database } from '../../../_/nitro.mjs';
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

const stats = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "GET") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const db = Database;
    const codeStats = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM activation_code 
      GROUP BY status
    `);
    let totalCodes = 0;
    let activatedCodes = 0;
    let expiredCodes = 0;
    let revokedCodes = 0;
    codeStats.forEach((stat) => {
      totalCodes += stat.count;
      switch (stat.status) {
        case ActivationCodeStatus.ACTIVATED:
          activatedCodes = stat.count;
          break;
        case ActivationCodeStatus.EXPIRED:
          expiredCodes = stat.count;
          break;
        case ActivationCodeStatus.REVOKED:
          revokedCodes = stat.count;
          break;
      }
    });
    const activationRate = totalCodes > 0 ? activatedCodes / totalCodes * 100 : 0;
    const revenueResult = await db.queryOne(`
      SELECT COALESCE(SUM(amount), 0) as totalRevenue 
      FROM payment_record 
      WHERE paymentStatus = '\u6210\u529F'
    `);
    const totalRevenue = (revenueResult == null ? void 0 : revenueResult.totalRevenue) || 0;
    const dailyStatsResult = await db.query(`
      SELECT 
        DATE(ac.createdTime) as date,
        COUNT(ac.activationCode) as total_generated,
        COUNT(CASE WHEN ac.status = '\u5DF2\u6FC0\u6D3B' THEN 1 END) as activated,
        COALESCE(SUM(pr.amount), 0) as revenue
      FROM activation_code ac
      LEFT JOIN payment_record pr ON pr.activationCodeId = ac.activationCode 
        AND pr.paymentStatus = '\u6210\u529F'
      WHERE ac.createdTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(ac.createdTime)
      ORDER BY date DESC
    `);
    const dailyStats = dailyStatsResult.map((row) => ({
      date: row.date,
      generated: row.total_generated,
      activated: row.activated,
      revenue: parseFloat(row.revenue) || 0
    }));
    const filledDailyStats = fillMissingDates(dailyStats, 30);
    return {
      success: true,
      data: {
        totalCodes,
        activatedCodes,
        expiredCodes,
        revokedCodes,
        activationRate: Math.round(activationRate * 100) / 100,
        totalRevenue,
        dailyStats: filledDailyStats
      },
      message: "\u7EDF\u8BA1\u6570\u636E\u83B7\u53D6\u6210\u529F"
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u7EDF\u8BA1\u6570\u636E\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});
function fillMissingDates(dailyStats, days) {
  const result = [];
  const statsMap = /* @__PURE__ */ new Map();
  dailyStats.forEach((stat) => {
    statsMap.set(stat.date, stat);
  });
  for (let i = 0; i < days; i++) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const existingStat = statsMap.get(dateStr);
    if (existingStat) {
      result.unshift(existingStat);
    } else {
      result.unshift({
        date: dateStr,
        generated: 0,
        activated: 0,
        revenue: 0
      });
    }
  }
  return result;
}

export { stats as default };
//# sourceMappingURL=stats.mjs.map
