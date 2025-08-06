# 激活码验证接口文档 (Validate-Simple)

## 接口概述

**接口名称**: 激活码验证接口（简化版）  
**接口路径**: `/api/codes/validate-simple`  
**请求方法**: `POST`  
**Content-Type**: `application/json`  
**功能描述**: 验证激活码有效性并实现设备指纹绑定验证机制

## 核心功能

### 设备指纹验证逻辑
1. **首次激活**: 激活码状态为"未使用"时，绑定设备指纹并更新状态为"已激活"
2. **重复验证**: 激活码状态为"已激活"时，验证请求设备指纹是否与绑定设备指纹一致
3. **设备冲突检测**: 如果设备指纹不一致，返回状态码3表示设备冲突

## 请求参数

### 请求体结构
```json
{
  "code": "string",           // 激活码（必填）
  "userId": "number",         // 用户ID（必填）
  "deviceFingerprint": "string", // 设备指纹（必填）
  "ip": "string"             // IP地址（必填）
}
```

### 参数详细说明

| 参数名 | 类型 | 必填 | 长度限制 | 说明 |
|--------|------|------|----------|------|
| code | string | ✅ | 32位 | 激活码，必须为32位大写字母和数字组合 |
| userId | number | ✅ | - | 用户ID，必须为正整数且在user表中存在 |
| deviceFingerprint | string | ✅ | 1-255 | 设备指纹标识 |
| ip | string | ✅ | 1-45 | IP地址，支持IPv4和IPv6格式 |

### 参数验证规则
- **code**: 必须匹配正则表达式 `^[A-Z0-9]{32}$`
- **userId**: 必须为存在的用户ID（外键约束）
- **deviceFingerprint**: 非空字符串
- **ip**: 有效的IP地址格式

## 响应格式

### 成功响应结构
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "string",
    "statusCode": "number"
  },
  "message": "string"
}
```

### 错误响应结构
```json
{
  "success": false,
  "data": {
    "valid": false,
    "message": "string",
    "statusCode": "number"
  },
  "message": "string"
}
```

## 状态码说明

| statusCode | 含义 | 场景 |
|------------|------|------|
| 1 | 验证成功 | 首次激活成功 或 设备指纹验证通过 |
| 2 | 验证失败 | 激活码不存在、已过期、状态无效 |
| 3 | 设备冲突 | 激活码已被其他设备使用 |

## 响应示例

### 1. 首次激活成功
**请求**:
```json
{
  "code": "ABCD1234EFGH5678IJKL9012MNOP3456",
  "userId": 2,
  "deviceFingerprint": "device-001",
  "ip": "192.168.1.100"
}
```

**响应**: `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "激活成功",
    "statusCode": 1
  },
  "message": "验证成功"
}
```

### 2. 相同设备重复验证
**请求**:
```json
{
  "code": "ABCD1234EFGH5678IJKL9012MNOP3456",
  "userId": 2,
  "deviceFingerprint": "device-001",
  "ip": "192.168.1.100"
}
```

**响应**: `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "验证通过",
    "statusCode": 1
  },
  "message": "验证成功"
}
```

### 3. 设备冲突检测
**请求**:
```json
{
  "code": "ABCD1234EFGH5678IJKL9012MNOP3456",
  "userId": 2,
  "deviceFingerprint": "device-different",
  "ip": "192.168.1.200"
}
```

**响应**: `200 OK`
```json
{
  "success": false,
  "data": {
    "valid": false,
    "message": "该激活码已被其他设备使用",
    "statusCode": 3
  },
  "message": "设备指纹冲突"
}
```

### 4. 激活码不存在
**请求**:
```json
{
  "code": "INVALID000000000000000000000000000",
  "userId": 2,
  "deviceFingerprint": "device-001",
  "ip": "192.168.1.100"
}
```

**响应**: `200 OK`
```json
{
  "success": false,
  "data": {
    "valid": false,
    "message": "激活码不存在",
    "statusCode": 2
  },
  "message": "激活码验证失败"
}
```

### 5. 激活码已过期
**请求**:
```json
{
  "code": "EXPIRED1234567890123456789012345",
  "userId": 2,
  "deviceFingerprint": "device-001",
  "ip": "192.168.1.100"
}
```

**响应**: `200 OK`
```json
{
  "success": false,
  "data": {
    "valid": false,
    "message": "激活码已过期",
    "statusCode": 2
  },
  "message": "激活码验证失败"
}
```

## 错误响应

### 参数验证错误
**响应**: `400 Bad Request`
```json
{
  "error": true,
  "statusCode": 400,
  "statusMessage": "参数不完整",
  "message": "参数不完整"
}
```

### 激活码格式错误
**响应**: `400 Bad Request`
```json
{
  "error": true,
  "statusCode": 400,
  "statusMessage": "激活码格式无效",
  "message": "激活码格式无效"
}
```

### 方法不允许
**响应**: `405 Method Not Allowed`
```json
{
  "error": true,
  "statusCode": 405,
  "statusMessage": "方法不允许",
  "message": "方法不允许"
}
```

### 服务器内部错误
**响应**: `500 Internal Server Error`
```json
{
  "error": true,
  "statusCode": 500,
  "statusMessage": "服务器内部错误: 详细错误信息",
  "message": "服务器内部错误: 详细错误信息"
}
```

## 数据库操作

### 首次激活时的数据库更新
```sql
UPDATE activation_code 
SET status = '已激活', 
    deviceFingerprint = ?, 
    userId = ?, 
    activationDate = NOW() 
WHERE activationCode = ?
```

### 触发器自动操作
激活码状态更新为"已激活"时，会自动触发 `tr_activation_code_activated` 触发器，在 `activation_record` 表中插入激活记录。

### 过期状态自动更新
系统配置了每天凌晨2点自动执行的事件调度器 `evt_update_expired_codes_daily`，调用 `UpdateExpiredCodes()` 存储过程自动将过期的激活码状态更新为"已过期"。

**存储过程功能**:
- 自动检测过期的激活码（状态为"未使用"或"已激活"且过期时间小于当前时间）
- 批量更新状态为"已过期"
- 记录执行日志到 `operation_log` 表
- 支持手动调用: `CALL UpdateExpiredCodes();`

## 调用示例

### 网页链接形式 (GET请求)
**接口地址**: `/api/codes/validate-url`  
**请求方法**: `GET` 或 `POST`

**URL格式**:
```
http://localhost:3000/api/codes/validate-url?code={激活码}&userId={用户ID}&deviceFingerprint={设备指纹}&ip={IP地址}
```

**完整示例URL**:
```
http://localhost:3000/api/codes/validate-url?code=ABCD1234EFGH5678IJKL9012MNOP3456&userId=2&deviceFingerprint=device-001&ip=192.168.1.100
```

**浏览器直接访问**:
- 可以直接在浏览器地址栏输入上述URL
- 支持书签保存和分享
- 返回JSON格式响应

### JavaScript (Node.js)
```javascript
const response = await fetch('http://localhost:3000/api/codes/validate-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'ABCD1234EFGH5678IJKL9012MNOP3456',
    userId: 2,
    deviceFingerprint: 'device-001',
    ip: '192.168.1.100'
  })
})

const result = await response.json()
console.log('验证结果:', result.data.statusCode)
```

### Python
```python
import requests
import json

url = 'http://localhost:3000/api/codes/validate-simple'
data = {
    'code': 'ABCD1234EFGH5678IJKL9012MNOP3456',
    'userId': 2,
    'deviceFingerprint': 'device-001',
    'ip': '192.168.1.100'
}

response = requests.post(url, json=data)
result = response.json()
print(f"验证结果: {result['data']['statusCode']}")
```

### cURL
**POST请求**:
```bash
curl -X POST http://localhost:3000/api/codes/validate-simple \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABCD1234EFGH5678IJKL9012MNOP3456",
    "userId": 2,
    "deviceFingerprint": "device-001",
    "ip": "192.168.1.100"
  }'
```

**GET请求（URL形式）**:
```bash
curl "http://localhost:3000/api/codes/validate-url?code=ABCD1234EFGH5678IJKL9012MNOP3456&userId=2&deviceFingerprint=device-001&ip=192.168.1.100"
```

## 接口变体

### 标准POST接口
- **路径**: `/api/codes/validate-simple`
- **方法**: `POST`
- **参数**: JSON请求体
- **用途**: 标准API调用

### URL参数接口  
- **路径**: `/api/codes/validate-url`
- **方法**: `GET` 或 `POST`
- **参数**: URL查询参数或JSON请求体
- **用途**: 浏览器直接访问、书签保存、链接分享

## 注意事项

### 请求方式选择建议

#### 🔒 **生产环境推荐：POST请求**
- **安全性高**：激活码等敏感参数不会出现在URL、浏览器历史记录或服务器日志中
- **符合RESTful规范**：激活操作涉及数据状态修改，语义上更适合使用POST
- **防止意外缓存**：避免激活码被浏览器或CDN缓存
- **数据完整性**：支持更复杂的请求体结构和验证

#### 🌐 **开发/测试环境：GET请求作为辅助**
- **测试便利**：可直接在浏览器地址栏测试，无需额外工具
- **调试友好**：支持书签保存，便于重复测试
- **演示方便**：可通过链接直接展示功能给其他人

#### ⚖️ **选择建议**
```
生产环境：POST (/api/codes/validate-simple) ← 推荐
测试环境：GET  (/api/codes/validate-url)    ← 辅助
```

### 安全考虑
1. **设备绑定**: 一旦激活码被激活，将永久绑定到首次激活的设备指纹
2. **用户验证**: userId必须为数据库中存在的有效用户ID
3. **设备唯一性**: 设备指纹作为主要验证依据，确保激活码与设备的唯一绑定关系
4. **URL安全性**: GET请求参数会出现在浏览器历史记录和服务器日志中，生产环境建议使用POST请求
5. **参数加密**: 敏感参数建议在传输前进行加密处理

### 性能优化
1. **数据库索引**: 激活码、设备指纹、用户ID等字段已建立索引
2. **连接池**: 使用MySQL连接池管理数据库连接
3. **错误处理**: 完善的错误处理和日志记录

### 兼容性
- **Nuxt 3.18.0+**: 基于Nuxt 3框架开发
- **MySQL 8.0+**: 需要MySQL 8.0或更高版本
- **Node.js 18+**: 需要Node.js 18或更高版本

## 测试建议

### 功能测试场景
1. ✅ 首次激活测试
2. ✅ 相同设备重复验证测试  
3. ✅ 不同设备冲突检测测试
4. ✅ 激活码不存在测试
5. ✅ 激活码已过期测试
6. ✅ 参数验证测试
7. ✅ 格式验证测试
8. ✅ 错误处理测试

### 压力测试
建议进行并发访问测试，验证数据库连接池和事务处理的稳定性。

## 更新记录

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2025-08-02 | 初始版本，实现IP验证功能 |
| 1.1.0 | 2025-08-02 | 修改为设备指纹验证功能 |
| 1.2.0 | 2025-08-02 | 新增URL参数访问方式，支持浏览器直接访问 |
| 1.3.0 | 2025-08-02 | 新增自动过期状态更新存储过程，每天凌晨2点自动执行 |

---

**文档维护**: GitHub Copilot  
**最后更新**: 2025年8月2日
