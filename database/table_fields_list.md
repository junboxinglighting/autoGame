# 激活码管理系统 - 数据库表结构清单

## 📊 数据库概览
- **数据库名**: `activation_code_system`
- **字符集**: `utf8mb4`
- **存储引擎**: `InnoDB`
- **总表数**: 9张表 + 3个视图

---

## 📋 表结构清单

### 1. 👤 user (用户表)
```sql
字段名              类型           约束          默认值                注释
userId             INT            PK,AI         -                    用户ID
username           VARCHAR(50)    NOT NULL,UQ   -                    用户名
email              VARCHAR(100)   NOT NULL,UQ   -                    邮箱
passwordHash       VARCHAR(255)   NOT NULL      -                    密码哈希
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    注册时间

索引: idx_username, idx_email, idx_created_time
```

### 2. 🎫 activation_code (激活码表)
```sql
字段名              类型           约束          默认值                注释
activationCode     VARCHAR(32)    PK            -                    激活码
status             ENUM           NOT NULL      '未使用'             状态
userId             INT            FK,NULL       NULL                 用户ID
deviceFingerprint  VARCHAR(255)   NULL          NULL                 设备指纹
ip                 VARCHAR(45)    NULL          NULL                 IP地址
activationDate     DATETIME       NULL          NULL                 激活时间
expirationDate     DATETIME       NULL          NULL                 过期时间
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    创建时间
lastModifiedTime   DATETIME       NOT NULL      CURRENT_TIMESTAMP    修改时间

状态枚举: '未使用', '已激活', '已过期', '已吊销'
索引: idx_status, idx_user_id, idx_expiration_date, idx_created_time, etc.
外键: userId → user(userId)
```

### 3. 💰 payment_record (支付记录表)
```sql
字段名              类型           约束          默认值                注释
paymentId          BIGINT         PK,AI         -                    支付ID
userId             INT            FK,NOT NULL   -                    用户ID
activationCodeId   VARCHAR(32)    FK,NULL       NULL                 激活码ID
amount             DECIMAL(10,2)  NOT NULL      -                    金额
paymentMethod      ENUM           NOT NULL      -                    支付方式
paymentStatus      ENUM           NOT NULL      '处理中'             支付状态
transactionId      VARCHAR(64)    NULL          NULL                 交易ID
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    支付时间

支付方式: '支付宝', '微信支付'
支付状态: '成功', '失败', '处理中'
外键: userId → user(userId), activationCodeId → activation_code(activationCode)
```

### 4. 📝 activation_record (激活记录表)
```sql
字段名              类型           约束          默认值                注释
activationId       BIGINT         PK,AI         -                    激活ID
activationCode     VARCHAR(32)    FK,NOT NULL   -                    激活码
userId             INT            FK,NOT NULL   -                    用户ID
deviceFingerprint  VARCHAR(255)   NOT NULL      -                    设备指纹
ip                 VARCHAR(45)    NOT NULL      -                    IP地址
activationTime     DATETIME       NOT NULL      CURRENT_TIMESTAMP    激活时间
result             ENUM           NOT NULL      -                    激活结果
errorMessage       TEXT           NULL          NULL                 错误信息

激活结果: '成功', '失败'
外键: activationCode → activation_code(activationCode), userId → user(userId)
```

### 5. 🔐 authorization_info (授权信息表)
```sql
字段名              类型           约束          默认值                注释
tokenId            BIGINT         PK,AI         -                    令牌ID
activationCode     VARCHAR(32)    FK,NOT NULL   -                    激活码
tokenContent       TEXT           NOT NULL      -                    令牌内容
effectiveTime      DATETIME       NOT NULL      CURRENT_TIMESTAMP    生效时间
expiryTime         DATETIME       NOT NULL      -                    过期时间
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    创建时间

外键: activationCode → activation_code(activationCode)
```

### 6. 📋 operation_log (操作日志表)
```sql
字段名              类型           约束          默认值                注释
logId              BIGINT         PK,AI         -                    日志ID
operatorId         INT            FK,NOT NULL   -                    操作者ID
operationType      ENUM           NOT NULL      -                    操作类型
target             VARCHAR(255)   NOT NULL      -                    操作对象
detail             TEXT           NULL          NULL                 操作详情
ip                 VARCHAR(45)    NOT NULL      -                    操作IP
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    操作时间

操作类型: '生成', '激活', '吊销', '导出', '修改'
外键: operatorId → user(userId)
```

### 7. 🚫 blacklist_code (激活码黑名单表)
```sql
字段名              类型           约束          默认值                注释
blacklistId        BIGINT         PK,AI         -                    黑名单ID
activationCode     VARCHAR(32)    NOT NULL,UQ   -                    激活码
reason             VARCHAR(255)   NOT NULL      -                    封禁原因
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    封禁时间
```

### 8. 🚫 blacklist_device (设备黑名单表)
```sql
字段名              类型           约束          默认值                注释
blacklistId        BIGINT         PK,AI         -                    黑名单ID
deviceFingerprint  VARCHAR(255)   NOT NULL,UQ   -                    设备指纹
reason             VARCHAR(255)   NOT NULL      -                    封禁原因
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    封禁时间
```

### 9. 🚫 blacklist_ip (IP黑名单表)
```sql
字段名              类型           约束          默认值                注释
blacklistId        BIGINT         PK,AI         -                    黑名单ID
ip                 VARCHAR(45)    NOT NULL,UQ   -                    IP地址
reason             VARCHAR(255)   NOT NULL      -                    封禁原因
createdTime        DATETIME       NOT NULL      CURRENT_TIMESTAMP    封禁时间
```

---

## 📊 数据库视图

### 1. v_activation_code_stats (激活码统计视图)
- 按日期统计激活码生成、激活、过期、吊销数量

### 2. v_revenue_stats (收入统计视图)
- 按日期和支付方式统计收入情况

### 3. v_user_activation_stats (用户激活统计视图)
- 统计每个用户的激活码使用情况

---

## 🔧 存储过程

### 1. CleanExpiredTokens()
- 清理过期的授权令牌

### 2. UpdateExpiredCodes()
- 更新过期的激活码状态

### 3. GenerateActivationReport(start_date, end_date)
- 生成指定时间段的激活码统计报告

---

## ⚡ 触发器

### 1. tr_activation_code_activated
- 激活码状态变更为"已激活"时自动记录激活记录

---

## ⏰ 事件调度器

### 1. evt_clean_expired_tokens
- 每小时执行一次清理过期令牌

### 2. evt_update_expired_codes
- 每天执行一次更新过期激活码状态

---

## 🔗 表关系图

```
user (1) ←─────── (N) activation_code
  │                      │
  │                      └─── (1) authorization_info (N)
  │
  ├─── (N) payment_record
  ├─── (N) activation_record  
  └─── (N) operation_log

独立表:
- blacklist_code
- blacklist_device  
- blacklist_ip
```

---

## 📈 性能优化

### 复合索引
- `activation_code`: (status, userId, createdTime)
- `payment_record`: (paymentStatus, userId, createdTime)
- `activation_record`: (result, activationTime, userId)
- `operation_log`: (operationType, createdTime, operatorId)

### 分区建议
对于大数据量表，建议按时间分区：
- `activation_record` - 按月分区
- `operation_log` - 按月分区
- `payment_record` - 按年分区

---

## 🚀 使用说明

### 创建数据库
```bash
mysql -u root -p < database/create_database.sql
```

### 验证创建结果
```sql
USE activation_code_system;
SHOW TABLES;
DESCRIBE user;
```

### 默认管理员账户
- 用户名: `admin`
- 密码: `admin123` 
- 邮箱: `admin@example.com`

---

## 📝 注意事项

1. **字符集**: 使用 utf8mb4 支持 emoji 等特殊字符
2. **时区**: 建议设置为服务器本地时区
3. **备份**: 定期备份数据库，特别是生产环境
4. **监控**: 监控表大小和查询性能
5. **安全**: 生产环境请修改默认密码和数据库连接配置
