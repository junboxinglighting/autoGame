-- 激活码管理系统数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS activation_code_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE activation_code_system;

-- 1. 用户表 (User)
CREATE TABLE IF NOT EXISTS user (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    passwordHash VARCHAR(255) NOT NULL COMMENT '密码哈希值',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 激活码表 (ActivationCode)
CREATE TABLE IF NOT EXISTS activation_code (
    activationCode VARCHAR(32) PRIMARY KEY COMMENT '激活码（唯一、不可预测，32位以上）',
    status ENUM('未使用', '已激活', '已过期', '已吊销') NOT NULL DEFAULT '未使用' COMMENT '激活码状态',
    userId INT NULL COMMENT '关联用户ID（可为空，用于未绑定激活码）',
    deviceFingerprint VARCHAR(255) NULL COMMENT '绑定设备指纹（如硬件ID + MAC地址）',
    ip VARCHAR(45) NULL COMMENT '绑定IP地址',
    activationDate DATETIME NULL COMMENT '激活时间（可为空，首次激活时填充）',
    expirationDate DATETIME NULL COMMENT '到期时间（可为NULL表示无限期）',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
    lastModifiedTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
    
    INDEX idx_status (status),
    INDEX idx_user_id (userId),
    INDEX idx_expiration_date (expirationDate),
    INDEX idx_created_time (createdTime),
    INDEX idx_device_fingerprint (deviceFingerprint),
    INDEX idx_ip (ip),
    
    FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='激活码表';

-- 3. 支付记录表 (PaymentRecord)
CREATE TABLE IF NOT EXISTS payment_record (
    paymentId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    userId INT NOT NULL COMMENT '用户ID',
    activationCodeId VARCHAR(32) NULL COMMENT '关联激活码',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    paymentMethod ENUM('支付宝', '微信支付') NOT NULL COMMENT '支付方式',
    paymentStatus ENUM('成功', '失败', '处理中') NOT NULL DEFAULT '处理中' COMMENT '支付状态',
    transactionId VARCHAR(64) NULL COMMENT '第三方支付交易ID',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '支付时间',
    
    INDEX idx_user_id (userId),
    INDEX idx_payment_status (paymentStatus),
    INDEX idx_activation_code_id (activationCodeId),
    INDEX idx_created_time (createdTime),
    INDEX idx_transaction_id (transactionId),
    
    FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE,
    FOREIGN KEY (activationCodeId) REFERENCES activation_code(activationCode) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 4. 激活记录表 (ActivationRecord)
CREATE TABLE IF NOT EXISTS activation_record (
    activationId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    activationCode VARCHAR(32) NOT NULL COMMENT '关联激活码',
    userId INT NOT NULL COMMENT '用户ID',
    deviceFingerprint VARCHAR(255) NOT NULL COMMENT '激活时设备指纹',
    ip VARCHAR(45) NOT NULL COMMENT '激活时IP地址',
    activationTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '激活时间',
    result ENUM('成功', '失败') NOT NULL COMMENT '激活结果',
    errorMessage TEXT NULL COMMENT '失败原因（可为空）',
    
    INDEX idx_activation_code (activationCode),
    INDEX idx_user_id (userId),
    INDEX idx_activation_time (activationTime),
    INDEX idx_result (result),
    INDEX idx_device_fingerprint (deviceFingerprint),
    INDEX idx_ip (ip),
    
    FOREIGN KEY (activationCode) REFERENCES activation_code(activationCode) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='激活记录表';

-- 5. 授权信息表 (AuthorizationInfo)
CREATE TABLE IF NOT EXISTS authorization_info (
    tokenId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    activationCode VARCHAR(32) NOT NULL COMMENT '关联激活码',
    tokenContent TEXT NOT NULL COMMENT '加密后的授权令牌（如JWT或加密文件）',
    effectiveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '令牌生效时间',
    expiryTime DATETIME NOT NULL COMMENT '令牌过期时间',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
    
    INDEX idx_activation_code (activationCode),
    INDEX idx_expiry_time (expiryTime),
    INDEX idx_created_time (createdTime),
    
    FOREIGN KEY (activationCode) REFERENCES activation_code(activationCode) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='授权信息表';

-- 6. 操作日志表 (OperationLog)
CREATE TABLE IF NOT EXISTS operation_log (
    logId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    operatorId INT NOT NULL COMMENT '操作人ID（管理员或系统）',
    operationType ENUM('生成', '激活', '吊销', '导出', '修改', '登录') NOT NULL COMMENT '操作类型',
    target VARCHAR(255) NOT NULL COMMENT '操作对象（如激活码、设备IP等）',
    detail TEXT NULL COMMENT '操作详情（如修改字段、删除原因）',
    ip VARCHAR(45) NOT NULL COMMENT '操作IP地址',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    
    INDEX idx_operator_id (operatorId),
    INDEX idx_operation_type (operationType),
    INDEX idx_created_time (createdTime),
    INDEX idx_ip (ip),
    
    FOREIGN KEY (operatorId) REFERENCES user(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 7. 激活码黑名单表
CREATE TABLE IF NOT EXISTS blacklist_code (
    blacklistId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    activationCode VARCHAR(32) NOT NULL UNIQUE COMMENT '黑名单激活码',
    reason VARCHAR(255) NOT NULL COMMENT '封禁原因',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '封禁时间',
    
    INDEX idx_activation_code (activationCode),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='激活码黑名单表';

-- 8. 设备黑名单表
CREATE TABLE IF NOT EXISTS blacklist_device (
    blacklistId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    deviceFingerprint VARCHAR(255) NOT NULL UNIQUE COMMENT '黑名单设备指纹',
    reason VARCHAR(255) NOT NULL COMMENT '封禁原因',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '封禁时间',
    
    INDEX idx_device_fingerprint (deviceFingerprint),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备黑名单表';

-- 9. IP黑名单表
CREATE TABLE IF NOT EXISTS blacklist_ip (
    blacklistId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    ip VARCHAR(45) NOT NULL UNIQUE COMMENT '黑名单IP地址',
    reason VARCHAR(255) NOT NULL COMMENT '封禁原因',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '封禁时间',
    
    INDEX idx_ip (ip),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='IP黑名单表';

-- 插入默认管理员用户（密码：admin123，需要使用bcrypt加密）
-- 注意：实际部署时应该修改默认密码
INSERT INTO user (username, email, passwordHash, createdTime) VALUES 
('admin', 'admin@example.com', '$2a$10$YourBcryptHashedPasswordHere', NOW())
ON DUPLICATE KEY UPDATE username = username;

-- 创建视图：激活码统计视图
CREATE OR REPLACE VIEW v_activation_code_stats AS
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

-- 创建视图：收入统计视图
CREATE OR REPLACE VIEW v_revenue_stats AS
SELECT 
    DATE(createdTime) as date,
    paymentMethod,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN paymentStatus = '成功' THEN amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN paymentStatus = '成功' THEN amount ELSE NULL END) as avg_amount
FROM payment_record 
GROUP BY DATE(createdTime), paymentMethod
ORDER BY date DESC, paymentMethod;

-- 创建存储过程：清理过期的授权令牌
DELIMITER //
CREATE PROCEDURE CleanExpiredTokens()
BEGIN
    DELETE FROM authorization_info 
    WHERE expiryTime < NOW();
    
    SELECT ROW_COUNT() as deleted_count;
END //
DELIMITER ;

-- 创建存储过程：自动更新过期的激活码状态
DELIMITER //
CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    UPDATE activation_code 
    SET status = '已过期', lastModifiedTime = NOW()
    WHERE status = '未使用' 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    SELECT ROW_COUNT() as updated_count;
END //
DELIMITER ;

-- 创建事件调度器（需要开启事件调度器：SET GLOBAL event_scheduler = ON;）
-- 每小时清理一次过期令牌
CREATE EVENT IF NOT EXISTS evt_clean_expired_tokens
ON SCHEDULE EVERY 1 HOUR
STARTS CURRENT_TIMESTAMP
DO
  CALL CleanExpiredTokens();

-- 每天更新一次过期激活码状态
CREATE EVENT IF NOT EXISTS evt_update_expired_codes
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  CALL UpdateExpiredCodes();

-- 性能优化建议的额外索引
-- ALTER TABLE activation_code ADD INDEX idx_composite_search (status, userId, createdTime);
-- ALTER TABLE payment_record ADD INDEX idx_composite_search (paymentStatus, userId, createdTime);
-- ALTER TABLE activation_record ADD INDEX idx_composite_search (result, activationTime, userId);

COMMIT;
