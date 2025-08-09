#!/bin/bash

# 检查admin用户权限和环境的脚本
# 在部署前运行此脚本验证环境

echo "🔍 检查当前用户和权限..."
echo "当前用户: $(whoami)"
echo "用户ID: $(id)"
echo ""

echo "🔐 检查sudo权限..."
if sudo -n true 2>/dev/null; then
    echo "✅ sudo权限可用（无需密码）"
elif sudo -l >/dev/null 2>&1; then
    echo "✅ sudo权限可用（可能需要密码）"
else
    echo "❌ 当前用户无sudo权限"
    exit 1
fi
echo ""

echo "📋 sudo权限详情:"
sudo -l 2>/dev/null || echo "需要输入密码查看详细权限"
echo ""

echo "🌐 检查域名解析..."
echo "检查 www.ymzxjb.top:"
nslookup www.ymzxjb.top 2>/dev/null | grep -A 2 "Non-authoritative answer:" || echo "⚠️ DNS解析可能有问题"

echo "检查 ymzxjb.top:"
nslookup ymzxjb.top 2>/dev/null | grep -A 2 "Non-authoritative answer:" || echo "⚠️ DNS解析可能有问题"
echo ""

echo "🔌 检查关键端口占用..."
echo "端口3000: $(sudo netstat -tlnp 2>/dev/null | grep :3000 || echo '未被占用')"
echo "端口80:   $(sudo netstat -tlnp 2>/dev/null | grep :80 || echo '未被占用')"
echo "端口443:  $(sudo netstat -tlnp 2>/dev/null | grep :443 || echo '未被占用')"
echo ""

echo "📦 检查必要命令..."
commands=("wget" "curl" "git")
for cmd in "${commands[@]}"; do
    if command -v $cmd >/dev/null 2>&1; then
        echo "✅ $cmd: $(command -v $cmd)"
    else
        echo "⚠️ $cmd: 未安装"
    fi
done
echo ""

echo "💾 检查磁盘空间..."
df -h | head -2
echo ""

echo "🧠 检查内存使用..."
free -h
echo ""

echo "🔥 检查防火墙状态..."
if command -v ufw >/dev/null 2>&1; then
    echo "UFW状态:"
    sudo ufw status 2>/dev/null || echo "UFW未配置或需要权限"
elif command -v firewall-cmd >/dev/null 2>&1; then
    echo "Firewalld状态:"
    sudo firewall-cmd --state 2>/dev/null || echo "Firewalld未运行或需要权限"
else
    echo "未检测到常用防火墙工具"
fi
echo ""

echo "🎯 环境检查完成！"
echo ""
echo "如果所有检查都通过，可以运行部署命令:"
echo "sudo bash auto-deploy.sh --domain=\"www.ymzxjb.top\" --port=3000 --mode=production --ssl=true --email=\"admin@ymzxjb.top\""
