#!/bin/bash
# 适配admin用户+IP访问的自动部署脚本（修正版，解决nodejs/npm冲突、权限、依赖等问题）
# 服务器IP: 8.148.184.5
# 仅支持admin用户，无域名、无SSL

set -e
set -o pipefail

PROJECT_NAME="activation-code-system"
SERVICE_NAME="activation-code-system"
APP_USER="admin"
PROJECT_DIR="/opt/$PROJECT_NAME"
LOG_FILE="/var/log/$PROJECT_NAME/deploy.log"
REPO_URL="https://github.com/junboxinglighting/autoGame.git"

log() {
    mkdir -p "/var/log/$PROJECT_NAME" 2>/dev/null || true
    echo -e "[\033[0;32m$(date +'%Y-%m-%d %H:%M:%S')\033[0m] $1" | tee -a "$LOG_FILE"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log "此脚本需要root权限运行"
        exit 1
    fi
}

setup_directories() {
    mkdir -p "$PROJECT_DIR" "$PROJECT_DIR/current" "/var/log/$PROJECT_NAME"
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR" "/var/log/$PROJECT_NAME"
}

remove_apt_node_npm() {
    log "卸载系统自带nodejs和npm..."
    apt-get remove -y nodejs npm || true
}

install_node18() {
    log "安装Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    node -v
    npm -v
    log "升级npm到最新版..."
    npm install -g npm@latest
    npm config set registry https://registry.npmmirror.com
}

install_dependencies() {
    log "安装基础依赖..."
    apt-get update
    apt-get install -y curl wget git build-essential nginx
}

update_code() {
    if [[ ! -d "$PROJECT_DIR/current/.git" ]]; then
        git clone "$REPO_URL" "$PROJECT_DIR/current"
    else
        cd "$PROJECT_DIR/current"
        git pull
    fi
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR/current"
}

install_node_modules() {
    cd "$PROJECT_DIR/current"
    rm -rf node_modules package-lock.json
    sudo -u $APP_USER npm install
    sudo chown -R $APP_USER:$APP_USER node_modules
    chmod -R 755 node_modules
    chmod -R 755 node_modules/.bin || true
}

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

setup_pm2() {
    cd "$PROJECT_DIR/current"
    sudo -u $APP_USER pm2 delete $SERVICE_NAME 2>/dev/null || true
    sudo -u $APP_USER pm2 start app.js --name $SERVICE_NAME || sudo -u $APP_USER pm2 start .output/server/index.mjs --name $SERVICE_NAME
    sudo -u $APP_USER pm2 save
    pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
}

setup_nginx() {
    cp "$PWD/nginx-ip.conf" /etc/nginx/sites-available/$PROJECT_NAME
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
}

main() {
    check_root
    log "开始部署..."
    setup_directories
    remove_apt_node_npm
    install_node18
    install_dependencies
    update_code
    install_node_modules
    setup_env
    setup_pm2
    setup_nginx
    log "部署完成！可通过 http://8.148.184.5 访问"
}

main
