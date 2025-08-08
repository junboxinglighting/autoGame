var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _MockDatabase = class _MockDatabase {
  constructor() {
    __publicField(this, "mockData", []);
    this.mockData = [
      {
        activationCode: "ABCD248A7B3F9C2E5D6H",
        status: "\u672A\u4F7F\u7528",
        price: 99,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        // 30天后
        createdTime: /* @__PURE__ */ new Date("2024-08-01"),
        updatedTime: /* @__PURE__ */ new Date("2024-08-01"),
        revokeReason: null
      },
      {
        activationCode: "EFGH49B6C8F2G3A7E9K2",
        status: "\u5DF2\u6FC0\u6D3B",
        price: 149,
        userId: 1001,
        deviceFingerprint: "demo-device-001",
        activationDate: /* @__PURE__ */ new Date("2024-08-05"),
        expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1e3),
        createdTime: /* @__PURE__ */ new Date("2024-08-01"),
        updatedTime: /* @__PURE__ */ new Date("2024-08-05"),
        revokeReason: null
      },
      {
        activationCode: "IJKL5A8C9E2F4B7D3H6P",
        status: "\u672A\u4F7F\u7528",
        price: 199,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1e3),
        // 60天后
        createdTime: /* @__PURE__ */ new Date("2024-08-02"),
        updatedTime: /* @__PURE__ */ new Date("2024-08-02"),
        revokeReason: null
      },
      {
        activationCode: "MNOP3C6F8A2E9B5D4H7Q",
        status: "\u5DF2\u8FC7\u671F",
        price: 99,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1e3),
        // 昨天过期
        createdTime: /* @__PURE__ */ new Date("2024-07-01"),
        updatedTime: /* @__PURE__ */ new Date("2024-07-01"),
        revokeReason: null
      },
      {
        activationCode: "RSTU7D9F2A4C8E6B3H5V",
        status: "\u5DF2\u540A\u9500",
        price: 149,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        createdTime: /* @__PURE__ */ new Date("2024-08-03"),
        updatedTime: /* @__PURE__ */ new Date("2024-08-06"),
        revokeReason: "\u6F14\u793A\u540A\u9500"
      }
    ];
  }
  static getInstance() {
    if (!_MockDatabase.instance) {
      _MockDatabase.instance = new _MockDatabase();
    }
    return _MockDatabase.instance;
  }
  async connect() {
    console.log("MockDatabase: \u4F7F\u7528\u6A21\u62DF\u6570\u636E\u5E93");
    return Promise.resolve();
  }
  async query(sql, params) {
    console.log("MockDatabase query:", sql, params);
    const selectRegex = /^\s*SELECT\b/i;
    const insertRegex = /^\s*INSERT\b/i;
    const updateRegex = /^\s*UPDATE\b/i;
    const activationCodeRegex = /\bactivation_code\b/i;
    if (selectRegex.test(sql) && activationCodeRegex.test(sql)) {
      let result = [...this.mockData];
      if (params && params.length > 0) {
        console.log("MockDatabase: \u5E94\u7528\u7B5B\u9009\u53C2\u6570", params);
      }
      return result;
    }
    if (insertRegex.test(sql) && activationCodeRegex.test(sql)) {
      const newCode = {
        activationCode: `DEMO-${Date.now()}`,
        status: "\u672A\u4F7F\u7528",
        price: (params == null ? void 0 : params[1]) || 99,
        userId: null,
        deviceFingerprint: null,
        activationDate: null,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        createdTime: /* @__PURE__ */ new Date(),
        updatedTime: /* @__PURE__ */ new Date(),
        revokeReason: null
      };
      this.mockData.push(newCode);
      return [{ insertId: this.mockData.length, affectedRows: 1 }];
    }
    if (updateRegex.test(sql) && activationCodeRegex.test(sql)) {
      let codeToUpdate;
      const match = sql.match(/where\s+activation_code\s*=\s*\?/i);
      if (match && params && params.length > 0) {
        const whereIndex = sql.substring(0, match.index).split("?").length - 1;
        codeToUpdate = params[whereIndex];
      } else if (params && params.length > 0) {
        codeToUpdate = params[params.length - 1];
      }
      const index = this.mockData.findIndex((item) => item.activationCode === codeToUpdate);
      if (index !== -1) {
        this.mockData[index].status = "\u5DF2\u540A\u9500";
        this.mockData[index].revokeReason = (params == null ? void 0 : params[0]) || "\u5DF2\u540A\u9500";
        this.mockData[index].updatedTime = /* @__PURE__ */ new Date();
        return [{ affectedRows: 1 }];
      }
    }
    return [];
  }
  async queryOne(sql, params) {
    const results = await this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }
  async transaction(callback) {
    return callback({
      execute: (sql, params) => this.query(sql, params),
      query: (sql, params) => this.query(sql, params)
    });
  }
  async close() {
    console.log("MockDatabase: \u5173\u95ED\u6A21\u62DF\u6570\u636E\u5E93\u8FDE\u63A5");
    return Promise.resolve();
  }
};
__publicField(_MockDatabase, "instance");
let MockDatabase = _MockDatabase;
MockDatabase.getInstance();

export { MockDatabase };
//# sourceMappingURL=mockDatabase.mjs.map
