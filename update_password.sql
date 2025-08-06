-- 更新管理员密码哈希
UPDATE user SET passwordHash = '$2a$10$QxgqTUY9i7.nSZw18XxVHue6SI2fa.3QtwL8sF1btqo.oa2dzzQRG' WHERE username = 'admin';
