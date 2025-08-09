#!/bin/bash

# 一键上传并部署脚本
# 在本地运行此脚本，自动上传文件到服务器并执行部署

# 配置信息（请修改为你的服务器信息）
SERVER_IP="your-server-ip"
SERVER_USER="admin"
DOMAIN="www.ymzxjb.top"
PORT="3000"
EMAIL="admin@ymzxjb.top"

echo "🚀 开始一键部署到 $DOMAIN"
echo "服务器: $SERVER_USER@$SERVER_IP"
echo ""

# 检查本地文件
echo "📋 检查本地部署文件..."
required_files=("auto-deploy.sh" "optimize-nginx-for-ymzxjb.sh" "check-admin-permissions.sh")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done
echo ""

# 测试服务器连接
echo "🔌 测试服务器连接..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_IP exit 2>/dev/null; then
    echo "✅ 服务器连接成功"
else
    echo "❌ 无法连接到服务器，请检查："
    echo "   1. 服务器IP地址是否正确"
    echo "   2. SSH密钥是否已配置"
    echo "   3. 服务器是否在线"
    exit 1
fi
echo ""

# 上传文件
echo "📤 上传部署文件到服务器..."
for file in "${required_files[@]}"; do
    echo "上传 $file..."
    if scp "$file" "$SERVER_USER@$SERVER_IP:~/"; then
        echo "✅ $file 上传成功"
    else
        echo "❌ $file 上传失败"
        exit 1
    fi
done
echo ""

# 远程执行部署
echo "🎯 开始远程部署..."
ssh $SERVER_USER@$SERVER_IP << EOF
echo "🔧 设置脚本权限..."
chmod +x auto-deploy.sh optimize-nginx-for-ymzxjb.sh check-admin-permissions.sh

echo "🔍 运行环境检查..."
bash check-admin-permissions.sh

echo "🚀 开始部署激活码管理系统..."
sudo bash auto-deploy.sh --domain="$DOMAIN" --port=$PORT --mode=production --ssl=true --email="$EMAIL"

echo ""
echo "🎉 部署完成！"
echo "🔗 访问地址: https://$DOMAIN"
echo "🔧 管理界面: https://$DOMAIN/admin"
EOF

echo ""
echo "✅ 一键部署完成！"
echo "🌐 网站地址: https://$DOMAIN"
echo "🔧 管理地址: https://$DOMAIN/admin"
