#!/bin/bash

# 针对 www.ymzxjb.top 域名的优化配置脚本
# 此脚本会优化Nginx配置以正确处理主域名和www子域名

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 域名配置
DOMAIN="www.ymzxjb.top"
ROOT_DOMAIN="ymzxjb.top"
PORT="${1:-3000}"  # 默认端口3000
SERVICE_NAME="activation-code-system"

log_info "开始为域名 $DOMAIN 优化Nginx配置"
log_info "应用端口: $PORT"

# 检查Nginx是否安装
if ! command -v nginx >/dev/null 2>&1; then
    log_info "安装Nginx..."
    if command -v apt >/dev/null 2>&1; then
        apt update && apt install -y nginx
    elif command -v yum >/dev/null 2>&1; then
        yum install -y nginx
    fi
    systemctl enable nginx
    systemctl start nginx
fi

# 创建优化的Nginx配置
log_info "创建优化的Nginx配置..."

cat > "/etc/nginx/sites-available/$ROOT_DOMAIN" << EOF
# www.ymzxjb.top 激活码管理系统 - 优化配置
# 包含主域名和根域名的完整处理

# 根域名重定向到www子域名
server {
    listen 80;
    server_name $ROOT_DOMAIN;
    
    # 重定向到www子域名
    return 301 http://www.$ROOT_DOMAIN\$request_uri;
}

# www子域名主配置
server {
    listen 80;
    server_name $DOMAIN;
    
    # 安全头设置
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    
    # 日志配置
    access_log /var/log/nginx/${ROOT_DOMAIN}_access.log;
    error_log /var/log/nginx/${ROOT_DOMAIN}_error.log warn;
    
    # 限制请求大小
    client_max_body_size 10M;
    
    # 主应用反向代理
    location / {
        # 检查上游服务器健康状态
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$server_name;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲设置优化
        proxy_buffering on;
        proxy_buffer_size 8k;
        proxy_buffers 8 8k;
        proxy_busy_buffers_size 16k;
        
        # 错误处理
        proxy_intercept_errors on;
        error_page 502 503 504 /50x.html;
    }
    
    # API接口专用配置
    location /api/ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # API专用超时（较短）
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # 禁用缓存
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 管理界面
    location /admin {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 管理界面安全设置
        add_header X-Frame-Options "SAMEORIGIN";
    }
    
    # 静态资源优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        
        # 长期缓存
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # 启用压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_comp_level 6;
        gzip_types
            text/css
            application/javascript
            application/json
            image/svg+xml
            font/woff
            font/woff2;
    }
    
    # 健康检查端点
    location /health {
        proxy_pass http://127.0.0.1:$PORT/health;
        proxy_set_header Host \$host;
        access_log off;
        
        # 健康检查专用设置
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
    }
    
    # 禁止访问敏感文件
    location ~ /\.(git|env|config) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ /(node_modules|\.nuxt|\.output) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 错误页面
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }
    
    # 全局Gzip配置
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

# 启用站点
if [[ -d "/etc/nginx/sites-enabled" ]]; then
    ln -sf "/etc/nginx/sites-available/$ROOT_DOMAIN" "/etc/nginx/sites-enabled/"
    
    # 移除默认站点
    if [[ -f "/etc/nginx/sites-enabled/default" ]]; then
        rm -f /etc/nginx/sites-enabled/default
        log_info "已移除Nginx默认站点"
    fi
else
    # CentOS/RHEL方式
    if ! grep -q "include /etc/nginx/sites-available/$ROOT_DOMAIN" /etc/nginx/nginx.conf; then
        echo "include /etc/nginx/sites-available/$ROOT_DOMAIN;" >> /etc/nginx/nginx.conf
    fi
fi

# 测试配置
log_info "测试Nginx配置..."
if nginx -t; then
    log_info "✅ Nginx配置测试通过"
    
    # 重启Nginx
    systemctl restart nginx
    log_info "✅ Nginx已重启"
else
    log_error "❌ Nginx配置测试失败"
    exit 1
fi

# 配置防火墙
log_info "配置防火墙..."
if command -v ufw >/dev/null 2>&1; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    log_info "✅ UFW防火墙规则已配置"
elif command -v firewall-cmd >/dev/null 2>&1; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    log_info "✅ Firewalld防火墙规则已配置"
fi

# 检查应用状态
log_info "检查应用状态..."
if systemctl is-active --quiet "$SERVICE_NAME"; then
    log_info "✅ 应用服务运行正常"
else
    log_warn "⚠️ 应用服务未运行，请确保已启动激活码系统"
fi

# 测试域名访问
log_info "测试域名访问..."
sleep 3

echo ""
log_info "🎉 Nginx配置优化完成！"
echo ""
echo "📋 配置信息:"
echo "• 主域名: $DOMAIN"  
echo "• 根域名: $ROOT_DOMAIN (自动重定向到www)"
echo "• 应用端口: $PORT"
echo "• 配置文件: /etc/nginx/sites-available/$ROOT_DOMAIN"
echo ""

echo "🔗 访问地址:"
echo "• http://$DOMAIN"
echo "• http://$ROOT_DOMAIN (自动跳转到www)"
echo "• 管理界面: http://$DOMAIN/admin"
echo "• API接口: http://$DOMAIN/api/admin/stats"
echo ""

echo "📊 验证命令:"
echo "curl -I http://$DOMAIN"
echo "curl -I http://$ROOT_DOMAIN"
echo ""

# 提供SSL配置选项
read -p "是否现在配置SSL证书? (y/N): " SETUP_SSL
if [[ "$SETUP_SSL" =~ ^[Yy]$ ]]; then
    log_info "配置SSL证书..."
    
    # 安装Certbot
    if ! command -v certbot >/dev/null 2>&1; then
        if command -v apt >/dev/null 2>&1; then
            apt install -y certbot python3-certbot-nginx
        elif command -v yum >/dev/null 2>&1; then
            yum install -y epel-release
            yum install -y certbot python3-certbot-nginx
        fi
    fi
    
    # 获取SSL证书
    if certbot --nginx -d "$DOMAIN" -d "$ROOT_DOMAIN" --non-interactive --agree-tos --email "admin@$ROOT_DOMAIN"; then
        log_info "🔒 SSL证书配置成功！"
        echo ""
        echo "🔗 HTTPS访问地址:"
        echo "• https://$DOMAIN"
        echo "• https://$ROOT_DOMAIN"
        
        # 设置自动续期
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        log_info "🔄 SSL证书自动续期已配置"
    else
        log_error "SSL证书配置失败，请检查DNS解析是否正确"
    fi
fi

echo ""
echo "🛠️ 管理命令:"
echo "• 重启Nginx: systemctl restart nginx"
echo "• 查看访问日志: tail -f /var/log/nginx/${ROOT_DOMAIN}_access.log"
echo "• 查看错误日志: tail -f /var/log/nginx/${ROOT_DOMAIN}_error.log"
echo "• 测试配置: nginx -t"
