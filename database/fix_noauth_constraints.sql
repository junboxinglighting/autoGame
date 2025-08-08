-- ====================================================================
-- 修复验证接口的数据库约束问题
-- 创建时间: 2025年8月8日
-- 用途: 为无认证模式修复外键约束问题
-- ====================================================================

USE activation_code_system;

-- 方案1: 添加一个默认用户供验证接口使用
INSERT INTO user (userId, username, email, passwordHash, createdTime) 
VALUES (0, 'system_default', 'system@localhost', '$2a$10$defaultpasswordhashfornoauth', NOW())
ON DUPLICATE KEY UPDATE 
    username = 'system_default',
    email = 'system@localhost';

-- 方案2: 如果需要完全移除外键约束（可选）
-- ALTER TABLE activation_code DROP FOREIGN KEY fk_activation_code_user;
-- ALTER TABLE activation_record DROP FOREIGN KEY fk_activation_record_user;
-- ALTER TABLE payment_record DROP FOREIGN KEY fk_payment_record_user;
-- ALTER TABLE operation_log DROP FOREIGN KEY fk_operation_log_user;

-- 验证修复结果
SELECT 'Default user created for no-auth mode' as message;
SELECT userId, username, email FROM user WHERE userId = 0;
