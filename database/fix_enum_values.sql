-- 修复数据库ENUM值的SQL脚本
-- 这个脚本用于更新现有数据库，添加缺少的'登录'操作类型

USE activation_code_system;

-- 修改operation_log表的operationType枚举，添加'登录'选项
ALTER TABLE operation_log 
MODIFY COLUMN operationType ENUM('生成', '激活', '吊销', '导出', '修改', '登录') NOT NULL COMMENT '操作类型';

-- 验证修改结果
DESCRIBE operation_log;

-- 显示修改完成的消息
SELECT '数据库ENUM值修复完成！' as message, NOW() as updated_time;
