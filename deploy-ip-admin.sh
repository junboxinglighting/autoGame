#!/bin/bash
# 适配admin用户+IP访问的自动部署脚本
# 服务器IP: 8.148.184.5
# 仅支持admin用户，无域名、无SSL

set -e
set -o pipefail

PROJECT_NAME="activation-code-system"
SERVICE_NAME="activation-code-system"
APP_USER="admin"
PROJECT_DIR="/opt/$PROJECT_NAME"
LOG_FILE="/var/log/$PROJECT_NAME/deploy.log"

# 日志函数
log() {
    echo -e "[\033[0;32m$(date +'%Y-%m-%d %H:%M:%S')\033[0m] $1" | tee -a "$LOG_FILE"
}

# 检查root权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log "此脚本需要root权限运行"
        exit 1
    fi
}

# 创建目录
setup_directories() {
    mkdir -p "$PROJECT_DIR" "$PROJECT_DIR/current" "/var/log/$PROJECT_NAME"
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR" "/var/log/$PROJECT_NAME"
}

# 安装依赖
install_dependencies() {
    apt-get update
    apt-get install -y curl wget git build-essential nginx nodejs npm
    npm install -g pm2
}

# 拉取/更新代码
update_code() {
    if [[ ! -d "$PROJECT_DIR/current/.git" ]]; then
        git clone https://github.com/your-username/activation-code-system.git "$PROJECT_DIR/current"
    else
        cd "$PROJECT_DIR/current"
        git pull
    fi
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR/current"
}

# 安装Node依赖
install_node_modules() {
    cd "$PROJECT_DIR/current"
    sudo -u $APP_USER npm install --cache=/tmp/.npm-cache
}

# 配置环境变量
setup_env() {
    cat > "$PROJECT_DIR/current/.env.production" << EOF
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=activation_user
DB_PASSWORD=your_secure_database_password
DB_NAME=activation_codes
APP_DOMAIN=http://8.148.184.5
PAYMENT_CALLBACK_URL=http://8.148.184.5/api/payment/callback
LOG_LEVEL=info
EOF
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/.env.production"
    chmod 600 "$PROJECT_DIR/current/.env.production"
}

# 配置PM2
setup_pm2() {
    cd "$PROJECT_DIR/current"
    sudo -u $APP_USER pm2 delete $SERVICE_NAME 2>/dev/null || true
    sudo -u $APP_USER pm2 start app.js --name $SERVICE_NAME
    sudo -u $APP_USER pm2 save
    pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
}

# 配置Nginx
setup_nginx() {
    cp "$PWD/nginx-ip.conf" /etc/nginx/sites-available/$PROJECT_NAME
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
}

main() {
    check_root
    log "开始部署..."
    setup_directories
    install_dependencies
    update_code
    install_node_modules
    setup_env
    setup_pm2
    setup_nginx
    log "部署完成！可通过 http://8.148.184.5 访问"
}

main
