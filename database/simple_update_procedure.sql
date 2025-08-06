USE activation_code_system;

DROP PROCEDURE IF EXISTS UpdateExpiredCodesEnhanced;

DELIMITER $$
CREATE PROCEDURE UpdateExpiredCodesEnhanced()
BEGIN
    DECLARE updated_count INT DEFAULT 0;
    DECLARE total_expired INT DEFAULT 0;
    DECLARE execution_start_time DATETIME DEFAULT NOW();
    DECLARE execution_end_time DATETIME;
    
    START TRANSACTION;
    
    SELECT COUNT(*) INTO total_expired
    FROM activation_code 
    WHERE status IN ('未使用', '已激活') 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    UPDATE activation_code 
    SET status = '已过期', 
        lastModifiedTime = NOW()
    WHERE status IN ('未使用', '已激活') 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    SET updated_count = ROW_COUNT();
    SET execution_end_time = NOW();
    
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
    
    SELECT 
        'SUCCESS' as status,
        total_expired as total_expired_codes,
        updated_count as successfully_updated,
        execution_start_time as start_time,
        execution_end_time as end_time;
    
END$$
DELIMITER ;
