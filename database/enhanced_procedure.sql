DELIMITER $$

CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    DECLARE updated_count INT DEFAULT 0;
    DECLARE total_expired INT DEFAULT 0;
    DECLARE execution_start_time DATETIME DEFAULT NOW();
    DECLARE execution_end_time DATETIME;
    
    -- 开始事务
    START TRANSACTION;
    
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
    
    -- 记录执行结果到操作日志
    INSERT INTO operation_log (
        operationType, 
        operatorId, 
        description, 
        createdTime
    ) VALUES (
        'System Maintenance', 
        0, 
        CONCAT('更新过期激活码: 总计=', total_expired, ', 更新=', updated_count, ', 时间=', TIMESTAMPDIFF(MICROSECOND, execution_start_time, execution_end_time)/1000, 'ms'), 
        execution_end_time
    );
    
    -- 提交事务
    COMMIT;
    
    -- 返回执行结果
    SELECT 
        'SUCCESS' as status,
        total_expired as total_expired_codes,
        updated_count as successfully_updated,
        execution_start_time as start_time,
        execution_end_time as end_time,
        TIMESTAMPDIFF(MICROSECOND, execution_start_time, execution_end_time)/1000 as execution_time_ms,
        CONCAT('已将 ', updated_count, ' 个过期激活码的状态更新为"已过期"') as message;
    
END$$

DELIMITER ;
