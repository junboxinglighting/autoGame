# 激活码管理系统

一个基于 Nuxt 3 的游戏脚本激活码管理平台，提供激活码生成、验证、状态管理、支付集成、黑名单管理等功能。

## 功能特性

### 核心功能
- ✅ **激活码生成**: 安全的批量激活码生成（支持1-10000个）
- ✅ **激活码验证**: 实时验证激活码状态和设备绑定
- ✅ **状态管理**: 完整的激活码生命周期管理
- ✅ **支付集成**: 支持支付宝、微信支付
- ✅ **黑名单管理**: 激活码、设备、IP黑名单功能
- ✅ **统计报表**: 使用率、收入统计分析
- ✅ **操作日志**: 完整的操作审计日志

### 安全特性
- 🔐 JWT认证授权
- 🛡️ 激活码加密存储
- 🚫 黑名单实时拦截
- 📝 操作日志记录
- 🔄 防重放攻击

### 技术栈
- **前端**: Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS
- **后端**: Nitro + Node.js API
- **数据库**: MySQL 8.0+
- **状态管理**: Pinia
- **UI组件**: 原生 Tailwind CSS

## 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd activation-code-system
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=activation_code_system

# JWT密钥
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 支付宝配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key

# 微信支付配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

4. **初始化数据库**
```bash
# 执行数据库初始化脚本
mysql -u root -p < database/init.sql
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 默认管理员账户
- 用户名: `admin`
- 密码: `admin123`（请在生产环境中修改）

## API接口文档

### 激活码管理

#### 生成激活码
```http
POST /api/admin/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "count": 100,
  "price": 1.00,
  "expirationDays": 365,
  "userId": 1
}
```

#### 验证激活码
```http
POST /api/codes/validate
Content-Type: application/json

{
  "code": "ACTIVATION_CODE",
  "userId": 1,
  "deviceFingerprint": "device_fingerprint",
  "ip": "127.0.0.1"
}
```

#### 查询激活码列表
```http
GET /api/codes/list?page=1&pageSize=20&status=未使用
Authorization: Bearer <token>
```

### 支付管理

#### 创建支付订单
```http
POST /api/payment/process
Content-Type: application/json

{
  "userId": 1,
  "amount": 10.00,
  "paymentMethod": "支付宝",
  "deviceFingerprint": "device_fingerprint",
  "count": 10,
  "expirationDays": 365
}
```

#### 支付回调
```http
PUT /api/payment/process
Content-Type: application/json

{
  "paymentId": 123,
  "transactionId": "alipay_transaction_id",
  "status": "success",
  "amount": 10.00,
  "signature": "payment_signature"
}
```

### 黑名单管理

#### 添加黑名单
```http
POST /api/blacklist/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "code|device|ip",
  "value": "blacklist_value",
  "reason": "封禁原因"
}
```

#### 检查黑名单
```http
GET /api/blacklist/check?code=CODE&device=DEVICE&ip=IP
```

### 管理员功能

#### 统计数据
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

#### 吊销激活码
```http
POST /api/admin/revoke
Authorization: Bearer <token>
Content-Type: application/json

{
  "codes": ["CODE1", "CODE2"],
  "reason": "吊销原因"
}
```

## 数据库设计

### 主要数据表
- `user`: 用户表
- `activation_code`: 激活码表
- `payment_record`: 支付记录表
- `activation_record`: 激活记录表
- `authorization_info`: 授权信息表
- `operation_log`: 操作日志表
- `blacklist_*`: 黑名单表（code/device/ip）

### 索引优化
系统针对高频查询字段建立了复合索引，包括：
- 激活码状态和创建时间
- 用户ID和支付状态
- 设备指纹和IP地址

## 部署指南

### 生产环境部署

1. **构建项目**
```bash
npm run build
```

2. **配置生产环境变量**
- 修改数据库连接信息
- 更换JWT密钥
- 配置支付接口参数

3. **启动生产服务器**
```bash
npm run preview
```

### Docker部署

创建 `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

创建 `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_PASSWORD=your_password
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=activation_code_system
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql_data:
```

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 性能优化

### 数据库优化
- 定期清理过期的授权令牌
- 使用复合索引优化查询性能
- 启用MySQL查询缓存

### 应用优化
- 使用Redis缓存热点数据
- 异步处理操作日志写入
- 支付回调失败重试机制

### 监控建议
- 设置数据库连接池监控
- 监控API响应时间
- 设置支付异常告警

## 安全建议

### 生产环境安全
1. **修改默认密码**: 更改默认管理员密码
2. **JWT密钥**: 使用强随机密钥
3. **HTTPS**: 启用SSL证书
4. **防火墙**: 限制数据库访问端口
5. **定期备份**: 设置自动数据库备份

### API安全
- 实施请求频率限制
- 验证支付回调签名
- 记录异常操作日志
- 定期轮换JWT密钥

## 故障排除

### 常见问题

**数据库连接失败**
- 检查数据库服务是否运行
- 验证连接参数是否正确
- 确认防火墙设置

**JWT验证失败**
- 检查JWT密钥配置
- 验证token是否过期
- 确认Authorization头格式

**支付回调异常**
- 验证回调URL配置
- 检查签名验证逻辑
- 查看支付平台日志

### 日志查看
```bash
# 查看应用日志
npm run dev

# 查看数据库日志
tail -f /var/log/mysql/error.log

# 查看Nginx日志
tail -f /var/log/nginx/error.log
```

## 开发指南

### 项目结构
```
activation-code-system/
├── components/          # Vue组件
├── pages/              # 页面路由
├── server/             # 服务端API
│   ├── api/           # API路由
│   ├── middleware/    # 服务端中间件
│   └── utils/         # 工具函数
├── stores/             # Pinia状态管理
├── types/              # TypeScript类型定义
├── middleware/         # 客户端中间件
├── database/           # 数据库脚本
└── assets/             # 静态资源
```

### 开发规范
- 使用TypeScript进行类型检查
- 遵循Vue 3 Composition API
- API接口返回统一格式
- 错误处理和日志记录

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: developer@example.com
- 项目地址: https://github.com/your-username/activation-code-system
