# www.ymzxjb.top 域名配置专用指南

## 🎯 针对你的域名的快速配置

### 域名信息
- **主域名**: www.ymzxjb.top
- **根域名**: ymzxjb.top
- **域名类型**: 国际域名 (.top)

## 🚀 一键部署命令 (推荐)

### 生产环境完整部署
```bash
# 最推荐的部署方式 - 包含HTTPS
sudo bash auto-deploy.sh --domain=www.ymzxjb.top --ssl --env=production
```

### HTTP版本 (如果暂时不需要SSL)
```bash
sudo bash auto-deploy.sh --domain=www.ymzxjb.top
```

## 📋 DNS配置步骤

### 1. 获取服务器IP地址
```bash
# 在服务器上执行，获取公网IP
curl ifconfig.me
# 或者
wget -qO- ifconfig.me
```

### 2. 配置DNS解析记录
在你的域名注册商管理面板中添加以下DNS记录：

```
记录类型: A
主机记录: @
记录值: [你的服务器IP]
TTL: 600

记录类型: A  
主机记录: www
记录值: [你的服务器IP]
TTL: 600
```

### 3. 验证DNS解析
```bash
# 等待5-30分钟后，在服务器上执行
nslookup www.ymzxjb.top
nslookup ymzxjb.top

# 应该都显示你的服务器IP
ping www.ymzxjb.top
ping ymzxjb.top
```

## 🔧 部署步骤详解

### Step 1: 准备服务器环境
```bash
# 连接到服务器
ssh root@your_server_ip

# 更新系统
apt update && apt upgrade -y  # Ubuntu/Debian
# 或
yum update -y  # CentOS/RHEL
```

### Step 2: 上传项目文件
```bash
# 确保项目文件已上传到服务器
ls -la auto-deploy.sh package.json nuxt.config.ts
```

### Step 3: 运行环境检查
```bash
chmod +x check-environment.sh
sudo bash check-environment.sh
```

### Step 4: 执行域名部署
```bash
chmod +x auto-deploy.sh

# 推荐命令 - 包含SSL证书
sudo bash auto-deploy.sh --domain=www.ymzxjb.top --ssl
```

## 🌐 部署完成后的访问地址

### HTTP访问 (端口80)
- http://www.ymzxjb.top
- http://ymzxjb.top

### HTTPS访问 (端口443，如果配置了SSL)
- https://www.ymzxjb.top
- https://ymzxjb.top

### 功能页面
- **管理界面**: https://www.ymzxjb.top/admin
- **API统计**: https://www.ymzxjb.top/api/admin/stats  
- **健康检查**: https://www.ymzxjb.top/health

## 🔍 部署验证清单

### 1. DNS解析验证
```bash
# 执行这些命令确认DNS正常
nslookup www.ymzxjb.top
dig www.ymzxjb.top +short
ping -c 3 www.ymzxjb.top
```

### 2. HTTP访问验证
```bash
# 测试HTTP访问
curl -I http://www.ymzxjb.top
curl -I http://ymzxjb.top

# 预期返回: HTTP/1.1 200 OK 或重定向状态码
```

### 3. HTTPS访问验证 (如果配置了SSL)
```bash
# 测试HTTPS访问
curl -I https://www.ymzxjb.top
curl -I https://ymzxjb.top

# SSL证书验证
openssl s_client -connect www.ymzxjb.top:443 -servername www.ymzxjb.top < /dev/null
```

### 4. 应用功能验证
```bash
# 测试API接口
curl https://www.ymzxjb.top/api/admin/stats

# 测试激活码生成
curl -X POST https://www.ymzxjb.top/api/codes/generate \
  -H "Content-Type: application/json" \
  -d '{"count":3}'
```

## 🛠️ 服务管理命令

### 应用服务管理
```bash
# 查看服务状态
systemctl status activation-code-system

# 重启应用
systemctl restart activation-code-system

# 查看实时日志
journalctl -u activation-code-system -f
```

### Nginx服务管理
```bash
# 查看Nginx状态
systemctl status nginx

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx

# 查看访问日志
tail -f /var/log/nginx/www.ymzxjb.top_access.log
```

## 🔐 SSL证书管理 (如果配置了)

### 查看证书状态
```bash
sudo certbot certificates
```

### 手动续期证书
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

### 强制重新申请证书
```bash
sudo certbot --nginx --force-renewal -d www.ymzxjb.top -d ymzxjb.top
```

## 🚨 故障排除

### 问题1: 域名无法访问
```bash
# 检查步骤:
1. 确认DNS解析: nslookup www.ymzxjb.top
2. 检查应用状态: systemctl status activation-code-system  
3. 检查Nginx状态: systemctl status nginx
4. 检查防火墙: ufw status
5. 查看错误日志: tail -f /var/log/nginx/error.log
```

### 问题2: SSL证书问题
```bash
# 解决步骤:
sudo systemctl stop nginx
sudo certbot --nginx -d www.ymzxjb.top -d ymzxjb.top --force-renewal
sudo systemctl start nginx
```

### 问题3: 502 Bad Gateway
```bash
# 检查应用是否运行
curl http://localhost:3000
systemctl restart activation-code-system
```

## 🎉 部署成功确认

当看到以下结果时，说明部署成功：

1. ✅ `systemctl status activation-code-system` 显示 "active (running)"
2. ✅ `systemctl status nginx` 显示 "active (running)"  
3. ✅ `curl -I https://www.ymzxjb.top` 返回 "HTTP/2 200" 或 "HTTP/1.1 200"
4. ✅ 浏览器访问 https://www.ymzxjb.top 可以看到激活码管理系统界面
5. ✅ SSL证书显示绿色锁图标

## 📞 技术支持

如果遇到问题：
1. 查看部署日志: `tail -f /var/log/activation-code-system/deploy_*.log`
2. 运行环境诊断: `sudo bash check-environment.sh`
3. 查看系统状态: `systemctl status activation-code-system nginx`

---

**🚀 准备好部署了吗？执行以下命令开始：**
```bash
sudo bash auto-deploy.sh --domain=www.ymzxjb.top --ssl
```
