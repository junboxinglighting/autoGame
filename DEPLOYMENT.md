# 激活码管理系统部署指南

## 数据库配置

### 1. 创建数据库和用户
```sql
-- 连接到MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE activation_code_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建专用用户（可选，建议生产环境使用）
CREATE USER 'activation_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON activation_code_system.* TO 'activation_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. 初始化数据库结构
```bash
# 在项目根目录执行
mysql -u root -p activation_code_system < database/init.sql
```

### 3. 插入默认管理员用户
```bash
mysql -u root -p activation_code_system < database/insert_admin.sql
```

### 4. 验证数据库
```sql
-- 检查表是否创建成功
USE activation_code_system;
SHOW TABLES;

-- 检查管理员用户是否插入成功
SELECT userId, username, email FROM user;
```

## 环境配置

### 1. 复制环境变量文件
```bash
cp .env.example .env
```

### 2. 编辑 .env 文件
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root  # 或 activation_user
DB_PASSWORD=your_password
DB_NAME=activation_code_system

# JWT密钥 - 生产环境请使用强随机密钥
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 支付宝配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key

# 微信支付配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

## 启动应用

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
# 构建
npm run build

# 启动
npm run preview
```

## 默认管理员账户

- **用户名**: admin
- **密码**: admin123
- **邮箱**: admin@example.com

⚠️ **重要**: 首次登录后请务必修改默认密码！

## 访问地址

- 主页: http://localhost:3000
- 管理后台: http://localhost:3000/admin
- API文档: 详见 README.md

## 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否启动
- 验证数据库配置信息
- 确认用户权限

### 2. 登录失败
- 确认管理员用户已正确插入
- 检查JWT密钥配置
- 查看浏览器控制台错误

### 3. 端口占用
```bash
# 修改端口
PORT=3001 npm run dev
```

## 生产环境注意事项

1. **安全性**
   - 修改默认管理员密码
   - 使用强JWT密钥
   - 启用HTTPS
   - 配置防火墙

2. **性能优化**
   - 启用数据库连接池
   - 配置Redis缓存
   - 使用CDN

3. **监控**
   - 设置日志轮转
   - 配置监控告警
   - 定期数据库备份
