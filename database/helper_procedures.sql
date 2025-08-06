SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

USE activation_code_system;

-- 创建测试存储过程
DROP PROCEDURE IF EXISTS TestUpdateExpiredCodes;

DELIMITER $$

CREATE PROCEDURE TestUpdateExpiredCodes()
BEGIN
    SELECT '==== 激活码过期状态更新测试 ====' as test_info;
    
    -- 显示更新前状态统计
    SELECT '更新前状态统计' as info;
    SELECT status, COUNT(*) as count FROM activation_code GROUP BY status ORDER BY status;
    
    -- 执行更新
    SELECT '执行更新过程...' as info;
    CALL UpdateExpiredCodes();
    
    -- 显示更新后状态统计
    SELECT '更新后状态统计' as info;
    SELECT status, COUNT(*) as count FROM activation_code GROUP BY status ORDER BY status;
    
END$$

DELIMITER ;

-- 创建历史查看存储过程
DROP PROCEDURE IF EXISTS ViewExpiredCodesUpdateHistory;

DELIMITER $$

CREATE PROCEDURE ViewExpiredCodesUpdateHistory(IN days_back INT)
BEGIN
    SELECT CONCAT('过期激活码更新历史记录 (最近', days_back, '天)') as report_title;
    
    SELECT 
        createdTime as execution_time,
        detail as execution_result,
        ip as source_ip
    FROM operation_log 
    WHERE operationType = '修改' 
    AND target = 'activation_code'
    AND detail LIKE '%expired codes%'
    AND createdTime >= DATE_SUB(NOW(), INTERVAL days_back DAY)
    ORDER BY createdTime DESC;
END$$

DELIMITER ;

-- 创建清理测试数据的存储过程
DROP PROCEDURE IF EXISTS CleanTestExpiredCodes;

DELIMITER $$

CREATE PROCEDURE CleanTestExpiredCodes()
BEGIN
    DECLARE deleted_count INT DEFAULT 0;
    
    DELETE FROM activation_code 
    WHERE activationCode LIKE 'EXPIRED%' 
    OR activationCode LIKE 'TEST%';
    
    SET deleted_count = ROW_COUNT();
    
    INSERT INTO operation_log (operatorId, operationType, target, detail, ip, createdTime) 
    VALUES (0, '修改', 'activation_code', CONCAT('Cleaned ', deleted_count, ' test expired codes'), '127.0.0.1', NOW());
    
    SELECT deleted_count as deleted_test_codes, 'Test data cleaned' as message;
END$$

DELIMITER ;
