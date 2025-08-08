# 激活码管理系统 - 快速部署手册

## 🚀 5分钟快速部署指南

### Step 1: 准备服务器 (1分钟)
```bash
# 1. 连接到你的Linux服务器
ssh root@your_server_ip

# 2. 快速系统更新
apt update && apt upgrade -y  # Ubuntu/Debian
# 或者
yum update -y  # CentOS/RHEL
```

### Step 2: 域名DNS配置 (如果有域名)
```bash
# 在域名注册商管理面板配置DNS解析:
# 记录类型: A
# 主机记录: @ (根域名) 或 www (子域名)
# 记录值: 你的服务器IP地址
# TTL: 600 (默认)

# 示例:
# example.com -> 123.456.789.123
# www.example.com -> 123.456.789.123

# 等待DNS生效 (5-30分钟)
nslookup yourdomain.com
```

### Step 3: 上传项目文件 (2分钟)
```bash
# 方法A: 直接上传 (推荐)
# 在本地将整个项目文件夹打包上传到服务器

# 方法B: GitHub克隆
git clone https://github.com/your-repo/activation-code-system.git
cd activation-code-system
```

### Step 4: 环境检查 (30秒)
```bash
# 运行环境检查脚本
chmod +x check-environment.sh
sudo bash check-environment.sh
```

### Step 5: 一键部署 (2分钟)
```bash
# 给部署脚本执行权限
chmod +x auto-deploy.sh

# 基础部署
sudo bash auto-deploy.sh

# 带域名的部署 (推荐)
sudo bash auto-deploy.sh --domain=yourdomain.com --ssl

# 域名配置说明:
# 如果你有域名，强烈推荐使用 --domain 参数
# 脚本会自动配置Nginx反向代理和SSL证书
```

### Step 6: 验证部署 (30秒)
```bash
# 检查服务状态
systemctl status activation-code-system

# 测试应用访问
curl http://localhost:3000

# 浏览器访问
http://your_server_ip:3000        # 无域名访问
http://yourdomain.com             # 有域名访问 (HTTP)
https://yourdomain.com            # 有域名访问 (HTTPS，如果配置了SSL)
```

---

## 🌐 域名配置详细指南

### 方法1: 使用部署脚本自动配置 (推荐)
```bash
# 一键配置域名 + SSL证书
sudo bash auto-deploy.sh --domain=yourdomain.com --ssl

# 仅配置域名 (HTTP)
sudo bash auto-deploy.sh --domain=yourdomain.com

# 自定义端口的域名配置
sudo bash auto-deploy.sh --domain=yourdomain.com --ssl --port=3001
```

### 方法2: 使用域名配置脚本
```bash
# 运行独立的域名配置脚本
chmod +x domain-config.sh
sudo bash domain-config.sh

# 脚本会引导你完成:
# 1. DNS解析验证
# 2. Nginx反向代理配置
# 3. SSL证书申请 (可选)
# 4. 防火墙规则配置
```

### DNS配置步骤 (必做)

**1. 在域名注册商管理面板添加DNS记录:**
```
记录类型: A
主机记录: @          (代表根域名 example.com)
记录值: 123.456.789.123    (你的服务器IP)
TTL: 600

记录类型: A
主机记录: www        (代表 www.example.com)
记录值: 123.456.789.123    (你的服务器IP)  
TTL: 600
```

**2. 验证DNS解析:**
```bash
# 检查DNS解析
nslookup yourdomain.com
dig yourdomain.com

# 检查是否解析到正确IP
ping yourdomain.com

# 等待DNS全球传播 (通常5-30分钟)
```

**3. 测试域名访问:**
```bash
# HTTP访问测试
curl -I http://yourdomain.com

# HTTPS访问测试 (如果配置了SSL)
curl -I https://yourdomain.com
```

### SSL证书配置

**自动配置 (推荐):**
```bash
# 使用部署脚本自动配置SSL
sudo bash auto-deploy.sh --domain=yourdomain.com --ssl
```

**手动配置Let's Encrypt:**
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian
sudo yum install certbot python3-certbot-nginx  # CentOS/RHEL

# 获取SSL证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 域名相关故障排除

**问题1: 域名无法访问**
```bash
# 检查DNS解析
nslookup yourdomain.com

# 检查Nginx配置
sudo nginx -t
sudo systemctl status nginx

# 检查应用状态
sudo systemctl status activation-code-system

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

**问题2: SSL证书问题**
```bash
# 检查证书状态
sudo certbot certificates

# 手动续期证书
sudo certbot renew

# 强制重新获取证书
sudo certbot --nginx --force-renewal -d yourdomain.com
```

**问题3: 502/504网关错误**
```bash
# 检查应用是否运行
curl http://localhost:3000

# 检查端口监听
sudo netstat -tlnp | grep :3000

# 重启应用
sudo systemctl restart activation-code-system
```

---

## 📋 部署选项对比

| 部署方式 | 适用场景 | 命令 | 特点 |
|---------|---------|------|------|
| **基础部署** | 测试/开发 | `sudo bash auto-deploy.sh` | 快速、简单、默认配置 |
| **生产部署** | 正式环境 | `sudo bash auto-deploy.sh --domain=example.com --ssl` | 完整功能、SSL、监控 |
| **自定义端口** | 端口冲突时 | `sudo bash auto-deploy.sh --port=8080` | 灵活端口配置 |
| **容器部署** | Docker环境 | `sudo bash auto-deploy.sh --env=container --no-nginx` | 容器优化配置 |

---

## 🔧 常用管理命令速查

### 服务管理
```bash
# 查看服务状态
systemctl status activation-code-system

# 启动/停止/重启
systemctl start activation-code-system
systemctl stop activation-code-system
systemctl restart activation-code-system

# 开机自启动
systemctl enable activation-code-system
```

### 应用监控
```bash
# 查看实时日志
journalctl -u activation-code-system -f

# 查看最近的错误日志
journalctl -u activation-code-system --since="1 hour ago" -p err

# 检查应用进程
ps aux | grep node
```

### 性能检查
```bash
# 系统资源使用
htop
free -h
df -h

# 网络连接状态
ss -tuln | grep :3000

# 应用响应测试
curl -I http://localhost:3000
```

---

## 🚨 常见问题快速解决

### 问题1: 端口被占用
```bash
# 查找占用进程
sudo netstat -tlnp | grep :3000

# 杀死进程
sudo kill -9 PID_NUMBER

# 重启服务
sudo systemctl restart activation-code-system
```

### 问题2: 服务启动失败
```bash
# 查看详细错误
sudo journalctl -u activation-code-system -n 20

# 检查配置文件
sudo nano /etc/systemd/system/activation-code-system.service

# 重新加载配置
sudo systemctl daemon-reload
sudo systemctl restart activation-code-system
```

### 问题3: 内存不足
```bash
# 查看内存使用
free -h

# 清理系统缓存
sudo sync && echo 3 > /proc/sys/vm/drop_caches

# 重启应用
sudo systemctl restart activation-code-system
```

### 问题4: 数据库连接失败
```bash
# 检查MySQL状态
sudo systemctl status mysql

# 启动MySQL
sudo systemctl start mysql

# 测试数据库连接
mysql -u activation_app -p activation_code_system
```

---

## 🎯 部署后必做的5件事

### 1. 验证核心功能
```bash
# 测试API接口
curl -X POST http://localhost:3000/api/codes/generate \
  -H "Content-Type: application/json" \
  -d '{"count":5}'

curl -X POST http://localhost:3000/api/codes/validate-simple \
  -H "Content-Type: application/json" \
  -d '{"code":"YOUR_TEST_CODE"}'
```

### 2. 配置防火墙
```bash
# Ubuntu/Debian
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. 设置SSL证书 (如果有域名)
```bash
# 重新运行部署脚本启用SSL
sudo bash auto-deploy.sh --domain=yourdomain.com --ssl
```

### 4. 配置备份策略
```bash
# 检查自动备份
ls -la /opt/backups/activation-code-system/

# 手动备份
sudo tar -czf /opt/backups/manual_backup_$(date +%Y%m%d).tar.gz \
  /opt/activation-code-system/current
```

### 5. 监控设置
```bash
# 查看监控脚本
ls -la /usr/local/bin/activation-code-system-monitor

# 查看监控日志
tail -f /var/log/activation-code-system/monitor.log
```

---

## 📊 性能优化清单

### 系统级优化
```bash
# 优化文件描述符限制
echo "* soft nofile 65535" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65535" | sudo tee -a /etc/security/limits.conf

# 优化网络参数
echo "net.core.somaxconn = 1024" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 应用级优化
```bash
# 查看PM2进程状态
sudo -u app pm2 list

# 优化PM2配置
sudo -u app pm2 set pm2:max_memory_restart 500M

# 启用性能监控
sudo -u app pm2 monit
```

### 数据库优化
```bash
# 优化MySQL配置
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# 添加优化参数:
# innodb_buffer_pool_size = 256M
# max_connections = 100

# 重启MySQL
sudo systemctl restart mysql
```

---

## 🔗 相关链接

- **项目主页**: [GitHub Repository]
- **API文档**: http://your-server:3000/api/docs
- **管理界面**: http://your-server:3000/admin
- **监控面板**: http://your-server:3000/health

---

## 📞 技术支持

如果遇到问题，请按以下顺序尝试:

1. **查看日志**: `journalctl -u activation-code-system -f`
2. **检查服务**: `systemctl status activation-code-system`
3. **运行诊断**: `sudo bash check-environment.sh`
4. **查看文档**: 阅读 `deployment-guide.md`

---

**🎉 部署成功！你的激活码管理系统已经准备就绪！**
