SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

USE activation_code_system;

DROP PROCEDURE IF EXISTS UpdateExpiredCodes;

DELIMITER $$

CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    DECLARE updated_count INT DEFAULT 0;
    
    -- 设置字符集
    SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
    
    -- 更新过期的激活码状态
    UPDATE activation_code 
    SET status = '已过期', 
        lastModifiedTime = NOW()
    WHERE (status = '未使用' OR status = '已激活')
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    SET updated_count = ROW_COUNT();
    
    -- 记录到日志
    INSERT INTO operation_log (operatorId, operationType, target, detail, ip, createdTime) 
    VALUES (0, '修改', 'activation_code', CONCAT('Updated ', updated_count, ' expired codes'), '127.0.0.1', NOW());
    
    -- 返回结果
    SELECT updated_count as updated_count, NOW() as execution_time;
    
END$$

DELIMITER ;
