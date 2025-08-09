#!/bin/bash

# 快速修复ymzxjb.top SSL问题
# 专门针对当前403错误

echo "🚀 快速修复 ymzxjb.top SSL问题"
echo "=================================="

# 检查root权限
if [[ $EUID -ne 0 ]]; then
    echo "❌ 需要root权限，请使用: sudo $0"
    exit 1
fi

# 1. 创建SSL验证目录
echo "📁 创建SSL验证目录..."
mkdir -p /var/www/html/.well-known/acme-challenge
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

# 2. 检查当前Nginx配置
echo "🔍 检查当前Nginx配置..."
if grep -q "return 404" /etc/nginx/sites-available/activation-codes; then
    echo "⚠️  发现问题：Nginx配置中有return 404"
    
    # 创建临时修复配置
    echo "🔧 创建修复配置..."
    
    cat > /tmp/nginx-fix.conf << 'EOF'
# 临时修复配置 - 根域名
server {
    listen 80;
    server_name ymzxjb.top;
    
    # SSL验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri $uri/ =404;
    }
    
    # 临时主页（用于SSL验证）
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ @proxy;
    }
    
    # 代理到应用
    location @proxy {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# www域名配置保持不变
server {
    listen 80;
    server_name www.ymzxjb.top;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri $uri/ =404;
    }
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # 备份原配置
    cp /etc/nginx/sites-available/activation-codes /etc/nginx/sites-available/activation-codes.backup

    # 应用修复配置
    cp /tmp/nginx-fix.conf /etc/nginx/sites-available/activation-codes
    
    echo "✅ 配置已更新"
fi

# 3. 创建临时HTML文件
echo "📄 创建临时主页..."
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>ymzxjb.top</title>
</head>
<body>
    <h1>Welcome to ymzxjb.top</h1>
    <p>SSL verification in progress...</p>
</body>
</html>
EOF

# 4. 测试并重载Nginx
echo "🔄 重载Nginx配置..."
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx重载成功"
else
    echo "❌ Nginx配置有错误"
    exit 1
fi

# 5. 测试访问
echo "🌐 测试根域名访问..."
if curl -s -o /dev/null -w "%{http_code}" http://ymzxjb.top | grep -q "200"; then
    echo "✅ 根域名访问正常"
else
    echo "⚠️  根域名访问可能还有问题"
fi

echo ""
echo "🔐 现在尝试申请SSL证书..."
echo ""

# 6. 申请SSL证书
echo "📜 为 ymzxjb.top 申请SSL证书..."
certbot --nginx -d ymzxjb.top --email admin@ymzxjb.top --agree-tos --non-interactive

if [[ $? -eq 0 ]]; then
    echo ""
    echo "🎉 成功！SSL证书申请成功"
    echo "现在可以访问: https://ymzxjb.top"
    echo ""
    
    # 清理临时文件
    rm -f /tmp/nginx-fix.conf
    
else
    echo ""
    echo "❌ SSL申请仍然失败"
    echo ""
    echo "🔍 进一步诊断："
    
    # 测试SSL验证路径
    echo "测试SSL验证路径..."
    curl -I http://ymzxjb.top/.well-known/acme-challenge/test
    
    echo ""
    echo "📋 手动排查步骤："
    echo "1. 检查应用状态: sudo -u app pm2 status"
    echo "2. 检查Nginx状态: sudo systemctl status nginx"
    echo "3. 检查端口: sudo netstat -tlnp | grep :80"
    echo "4. 查看错误日志: sudo tail -f /var/log/nginx/error.log"
    echo ""
fi
