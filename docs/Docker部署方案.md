# Docker容器化部署方案

## 概述

提供基于Docker的容器化部署方案，适合快速部署和开发环境。

## Docker文件

### Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY nuxt.config.ts ./
COPY tsconfig.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产镜像
FROM node:18-alpine AS production

# 创建应用用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

WORKDIR /app

# 从构建阶段复制文件
COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxt:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nuxt:nodejs /app/package.json /app/package.json

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# 切换到非root用户
USER nuxt

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 启动应用
CMD ["node", ".output/server/index.mjs"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # 应用服务
  app:
    build: .
    container_name: activation-code-system
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=activation_code_system
      - DB_USER=activation_app
      - DB_PASSWORD=secure_password_here
      - JWT_SECRET=your_jwt_secret_here
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - app-network
    volumes:
      - app-logs:/app/logs

  # MySQL数据库
  mysql:
    image: mysql:8.0
    container_name: activation-mysql
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=root_password_here
      - MYSQL_DATABASE=activation_code_system
      - MYSQL_USER=activation_app
      - MYSQL_PASSWORD=secure_password_here
      - MYSQL_CHARACTER_SET_SERVER=utf8mb4
      - MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/create_database.sql:/docker-entrypoint-initdb.d/01-create_database.sql
      - ./database/simple_expired_update.sql:/docker-entrypoint-initdb.d/02-procedures.sql
      - ./docker/mysql.cnf:/etc/mysql/conf.d/custom.cnf
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    networks:
      - app-network

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    container_name: activation-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/ssl:/etc/ssl/certs
      - nginx-logs:/var/log/nginx
    depends_on:
      - app
    networks:
      - app-network

  # Redis缓存（可选）
  redis:
    image: redis:7-alpine
    container_name: activation-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --requirepass redis_password_here
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
  app-logs:
  nginx-logs:
```

### docker/mysql.cnf

```ini
[mysqld]
# 性能优化
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M
max_connections = 100

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# 事件调度器
event_scheduler = ON

# 日志
slow_query_log = 1
long_query_time = 2
```

### docker/nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # 基础配置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 限流
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        access_log /var/log/nginx/access.log main;
        error_log /var/log/nginx/error.log;

        # API限流
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 主要代理
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 部署命令

### 开发环境部署

```bash
# 克隆项目
git clone https://github.com/your-repo/activation-code-system.git
cd activation-code-system

# 创建环境文件
cp .env.example .env.docker

# 编辑配置
vim .env.docker

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查服务状态
docker-compose ps
```

### 生产环境部署

```bash
# 使用生产配置
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 或者单独构建
docker build -t activation-code-system:latest .
docker run -d --name activation-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  activation-code-system:latest
```

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  app:
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  mysql:
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql_root_password
      - MYSQL_PASSWORD_FILE=/run/secrets/mysql_password
    secrets:
      - mysql_root_password
      - mysql_password
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  nginx:
    restart: always
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro

secrets:
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt
  mysql_password:
    file: ./secrets/mysql_password.txt
```

## 管理命令

### 常用操作

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs app
docker-compose logs mysql

# 重启服务
docker-compose restart app

# 进入容器
docker-compose exec app sh
docker-compose exec mysql mysql -u root -p

# 备份数据库
docker-compose exec mysql mysqldump -u root -p activation_code_system > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -u root -p activation_code_system < backup.sql

# 清理
docker-compose down
docker-compose down -v  # 删除数据卷
```

### 监控和调试

```bash
# 监控资源使用
docker stats

# 查看容器详情
docker inspect activation-code-system

# 实时日志
docker-compose logs -f --tail=100 app

# 健康检查
curl http://localhost/health
curl http://localhost:3000/api/codes/validate-url?code=TEST&userId=1&deviceFingerprint=test&ip=127.0.0.1
```

## 优缺点对比

### Docker部署优势
- ✅ 环境一致性，开发生产环境相同
- ✅ 快速部署，一键启动所有服务
- ✅ 易于扩展和负载均衡
- ✅ 隔离性好，依赖冲突少
- ✅ 便于CI/CD集成

### Docker部署劣势
- ❌ 资源开销较大（内存、存储）
- ❌ 学习成本相对较高
- ❌ 网络配置复杂性增加
- ❌ 调试相对困难

### 选择建议

| 场景 | 推荐方案 |
|------|----------|
| 开发环境 | Docker Compose |
| 测试环境 | Docker Compose |
| 小规模生产 | 传统部署或Docker |
| 大规模生产 | Kubernetes + Docker |
| 快速原型 | Docker Compose |

## 总结

Docker方案提供了标准化的部署流程，特别适合：
1. 多环境一致性要求高的项目
2. 需要快速部署的场景
3. 微服务架构演进
4. 团队协作开发

选择哪种部署方案需要根据实际需求、团队技术栈和运维能力来决定。
