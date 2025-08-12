#!/bin/bash
# 一键升级Node.js到18.x并重装npm依赖

set -e

PROJECT_DIR="/opt/activation-code-system/current"

echo "🚀 开始升级Node.js到18.x..."

# 1. 卸载旧版nodejs和npm
sudo apt-get remove -y nodejs npm || true

# 2. 安装Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 检查版本
node -v
npm -v

# 4. 设置国内npm镜像（可选，提升速度）
npm config set registry https://registry.npmmirror.com

# 5. 清理并重装依赖
cd "$PROJECT_DIR"
rm -rf node_modules package-lock.json
npm install

echo "✅ Node.js升级并依赖安装完成！"
node -v
npm -v
