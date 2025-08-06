DELIMITER $$

CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    DECLARE updated_count INT DEFAULT 0;
    DECLARE total_expired INT DEFAULT 0;
    DECLARE execution_start_time DATETIME DEFAULT NOW();
    DECLARE execution_end_time DATETIME;
    
    START TRANSACTION;
    
    -- Count total expired codes
    SELECT COUNT(*) INTO total_expired
    FROM activation_code 
    WHERE status = '未使用' 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    -- Also count activated codes that are expired
    SELECT COUNT(*) + total_expired INTO total_expired
    FROM activation_code 
    WHERE status = '已激活' 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    -- Update unused expired codes
    UPDATE activation_code 
    SET status = '已过期', 
        lastModifiedTime = NOW()
    WHERE status = '未使用' 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    -- Update activated expired codes
    UPDATE activation_code 
    SET status = '已过期', 
        lastModifiedTime = NOW()
    WHERE status = '已激活' 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    SET updated_count = ROW_COUNT();
    SET execution_end_time = NOW();
    
    -- Log the operation
    INSERT INTO operation_log (
        operationType, 
        operatorId, 
        description, 
        createdTime
    ) VALUES (
        'System Maintenance', 
        0, 
        CONCAT('Updated expired codes: Total=', total_expired, ', Updated=', updated_count), 
        execution_end_time
    );
    
    COMMIT;
    
    -- Return results
    SELECT 
        'SUCCESS' as status,
        total_expired as total_expired_codes,
        updated_count as successfully_updated,
        execution_start_time as start_time,
        execution_end_time as end_time,
        TIMESTAMPDIFF(MICROSECOND, execution_start_time, execution_end_time)/1000 as execution_time_ms;
    
END$$

DELIMITER ;
