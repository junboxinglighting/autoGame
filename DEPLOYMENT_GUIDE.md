# 激活码管理系统 - 自动化部署文档 v2.0

## 🚀 部署方案总览

本系统提供三种自动化部署方案：

| 方案 | 适用场景 | 优势 | 文件 |
|------|----------|------|------|
| **Linux自动部署** | Ubuntu/CentOS服务器 | 完整的系统集成、自动配置 | `auto-deploy.sh` |
| **Windows自动部署** | Windows服务器/桌面 | 简单易用、图形界面友好 | `auto-deploy.bat` |
| **Docker部署** | 容器化环境 | 跨平台、易于维护 | `docker/` 目录 |

## 📋 系统要求

### 通用要求
- **Node.js**: 18.x 或更高版本
- **内存**: 最少 2GB RAM
- **存储**: 最少 10GB 可用空间
- **网络**: 需要访问互联网（用于下载依赖）

### Linux服务器
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **权限**: root 权限
- **数据库**: MySQL 8.0+ (脚本自动安装)
- **Web服务器**: Nginx (脚本自动安装)

### Windows服务器
- **操作系统**: Windows 10+ / Windows Server 2019+
- **权限**: 管理员权限
- **数据库**: 可选（支持外部MySQL连接）

## 🔧 快速部署指南

### Linux服务器部署

1. **下载部署脚本**
   ```bash
   wget https://github.com/your-repo/activation-code-system/raw/main/auto-deploy.sh
   chmod +x auto-deploy.sh
   ```

2. **执行部署**
   ```bash
   sudo ./auto-deploy.sh
   ```

3. **跟随提示完成配置**
   - 确认部署参数
   - 输入域名（可选）
   - 等待自动安装和配置

4. **访问系统**
   - 打开浏览器访问服务器IP地址
   - 开始使用激活码管理功能

### Windows服务器部署

1. **准备环境**
   - 安装 Node.js 18.x+
   - 以管理员身份运行PowerShell

2. **执行部署脚本**
   ```batch
   auto-deploy.bat
   ```

3. **完成配置**
   - 脚本自动安装PM2和依赖
   - 配置Windows服务
   - 创建防火墙规则

4. **访问系统**
   - 脚本会自动打开浏览器
   - 或手动访问 http://localhost:3000

### Docker部署

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd activation-code-system
   ```

2. **一键部署**
   ```bash
   chmod +x docker/docker-deploy.sh
   sudo ./docker/docker-deploy.sh
   ```

3. **验证部署**
   ```bash
   docker-compose ps
   curl http://localhost/health
   ```

## 🎯 系统特性

### 核心功能
- ✅ **无认证模式** - 专为私有环境设计
- ✅ **激活码生成** - 批量生成和管理
- ✅ **多种验证方式** - REST API + URL验证
- ✅ **统计分析** - 实时数据统计
- ✅ **黑名单管理** - 安全防护
- ✅ **响应式设计** - 支持移动端访问

### 部署特性
- 🚀 **一键部署** - 全自动化安装配置
- 🔧 **零配置启动** - 开箱即用
- 📊 **实时监控** - PM2进程管理
- 🛡️ **安全加固** - 防火墙和权限配置
- 📱 **跨平台支持** - Linux/Windows/Docker

## 📊 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx/IIS     │    │   Node.js App   │    │   MySQL 8.0     │
│   反向代理        │────│   Nuxt 3       │────│   数据存储       │
│   负载均衡        │    │   PM2管理       │    │   事务支持       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │   File System   │             │
         └──────────────│   日志/备份      │─────────────┘
                        │   静态资源       │
                        └─────────────────┘
```

## 🗂️ 目录结构

```
activation-code-system/
├── auto-deploy.sh              # Linux自动部署脚本
├── auto-deploy.bat             # Windows自动部署脚本
├── docker/                     # Docker部署文件
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
├── database/                   # 数据库脚本
│   ├── create_database.sql
│   └── fix_noauth_constraints.sql
├── pages/                      # 前端页面
├── components/                 # Vue组件
├── server/                     # 后端API
├── stores/                     # 状态管理
└── types/                      # TypeScript类型
```

## 🔗 API接口文档

### 核心接口
| 接口 | 方法 | 说明 | 状态 |
|------|------|------|------|
| `/api/codes/generate` | POST | 生成激活码 | ✅ |
| `/api/codes/validate-simple` | POST | 简单验证 | ✅ |
| `/api/codes/validate-url` | GET | URL验证 | ✅ |
| `/api/codes/list` | GET | 激活码列表 | ✅ |
| `/api/admin/stats` | GET | 统计数据 | ✅ |
| `/api/admin/revoke` | POST | 吊销激活码 | ✅ |
| `/api/blacklist/check` | POST | 黑名单检查 | ✅ |

### 使用示例

**生成激活码**:
```bash
curl -X POST http://your-server/api/codes/generate \
  -H "Content-Type: application/json" \
  -d '{"count":5,"prefix":"GAME","price":99.99}'
```

**验证激活码**:
```bash
curl -X POST http://your-server/api/codes/validate-simple \
  -H "Content-Type: application/json" \
  -d '{"code":"YOUR_CODE","deviceFingerprint":"device123","ip":"1.2.3.4"}'
```

## 🛠️ 管理和维护

### 服务管理命令

**Linux (systemd)**:
```bash
systemctl status activation-code-system    # 查看状态
systemctl start activation-code-system     # 启动服务
systemctl stop activation-code-system      # 停止服务  
systemctl restart activation-code-system   # 重启服务
journalctl -u activation-code-system -f    # 查看日志
```

**PM2管理**:
```bash
pm2 list                    # 查看进程列表
pm2 logs activation-code-system  # 查看日志
pm2 restart activation-code-system  # 重启应用
pm2 monit                   # 监控面板
```

**Windows服务**:
```batch
net start ActivationCodeSystem     # 启动服务
net stop ActivationCodeSystem      # 停止服务
sc query ActivationCodeSystem      # 查看状态
```

### 日志位置
- **Linux**: `/var/log/activation-code-system/`
- **Windows**: `C:\logs\ActivationCodeSystem\`
- **Docker**: `docker-compose logs -f app`

### 备份策略

**数据库备份**:
```bash
# Linux
mysqldump -u activation_app -p activation_code_system > backup_$(date +%Y%m%d).sql

# Docker
docker-compose exec mysql mysqldump -u root -p activation_code_system > backup.sql
```

**文件备份**:
```bash
# 备份应用文件
tar -czf activation-code-system-$(date +%Y%m%d).tar.gz /opt/activation-code-system/current
```

## 🔒 安全配置

### 防火墙设置
```bash
# Ubuntu UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# CentOS FirewallD  
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### SSL配置（生产环境推荐）
```bash
# 使用Let's Encrypt
certbot --nginx -d your-domain.com
```

### 数据库安全
- 使用强密码
- 限制网络访问
- 定期备份数据
- 启用慢查询日志

## 📈 性能优化

### PM2集群模式
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'activation-code-system',
    instances: 'max',  // 使用所有CPU核心
    exec_mode: 'cluster'
  }]
}
```

### Nginx缓存配置
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 数据库优化
- 添加适当的索引
- 定期清理过期数据
- 启用查询缓存

## 🚨 故障排除

### 常见问题

**1. 端口冲突**
```bash
# 查看端口占用
netstat -tulpn | grep 3000
# 修改配置文件中的PORT变量
```

**2. 数据库连接失败**
```bash
# 检查MySQL状态
systemctl status mysql
# 重置数据库密码
mysql_secure_installation
```

**3. PM2进程异常**
```bash
# 查看PM2日志
pm2 logs --lines 100
# 重启所有进程
pm2 restart all
```

**4. 权限问题**
```bash
# 修复文件权限
chown -R app:app /opt/activation-code-system
chmod -R 755 /opt/activation-code-system
```

## 📞 技术支持

### 获取帮助
1. **查看日志**: 首先检查应用和系统日志
2. **健康检查**: 访问 `/health` 端点检查服务状态
3. **系统资源**: 使用 `htop`、`df -h` 检查系统资源
4. **网络连接**: 使用 `curl` 测试API接口

### 监控指标
- CPU使用率 < 80%
- 内存使用率 < 85%
- 磁盘使用率 < 90%
- 响应时间 < 500ms
- 错误率 < 1%

---

🎉 **通过自动化部署脚本，您可以在几分钟内完成完整的系统部署！**
