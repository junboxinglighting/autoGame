-- ====================================================================
-- 增强版激活码过期状态更新存储过程
-- 功能：每天凌晨自动更新过期的激活码状态
-- 作者：GitHub Copilot
-- 创建时间：2025-08-02
-- ====================================================================

USE activation_code_system;

-- ====================================================================
-- 1. 删除现有的存储过程（如果存在）
-- ====================================================================
DROP PROCEDURE IF EXISTS UpdateExpiredCodesEnhanced;

-- ====================================================================
-- 2. 创建增强版存储过程
-- ====================================================================
DELIMITER //
CREATE PROCEDURE UpdateExpiredCodesEnhanced()
BEGIN
    -- 声明变量
    DECLARE updated_count INT DEFAULT 0;
    DECLARE total_expired INT DEFAULT 0;
    DECLARE error_count INT DEFAULT 0;
    DECLARE done INT DEFAULT FALSE;
    DECLARE current_code VARCHAR(32);
    DECLARE execution_start_time DATETIME DEFAULT NOW();
    DECLARE execution_end_time DATETIME;
    
    -- 声明游标用于遍历过期的激活码
    DECLARE expired_cursor CURSOR FOR 
        SELECT activationCode 
        FROM activation_code 
        WHERE status IN ('未使用', '已激活') 
        AND expirationDate IS NOT NULL 
        AND expirationDate < NOW();
    
    -- 声明异常处理
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET error_count = error_count + 1;
    
    -- 开始事务
    START TRANSACTION;
    
    -- 记录执行开始
    INSERT INTO operation_log (
        operationType, 
        operatorId, 
        description, 
        createdTime
    ) VALUES (
        '系统维护', 
        0, 
        '开始执行激活码过期状态更新任务', 
        execution_start_time
    );
    
    -- 统计需要更新的总数
    SELECT COUNT(*) INTO total_expired
    FROM activation_code 
    WHERE status IN ('未使用', '已激活') 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    -- 批量更新过期的激活码状态
    UPDATE activation_code 
    SET status = '已过期', 
        lastModifiedTime = NOW()
    WHERE status IN ('未使用', '已激活') 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    -- 获取实际更新的行数
    SET updated_count = ROW_COUNT();
    SET execution_end_time = NOW();
    
    -- 记录执行结果
    INSERT INTO operation_log (
        operationType, 
        operatorId, 
        description, 
        createdTime
    ) VALUES (
        '系统维护', 
        0, 
        CONCAT('激活码过期状态更新完成 - 总计:', total_expired, '条, 成功更新:', updated_count, '条, 错误:', error_count, '条, 耗时:', TIMESTAMPDIFF(MICROSECOND, execution_start_time, execution_end_time)/1000, 'ms'), 
        execution_end_time
    );
    
    -- 如果有错误，回滚事务
    IF error_count > 0 THEN
        ROLLBACK;
        SELECT 'ERROR' as status, total_expired, 0 as updated_count, error_count, execution_start_time, execution_end_time;
    ELSE
        -- 提交事务
        COMMIT;
        -- 返回执行结果
        SELECT 
            'SUCCESS' as status,
            total_expired as total_expired_codes,
            updated_count as successfully_updated,
            error_count as error_count,
            execution_start_time as start_time,
            execution_end_time as end_time,
            TIMESTAMPDIFF(MICROSECOND, execution_start_time, execution_end_time)/1000 as execution_time_ms,
            CONCAT('已将 ', updated_count, ' 个过期激活码的状态更新为"已过期"') as message;
    END IF;
    
END //
DELIMITER ;

-- ====================================================================
-- 3. 创建简化版存储过程（保持向后兼容）
-- ====================================================================
DELIMITER //
CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    CALL UpdateExpiredCodesEnhanced();
END //
DELIMITER ;

-- ====================================================================
-- 4. 更新事件调度器 - 设置为每天凌晨2点执行
-- ====================================================================

-- 删除现有事件
DROP EVENT IF EXISTS evt_update_expired_codes;

-- 创建新的事件调度器 - 每天凌晨2点执行
CREATE EVENT evt_update_expired_codes_daily
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 02:00:00')
ON COMPLETION PRESERVE
ENABLE
COMMENT '每天凌晨2点自动更新过期的激活码状态'
DO
  CALL UpdateExpiredCodesEnhanced();

-- ====================================================================
-- 5. 创建手动执行脚本（用于测试）
-- ====================================================================
DELIMITER //
CREATE PROCEDURE TestUpdateExpiredCodes()
BEGIN
    SELECT '=== 激活码过期状态更新测试 ===' as test_info;
    
    -- 显示当前状态统计
    SELECT 
        '更新前状态统计' as info,
        status,
        COUNT(*) as count
    FROM activation_code 
    GROUP BY status
    ORDER BY status;
    
    -- 执行更新
    CALL UpdateExpiredCodesEnhanced();
    
    -- 显示更新后状态统计
    SELECT 
        '更新后状态统计' as info,
        status,
        COUNT(*) as count
    FROM activation_code 
    GROUP BY status
    ORDER BY status;
    
END //
DELIMITER ;

-- ====================================================================
-- 6. 创建查看执行历史的存储过程
-- ====================================================================
DELIMITER //
CREATE PROCEDURE ViewExpiredCodesUpdateHistory(IN days_back INT)
BEGIN
    SELECT 
        '过期激活码更新历史记录' as report_title,
        days_back as days_back,
        NOW() as query_time;
    
    SELECT 
        createdTime as execution_time,
        description as execution_result
    FROM operation_log 
    WHERE operationType = '系统维护' 
    AND description LIKE '%激活码过期状态更新%'
    AND createdTime >= DATE_SUB(NOW(), INTERVAL days_back DAY)
    ORDER BY createdTime DESC;
END //
DELIMITER ;

-- ====================================================================
-- 7. 权限和安全设置
-- ====================================================================

-- 为应用用户授予执行权限
-- GRANT EXECUTE ON PROCEDURE UpdateExpiredCodesEnhanced TO 'activation_app'@'localhost';
-- GRANT EXECUTE ON PROCEDURE UpdateExpiredCodes TO 'activation_app'@'localhost';
-- GRANT EXECUTE ON PROCEDURE TestUpdateExpiredCodes TO 'activation_app'@'localhost';
-- GRANT EXECUTE ON PROCEDURE ViewExpiredCodesUpdateHistory TO 'activation_app'@'localhost';

-- ====================================================================
-- 8. 验证事件调度器状态
-- ====================================================================

-- 显示事件调度器状态
SELECT 
    'Event Scheduler Status' as info,
    @@event_scheduler as status;

-- 显示相关事件
SELECT 
    EVENT_NAME as event_name,
    EVENT_DEFINITION as definition,
    INTERVAL_VALUE as interval_value,
    INTERVAL_FIELD as interval_field,
    STATUS as status,
    STARTS as starts,
    ENDS as ends,
    LAST_EXECUTED as last_executed,
    EVENT_COMMENT as comment
FROM information_schema.EVENTS 
WHERE EVENT_SCHEMA = 'activation_code_system' 
AND EVENT_NAME LIKE '%expired_codes%';

-- ====================================================================
-- 创建完成信息
-- ====================================================================
SELECT 
    '增强版激活码过期状态更新存储过程创建完成' as message,
    NOW() as created_time,
    '每天凌晨2点自动执行' as schedule,
    'UpdateExpiredCodesEnhanced()' as main_procedure,
    'TestUpdateExpiredCodes()' as test_procedure,
    'ViewExpiredCodesUpdateHistory()' as history_procedure;
