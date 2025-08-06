#!/bin/bash

# 激活码管理系统启动脚本

set -e

echo "🚀 激活码管理系统启动脚本"
echo "=================================="

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，请安装 18+ 版本"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"

# 检查是否安装了MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL 未安装，请确保已安装 MySQL 8.0+"
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 检查环境变量文件
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📝 复制环境变量文件..."
        cp .env.example .env
        echo "⚠️  请编辑 .env 文件配置数据库等信息"
    else
        echo "❌ 环境变量文件不存在，请创建 .env 文件"
        exit 1
    fi
fi

# 询问是否初始化数据库
read -p "🗄️  是否需要初始化数据库？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 初始化数据库..."
    
    # 读取数据库配置
    source .env
    
    if [ -z "$DB_NAME" ]; then
        echo "❌ 数据库配置不完整，请检查 .env 文件"
        exit 1
    fi
    
    echo "正在初始化数据库结构..."
    mysql -u ${DB_USER:-root} -p${DB_PASSWORD} ${DB_NAME} < database/init.sql
    
    echo "正在插入默认管理员用户..."
    mysql -u ${DB_USER:-root} -p${DB_PASSWORD} ${DB_NAME} < database/insert_admin.sql
    
    echo "✅ 数据库初始化完成"
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 启动应用
echo "🎉 启动应用..."
echo "=================================="
echo "📍 访问地址: http://localhost:3000"
echo "👤 管理员账户: admin / admin123"
echo "⚠️  首次登录请修改默认密码"
echo "=================================="

npm run preview
