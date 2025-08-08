#!/bin/bash

# 域名配置辅助脚本
# 用于手动配置域名和SSL证书

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
if [[ $EUID -ne 0 ]]; then
    log_error "此脚本需要root权限运行"
    exit 1
fi

# 获取域名
read -p "请输入你的域名 (例如: example.com): " DOMAIN
if [[ -z "$DOMAIN" ]]; then
    log_error "域名不能为空"
    exit 1
fi

# 获取应用端口
read -p "请输入应用端口 (默认: 3000): " PORT
PORT=${PORT:-3000}

log_info "开始配置域名: $DOMAIN"
log_info "应用端口: $PORT"

# 1. 验证DNS解析
log_info "验证DNS解析..."
if ! nslookup "$DOMAIN" >/dev/null 2>&1; then
    log_warn "DNS解析可能未生效，请确保域名已正确解析到服务器IP"
    read -p "是否继续配置? (y/N): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# 2. 安装Nginx（如果未安装）
if ! command -v nginx >/dev/null 2>&1; then
    log_info "安装Nginx..."
    if command -v apt >/dev/null 2>&1; then
        apt update && apt install -y nginx
    elif command -v yum >/dev/null 2>&1; then
        yum install -y nginx
    else
        log_error "无法安装Nginx，请手动安装"
        exit 1
    fi
    
    systemctl enable nginx
    systemctl start nginx
fi

# 3. 创建Nginx配置文件
log_info "创建Nginx配置..."

cat > "/etc/nginx/sites-available/$DOMAIN" << EOF
# $DOMAIN - Activation Code System
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # 安全头设置
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 日志配置
    access_log /var/log/nginx/${DOMAIN}_access.log;
    error_log /var/log/nginx/${DOMAIN}_error.log warn;
    
    # 主应用反向代理
    location / {
        # 检查应用是否运行
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # 静态资源优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        
        # 尝试直接访问文件，失败则代理到应用
        try_files \$uri @proxy;
        
        # 启用gzip压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types
            text/css
            application/javascript
            application/json
            image/svg+xml
            font/woff
            font/woff2;
    }
    
    # 静态资源代理回退
    location @proxy {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 健康检查端点
    location /health {
        proxy_pass http://127.0.0.1:$PORT/health;
        proxy_set_header Host \$host;
        access_log off;
    }
    
    # API接口优化
    location /api/ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # API专用超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # 管理界面
    location /admin {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 禁止访问隐藏文件和敏感目录
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ /(\.git|\.env|\.config|node_modules) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 限制文件上传大小
    client_max_body_size 10M;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# 4. 启用站点
log_info "启用Nginx站点..."
if [[ -d "/etc/nginx/sites-enabled" ]]; then
    # Ubuntu/Debian方式
    ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/"
    
    # 移除默认站点（可选）
    read -p "是否移除Nginx默认站点? (y/N): " REMOVE_DEFAULT
    if [[ "$REMOVE_DEFAULT" =~ ^[Yy]$ ]]; then
        rm -f /etc/nginx/sites-enabled/default
        log_info "已移除默认站点"
    fi
else
    # CentOS/RHEL方式
    if ! grep -q "include /etc/nginx/sites-available/$DOMAIN" /etc/nginx/nginx.conf; then
        echo "include /etc/nginx/sites-available/$DOMAIN;" >> /etc/nginx/nginx.conf
    fi
fi

# 5. 测试Nginx配置
log_info "测试Nginx配置..."
if nginx -t; then
    log_info "Nginx配置测试通过"
else
    log_error "Nginx配置测试失败，请检查配置"
    exit 1
fi

# 6. 重启Nginx
log_info "重启Nginx..."
systemctl restart nginx

# 7. 检查应用是否运行
log_info "检查应用状态..."
if systemctl is-active --quiet activation-code-system; then
    log_info "应用服务运行正常"
else
    log_warn "应用服务未运行，请先启动应用"
    echo "启动命令: systemctl start activation-code-system"
fi

# 8. 配置防火墙
log_info "配置防火墙..."
if command -v ufw >/dev/null 2>&1; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    log_info "UFW防火墙规则已添加"
elif command -v firewall-cmd >/dev/null 2>&1; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    log_info "Firewalld防火墙规则已添加"
fi

# 9. 测试域名访问
log_info "测试域名访问..."
sleep 3

if curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "200\|301\|302"; then
    log_info "域名访问测试成功！"
else
    log_warn "域名访问测试失败，请检查："
    echo "1. DNS解析是否生效"
    echo "2. 应用是否正常运行"
    echo "3. 防火墙是否已开放80端口"
fi

# 10. SSL证书配置提示
echo ""
log_info "域名基础配置完成！"
echo -e "${BLUE}访问地址: http://$DOMAIN${NC}"
echo ""

read -p "是否现在配置SSL证书 (Let's Encrypt)? (y/N): " SETUP_SSL
if [[ "$SETUP_SSL" =~ ^[Yy]$ ]]; then
    # 安装Certbot
    log_info "安装Certbot..."
    if command -v apt >/dev/null 2>&1; then
        apt update
        apt install -y certbot python3-certbot-nginx
    elif command -v yum >/dev/null 2>&1; then
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    fi
    
    # 获取SSL证书
    log_info "获取SSL证书..."
    if certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"; then
        log_info "SSL证书配置成功！"
        echo -e "${GREEN}HTTPS访问地址: https://$DOMAIN${NC}"
        
        # 设置自动续期
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        log_info "SSL证书自动续期已配置"
    else
        log_error "SSL证书配置失败"
    fi
fi

echo ""
echo "🎉 域名配置完成！"
echo ""
echo "📋 配置信息:"
echo "• 域名: $DOMAIN"
echo "• 应用端口: $PORT"
echo "• Nginx配置: /etc/nginx/sites-available/$DOMAIN"
echo "• 访问日志: /var/log/nginx/${DOMAIN}_access.log"
echo "• 错误日志: /var/log/nginx/${DOMAIN}_error.log"
echo ""
echo "🔗 访问地址:"
echo "• HTTP: http://$DOMAIN"
if [[ "$SETUP_SSL" =~ ^[Yy]$ ]]; then
    echo "• HTTPS: https://$DOMAIN"
fi
echo ""
echo "🛠️ 管理命令:"
echo "• 重启Nginx: systemctl restart nginx"
echo "• 查看Nginx状态: systemctl status nginx"
echo "• 测试配置: nginx -t"
echo "• 查看访问日志: tail -f /var/log/nginx/${DOMAIN}_access.log"
