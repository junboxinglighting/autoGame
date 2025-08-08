# 激活码管理系统 - Docker部署方案 v2.0 (增强版)

## 📋 部署方案总览

本目录提供完整的容器化部署解决方案，支持生产环境和开发环境：

### 🗂️ 文件结构
- `docker-compose.yml` - 生产环境Docker Compose配置
- `docker-compose.dev.yml` - 开发环境配置覆盖
- `Dockerfile` - Node.js应用容器构建文件
- `Dockerfile.nginx` - Nginx反向代理容器
- `nginx.conf` - Nginx生产环境配置
- `docker-deploy.sh` - 一键自动化部署脚本
- `scripts/` - 维护和管理脚本目录
- `mysql/` - 数据库初始化脚本和配置

### 🚀 部署特性
- ✅ **多环境支持** - 开发/测试/生产环境
- ✅ **自动扩展** - 支持水平扩展和负载均衡  
- ✅ **健康检查** - 完整的服务健康监控
- ✅ **SSL支持** - Let's Encrypt自动证书
- ✅ **数据持久化** - 数据卷和备份策略
- ✅ **日志聚合** - 统一日志管理
- ✅ **性能优化** - Redis缓存和数据库调优
- `docker-deploy.bat` - 一键部署脚本（Windows）

## 🚀 快速部署

### Linux/macOS
```bash
chmod +x docker-deploy.sh
sudo ./docker-deploy.sh
```

### Windows
```batch
docker-deploy.bat
```

## 🐳 手动Docker部署

### 1. 环境要求
- Docker 20.10+
- Docker Compose 2.0+
- 至少2GB可用内存

### 2. 克隆项目
```bash
git clone <your-repo-url>
cd activation-code-system
```

### 3. 配置环境变量
```bash
cp .env.example .env.docker
# 编辑 .env.docker 文件设置数据库密码等
```

### 4. 构建并启动
```bash
docker-compose up -d --build
```

### 5. 初始化数据库
```bash
docker-compose exec app npm run db:init
```

## 📊 容器服务

| 服务名 | 端口 | 说明 |
|--------|------|------|
| nginx | 80, 443 | 反向代理和负载均衡 |
| app | 3000 | Node.js应用程序 |
| mysql | 3306 | MySQL数据库 |
| redis | 6379 | Redis缓存（可选）|

## 🔧 管理命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启服务
docker-compose restart app

# 进入容器
docker-compose exec app bash

# 停止所有服务
docker-compose down

# 更新应用
docker-compose pull && docker-compose up -d --force-recreate app
```

## 📈 监控和维护

### 健康检查
```bash
curl http://localhost/health
```

### 备份数据库
```bash
docker-compose exec mysql mysqldump -u root -p activation_code_system > backup_$(date +%Y%m%d).sql
```

### 查看资源使用
```bash
docker stats
```

## 🛡️ 安全配置

1. **更改默认密码**：修改 `.env.docker` 中的数据库密码
2. **启用HTTPS**：配置SSL证书到 `./ssl/` 目录
3. **限制访问**：配置防火墙规则
4. **定期备份**：设置定时备份任务

## 🔄 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并部署
docker-compose up -d --build --force-recreate app

# 清理旧镜像
docker image prune -f
```

## 📱 移动端适配

系统已针对移动设备进行响应式设计优化：
- 支持触摸操作
- 自适应屏幕尺寸  
- 优化的移动端UI

## 🌐 多环境部署

- **开发环境**: `docker-compose -f docker-compose.dev.yml up`
- **测试环境**: `docker-compose -f docker-compose.test.yml up` 
- **生产环境**: `docker-compose -f docker-compose.prod.yml up`

## 📞 技术支持

如有问题请查看：
1. Docker日志: `docker-compose logs`
2. 应用日志: `/var/log/activation-code-system/`
3. Nginx日志: `/var/log/nginx/`

---

🎉 **Docker化部署让系统更加可靠、可移植和易于维护！**
