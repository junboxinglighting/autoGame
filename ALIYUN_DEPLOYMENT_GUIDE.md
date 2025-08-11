# 阿里云服务器部署指南 (ymzxjb.top 域名)## 🔧 取消域名配置（如果之前已配置）

如果您之前已经配置了域名，需要取消域名配置以便使用IP地址直接访问：

### 1. 检查当前Nginx配置

```bash
# 检查当前启用的站点
ls -la /etc/nginx/sites-enabled/

# 查看域名配置文件内容（如果存在）
sudo cat /etc/nginx/sites-available/ymzxjb.top
```

### 2. 禁用域名配置

```bash
# 移除站点启用链接（如果存在）
sudo rm -f /etc/nginx/sites-enabled/ymzxjb.top

# 重新加载Nginx配置
sudo systemctl reload nginx
```

### 3. 检查SSL证书（如果已安装）

如果您已经成功安装了SSL证书，您可能需要删除它们：

```bash
# 列出已安装的证书
sudo certbot certificates

# 删除特定证书（如果需要）
sudo certbot delete --cert-name ymzxjb.top
```

### 4. 验证配置已取消

```bash
# 检查80端口是否仍然监听
sudo netstat -tlnp | grep :80

# 测试本地访问
curl http://localhost

# 检查Nginx状态
sudo systemctl status nginx
```

## 🎯 部署概述

本指南介绍如何在阿里云ECS服务器上部署激活码管理系统，专门针对 `ymzxjb.top` 域名进行配置。部署脚本将从GitHub仓库拉取最新代码进行部署。

## 🛠️ 技术栈

### 前端技术
- **Nuxt 3**: Vue.js 框架，提供服务端渲染(SSR)和静态生成
- **Vue 3**: 渐进式JavaScript框架
- **TypeScript**: JavaScript的超集，提供类型安全
- **Tailwind CSS**: 实用优先的CSS框架

### 后端技术
- **Nitro**: Nuxt的服务器引擎
- **Node.js**: JavaScript运行时环境
- **MySQL 8.0+**: 关系型数据库

### 部署技术
- **Nginx**: 反向代理和负载均衡
- **PM2**: Node.js进程管理器
- **Systemd**: 系统服务管理
- **Git**: 代码版本控制和部署

### 其他依赖
- **bcryptjs**: 密码加密
- **jsonwebtoken**: JWT认证
- **mysql2**: MySQL数据库连接
- **uuid**: 唯一标识生成
- **zod**: 数据验证

## 👥 阿里云用户管理

阿里云提供的镜像通常已经预置了以下用户：
- **root用户**：具有完全系统管理权限
- **admin用户**：具有sudo权限的管理员用户

### 用户使用建议

1. **推荐使用admin用户**进行日常操作和部署，以提高系统安全性
2. **仅在必要时使用root用户**执行系统级管理任务
3. **配置SSH密钥登录**以提高安全性

### SSH密钥配置（推荐）

```bash
# 在本地机器生成SSH密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -C "admin@ymzxjb.top"

# 将公钥复制到服务器（替换your_server_ip为实际IP）
ssh-copy-id admin@your_server_ip

# 测试登录
ssh admin@your_server_ip
```

## 🚀 部署步骤

### 1. 准备阿里云ECS服务器

1. 登录阿里云控制台
2. 创建ECS实例（推荐配置：2核4GB内存以上）
3. 选择操作系统（支持Ubuntu 20.04+、CentOS 8+、Debian 11+）
4. 配置安全组规则，开放端口：
   - 22 (SSH)
   - 80 (HTTP)
   - 443 (HTTPS，可选)
   - 3306 (MySQL，仅内网访问)

### 2. 配置部署脚本

在执行部署之前，需要先配置部署脚本中的GitHub仓库地址：

```bash
# 使用admin用户连接到服务器
ssh admin@your_server_ip

# 下载部署脚本（或者直接创建）
nano aliyun-deploy-ymzxjb.sh

# 修改脚本中的GITHUB_REPO变量为你的实际仓库地址
# 找到这行并修改:
# GITHUB_REPO="https://github.com/your-username/activation-code-system.git"
```

### 4. 上传并执行部署脚本

#### 4.1 上传脚本到服务器

```bash
# 在本地机器执行，将脚本上传到服务器
scp aliyun-deploy-ymzxjb.sh admin@your_server_ip:/home/admin/

# 连接到服务器
ssh admin@your_server_ip
```

#### 4.2 执行部署脚本

```bash
# 切换到admin用户主目录
cd ~

# 给部署脚本添加执行权限
chmod +x aliyun-deploy-ymzxjb.sh

# 执行部署脚本（脚本会自动使用sudo执行需要root权限的操作）
./aliyun-deploy-ymzxjb.sh
```

#### 4.3 实时监控部署过程

```bash
# 在另一个终端窗口中监控部署日志
ssh admin@your_server_ip
tail -f /var/log/activation-code-system/*.log
```

### 5. 部署脚本执行内容

部署脚本将自动完成以下操作：

1. **权限检查**: 检查当前用户权限并适配执行
2. **系统更新**: 更新系统包到最新版本
3. **依赖安装**: 安装Node.js、Nginx、MySQL、Git等必要软件
4. **服务配置**: 启动并启用Nginx和MySQL服务
5. **数据库配置**: 
   - 创建数据库 `activation_code_system`
   - 创建用户 `activation_user`
   - 初始化表结构
6. **应用部署**:
   - 从GitHub拉取最新代码
   - 安装Node.js依赖
   - 构建生产版本
   - 配置环境变量
7. **PM2配置**: 配置PM2进程管理器
8. **Nginx配置**: 配置反向代理和静态文件服务
9. **防火墙配置**: 配置系统防火墙规则


### 2. 数据库安全配置

修改MySQL root密码并进行安全配置：

```bash
# 运行MySQL安全配置向导
sudo mysql_secure_installation

# 登录MySQL并修改密码
mysql -u root -p
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_secure_password';
FLUSH PRIVILEGES;
EXIT;
```

### 3. 应用配置优化

根据需要修改环境配置文件 `/opt/activation-code-system/.env`：

```bash
# 编辑环境配置
nano /opt/activation-code-system/.env
```

## 🔄 更新部署

当GitHub仓库中有新代码时，可以通过以下方式更新部署：

```bash
# 进入应用目录
cd /opt/activation-code-system

# 拉取最新代码
git pull

# 安装新依赖（如果有）
npm install

# 重新构建应用
npm run build

# 重启应用
pm2 restart activation-code-system
```

或者重新运行整个部署脚本以进行完整更新：

```bash
# 重新运行部署脚本
./aliyun-deploy-ymzxjb.sh
```

## 📈 系统管理

### 服务管理命令

```bash
# 查看应用状态
pm2 status

# 查看应用日志
pm2 logs

# 重启应用
pm2 restart activation-code-system

# 停止应用
pm2 stop activation-code-system

# 启动应用
pm2 start activation-code-system

# 查看系统服务状态
sudo systemctl status activation-code-system

# 重启Nginx
sudo systemctl restart nginx

# 重启MySQL
sudo systemctl restart mysql
```

### 日志查看

```bash
# 应用日志
tail -f /var/log/activation-code-system/*.log

# Nginx访问日志
tail -f /var/log/nginx/ymzxjb.top_access.log

# Nginx错误日志
tail -f /var/log/nginx/ymzxjb.top_error.log

# MySQL日志
tail -f /var/log/mysql/error.log  # Ubuntu/Debian
tail -f /var/log/mysqld.log       # CentOS/RHEL
```

## 🔄 备份与恢复

### 数据库备份

```bash
# 备份数据库
mysqldump -u activation_user -p activation_code_system > backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复数据库
mysql -u activation_user -p activation_code_system < backup_file.sql
```

### 应用文件备份

```bash
# 备份应用文件
tar -czf activation-code-system-backup-$(date +%Y%m%d_%H%M%S).tar.gz /opt/activation-code-system
```

## 🚨 故障排除

### 常见问题

1. **应用无法访问**
   ```bash
   # 检查应用状态
   pm2 status
   
   # 检查应用日志
   pm2 logs
   
   # 检查端口监听
   netstat -tlnp | grep 3000
   ```

2. **Nginx 502 错误**
   ```bash
   # 检查Nginx配置
   sudo nginx -t
   
   # 检查应用是否运行
   curl http://localhost:3000
   
   # 重启应用
   pm2 restart activation-code-system
   ```

3. **数据库连接失败**
   ```bash
   # 检查MySQL服务状态
   sudo systemctl status mysql
   
   # 检查数据库连接
   mysql -u activation_user -p activation_code_system
   
   # 检查防火墙设置
   sudo ufw status  # Ubuntu
   sudo firewall-cmd --list-all  # CentOS
   ```

4. **Git拉取代码失败**
   ```bash
   # 检查仓库地址是否正确
   cd /opt/activation-code-system
   git remote -v
   
   # 检查网络连接
   ping github.com
   
   # 如果是私有仓库，需要配置SSH密钥或使用HTTPS token
   ```

## 🔒 安全建议

1. **定期更新系统和软件**
   ```bash
   sudo apt update && sudo apt upgrade  # Ubuntu/Debian
   sudo yum update                 # CentOS/RHEL
   ```

2. **配置SSH安全**
   - 确保已配置SSH密钥登录
   - 禁用密码登录（可选）
   - 限制SSH登录用户

3. **定期备份**
   - 数据库备份
   - 应用文件备份
   - 配置文件备份

4. **监控和告警**
   - 配置系统资源监控
   - 配置应用性能监控
   - 设置异常告警

## 📞 技术支持

如遇到部署或运行问题，请检查以下内容：

1. 查看部署日志
2. 检查系统资源使用情况
3. 验证网络连接和DNS解析
4. 确认防火墙规则配置
5. 检查GitHub仓库地址和访问权限

---
**🎉 部署完成！现在可以通过 http://[服务器IP] 访问您的激活码管理系统了！**