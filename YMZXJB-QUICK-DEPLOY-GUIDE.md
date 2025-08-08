# www.ymzxjb.top 部署快速指南

## 🚀 一键部署命令

### 基础HTTP部署
```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/activation-code-system/main/auto-deploy.sh | sudo bash -s -- --domain="www.ymzxjb.top" --port=3000 --mode=production
```

### 完整HTTPS部署（推荐）
```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/activation-code-system/main/auto-deploy.sh | sudo bash -s -- --domain="www.ymzxjb.top" --port=3000 --mode=production --ssl=true --email="admin@ymzxjb.top"
```

### 本地脚本部署
```bash
sudo bash auto-deploy.sh --domain="www.ymzxjb.top" --port=3000 --mode=production --ssl=true
```

## 🔧 针对ymzxjb.top的特殊优化

### 1. 自动域名处理
- ✅ `ymzxjb.top` → `www.ymzxjb.top` (自动重定向)
- ✅ `www.ymzxjb.top` → 主站点
- ✅ 优化的Nginx配置，专门针对你的域名

### 2. SSL证书配置
```bash
# 自动SSL配置（包含在部署脚本中）
certbot --nginx -d www.ymzxjb.top -d ymzxjb.top --non-interactive --agree-tos --email admin@ymzxjb.top
```

### 3. DNS配置要求
```
# 在你的DNS提供商控制台添加以下记录：
A    @             [服务器IP]      # ymzxjb.top
A    www           [服务器IP]      # www.ymzxjb.top
```

## 📝 部署前检查清单

### 服务器要求
- [ ] Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- [ ] 2GB+ RAM
- [ ] 20GB+ 磁盘空间
- [ ] 80/443端口开放

### 域名要求
- [ ] DNS解析已生效（A记录指向服务器IP）
- [ ] 防火墙允许80和443端口
- [ ] 服务器可以访问外网

### 快速验证DNS
```bash
# 检查DNS解析
nslookup www.ymzxjb.top
nslookup ymzxjb.top

# 从服务器测试访问
curl -I http://www.ymzxjb.top
```

## 🎯 部署步骤详解

### 步骤1：环境检查
```bash
# 下载环境检查脚本
wget https://your-repo.com/check-environment.sh
sudo bash check-environment.sh
```

### 步骤2：域名优化配置
```bash
# 使用专用域名配置脚本
sudo bash optimize-nginx-for-ymzxjb.sh 3000
```

### 步骤3：主程序部署
```bash
# 完整部署（包含SSL）
sudo bash auto-deploy.sh \
  --domain="www.ymzxjb.top" \
  --port=3000 \
  --mode=production \
  --ssl=true \
  --email="admin@ymzxjb.top" \
  --auto-start=true
```

## 🌐 部署后验证

### HTTP访问测试
```bash
# 测试根域名重定向
curl -I http://ymzxjb.top
# 应返回: HTTP/1.1 301 Moved Permanently
# Location: http://www.ymzxjb.top/

# 测试www主站
curl -I http://www.ymzxjb.top
# 应返回: HTTP/1.1 200 OK
```

### HTTPS访问测试（SSL部署后）
```bash
curl -I https://www.ymzxjb.top
curl -I https://ymzxjb.top
```

### 功能测试
```bash
# API测试
curl http://www.ymzxjb.top/api/admin/stats

# 健康检查
curl http://www.ymzxjb.top/health

# 管理界面
curl -I http://www.ymzxjb.top/admin
```

## 📊 访问地址汇总

部署成功后，你的网站将在以下地址可用：

### HTTP访问 (基础部署)
- 🌐 **主站**: http://www.ymzxjb.top
- 🔄 **根域名**: http://ymzxjb.top (自动跳转到www)
- 🔧 **管理界面**: http://www.ymzxjb.top/admin
- 📡 **API接口**: http://www.ymzxjb.top/api/
- ⚕️ **健康检查**: http://www.ymzxjb.top/health

### HTTPS访问 (SSL部署)
- 🔒 **主站**: https://www.ymzxjb.top
- 🔄 **根域名**: https://ymzxjb.top (自动跳转到www)
- 🔧 **管理界面**: https://www.ymzxjb.top/admin
- 📡 **API接口**: https://www.ymzxjb.top/api/
- ⚕️ **健康检查**: https://www.ymzxjb.top/health

## 🛠️ 运维管理命令

### 应用管理
```bash
# 查看应用状态
systemctl status activation-code-system

# 重启应用
sudo systemctl restart activation-code-system

# 查看应用日志
journalctl -u activation-code-system -f
```

### Nginx管理
```bash
# 重启Nginx
sudo systemctl restart nginx

# 查看访问日志
tail -f /var/log/nginx/ymzxjb-top_access.log

# 查看错误日志
tail -f /var/log/nginx/ymzxjb-top_error.log

# 测试配置
sudo nginx -t
```

### SSL证书管理
```bash
# 手动续期证书
sudo certbot renew

# 查看证书状态
sudo certbot certificates

# 证书自动续期状态
systemctl status certbot.timer
```

## 🚨 故障排除

### 常见问题

#### 1. DNS未解析
```bash
# 检查DNS
nslookup www.ymzxjb.top
# 如果没有返回服务器IP，请检查DNS配置
```

#### 2. 端口被占用
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000
# 如果被占用，修改PORT参数或停止占用进程
```

#### 3. SSL证书申请失败
```bash
# 检查域名解析
curl -I http://www.ymzxjb.top
# 确保HTTP先可访问，再申请SSL
```

#### 4. 应用无法启动
```bash
# 查看应用日志
journalctl -u activation-code-system -n 50

# 检查应用配置
cat /opt/activation-code-system/.env
```

### 紧急恢复
```bash
# 重新部署（保留数据）
sudo bash auto-deploy.sh --domain="www.ymzxjb.top" --mode=production --keep-data=true

# 回滚到HTTP（如果SSL有问题）
sudo bash auto-deploy.sh --domain="www.ymzxjb.top" --mode=production --ssl=false
```

## 📈 性能监控

### 基础监控
```bash
# 系统资源
htop

# 应用性能
pm2 monit  # 如果使用PM2

# Nginx状态
curl http://www.ymzxjb.top/nginx_status
```

### 日志分析
```bash
# 访问量统计
awk '{print $1}' /var/log/nginx/ymzxjb-top_access.log | sort | uniq -c | sort -nr

# 错误日志分析
tail -f /var/log/nginx/ymzxjb-top_error.log
```

## 🔒 安全建议

1. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade  # Ubuntu/Debian
   sudo yum update                      # CentOS
   ```

2. **配置防火墙**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

3. **启用fail2ban**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

4. **定期备份**
   ```bash
   # 数据库备份
   sudo -u postgres pg_dump activation_codes > backup_$(date +%Y%m%d).sql
   
   # 配置备份
   tar -czf config_backup_$(date +%Y%m%d).tar.gz /opt/activation-code-system/
   ```

---

🎉 **恭喜！** 你的激活码管理系统现已针对 `www.ymzxjb.top` 域名进行了完全优化！

需要技术支持请查看项目文档或提交Issue。
