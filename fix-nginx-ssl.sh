#!/bin/bash

# 修复Nginx SSL配置脚本
# 解决根域名 ymzxjb.top 的SSL申请问题

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 检查root权限
if [[ $EUID -ne 0 ]]; then
    log_error "此脚本需要root权限运行"
    echo "请使用: sudo $0"
    exit 1
fi

echo ""
echo "=================================="
echo "🔧 修复Nginx SSL配置"
echo "=================================="
echo ""

# 备份现有配置
log_info "备份现有Nginx配置..."
cp /etc/nginx/sites-available/activation-codes /etc/nginx/sites-available/activation-codes.backup.$(date +%Y%m%d_%H%M%S)

# 创建修复后的配置
log_info "创建修复后的Nginx配置..."

cat > /etc/nginx/sites-available/activation-codes << 'EOF'
# www.ymzxjb.top 激活码管理系统配置 - 修复版

# 根域名配置 - 用于SSL验证和重定向
server {
    listen 80;
    server_name ymzxjb.top;
    
    # SSL验证路径 - 重要！
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri $uri/ =404;
    }
    
    # 其他请求重定向到www
    location / {
        return 301 http://www.ymzxjb.top$request_uri;
    }
}

# www子域名配置
server {
    listen 80;
    server_name www.ymzxjb.top;
    
    # SSL验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri $uri/ =404;
    }
    
    # 安全头设置
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 日志配置
    access_log /var/log/nginx/ymzxjb_access.log;
    error_log /var/log/nginx/ymzxjb_error.log warn;
    
    # 请求大小限制
    client_max_body_size 10M;
    
    # 主应用反向代理
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
    
    # API接口优化
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 禁用API缓存
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 静态资源优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }
    
    # 安全 - 禁止访问敏感文件
    location ~ /\.(git|env|config) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 全局Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/json
        application/javascript;
}
EOF

# 确保SSL验证目录存在
log_info "创建SSL验证目录..."
mkdir -p /var/www/html/.well-known/acme-challenge
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

# 测试配置
log_info "测试Nginx配置..."
if nginx -t; then
    log_success "Nginx配置语法正确"
else
    log_error "Nginx配置有错误"
    exit 1
fi

# 重新加载配置
log_info "重新加载Nginx配置..."
systemctl reload nginx

if systemctl is-active --quiet nginx; then
    log_success "Nginx重新加载成功"
else
    log_error "Nginx重新加载失败"
    exit 1
fi

echo ""
echo "🔐 现在可以申请SSL证书了："
echo ""

# 先为www域名申请
log_info "为 www.ymzxjb.top 申请SSL证书..."
certbot --nginx -d www.ymzxjb.top --email admin@ymzxjb.top --agree-tos --non-interactive

if [[ $? -eq 0 ]]; then
    log_success "www.ymzxjb.top SSL证书申请成功"
    
    # 再为根域名申请
    echo ""
    log_info "为 ymzxjb.top 申请SSL证书..."
    certbot --nginx -d ymzxjb.top --email admin@ymzxjb.top --agree-tos --non-interactive
    
    if [[ $? -eq 0 ]]; then
        log_success "ymzxjb.top SSL证书申请成功"
        
        # 设置自动续期
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        log_success "已设置证书自动续期"
        
        echo ""
        echo "🎉 SSL配置完成！"
        echo "现在可以通过以下地址访问："
        echo "• https://www.ymzxjb.top"
        echo "• https://ymzxjb.top"
        echo ""
        
    else
        log_warn "根域名SSL申请失败，但www域名可用"
        echo "你仍然可以通过 https://www.ymzxjb.top 访问"
    fi
else
    log_error "SSL证书申请失败"
    echo ""
    echo "🔍 故障排除建议："
    echo "1. 检查应用是否正在运行: sudo -u app pm2 status"
    echo "2. 检查端口3000是否被占用: sudo netstat -tlnp | grep :3000"
    echo "3. 查看详细错误: sudo certbot --nginx -d www.ymzxjb.top -v"
fi

echo ""
log_info "配置完成！"
