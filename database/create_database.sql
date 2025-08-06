-- ====================================================================
-- 激活码管理系统 - MySQL数据库建库建表语句
-- 创建时间: 2025年8月1日
-- 数据库版本: MySQL 8.0+
-- 字符集: utf8mb4
-- ====================================================================

-- 1. 创建数据库
DROP DATABASE IF EXISTS activation_code_system;
CREATE DATABASE activation_code_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci 
COMMENT '激活码管理系统数据库';

-- 使用数据库
USE activation_code_system;

-- ====================================================================
-- 2. 创建数据表
-- ====================================================================

-- 2.1 用户表 (user)
-- 存储系统用户信息，包括管理员和普通用户
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    userId INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID（主键）',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱地址',
    passwordHash VARCHAR(255) NOT NULL COMMENT '密码哈希值（bcrypt加密）',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    
    -- 索引
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2.2 激活码表 (activation_code)
-- 存储激活码信息，是系统的核心业务表
DROP TABLE IF EXISTS activation_code;
CREATE TABLE activation_code (
    activationCode VARCHAR(32) PRIMARY KEY COMMENT '激活码（唯一标识，32位字符串）',
    status ENUM('未使用', '已激活', '已过期', '已吊销') NOT NULL DEFAULT '未使用' COMMENT '激活码状态',
    userId INT NULL COMMENT '关联用户ID（可为空）',
    deviceFingerprint VARCHAR(255) NULL COMMENT '绑定设备指纹（硬件ID + MAC地址）',
    ip VARCHAR(45) NULL COMMENT '绑定IP地址（支持IPv4和IPv6）',
    activationDate DATETIME NULL COMMENT '激活时间（首次激活时填充）',
    expirationDate DATETIME NULL COMMENT '到期时间（NULL表示永不过期）',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
    lastModifiedTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后修改时间',
    
    -- 索引
    INDEX idx_status (status),
    INDEX idx_user_id (userId),
    INDEX idx_expiration_date (expirationDate),
    INDEX idx_created_time (createdTime),
    INDEX idx_device_fingerprint (deviceFingerprint),
    INDEX idx_ip (ip),
    INDEX idx_activation_date (activationDate),
    
    -- 外键约束
    FOREIGN KEY fk_activation_code_user (userId) REFERENCES user(userId) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='激活码表';

-- 2.3 支付记录表 (payment_record)
-- 存储用户支付信息和交易记录
DROP TABLE IF EXISTS payment_record;
CREATE TABLE payment_record (
    paymentId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '支付ID（主键）',
    userId INT NOT NULL COMMENT '用户ID',
    activationCodeId VARCHAR(32) NULL COMMENT '关联激活码',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额（单位：元）',
    paymentMethod ENUM('支付宝', '微信支付') NOT NULL COMMENT '支付方式',
    paymentStatus ENUM('成功', '失败', '处理中') NOT NULL DEFAULT '处理中' COMMENT '支付状态',
    transactionId VARCHAR(64) NULL COMMENT '第三方支付交易ID',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '支付时间',
    
    -- 索引
    INDEX idx_user_id (userId),
    INDEX idx_payment_status (paymentStatus),
    INDEX idx_activation_code_id (activationCodeId),
    INDEX idx_created_time (createdTime),
    INDEX idx_transaction_id (transactionId),
    INDEX idx_payment_method (paymentMethod),
    
    -- 外键约束
    FOREIGN KEY fk_payment_record_user (userId) REFERENCES user(userId) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY fk_payment_record_code (activationCodeId) REFERENCES activation_code(activationCode) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 2.4 激活记录表 (activation_record)
-- 存储激活码的使用记录，用于审计和统计
DROP TABLE IF EXISTS activation_record;
CREATE TABLE activation_record (
    activationId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '激活记录ID（主键）',
    activationCode VARCHAR(32) NOT NULL COMMENT '关联激活码',
    userId INT NOT NULL COMMENT '用户ID',
    deviceFingerprint VARCHAR(255) NOT NULL COMMENT '激活时设备指纹',
    ip VARCHAR(45) NOT NULL COMMENT '激活时IP地址',
    activationTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '激活时间',
    result ENUM('成功', '失败') NOT NULL COMMENT '激活结果',
    errorMessage TEXT NULL COMMENT '失败原因（激活失败时的详细信息）',
    
    -- 索引
    INDEX idx_activation_code (activationCode),
    INDEX idx_user_id (userId),
    INDEX idx_activation_time (activationTime),
    INDEX idx_result (result),
    INDEX idx_device_fingerprint (deviceFingerprint),
    INDEX idx_ip (ip),
    
    -- 外键约束
    FOREIGN KEY fk_activation_record_code (activationCode) REFERENCES activation_code(activationCode) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY fk_activation_record_user (userId) REFERENCES user(userId) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='激活记录表';

-- 2.5 授权信息表 (authorization_info)
-- 存储激活码对应的授权令牌信息
DROP TABLE IF EXISTS authorization_info;
CREATE TABLE authorization_info (
    tokenId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '令牌ID（主键）',
    activationCode VARCHAR(32) NOT NULL COMMENT '关联激活码',
    tokenContent TEXT NOT NULL COMMENT '加密后的授权令牌（JWT或加密文件）',
    effectiveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '令牌生效时间',
    expiryTime DATETIME NOT NULL COMMENT '令牌过期时间',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
    
    -- 索引
    INDEX idx_activation_code (activationCode),
    INDEX idx_expiry_time (expiryTime),
    INDEX idx_created_time (createdTime),
    INDEX idx_effective_time (effectiveTime),
    
    -- 外键约束
    FOREIGN KEY fk_authorization_info_code (activationCode) REFERENCES activation_code(activationCode) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='授权信息表';

-- 2.6 操作日志表 (operation_log)
-- 存储系统所有重要操作的日志记录，用于审计
DROP TABLE IF EXISTS operation_log;
CREATE TABLE operation_log (
    logId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID（主键）',
    operatorId INT NOT NULL COMMENT '操作人ID（管理员或系统用户）',
    operationType ENUM('生成', '激活', '吊销', '导出', '修改', '登录') NOT NULL COMMENT '操作类型',
    target VARCHAR(255) NOT NULL COMMENT '操作对象（激活码、设备IP等）',
    detail TEXT NULL COMMENT '操作详情（修改字段、删除原因等）',
    ip VARCHAR(45) NOT NULL COMMENT '操作IP地址',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    
    -- 索引
    INDEX idx_operator_id (operatorId),
    INDEX idx_operation_type (operationType),
    INDEX idx_created_time (createdTime),
    INDEX idx_ip (ip),
    INDEX idx_target (target),
    
    -- 外键约束
    FOREIGN KEY fk_operation_log_user (operatorId) REFERENCES user(userId) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 2.7 激活码黑名单表 (blacklist_code)
-- 存储被封禁的激活码
DROP TABLE IF EXISTS blacklist_code;
CREATE TABLE blacklist_code (
    blacklistId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '黑名单ID（主键）',
    activationCode VARCHAR(32) NOT NULL UNIQUE COMMENT '黑名单激活码',
    reason VARCHAR(255) NOT NULL COMMENT '封禁原因',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '封禁时间',
    
    -- 索引
    INDEX idx_activation_code (activationCode),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='激活码黑名单表';

-- 2.8 设备黑名单表 (blacklist_device)
-- 存储被封禁的设备指纹
DROP TABLE IF EXISTS blacklist_device;
CREATE TABLE blacklist_device (
    blacklistId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '黑名单ID（主键）',
    deviceFingerprint VARCHAR(255) NOT NULL UNIQUE COMMENT '黑名单设备指纹',
    reason VARCHAR(255) NOT NULL COMMENT '封禁原因',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '封禁时间',
    
    -- 索引
    INDEX idx_device_fingerprint (deviceFingerprint),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备黑名单表';

-- 2.9 IP黑名单表 (blacklist_ip)
-- 存储被封禁的IP地址
DROP TABLE IF EXISTS blacklist_ip;
CREATE TABLE blacklist_ip (
    blacklistId BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '黑名单ID（主键）',
    ip VARCHAR(45) NOT NULL UNIQUE COMMENT '黑名单IP地址（支持IPv4和IPv6）',
    reason VARCHAR(255) NOT NULL COMMENT '封禁原因',
    createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '封禁时间',
    
    -- 索引
    INDEX idx_ip (ip),
    INDEX idx_created_time (createdTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='IP黑名单表';

-- ====================================================================
-- 3. 创建视图
-- ====================================================================

-- 3.1 激活码统计视图
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

-- 3.2 收入统计视图
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

-- 3.3 用户激活统计视图
CREATE OR REPLACE VIEW v_user_activation_stats AS
SELECT 
    u.userId,
    u.username,
    u.email,
    COUNT(ac.activationCode) as total_codes,
    COUNT(CASE WHEN ac.status = '已激活' THEN 1 END) as activated_codes,
    COUNT(CASE WHEN ac.status = '未使用' THEN 1 END) as unused_codes,
    MAX(ac.activationDate) as last_activation_time
FROM user u
LEFT JOIN activation_code ac ON u.userId = ac.userId
GROUP BY u.userId, u.username, u.email
ORDER BY total_codes DESC;

-- ====================================================================
-- 4. 创建存储过程
-- ====================================================================

-- 4.1 清理过期的授权令牌
DELIMITER //
CREATE PROCEDURE CleanExpiredTokens()
BEGIN
    DECLARE deleted_count INT DEFAULT 0;
    
    DELETE FROM authorization_info 
    WHERE expiryTime < NOW();
    
    SET deleted_count = ROW_COUNT();
    SELECT deleted_count as deleted_count, NOW() as execution_time;
END //
DELIMITER ;

-- 4.2 自动更新过期的激活码状态
DELIMITER //
CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    DECLARE updated_count INT DEFAULT 0;
    
    UPDATE activation_code 
    SET status = '已过期', lastModifiedTime = NOW()
    WHERE status = '未使用' 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    SET updated_count = ROW_COUNT();
    SELECT updated_count as updated_count, NOW() as execution_time;
END //
DELIMITER ;

-- 4.3 生成激活码统计报告
DELIMITER //
CREATE PROCEDURE GenerateActivationReport(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        '激活码统计报告' as report_title,
        start_date as report_start_date,
        end_date as report_end_date,
        NOW() as report_generated_time;
    
    SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM activation_code WHERE DATE(createdTime) BETWEEN start_date AND end_date), 2) as percentage
    FROM activation_code 
    WHERE DATE(createdTime) BETWEEN start_date AND end_date
    GROUP BY status
    ORDER BY count DESC;
    
    SELECT 
        DATE(createdTime) as date,
        COUNT(*) as daily_generated,
        COUNT(CASE WHEN status = '已激活' THEN 1 END) as daily_activated
    FROM activation_code 
    WHERE DATE(createdTime) BETWEEN start_date AND end_date
    GROUP BY DATE(createdTime)
    ORDER BY date;
END //
DELIMITER ;

-- ====================================================================
-- 5. 创建触发器
-- ====================================================================

-- 5.1 激活码激活时自动记录激活记录
DELIMITER //
CREATE TRIGGER tr_activation_code_activated
AFTER UPDATE ON activation_code
FOR EACH ROW
BEGIN
    IF NEW.status = '已激活' AND OLD.status != '已激活' THEN
        INSERT INTO activation_record (
            activationCode, 
            userId, 
            deviceFingerprint, 
            ip, 
            activationTime, 
            result
        ) VALUES (
            NEW.activationCode,
            NEW.userId,
            COALESCE(NEW.deviceFingerprint, '未知设备'),
            COALESCE(NEW.ip, '未知IP'),
            NOW(),
            '成功'
        );
    END IF;
END //
DELIMITER ;

-- ====================================================================
-- 6. 创建事件调度器（需要开启事件调度器）
-- ====================================================================

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 6.1 每小时清理一次过期令牌
CREATE EVENT IF NOT EXISTS evt_clean_expired_tokens
ON SCHEDULE EVERY 1 HOUR
STARTS CURRENT_TIMESTAMP
DO
  CALL CleanExpiredTokens();

-- 6.2 每天更新一次过期激活码状态
CREATE EVENT IF NOT EXISTS evt_update_expired_codes
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  CALL UpdateExpiredCodes();

-- ====================================================================
-- 7. 性能优化索引
-- ====================================================================

-- 7.1 激活码表复合索引
ALTER TABLE activation_code ADD INDEX idx_composite_status_user_time (status, userId, createdTime);

-- 7.2 支付记录表复合索引
ALTER TABLE payment_record ADD INDEX idx_composite_status_user_time (paymentStatus, userId, createdTime);

-- 7.3 激活记录表复合索引
ALTER TABLE activation_record ADD INDEX idx_composite_result_time_user (result, activationTime, userId);

-- 7.4 操作日志表复合索引
ALTER TABLE operation_log ADD INDEX idx_composite_type_time_operator (operationType, createdTime, operatorId);

-- ====================================================================
-- 8. 插入默认数据
-- ====================================================================

-- 8.1 插入默认管理员用户
-- 注意：密码hash是 'admin123' 的bcrypt加密结果
INSERT INTO user (username, email, passwordHash, createdTime) VALUES 
('admin', 'admin@example.com', '$2a$10$rQ8F5Z9L.jK6mZ5Y8N7X7e5V8R3Z4L6N9M2P1Q7S5T6U3V2W1X0Y9Z', NOW())
ON DUPLICATE KEY UPDATE username = username;

-- ====================================================================
-- 9. 权限设置建议
-- ====================================================================

-- 建议为应用创建专用数据库用户
-- CREATE USER 'activation_app'@'localhost' IDENTIFIED BY 'strong_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON activation_code_system.* TO 'activation_app'@'localhost';
-- GRANT EXECUTE ON activation_code_system.* TO 'activation_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ====================================================================
-- 建库建表语句执行完成
-- ====================================================================

-- 显示创建结果
SHOW TABLES;

-- 显示表结构信息
SELECT 
    TABLE_NAME as '表名',
    TABLE_COMMENT as '表注释',
    TABLE_ROWS as '预估行数',
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as '大小(MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'activation_code_system'
ORDER BY TABLE_NAME;

-- 显示完成信息
SELECT 
    '激活码管理系统数据库创建完成' as message,
    NOW() as created_time,
    'MySQL 8.0+' as database_version,
    'utf8mb4' as charset,
    '9张业务表 + 3个视图 + 3个存储过程 + 1个触发器 + 2个事件' as summary;
