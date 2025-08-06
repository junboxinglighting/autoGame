# 激活码管理系统 - 数据库表结构

## 数据库信息
- **数据库名称**: `activation_code_system`
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`
- **存储引擎**: `InnoDB`

---

## 1. 用户表 (user)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| userId | INT | PRIMARY KEY, AUTO_INCREMENT | - | 用户ID（主键） |
| username | VARCHAR(50) | NOT NULL, UNIQUE | - | 用户名 |
| email | VARCHAR(100) | NOT NULL, UNIQUE | - | 邮箱 |
| passwordHash | VARCHAR(255) | NOT NULL | - | 密码哈希值 |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 注册时间 |

**索引**:
- `idx_username` (username)
- `idx_email` (email)

---

## 2. 激活码表 (activation_code)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| activationCode | VARCHAR(32) | PRIMARY KEY | - | 激活码（唯一、不可预测，32位以上） |
| status | ENUM('未使用', '已激活', '已过期', '已吊销') | NOT NULL | '未使用' | 激活码状态 |
| userId | INT | NULL, FOREIGN KEY | NULL | 关联用户ID（可为空，用于未绑定激活码） |
| deviceFingerprint | VARCHAR(255) | NULL | NULL | 绑定设备指纹（如硬件ID + MAC地址） |
| ip | VARCHAR(45) | NULL | NULL | 绑定IP地址 |
| activationDate | DATETIME | NULL | NULL | 激活时间（可为空，首次激活时填充） |
| expirationDate | DATETIME | NULL | NULL | 到期时间（可为NULL表示无限期） |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 生成时间 |
| lastModifiedTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最后修改时间 |

**索引**:
- `idx_status` (status)
- `idx_user_id` (userId)
- `idx_expiration_date` (expirationDate)
- `idx_created_time` (createdTime)
- `idx_device_fingerprint` (deviceFingerprint)
- `idx_ip` (ip)

**外键约束**:
- `userId` → `user(userId)` ON DELETE SET NULL

---

## 3. 支付记录表 (payment_record)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| paymentId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| userId | INT | NOT NULL, FOREIGN KEY | - | 用户ID |
| activationCodeId | VARCHAR(32) | NULL, FOREIGN KEY | NULL | 关联激活码 |
| amount | DECIMAL(10,2) | NOT NULL | - | 支付金额 |
| paymentMethod | ENUM('支付宝', '微信支付') | NOT NULL | - | 支付方式 |
| paymentStatus | ENUM('成功', '失败', '处理中') | NOT NULL | '处理中' | 支付状态 |
| transactionId | VARCHAR(64) | NULL | NULL | 第三方支付交易ID |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 支付时间 |

**索引**:
- `idx_user_id` (userId)
- `idx_payment_status` (paymentStatus)
- `idx_activation_code_id` (activationCodeId)
- `idx_created_time` (createdTime)
- `idx_transaction_id` (transactionId)

**外键约束**:
- `userId` → `user(userId)` ON DELETE CASCADE
- `activationCodeId` → `activation_code(activationCode)` ON DELETE SET NULL

---

## 4. 激活记录表 (activation_record)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| activationId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| activationCode | VARCHAR(32) | NOT NULL, FOREIGN KEY | - | 关联激活码 |
| userId | INT | NOT NULL, FOREIGN KEY | - | 用户ID |
| deviceFingerprint | VARCHAR(255) | NOT NULL | - | 激活时设备指纹 |
| ip | VARCHAR(45) | NOT NULL | - | 激活时IP地址 |
| activationTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 激活时间 |
| result | ENUM('成功', '失败') | NOT NULL | - | 激活结果 |
| errorMessage | TEXT | NULL | NULL | 失败原因（可为空） |

**索引**:
- `idx_activation_code` (activationCode)
- `idx_user_id` (userId)
- `idx_activation_time` (activationTime)
- `idx_result` (result)
- `idx_device_fingerprint` (deviceFingerprint)
- `idx_ip` (ip)

**外键约束**:
- `activationCode` → `activation_code(activationCode)` ON DELETE CASCADE
- `userId` → `user(userId)` ON DELETE CASCADE

---

## 5. 授权信息表 (authorization_info)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| tokenId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| activationCode | VARCHAR(32) | NOT NULL, FOREIGN KEY | - | 关联激活码 |
| tokenContent | TEXT | NOT NULL | - | 加密后的授权令牌（如JWT或加密文件） |
| effectiveTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 令牌生效时间 |
| expiryTime | DATETIME | NOT NULL | - | 令牌过期时间 |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 生成时间 |

**索引**:
- `idx_activation_code` (activationCode)
- `idx_expiry_time` (expiryTime)
- `idx_created_time` (createdTime)

**外键约束**:
- `activationCode` → `activation_code(activationCode)` ON DELETE CASCADE

---

## 6. 操作日志表 (operation_log)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| logId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| operatorId | INT | NOT NULL, FOREIGN KEY | - | 操作人ID（管理员或系统） |
| operationType | ENUM('生成', '激活', '吊销', '导出', '修改') | NOT NULL | - | 操作类型 |
| target | VARCHAR(255) | NOT NULL | - | 操作对象（如激活码、设备IP等） |
| detail | TEXT | NULL | NULL | 操作详情（如修改字段、删除原因） |
| ip | VARCHAR(45) | NOT NULL | - | 操作IP地址 |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 操作时间 |

**索引**:
- `idx_operator_id` (operatorId)
- `idx_operation_type` (operationType)
- `idx_created_time` (createdTime)
- `idx_ip` (ip)

**外键约束**:
- `operatorId` → `user(userId)` ON DELETE CASCADE

---

## 7. 激活码黑名单表 (blacklist_code)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| blacklistId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| activationCode | VARCHAR(32) | NOT NULL, UNIQUE | - | 黑名单激活码 |
| reason | VARCHAR(255) | NOT NULL | - | 封禁原因 |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 封禁时间 |

**索引**:
- `idx_activation_code` (activationCode)
- `idx_created_time` (createdTime)

---

## 8. 设备黑名单表 (blacklist_device)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| blacklistId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| deviceFingerprint | VARCHAR(255) | NOT NULL, UNIQUE | - | 黑名单设备指纹 |
| reason | VARCHAR(255) | NOT NULL | - | 封禁原因 |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 封禁时间 |

**索引**:
- `idx_device_fingerprint` (deviceFingerprint)
- `idx_created_time` (createdTime)

---

## 9. IP黑名单表 (blacklist_ip)

| 字段名 | 数据类型 | 约束 | 默认值 | 注释 |
|--------|----------|------|--------|------|
| blacklistId | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 自增主键 |
| ip | VARCHAR(45) | NOT NULL, UNIQUE | - | 黑名单IP地址 |
| reason | VARCHAR(255) | NOT NULL | - | 封禁原因 |
| createdTime | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 封禁时间 |

**索引**:
- `idx_ip` (ip)
- `idx_created_time` (createdTime)

---

## 数据库视图

### 1. 激活码统计视图 (v_activation_code_stats)
```sql
SELECT 
    DATE(createdTime) as date,
    COUNT(*) as total_generated,
    COUNT(CASE WHEN status = '已激活' THEN 1 END) as total_activated,
    COUNT(CASE WHEN status = '已过期' THEN 1 END) as total_expired,
    COUNT(CASE WHEN status = '已吊销' THEN 1 END) as total_revoked,
    COUNT(CASE WHEN status = '未使用' THEN 1 END) as total_unused
FROM activation_code 
GROUP BY DATE(createdTime)
ORDER BY date DESC;
```

### 2. 收入统计视图 (v_revenue_stats)
```sql
SELECT 
    DATE(createdTime) as date,
    paymentMethod,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN paymentStatus = '成功' THEN amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN paymentStatus = '成功' THEN amount ELSE NULL END) as avg_amount
FROM payment_record 
GROUP BY DATE(createdTime), paymentMethod
ORDER BY date DESC, paymentMethod;
```

---

## 存储过程

### 1. 清理过期的授权令牌 (CleanExpiredTokens)
- **功能**: 删除已过期的授权令牌
- **返回**: 删除的记录数量

### 2. 自动更新过期的激活码状态 (UpdateExpiredCodes)
- **功能**: 将过期的未使用激活码状态更新为"已过期"
- **返回**: 更新的记录数量

---

## 事件调度器

### 1. 清理过期令牌事件 (evt_clean_expired_tokens)
- **频率**: 每小时执行一次
- **功能**: 调用 `CleanExpiredTokens()` 存储过程

### 2. 更新过期激活码事件 (evt_update_expired_codes)
- **频率**: 每天执行一次
- **功能**: 调用 `UpdateExpiredCodes()` 存储过程

---

## 表关系图

```
user (1) ←──── (N) activation_code
  │                    │
  │                    └─── (1) authorization_info (N)
  │
  ├─── (N) payment_record
  ├─── (N) activation_record
  └─── (N) operation_log

blacklist_code (独立表)
blacklist_device (独立表)
blacklist_ip (独立表)
```

---

## 性能优化建议

建议创建以下复合索引以提升查询性能：

```sql
-- 激活码表复合索引
ALTER TABLE activation_code ADD INDEX idx_composite_search (status, userId, createdTime);

-- 支付记录表复合索引
ALTER TABLE payment_record ADD INDEX idx_composite_search (paymentStatus, userId, createdTime);

-- 激活记录表复合索引
ALTER TABLE activation_record ADD INDEX idx_composite_search (result, activationTime, userId);
```

---

## 数据统计

| 表名 | 预计记录数 | 主要用途 |
|------|------------|----------|
| user | 10K - 100K | 用户管理 |
| activation_code | 100K - 1M | 激活码管理 |
| payment_record | 50K - 500K | 支付追踪 |
| activation_record | 100K - 1M | 激活追踪 |
| authorization_info | 100K - 1M | 授权管理 |
| operation_log | 1M+ | 审计日志 |
| blacklist_* | 1K - 10K | 安全防护 |
