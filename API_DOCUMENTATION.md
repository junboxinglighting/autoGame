# 激活码管理系统 API 接口文档

## 概述

激活码管理系统提供了完整的激活码生成、管理、验证和吊销功能。本文档描述了所有可用的API接口。

**基础信息:**
- 基础URL: `http://localhost:3000`
- 认证方式: JWT Bearer Token
- 数据格式: JSON
- 字符编码: UTF-8

## 认证

除了登录接口外，所有API都需要在请求头中包含JWT令牌：

```
Authorization: Bearer <your-jwt-token>
```

---

## 1. 用户认证

### 1.1 管理员登录

**接口地址:** `POST /api/login`

**描述:** 管理员登录获取访问令牌

**请求参数:**
```json
{
  "username": "string",  // 用户名
  "password": "string"   // 密码
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": 0,
      "username": "admin",
      "email": "admin@example.com"
    }
  },
  "message": "登录成功"
}
```

**错误响应:**
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

---

## 2. 激活码管理

### 2.1 获取激活码列表

**接口地址:** `GET /api/codes/list`

**描述:** 获取激活码列表，支持分页和筛选

**查询参数:**
- `page` (number, 可选): 页码，默认1
- `pageSize` (number, 可选): 每页数量，默认20
- `code` (string, 可选): 激活码筛选
- `status` (string, 可选): 状态筛选 ("未使用", "已激活", "已过期", "已吊销")
- `userId` (number, 可选): 用户ID筛选
- `deviceFingerprint` (string, 可选): 设备指纹筛选
- `startDate` (string, 可选): 开始日期 (YYYY-MM-DD)
- `endDate` (string, 可选): 结束日期 (YYYY-MM-DD)

**请求示例:**
```
GET /api/codes/list?page=1&pageSize=10&status=未使用
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "activationCode": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
        "status": "未使用",
        "price": 5.00,
        "userId": null,
        "deviceFingerprint": null,
        "ip": null,
        "activationDate": null,
        "expirationDate": "2025-08-02T15:30:00.000Z",
        "createdTime": "2025-08-02T11:30:00.000Z",
        "lastModifiedTime": "2025-08-02T11:30:00.000Z"
      }
    ],
    "total": 19,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  },
  "message": "查询成功"
}
```

### 2.2 生成激活码

**接口地址:** `POST /api/codes/generate`

**描述:** 批量生成激活码

**请求参数:**
```json
{
  "count": 10,           // 生成数量
  "price": 5.00,         // 单价
  "validDays": 365       // 有效期天数
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "codes": [
      "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
      "XYZ7MNOP3456QRST789UVWXYZ1234567"
    ],
    "count": 2
  },
  "message": "激活码生成成功"
}
```

### 2.3 查询激活码状态

**接口地址:** `GET /api/codes/query`

**描述:** 查询激活码的当前状态和有效性（对外公开接口，无需认证）

**查询参数:**
- `code` (string, 必需): 激活码

**响应字段说明:**
- `success` (boolean): 请求是否成功处理
- `data.statusCode` (number): 查询状态码
  - `1`: 查询成功（找到激活码）
  - `2`: 查询失败（激活码不存在、参数错误等）
- `data.isValid` (boolean): 激活码是否有效可用
- `data.remainingDays` (number): 剩余天数（仅当有效时返回）
- `data.remainingHours` (number): 剩余小时数（仅当有效时返回）
- `data.message` (string): 详细状态描述或失败原因

**请求示例:**
```
GET /api/codes/query?code=BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A
```

**响应示例 - 有效激活码:**
```json
{
  "success": true,
  "data": {
    "activationCode": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
    "status": "未使用",
    "isValid": true,
    "remainingDays": 364,
    "remainingHours": 12,
    "expirationDate": "2026-08-02T15:30:00.000Z",
    "activationDate": null,
    "message": "激活码有效，剩余364天12小时",
    "statusCode": 1
  },
  "message": "查询成功"
}
```

**响应示例 - 已过期激活码:**
```json
{
  "success": true,
  "data": {
    "activationCode": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
    "status": "已过期",
    "isValid": false,
    "expirationDate": "2024-08-02T15:30:00.000Z",
    "activationDate": "2024-01-15T10:20:30.000Z",
    "message": "激活码已过期",
    "statusCode": 1
  },
  "message": "查询成功"
}
```

**响应示例 - 已吊销激活码:**
```json
{
  "success": true,
  "data": {
    "activationCode": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
    "status": "已吊销",
    "isValid": false,
    "expirationDate": "2025-08-02T15:30:00.000Z",
    "activationDate": null,
    "message": "激活码已被吊销",
    "statusCode": 1
  },
  "message": "查询成功"
}
```

**错误响应:**
```json
{
  "success": false,
  "data": {
    "activationCode": "INVALID_CODE_12345",
    "status": "未知",
    "isValid": false,
    "message": "激活码不存在",
    "statusCode": 2
  },
  "message": "激活码不存在"
}
```

**状态码说明:**
- `statusCode: 1` - 查询成功（找到激活码，无论其状态如何）
- `statusCode: 2` - 查询失败（激活码不存在、参数错误、服务器错误等）

### 2.4 验证激活码

**接口地址:** `POST /api/codes/validate`

**描述:** 验证并激活激活码，支持IP地址验证

**功能特性:**
- 首次验证：未使用的激活码会被激活，并将IP地址绑定到该激活码
- 重复验证：已激活的激活码会验证IP地址是否匹配
- IP保护：如果IP地址不匹配，返回状态码3（激活码已被其他IP使用）

**请求参数:**
```json
{
  "code": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
  "userId": 12345,
  "deviceFingerprint": "abc123def456",
  "ip": "192.168.1.100"
}
```

**响应字段说明:**
- `success` (boolean): 请求是否成功处理
- `data.statusCode` (number): 验证状态码
  - `1`: 验证成功（激活成功或IP匹配）
  - `2`: 验证失败（激活码无效、过期等）
  - `3`: 激活码已被其他IP使用
- `data.valid` (boolean): 激活码是否有效
- `data.token` (string): 授权令牌（仅验证成功时返回）
- `data.expiryTime` (string): 过期时间（仅验证成功时返回）
- `data.message` (string): 详细状态描述

**响应示例 - 首次激活成功:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiryTime": "2026-08-02T15:30:00.000Z",
    "message": "激活成功",
    "statusCode": 1
  },
  "message": "验证成功",
  "code": 1
}
```

**响应示例 - IP匹配验证成功:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiryTime": "2026-08-02T15:30:00.000Z",
    "message": "验证成功",
    "statusCode": 1
  },
  "message": "验证成功",
  "code": 1
}
```

**响应示例 - IP不匹配:**
```json
{
  "success": false,
  "data": {
    "valid": false,
    "message": "该激活码已被其他IP使用",
    "statusCode": 3
  },
  "message": "验证失败",
  "code": 3
}
```

**响应示例 - 激活码无效:**
```json
{
  "success": false,
  "data": {
    "valid": false,
    "message": "激活码已过期",
    "statusCode": 2
  },
  "message": "验证失败",
  "code": 2
}
```

---

## 3. 管理员操作

### 3.1 吊销激活码

**接口地址:** `POST /api/admin/revoke`

**描述:** 吊销指定的激活码

**请求参数:**
```json
{
  "activationCodes": [
    "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A"
  ],
  "reason": "违规使用"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "revokedCount": 1,
    "failedCodes": []
  },
  "message": "吊销操作完成"
}
```

### 3.2 获取统计信息

**接口地址:** `GET /api/admin/stats`

**描述:** 获取系统统计信息

**响应示例:**
```json
{
  "success": true,
  "data": {
    "totalCodes": 100,
    "usedCodes": 25,
    "expiredCodes": 5,
    "revokedCodes": 2,
    "totalRevenue": 125.00,
    "monthlyStats": [
      {
        "month": "2025-08",
        "generated": 50,
        "activated": 15,
        "revenue": 75.00
      }
    ]
  },
  "message": "统计信息获取成功"
}
```

---

## 4. 黑名单管理

### 4.1 检查黑名单

**接口地址:** `POST /api/blacklist/check`

**描述:** 检查设备或IP是否在黑名单中

**请求参数:**
```json
{
  "deviceFingerprint": "abc123def456",
  "ip": "192.168.1.100"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "isBlacklisted": false,
    "type": null,
    "reason": null
  },
  "message": "检查完成"
}
```

### 4.2 添加黑名单

**接口地址:** `POST /api/blacklist/add`

**描述:** 添加设备或IP到黑名单

**请求参数:**
```json
{
  "type": "device",              // "device" 或 "ip"
  "value": "abc123def456",       // 设备指纹或IP地址
  "reason": "恶意使用"           // 添加原因
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "type": "device",
    "value": "abc123def456",
    "reason": "恶意使用"
  },
  "message": "已添加到黑名单"
}
```

---

## 5. 支付相关

### 5.1 处理支付

**接口地址:** `POST /api/payment/process`

**描述:** 处理激活码购买支付

**请求参数:**
```json
{
  "activationCode": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A",
  "paymentMethod": "alipay",
  "amount": 5.00,
  "userId": 12345
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123456789",
    "status": "completed",
    "amount": 5.00,
    "activationCode": "BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A"
  },
  "message": "支付处理成功"
}
```

---

## 数据结构定义

### 激活码状态枚举
```typescript
enum ActivationCodeStatus {
  UNUSED = "未使用",
  ACTIVATED = "已激活", 
  EXPIRED = "已过期",
  REVOKED = "已吊销"
}
```

### 通用响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}
```

### 分页响应格式  
```typescript
interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

---

## 错误代码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 内部服务器错误 |

## 常见错误消息

- `"未提供认证令牌"` - 请求头中缺少Authorization
- `"认证令牌无效"` - JWT令牌过期或格式错误
- `"激活码不存在"` - 指定的激活码未找到
- `"激活码已被使用"` - 尝试激活已使用的激活码
- `"设备已在黑名单中"` - 设备被禁止使用
- `"参数验证失败"` - 请求参数格式或值不正确

---

## 使用示例

### JavaScript/TypeScript 示例

```javascript
// 登录获取token
async function login() {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  const data = await response.json();
  return data.data.token;
}

// 获取激活码列表
async function getActivationCodes(token, page = 1, status = null) {
  const params = new URLSearchParams({ page: page.toString() });
  if (status) params.append('status', status);
  
  const response = await fetch(`/api/codes/list?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}

// 查询激活码状态（无需认证）
async function queryActivationCode(code) {
  const response = await fetch(`/api/codes/query?code=${encodeURIComponent(code)}`);
  return await response.json();
}

// 生成激活码
async function generateCodes(token, count, price, validDays) {
  const response = await fetch('/api/codes/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ count, price, validDays })
  });
  return await response.json();
}
```

### cURL 示例

```bash
# 登录
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取激活码列表
curl -X GET "http://localhost:3000/api/codes/list?page=1&status=未使用" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 查询激活码状态（无需认证）
curl -X GET "http://localhost:3000/api/codes/query?code=BEW6EDQCYDRBZNBQ4DJIJGTQYGA4993A"

# 生成激活码
curl -X POST http://localhost:3000/api/codes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"count":5,"price":10.00,"validDays":365}'
```

---

**版本:** v1.0.0  
**更新时间:** 2025年8月2日  
**联系方式:** admin@example.com
