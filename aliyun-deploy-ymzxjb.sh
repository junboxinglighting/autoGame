#!/bin/bash

# ====================================================================
# 激活码管理系统 - 阿里云自动化部署脚本 (针对 ymzxjb.top 域名)
# 适用于阿里云ECS服务器
# 支持root用户和具有sudo权限的普通用户
# 作者: GitHub Copilot
# ====================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# 检查用户权限
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        # 当前是root用户
        SUDO=""
        CURRENT_USER="root"
        log "以root用户身份运行"
    else
        # 检查是否有sudo权限
        if sudo -l >/dev/null 2>&1; then
            SUDO="sudo"
            CURRENT_USER=$(whoami)
            log "以普通用户 $CURRENT_USER 身份运行，使用sudo执行管理命令"
        else
            log_error "当前用户无root权限且无sudo权限，无法执行部署"
            exit 1
        fi
    fi
}

# 检查操作系统
check_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
        log "检测到操作系统: $OS $VER"
    else
        log_error "无法确定操作系统"
        exit 1
    fi
}

# 更新系统
update_system() {
    log "更新系统包..."
    if [[ $OS == *"Ubuntu"* ]] || [[ $OS == *"Debian"* ]]; then
        $SUDO apt update && $SUDO apt upgrade -y
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]] || [[ $OS == *"AlmaLinux"* ]] || [[ $OS == *"Rocky"* ]]; then
        $SUDO yum update -y
    else
        log_error "不支持的操作系统: $OS"
        exit 1
    fi
}

# 安装必要软件
install_dependencies() {
    log "安装必要软件..."
    if [[ $OS == *"Ubuntu"* ]] || [[ $OS == *"Debian"* ]]; then
        $SUDO apt install -y curl wget gnupg ca-certificates lsb-release nginx mysql-server nodejs npm
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]] || [[ $OS == *"AlmaLinux"* ]] || [[ $OS == *"Rocky"* ]]; then
        $SUDO yum install -y curl wget gnupg nginx mysql-server
        # 在CentOS上安装Node.js
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | $SUDO bash -
        $SUDO yum install -y nodejs
    fi
}

# 启动并启用服务
enable_services() {
    log "启动并启用必要服务..."
    $SUDO systemctl start nginx
    $SUDO systemctl enable nginx
    
    $SUDO systemctl start mysqld || $SUDO systemctl start mysql
    $SUDO systemctl enable mysqld || $SUDO systemctl enable mysql
}

# 配置MySQL数据库
configure_mysql() {
    log "配置MySQL数据库..."
    
    # 获取临时密码（CentOS/RedHat）
    if [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]] || [[ $OS == *"AlmaLinux"* ]] || [[ $OS == *"Rocky"* ]]; then
        TEMP_PASSWORD=$($SUDO grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')
        log "临时MySQL密码: $TEMP_PASSWORD"
    fi
    
    # 创建数据库和用户
    $SUDO mysql -e "CREATE DATABASE IF NOT EXISTS activation_code_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    $SUDO mysql -e "CREATE USER IF NOT EXISTS 'activation_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';"
    $SUDO mysql -e "GRANT ALL PRIVILEGES ON activation_code_system.* TO 'activation_user'@'localhost';"
    $SUDO mysql -e "FLUSH PRIVILEGES;"
    
    log "MySQL数据库配置完成"
}

# 安装PM2
install_pm2() {
    log "安装PM2进程管理器..."
    npm install -g pm2
    pm2 startup systemd -u $CURRENT_USER --hp /home/$CURRENT_USER
}

# 部署应用
deploy_application() {
    log "部署应用..."
    
    # 创建应用目录
    $SUDO mkdir -p /opt/activation-code-system
    $SUDO chown $CURRENT_USER:$CURRENT_USER /opt/activation-code-system
    cd /opt/activation-code-system
    
    # 克隆或复制应用代码（这里假设代码已上传到服务器）
    # git clone <repository-url> .
    
    # 安装依赖
    npm install --production
    
    # 构建应用
    npm run build
    
    # 初始化数据库
    mysql -u activation_user -pStrongPassword123! activation_code_system < /opt/activation-code-system/database/init.sql
    
    # 创建环境配置文件
    cat > /opt/activation-code-system/.env << EOF
# 应用配置
NODE_ENV=production
PORT=3000
DOMAIN=www.ymzxjb.top
ROOT_DOMAIN=ymzxjb.top

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=activation_code_system
DB_USER=activation_user
DB_PASSWORD=StrongPassword123!

# 安全配置
JWT_SECRET=$(openssl rand -base64 32)
NO_AUTH_MODE=true

# 日志配置
LOG_LEVEL=info
LOG_FILE=/var/log/activation-code-system/app.log
EOF
    
    # 设置文件权限
    chmod 600 /opt/activation-code-system/.env
}

# 配置PM2
configure_pm2() {
    log "配置PM2..."
    
    # 创建PM2配置文件
    cat > /opt/activation-code-system/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'activation-code-system',
    script: '.output/server/index.mjs',
    cwd: '/opt/activation-code-system',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/activation-code-system/err.log',
    out_file: '/var/log/activation-code-system/out.log',
    log_file: '/var/log/activation-code-system/combined.log',
    time: true
  }]
}
EOF
    
    # 创建日志目录
    $SUDO mkdir -p /var/log/activation-code-system
    $SUDO chown -R $CURRENT_USER:$CURRENT_USER /var/log/activation-code-system
    
    # 启动应用
    cd /opt/activation-code-system
    pm2 start ecosystem.config.js
    pm2 save
}

# 配置Nginx
configure_nginx() {
    log "配置Nginx..."
    
    # 创建Nginx配置文件
    $SUDO tee /etc/nginx/sites-available/ymzxjb.top > /dev/null << 'EOF'
server {
    listen 80;
    server_name ymzxjb.top www.ymzxjb.top;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # 日志
    access_log /var/log/nginx/ymzxjb.top_access.log;
    error_log /var/log/nginx/ymzxjb.top_error.log;
    
    # 反向代理到Node.js应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }
}
EOF
    
    # 启用站点
    $SUDO ln -sf /etc/nginx/sites-available/ymzxjb.top /etc/nginx/sites-enabled/
    
    # 测试并重新加载Nginx
    $SUDO nginx -t && $SUDO systemctl reload nginx
    
    log "Nginx配置完成"
}

# 配置防火墙
configure_firewall() {
    log "配置防火墙..."
    
    if command -v ufw >/dev/null 2>&1; then
        # Ubuntu防火墙
        echo "y" | $SUDO ufw enable
        $SUDO ufw allow OpenSSH
        $SUDO ufw allow 'Nginx Full'
    elif command -v firewall-cmd >/dev/null 2>&1; then
        # CentOS防火墙
        $SUDO firewall-cmd --permanent --add-service=ssh
        $SUDO firewall-cmd --permanent --add-service=http
        $SUDO firewall-cmd --permanent --add-service=https
        $SUDO firewall-cmd --reload
    fi
    
    log "防火墙配置完成"
}

# 获取服务器公网IP
get_public_ip() {
    PUBLIC_IP=$(curl -s ifconfig.me)
    log "服务器公网IP: $PUBLIC_IP"
}

# 显示部署完成信息
show_completion() {
    get_public_ip
    
    log_success "==========================================="
    log_success "激活码管理系统部署完成！"
    log_success "==========================================="
    log_success "访问地址："
    log_success "  - http://ymzxjb.top"
    log_success "  - http://www.ymzxjb.top"
    log_success "  - http://$PUBLIC_IP"
    log_success ""
    log_success "管理命令："
    log_success "  - 查看应用状态: pm2 status"
    log_success "  - 查看日志: pm2 logs"
    log_success "  - 重启应用: pm2 restart activation-code-system"
    log_success "  - 停止应用: pm2 stop activation-code-system"
    log_success ""
    log_success "重要提醒："
    log_success "1. 请在域名注册商处将 ymzxjb.top 和 www.ymzxjb.top 解析到 $PUBLIC_IP"
    log_success "2. 如需配置SSL证书，可使用 Let's Encrypt:"
    log_success "   sudo certbot --nginx -d ymzxjb.top -d www.ymzxjb.top"
    log_success "==========================================="
}

# 主函数
main() {
    log "开始部署激活码管理系统到阿里云服务器..."
    
    check_permissions
    check_os
    update_system
    install_dependencies
    enable_services
    configure_mysql
    install_pm2
    deploy_application
    configure_pm2
    configure_nginx
    configure_firewall
    show_completion
    
    log_success "部署脚本执行完成！"
}

# 执行主函数
main "$@"