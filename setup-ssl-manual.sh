#!/bin/bash

# SSL证书手动配置脚本
# 用于在DNS配置完成后申请SSL证书

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
echo "🔐 SSL证书手动配置工具"
echo "=================================="
echo ""

# 默认配置
DOMAIN="${1:-www.ymzxjb.top}"
EMAIL="${2:-admin@ymzxjb.top}"

log_info "域名: $DOMAIN"
log_info "邮箱: $EMAIL"
echo ""

# 检查Certbot是否安装
if ! command -v certbot &> /dev/null; then
    log_info "安装Certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# 检查Nginx是否运行
if ! systemctl is-active --quiet nginx; then
    log_error "Nginx未运行，正在启动..."
    systemctl start nginx
    if ! systemctl is-active --quiet nginx; then
        log_error "Nginx启动失败"
        exit 1
    fi
fi

log_success "Nginx运行正常"

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)
log_info "服务器IP: $SERVER_IP"

# 检查域名解析
echo ""
log_info "检查域名解析..."

check_dns() {
    local domain=$1
    local ip=$(dig +short A $domain | head -1)
    
    if [[ -n "$ip" ]]; then
        if [[ "$ip" == "$SERVER_IP" ]]; then
            log_success "$domain → $ip ✓"
            return 0
        else
            log_warn "$domain → $ip (不匹配服务器IP)"
            return 1
        fi
    else
        log_error "$domain 没有A记录"
        return 1
    fi
}

# 检查域名
if [[ "$DOMAIN" == "www.ymzxjb.top" ]]; then
    WWW_OK=0
    ROOT_OK=0
    
    if check_dns "www.ymzxjb.top"; then
        WWW_OK=1
    fi
    
    if check_dns "ymzxjb.top"; then
        ROOT_OK=1
    fi
    
    echo ""
    
    if [[ $WWW_OK -eq 1 && $ROOT_OK -eq 1 ]]; then
        log_info "为 www.ymzxjb.top 和 ymzxjb.top 申请SSL证书..."
        certbot --nginx -d www.ymzxjb.top -d ymzxjb.top \
            --non-interactive --agree-tos --email "$EMAIL"
    elif [[ $WWW_OK -eq 1 ]]; then
        log_info "只为 www.ymzxjb.top 申请SSL证书..."
        certbot --nginx -d www.ymzxjb.top \
            --non-interactive --agree-tos --email "$EMAIL"
    else
        log_error "域名DNS配置有问题，无法申请证书"
        echo ""
        echo "请确保以下DNS记录配置正确："
        echo "A    @      $SERVER_IP"
        echo "A    www    $SERVER_IP" 
        echo ""
        echo "配置完成后等待5-30分钟，然后重新运行此脚本"
        exit 1
    fi
else
    if check_dns "$DOMAIN"; then
        log_info "为 $DOMAIN 申请SSL证书..."
        certbot --nginx -d "$DOMAIN" \
            --non-interactive --agree-tos --email "$EMAIL"
    else
        log_error "$DOMAIN DNS配置有问题，无法申请证书"
        echo ""
        echo "请确保DNS记录配置正确："
        echo "A    your-domain    $SERVER_IP"
        echo ""
        echo "配置完成后等待5-30分钟，然后重新运行此脚本"
        exit 1
    fi
fi

if [[ $? -eq 0 ]]; then
    echo ""
    log_success "🎉 SSL证书申请成功！"
    
    # 设置自动续期
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    log_success "已设置证书自动续期"
    
    # 重新加载Nginx
    systemctl reload nginx
    log_success "Nginx配置已重新加载"
    
    echo ""
    echo "🔗 现在可以通过HTTPS访问："
    if [[ "$DOMAIN" == "www.ymzxjb.top" ]]; then
        echo "• https://www.ymzxjb.top"
        echo "• https://ymzxjb.top (如果根域名DNS也配置了)"
    else
        echo "• https://$DOMAIN"
    fi
    echo ""
    
else
    echo ""
    log_error "❌ SSL证书申请失败"
    echo ""
    echo "📋 故障排除："
    echo "1. 检查域名DNS配置是否正确"
    echo "2. 确保防火墙开放80和443端口"
    echo "3. 查看详细错误日志："
    echo "   sudo tail -f /var/log/letsencrypt/letsencrypt.log"
    echo ""
    echo "📞 如需帮助，请运行："
    echo "   sudo certbot --nginx -d $DOMAIN -v"
    echo ""
fi
