#!/bin/bash

# 服务器部署指南 - 文件传输和部署
# 此脚本帮助你将本地脚本上传到服务器并运行

echo "🚀 www.ymzxjb.top 服务器部署指南"
echo "=================================="
echo ""

echo "📋 请按以下步骤操作："
echo ""

echo "1️⃣ 将脚本文件上传到服务器"
echo "   方法A: 使用SCP命令（在本地Windows上运行）"
echo "   scp auto-deploy.sh admin@your-server-ip:~/"
echo "   scp optimize-nginx-for-ymzxjb.sh admin@your-server-ip:~/"
echo "   scp check-admin-permissions.sh admin@your-server-ip:~/"
echo ""

echo "   方法B: 使用SFTP工具（WinSCP、FileZilla等）"
echo "   - 连接到服务器"
echo "   - 上传 auto-deploy.sh 到服务器的 /home/admin/ 目录"
echo ""

echo "   方法C: 直接在服务器上下载"
echo "   wget https://raw.githubusercontent.com/your-repo/activation-code-system/main/auto-deploy.sh"
echo ""

echo "2️⃣ SSH登录到服务器"
echo "   ssh admin@your-server-ip"
echo ""

echo "3️⃣ 在服务器上设置脚本权限"
echo "   chmod +x auto-deploy.sh"
echo "   chmod +x optimize-nginx-for-ymzxjb.sh"
echo "   chmod +x check-admin-permissions.sh"
echo ""

echo "4️⃣ 运行环境检查（可选）"
echo "   bash check-admin-permissions.sh"
echo ""

echo "5️⃣ 运行部署脚本"
echo "   sudo bash auto-deploy.sh --domain=\"www.ymzxjb.top\" --port=3000 --mode=production --ssl=true --email=\"admin@ymzxjb.top\""
echo ""

echo "⚠️  注意事项："
echo "   - 确保在服务器上运行命令，不是在本地Windows上"
echo "   - 确保脚本文件已上传到服务器"
echo "   - 确保admin用户有sudo权限"
echo "   - 确保DNS解析已生效"
echo ""

echo "🔍 故障排除："
echo "   如果仍然提示文件不存在："
echo "   pwd                    # 查看当前目录"
echo "   ls -la *.sh           # 查看脚本文件"
echo "   whoami                # 确认当前用户"
echo ""
