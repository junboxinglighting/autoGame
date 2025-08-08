# 域名配置检查清单

## ✅ 域名配置前置检查

### 1. 域名信息准备
- [ ] 已购买域名 (你的域名: www.ymzxjb.top)
- [ ] 知道域名注册商管理面板登录方式
- [ ] 已获取服务器公网IP地址
- [ ] 准备邮箱地址 (用于SSL证书申请)

### 2. DNS解析配置
```bash
# 在域名注册商管理面板配置:
# 为 ymzxjb.top 配置根域名解析
记录类型: A
主机记录: @
记录值: YOUR_SERVER_IP
TTL: 600

# 为 www.ymzxjb.top 配置www子域名解析
记录类型: A  
主机记录: www
记录值: YOUR_SERVER_IP
TTL: 600

# 注意：你的主域名是 www.ymzxjb.top
# 建议同时配置根域名 ymzxjb.top 的解析
```

### 3. 验证DNS生效
```bash
# 检查你的域名解析结果
nslookup www.ymzxjb.top
dig www.ymzxjb.top

# 同时检查根域名解析
nslookup ymzxjb.top
dig ymzxjb.top

# 预期结果应显示你的服务器IP
# 也可以用ping命令测试
ping www.ymzxjb.top
ping ymzxjb.top
```

## 🚀 自动化域名配置命令

### 完整域名 + SSL配置 (推荐生产环境)
```bash
sudo bash auto-deploy.sh --domain=www.ymzxjb.top --ssl --env=production
```

### 仅域名配置 (HTTP)
```bash
sudo bash auto-deploy.sh --domain=www.ymzxjb.top
```

### 自定义端口域名配置
```bash
sudo bash auto-deploy.sh --domain=www.ymzxjb.top --ssl --port=8080
```

## 🔧 手动域名配置步骤

### 1. 运行域名配置脚本
```bash
chmod +x domain-config.sh
sudo bash domain-config.sh
```

### 2. 按提示输入域名和端口
```
请输入你的域名 (例如: www.ymzxjb.top): www.ymzxjb.top
请输入应用端口 (默认: 3000): 3000
```

### 3. 选择是否配置SSL
```
是否现在配置SSL证书 (Let's Encrypt)? (y/N): y
```

## 📊 域名配置后验证

### HTTP访问测试
```bash
# 命令行测试你的域名
curl -I http://www.ymzxjb.top
curl -I http://ymzxjb.top

# 预期结果: HTTP/1.1 200 OK 或 301/302 重定向
```

### HTTPS访问测试 (如果配置了SSL)
```bash
# 命令行测试HTTPS
curl -I https://www.ymzxjb.top
curl -I https://ymzxjb.top

# SSL证书检查
openssl s_client -connect www.ymzxjb.top:443 -servername www.ymzxjb.top
```

### 浏览器访问测试
- [ ] http://www.ymzxjb.top 可以正常访问
- [ ] https://www.ymzxjb.top 可以正常访问 (如果配置了SSL)
- [ ] http://ymzxjb.top 可以正常访问 (根域名)
- [ ] https://ymzxjb.top 可以正常访问 (根域名HTTPS)
- [ ] SSL证书显示为绿色锁图标 (HTTPS)

## 🌍 不同云服务商DNS配置指南

### 阿里云DNS配置
```
1. 登录阿里云控制台
2. 进入 "域名" -> "解析设置"
3. 添加记录:
   - 记录类型: A
   - 主机记录: @
   - 解析路线: 默认
   - 记录值: 服务器IP
   - TTL: 10分钟
```

### 腾讯云DNS配置
```
1. 登录腾讯云控制台
2. 进入 "域名注册" -> "我的域名" -> "解析"
3. 添加记录:
   - 记录类型: A
   - 主机记录: @
   - 记录值: 服务器IP
   - TTL: 600
```

### Cloudflare DNS配置
```
1. 登录Cloudflare管理面板
2. 选择域名进入DNS管理
3. 添加记录:
   - Type: A
   - Name: @ 或 yourdomain.com
   - IPv4 address: 服务器IP
   - TTL: Auto
   - Proxy status: DNS only (灰色云朵)
```

### GoDaddy DNS配置
```
1. 登录GoDaddy账户
2. 进入 "My Products" -> "DNS"
3. 添加记录:
   - Type: A
   - Host: @
   - Points to: 服务器IP
   - TTL: 1 Hour
```

## 🔍 常见域名问题排除

### 问题1: DNS解析不生效
```bash
# 可能原因和解决方案:
1. DNS传播延迟 (等待30分钟到2小时)
2. TTL设置过长 (设置为600秒)
3. DNS缓存问题 (清除本地DNS缓存)
   - Windows: ipconfig /flushdns
   - macOS: sudo dscacheutil -flushcache
   - Linux: sudo systemctl restart systemd-resolved
```

### 问题2: 域名指向错误IP
```bash
# 检查DNS配置:
nslookup yourdomain.com
dig yourdomain.com

# 确认服务器IP:
curl ifconfig.me
wget -qO- ifconfig.me
```

### 问题3: 502 Bad Gateway错误
```bash
# 检查应用是否运行:
systemctl status activation-code-system
curl http://localhost:3000

# 检查Nginx配置:
nginx -t
systemctl status nginx

# 查看错误日志:
tail -f /var/log/nginx/error.log
```

### 问题4: SSL证书申请失败
```bash
# 可能原因:
1. DNS解析未生效
2. 80端口被占用或未开放
3. 域名已有证书冲突

# 解决步骤:
sudo systemctl stop nginx
sudo certbot --nginx -d yourdomain.com --force-renewal
sudo systemctl start nginx
```

## 📋 域名配置完成检查清单

### 基础功能检查
- [ ] http://yourdomain.com 返回激活码管理系统首页
- [ ] http://yourdomain.com/admin 可以访问管理界面
- [ ] API接口可以正常访问: http://yourdomain.com/api/admin/stats

### SSL配置检查 (如果配置)
- [ ] https://yourdomain.com 可以正常访问
- [ ] 浏览器显示安全锁图标
- [ ] HTTP自动重定向到HTTPS
- [ ] SSL证书有效期正常 (90天)

### 性能和安全检查
- [ ] 静态资源压缩正常 (查看响应头 Content-Encoding: gzip)
- [ ] 安全头设置正确 (X-Frame-Options, X-Content-Type-Options 等)
- [ ] 响应时间正常 (< 2秒)
- [ ] 防火墙规则正确配置

## 🎯 域名配置最佳实践

### 1. 使用CDN加速 (可选)
```bash
# 如果使用Cloudflare:
1. 将DNS托管到Cloudflare
2. 启用代理模式 (橙色云朵)
3. 开启缓存和压缩优化
```

### 2. 配置子域名 (可选)
```bash
# 为不同环境配置子域名:
api.yourdomain.com    -> API服务
admin.yourdomain.com  -> 管理界面
test.yourdomain.com   -> 测试环境
```

### 3. 监控和维护
```bash
# 定期检查SSL证书状态:
sudo certbot certificates

# 监控域名解析:
dig yourdomain.com

# 检查网站可用性:
curl -I https://yourdomain.com
```

---

**配置完成后，你的激活码管理系统将通过域名专业地提供服务！**
