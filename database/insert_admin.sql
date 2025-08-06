-- 插入默认管理员用户
-- 用户名: admin
-- 密码: admin123 (已用bcrypt加密，轮数为10)
INSERT IGNORE INTO user (userId, username, email, passwordHash, createdTime) VALUES 
(1, 'admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.7WD/Ic2rE5X5gUP9pKT7QDxQhpz3Ba', NOW());

-- 注意：这个hash对应的明文密码是 "admin123"
-- 在生产环境中请务必修改此密码
