# 激活码管理系统 - 部署指南

## 🎯 部署脚本使用示例

### 基础部署 (推荐新手)
```bash
# 最简单的部署方式，使用默认配置
sudo bash auto-deploy.sh
```

### 生产环境部署
```bash
# 完整的生产环境部署，包含域名、SSL、监控
sudo bash auto-deploy.sh \
  --domain=activation.yourcompany.com \
  --ssl \
  --env=production \
  --port=3000
```

### 开发环境部署
```bash
# 开发环境部署，跳过一些生产特性
sudo bash auto-deploy.sh \
  --env=development \
  --port=3001 \
  --no-ssl \
  --skip-health-check
```

### 自定义端口部署
```bash
# 使用自定义端口，不配置Nginx反向代理
sudo bash auto-deploy.sh \
  --port=8080 \
  --no-nginx \
  --no-monitoring
```

### 容器环境部署
```bash
# 适合Docker容器内部署
sudo bash auto-deploy.sh \
  --env=container \
  --port=3000 \
  --no-nginx \
  --no-backup
```

## 📋 命令行参数说明

| 参数 | 说明 | 默认值 | 示例 |
|-----|------|-------|------|
| `--domain=DOMAIN` | 配置域名 | 无 | `--domain=example.com` |
| `--port=PORT` | 应用端口 | 3000 | `--port=8080` |
| `--ssl` | 启用SSL证书 | 禁用 | `--ssl` |
| `--no-nginx` | 跳过Nginx配置 | 启用 | `--no-nginx` |
| `--no-backup` | 跳过部署前备份 | 启用 | `--no-backup` |
| `--no-monitoring` | 跳过监控配置 | 启用 | `--no-monitoring` |
| `--skip-health-check` | 跳过健康检查 | 启用 | `--skip-health-check` |
| `--env=ENV` | 部署环境 | production | `--env=development` |
| `--help` | 显示帮助 | - | `--help` |
| `--version` | 显示版本 | - | `--version` |

## 🛠️ 部署前准备工作

### 1. 服务器准备
```bash
# 确保系统更新
sudo apt update && sudo apt upgrade -y

# 确保有足够的磁盘空间
df -h

# 检查内存
free -h

# 检查网络连接
ping -c 3 google.com
```

### 2. 代码准备
```bash
# 确保项目代码在脚本同目录
ls -la auto-deploy.sh
ls -la package.json nuxt.config.ts

# 或者准备代码压缩包
tar -czf activation-code-system.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=*.log \
  .
```

### 3. 域名准备 (可选)
```bash
# 配置DNS A记录
# example.com -> your_server_ip

# 验证DNS解析
nslookup your-domain.com
dig your-domain.com
```

## 🔧 部署后管理命令

### 服务管理
```bash
# 查看服务状态
systemctl status activation-code-system

# 启动/停止/重启服务
systemctl start activation-code-system
systemctl stop activation-code-system
systemctl restart activation-code-system

# 查看服务日志
journalctl -u activation-code-system -f
journalctl -u activation-code-system --since="1 hour ago"
```

### 应用管理
```bash
# 查看应用进程
ps aux | grep node

# 检查端口占用
netstat -tlnp | grep :3000
ss -tlnp | grep :3000

# 查看应用日志
tail -f /var/log/activation-code-system/combined.log
```

### 性能监控
```bash
# 查看系统资源
htop
free -h
df -h

# 查看网络连接
ss -tuln

# 测试应用响应
curl http://localhost:3000
curl -I http://localhost:3000/health
```

## 🚨 故障排除

### 常见问题及解决方案

#### 1. 端口被占用
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000

# 杀死占用进程
sudo kill -9 PID_NUMBER

# 重新启动服务
sudo systemctl restart activation-code-system
```

#### 2. 服务启动失败
```bash
# 查看详细错误日志
sudo journalctl -u activation-code-system -n 50

# 检查配置文件
sudo nano /etc/systemd/system/activation-code-system.service

# 重新加载配置
sudo systemctl daemon-reload
sudo systemctl restart activation-code-system
```

#### 3. Nginx配置问题
```bash
# 测试Nginx配置
sudo nginx -t

# 查看Nginx日志
sudo tail -f /var/log/nginx/error.log

# 重新加载Nginx
sudo systemctl reload nginx
```

#### 4. 数据库连接问题
```bash
# 查看MySQL状态
sudo systemctl status mysql

# 测试数据库连接
mysql -u activation_app -p activation_code_system

# 查看数据库日志
sudo tail -f /var/log/mysql/error.log
```

## 🔐 安全建议

### 1. 防火墙配置
```bash
# UFW防火墙 (Ubuntu/Debian)
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 系统加固
```bash
# 禁用root SSH登录 (生产环境)
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 配置自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### 3. 备份策略
```bash
# 查看自动备份
ls -la /opt/backups/activation-code-system/

# 手动创建备份
sudo tar -czf /opt/backups/manual_backup_$(date +%Y%m%d).tar.gz \
  /opt/activation-code-system/current

# 数据库备份
sudo mysqldump -u activation_app -p activation_code_system > \
  /opt/backups/db_backup_$(date +%Y%m%d).sql
```

## 📊 监控和维护

### 1. 系统监控
```bash
# 查看监控脚本状态
ls -la /usr/local/bin/activation-code-system-monitor

# 查看监控日志
tail -f /var/log/activation-code-system/monitor.log

# 手动运行监控检查
sudo /usr/local/bin/activation-code-system-monitor
```

### 2. 日志轮转
```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/activation-code-system

# 内容示例:
/var/log/activation-code-system/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 app app
}
```

### 3. 定期维护
```bash
# 清理旧的发布版本
sudo find /opt/activation-code-system/releases -type d -mtime +30 -exec rm -rf {} \;

# 清理旧的日志文件
sudo find /var/log/activation-code-system -name "*.log" -mtime +30 -delete

# 数据库优化
sudo mysqlcheck -u activation_app -p --optimize activation_code_system
```

## 🎯 性能优化建议

### 1. 系统级优化
```bash
# 优化文件描述符限制
echo "* soft nofile 65535" >> /etc/security/limits.conf
echo "* hard nofile 65535" >> /etc/security/limits.conf

# 优化内核参数
echo "net.core.somaxconn = 1024" >> /etc/sysctl.conf
sysctl -p
```

### 2. Node.js优化
```bash
# 优化PM2配置
sudo -u app pm2 set pm2:max_memory_restart 500M
sudo -u app pm2 set pm2:autorestart true

# 查看应用性能
sudo -u app pm2 monit
```

### 3. Nginx优化
```bash
# 优化Nginx配置
sudo nano /etc/nginx/nginx.conf

# 添加优化配置:
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
gzip on;
```

---

**部署完成后访问地址:**
- 本地访问: `http://localhost:3000`
- 服务器访问: `http://YOUR_SERVER_IP:3000`
- 域名访问: `http://your-domain.com` (如果配置了域名)
- HTTPS访问: `https://your-domain.com` (如果配置了SSL)

**管理界面功能:**
- 激活码生成和管理
- 黑名单管理
- 统计数据查看
- 系统状态监控
