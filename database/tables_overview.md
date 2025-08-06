# 数据库表结构概览

## 核心业务表 (5张)

### 1. user - 用户表
```sql
userId (PK), username, email, passwordHash, createdTime
```

### 2. activation_code - 激活码表
```sql
activationCode (PK), status, userId (FK), deviceFingerprint, ip, 
activationDate, expirationDate, createdTime, lastModifiedTime
```

### 3. payment_record - 支付记录表
```sql
paymentId (PK), userId (FK), activationCodeId (FK), amount, 
paymentMethod, paymentStatus, transactionId, createdTime
```

### 4. activation_record - 激活记录表
```sql
activationId (PK), activationCode (FK), userId (FK), deviceFingerprint, 
ip, activationTime, result, errorMessage
```

### 5. authorization_info - 授权信息表
```sql
tokenId (PK), activationCode (FK), tokenContent, effectiveTime, 
expiryTime, createdTime
```

## 日志审计表 (1张)

### 6. operation_log - 操作日志表
```sql
logId (PK), operatorId (FK), operationType, target, detail, ip, createdTime
```

## 黑名单管理表 (3张)

### 7. blacklist_code - 激活码黑名单
```sql
blacklistId (PK), activationCode, reason, createdTime
```

### 8. blacklist_device - 设备黑名单
```sql
blacklistId (PK), deviceFingerprint, reason, createdTime
```

### 9. blacklist_ip - IP黑名单
```sql
blacklistId (PK), ip, reason, createdTime
```

## 表关系
- user (1:N) activation_code
- activation_code (1:1) authorization_info
- user (1:N) payment_record
- user (1:N) activation_record
- user (1:N) operation_log
- activation_code (1:N) activation_record

## 主要枚举值
- activation_code.status: '未使用', '已激活', '已过期', '已吊销'
- payment_record.paymentMethod: '支付宝', '微信支付'
- payment_record.paymentStatus: '成功', '失败', '处理中'
- activation_record.result: '成功', '失败'
- operation_log.operationType: '生成', '激活', '吊销', '导出', '修改'
