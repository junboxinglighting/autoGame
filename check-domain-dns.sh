#!/bin/bash

# 域名DNS检查脚本
# 用于验证 ymzxjb.top 域名的DNS配置

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

echo ""
echo "=================================="
echo "🔍 域名DNS检查工具"
echo "=================================="
echo ""

# 获取服务器公网IP
log_info "获取服务器公网IP地址..."
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || curl -s icanhazip.com)

if [[ -n "$SERVER_IP" ]]; then
    log_success "服务器IP: $SERVER_IP"
else
    log_error "无法获取服务器IP地址"
    exit 1
fi

echo ""

# 检查域名解析
check_domain_dns() {
    local domain=$1
    log_info "检查域名解析: $domain"
    
    # 检查A记录
    A_RECORD=$(dig +short A $domain | head -1)
    if [[ -n "$A_RECORD" ]]; then
        if [[ "$A_RECORD" == "$SERVER_IP" ]]; then
            log_success "$domain A记录正确: $A_RECORD"
            return 0
        else
            log_error "$domain A记录错误: $A_RECORD (应该是: $SERVER_IP)"
            return 1
        fi
    else
        log_error "$domain 没有A记录"
        return 1
    fi
}

# 检查主要域名
echo "📍 检查域名解析状态："
echo ""

# 检查 www.ymzxjb.top
WWW_OK=0
if check_domain_dns "www.ymzxjb.top"; then
    WWW_OK=1
fi

echo ""

# 检查 ymzxjb.top (根域名)
ROOT_OK=0
if check_domain_dns "ymzxjb.top"; then
    ROOT_OK=1
fi

echo ""
echo "=================================="
echo "📊 检查结果总结"
echo "=================================="
echo ""

if [[ $WWW_OK -eq 1 && $ROOT_OK -eq 1 ]]; then
    log_success "✅ 所有域名解析正确，可以申请SSL证书"
    echo ""
    echo "🎯 建议的SSL申请命令："
    echo "sudo certbot --nginx -d www.ymzxjb.top -d ymzxjb.top --email admin@ymzxjb.top --agree-tos --non-interactive"
    
elif [[ $WWW_OK -eq 1 && $ROOT_OK -eq 0 ]]; then
    log_warn "⚠️  只有 www.ymzxjb.top 解析正确"
    echo ""
    echo "🎯 建议只为 www 子域名申请SSL："
    echo "sudo certbot --nginx -d www.ymzxjb.top --email admin@ymzxjb.top --agree-tos --non-interactive"
    
elif [[ $WWW_OK -eq 0 && $ROOT_OK -eq 1 ]]; then
    log_warn "⚠️  只有 ymzxjb.top 解析正确"
    echo ""
    echo "🎯 建议只为根域名申请SSL："
    echo "sudo certbot --nginx -d ymzxjb.top --email admin@ymzxjb.top --agree-tos --non-interactive"
    
else
    log_error "❌ 域名解析配置有问题"
    echo ""
    echo "🔧 需要在DNS服务商处配置以下记录："
    echo "类型: A"
    echo "主机: @"
    echo "值: $SERVER_IP"
    echo "TTL: 300"
    echo ""
    echo "类型: A" 
    echo "主机: www"
    echo "值: $SERVER_IP"
    echo "TTL: 300"
fi

echo ""
echo "🌐 DNS服务商配置指南："
echo "• 登录你的域名注册商或DNS服务商管理面板"
echo "• 找到DNS记录管理页面"
echo "• 添加/修改以下记录："
echo "  - A记录: @ → $SERVER_IP"
echo "  - A记录: www → $SERVER_IP"
echo "• 等待DNS传播（通常5-30分钟）"
echo ""
echo "🔍 验证方法："
echo "ping ymzxjb.top"
echo "ping www.ymzxjb.top"
echo ""
