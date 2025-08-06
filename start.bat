@echo off
chcp 65001 >nul

echo 🚀 激活码管理系统启动脚本
echo ==================================

:: 检查Node.js是否安装
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js 版本检查通过: 
node -v

:: 检查MySQL是否安装
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MySQL 未安装，请确保已安装 MySQL 8.0+
)

:: 安装依赖
echo 📦 安装项目依赖...
npm install

:: 检查环境变量文件
if not exist ".env" (
    if exist ".env.example" (
        echo 📝 复制环境变量文件...
        copy .env.example .env
        echo ⚠️  请编辑 .env 文件配置数据库等信息
    ) else (
        echo ❌ 环境变量文件不存在，请创建 .env 文件
        pause
        exit /b 1
    )
)

:: 询问是否初始化数据库
set /p choice=🗄️  是否需要初始化数据库？(y/N): 
if /i "%choice%"=="y" (
    echo 🔧 初始化数据库...
    echo 请手动执行以下命令初始化数据库：
    echo mysql -u root -p your_database_name ^< database/init.sql
    echo mysql -u root -p your_database_name ^< database/insert_admin.sql
    pause
)

:: 构建项目
echo 🔨 构建项目...
npm run build

:: 启动应用
echo 🎉 启动应用...
echo ==================================
echo 📍 访问地址: http://localhost:3000
echo 👤 管理员账户: admin / admin123
echo ⚠️  首次登录请修改默认密码
echo ==================================

npm run preview
