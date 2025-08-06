#!/bin/bash
# 激活码系统快速部署脚本
# 使用方法: chmod +x quick-deploy.sh && ./quick-deploy.sh

set -e  # 遇到错误立即退出

# 配置变量
APP_NAME="activation-code-system"
APP_DIR="/home/appuser/$APP_NAME"
REPO_URL="https://github.com/your-repo/activation-code-system.git"
DB_NAME="activation_code_system"
DB_USER="activation_app"

echo "🚀 开始部署激活码验证系统..."

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo "❌ 请不要使用root用户运行此脚本"
    exit 1
fi

# 1. 检查必要工具
echo "📋 检查系统环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js版本过低 (当前: $(node -v))，需要18+"
    exit 1
fi

# 检查PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装PM2..."
    npm install -g pm2
fi

# 检查MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL未安装，请先安装MySQL 8.0+"
    exit 1
fi

echo "✅ 系统环境检查通过"

# 2. 克隆或更新代码
if [ -d "$APP_DIR" ]; then
    echo "📁 更新现有代码..."
    cd "$APP_DIR"
    
    # 备份当前版本
    BACKUP_DIR="/tmp/${APP_NAME}_backup_$(date +%Y%m%d_%H%M%S)"
    cp -r "$APP_DIR" "$BACKUP_DIR"
    echo "📦 已备份到: $BACKUP_DIR"
    
    git pull origin main
else
    echo "📥 克隆代码仓库..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 3. 安装依赖
echo "📦 安装依赖..."
npm ci

# 4. 配置环境变量
if [ ! -f ".env" ]; then
    echo "⚙️ 配置环境变量..."
    cat > .env << EOF
NODE_ENV=production
NITRO_PORT=3000
NITRO_HOST=127.0.0.1

# 数据库配置 - 请修改密码
DB_HOST=localhost
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=123321

# JWT密钥 - 请修改为随机字符串
JWT_SECRET=FF8VwiljqIFayBTOJJ/xZ+ajIbHDl9HSJYNYucMSLtA

# 应用配置
APP_NAME=激活码验证系统
APP_URL=https://your-domain.com
APP_DEBUG=false
EOF
    
    echo "⚠️  请编辑 .env 文件，修改数据库密码和JWT密钥"
    echo "   vim $APP_DIR/.env"
    read -p "配置完成后按回车继续..."
fi

# 5. 初始化数据库
echo "🗄️ 初始化数据库..."
read -s -p "请输入MySQL root密码: " MYSQL_ROOT_PASSWORD
echo

# 创建数据库和用户
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$(grep DB_PASSWORD .env | cut -d'=' -f2)';
GRANT SELECT, INSERT, UPDATE, DELETE ON $DB_NAME.* TO '$DB_USER'@'localhost';
GRANT EXECUTE ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SET GLOBAL event_scheduler = ON;
EOF

# 导入数据库结构
if [ -f "database/create_database.sql" ]; then
    echo "📊 导入数据库结构..."
    mysql -u "$DB_USER" -p"$(grep DB_PASSWORD .env | cut -d'=' -f2)" "$DB_NAME" < database/create_database.sql
fi

# 6. 构建应用
echo "🔨 构建应用..."
npm run build

# 检查构建结果
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建失败！找不到 .output/server/index.mjs"
    exit 1
fi

echo "✅ 构建成功"

# 7. 清理开发依赖
echo "🧹 清理开发依赖..."
npm prune --production

# 8. 创建日志目录
LOG_DIR="/var/log/$APP_NAME"
if [ ! -d "$LOG_DIR" ]; then
    sudo mkdir -p "$LOG_DIR"
    sudo chown "$(whoami):$(whoami)" "$LOG_DIR"
fi

# 9. 配置PM2
echo "⚙️ 配置PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: './.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      NITRO_PORT: 3000,
      NITRO_HOST: '127.0.0.1'
    },
    error_file: '$LOG_DIR/error.log',
    out_file: '$LOG_DIR/out.log',
    log_file: '$LOG_DIR/combined.log',
    time: true,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 5,
    autorestart: true,
    watch: false
  }]
}
EOF

# 10. 启动应用
echo "🚀 启动应用..."

# 停止现有进程（如果存在）
pm2 delete "$APP_NAME" 2>/dev/null || true

# 启动新进程
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启动
if ! pm2 startup | grep -q "already"; then
    echo "⚙️ 设置开机自启动..."
    pm2 startup | tail -1 | sudo bash
fi

# 11. 验证部署
echo "✅ 验证部署..."
sleep 5

if pm2 list | grep -q "$APP_NAME.*online"; then
    echo "🎉 部署成功！"
    echo ""
    echo "📊 应用状态:"
    pm2 list
    echo ""
    echo "📝 查看日志: pm2 logs $APP_NAME"
    echo "🔄 重启应用: pm2 restart $APP_NAME"
    echo "📈 监控应用: pm2 monit"
    echo ""
    echo "🌐 应用运行在: http://localhost:3000"
    echo "⚠️  请配置Nginx反向代理和SSL证书用于生产环境"
    echo ""
    echo "📚 详细配置请参考: docs/部署指南.md"
else
    echo "❌ 部署失败！应用未正常启动"
    echo "查看错误日志: pm2 logs $APP_NAME"
    exit 1
fi
