-- Enhanced Update Expired Codes Procedure
-- Author: GitHub Copilot
-- Date: 2025-08-02

USE activation_code_system;

-- Drop existing procedures
DROP PROCEDURE IF EXISTS UpdateExpiredCodesEnhanced;
DROP PROCEDURE IF EXISTS TestUpdateExpiredCodes;
DROP PROCEDURE IF EXISTS ViewExpiredCodesUpdateHistory;

-- Create enhanced procedure
DELIMITER //
CREATE PROCEDURE UpdateExpiredCodesEnhanced()
BEGIN
    DECLARE updated_count INT DEFAULT 0;
    DECLARE total_expired INT DEFAULT 0;
    DECLARE execution_start_time DATETIME DEFAULT NOW();
    DECLARE execution_end_time DATETIME;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Count total expired codes
    SELECT COUNT(*) INTO total_expired
    FROM activation_code 
    WHERE status IN ('未使用', '已激活') 
    AND expirationDate IS NOT NULL 
    AND expirationDate < NOW();
    
    -- Update expired codes status
    UPDATE activation_code 
    SET status = '已过期', 
        lastModifiedTime = NOW()
    WHERE status IN ('未使用', '已激活') 
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
        CONCAT('Updated expired codes: Total=', total_expired, ', Updated=', updated_count, ', Time=', TIMESTAMPDIFF(MICROSECOND, execution_start_time, execution_end_time)/1000, 'ms'), 
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
    
END //
DELIMITER ;

-- Update existing procedure for compatibility
DELIMITER //
CREATE PROCEDURE UpdateExpiredCodes()
BEGIN
    CALL UpdateExpiredCodesEnhanced();
END //
DELIMITER ;

-- Create test procedure
DELIMITER //
CREATE PROCEDURE TestUpdateExpiredCodes()
BEGIN
    SELECT 'Before Update - Status Count' as info;
    SELECT status, COUNT(*) as count FROM activation_code GROUP BY status;
    
    CALL UpdateExpiredCodesEnhanced();
    
    SELECT 'After Update - Status Count' as info;
    SELECT status, COUNT(*) as count FROM activation_code GROUP BY status;
END //
DELIMITER ;

-- Create history view procedure
DELIMITER //
CREATE PROCEDURE ViewExpiredCodesUpdateHistory(IN days_back INT)
BEGIN
    SELECT 
        createdTime as execution_time,
        description as execution_result
    FROM operation_log 
    WHERE operationType = 'System Maintenance' 
    AND description LIKE '%expired codes%'
    AND createdTime >= DATE_SUB(NOW(), INTERVAL days_back DAY)
    ORDER BY createdTime DESC;
END //
DELIMITER ;

-- Update event scheduler - set to run daily at 2 AM
DROP EVENT IF EXISTS evt_update_expired_codes;
DROP EVENT IF EXISTS evt_update_expired_codes_daily;

CREATE EVENT evt_update_expired_codes_daily
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 02:00:00')
ON COMPLETION PRESERVE
ENABLE
COMMENT 'Daily update of expired activation codes at 2 AM'
DO
  CALL UpdateExpiredCodesEnhanced();

-- Show event scheduler status
SELECT @@event_scheduler as event_scheduler_status;

-- Show created events
SELECT 
    EVENT_NAME,
    INTERVAL_VALUE,
    INTERVAL_FIELD,
    STATUS,
    STARTS,
    EVENT_COMMENT
FROM information_schema.EVENTS 
WHERE EVENT_SCHEMA = 'activation_code_system' 
AND EVENT_NAME LIKE '%expired_codes%';

SELECT 'Enhanced expired codes update procedures created successfully!' as result;
