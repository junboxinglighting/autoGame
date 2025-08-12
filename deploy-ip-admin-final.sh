#!/bin/bash
# 适配admin用户+IP访问的自动部署脚本（最终版，适配Node18+npm10，无npm11升级）
# 服务器IP: 8.148.184.5
# 仅支持admin用户，无域名、无SSL

set -e
set -o pipefail

PROJECT_NAME="activation-code-system"
SERVICE_NAME="activation-code-system"
#!/bin/bash
# 优化部署脚本：自动 clone、进入目录、用用户目录全局安装 pm2、自动 build 并启动

REPO_URL="https://github.com/junboxinglighting/autoGame.git"
REPO_DIR="$HOME/autoGame"

echo "[1/8] 检查 Node.js 版本："
node -v

echo "[2/8] 检查 npm 版本："
npm -v

echo "[3/8] 设置 npm 镜像源为淘宝镜像..."
npm config set registry https://registry.npmmirror.com

# 4. clone 仓库（如不存在）
if [ ! -d "$REPO_DIR" ]; then
    echo "项目目录 $REPO_DIR 不存在，自动 clone..."
    git clone "$REPO_URL" "$REPO_DIR"
fi
cd "$REPO_DIR"

# 5. 拉取最新代码
echo "[4/8] 拉取最新代码..."
git pull



# 6. 清理依赖并安装
echo "[5/8] 清理依赖并安装..."
rm -rf node_modules package-lock.json
# 安装依赖前修复 .bin 权限（防止残留）
chmod -R 755 node_modules/.bin || true
npm install
# 安装后再次修复 .bin 权限
chmod -R 755 node_modules/.bin

# 7. 构建项目
echo "[6/8] 构建项目..."
npm run build

# 8. 配置 npm 全局包目录到用户目录，避免权限问题
if [ ! -d "$HOME/.npm-global" ]; then
    mkdir -p "$HOME/.npm-global"
    npm config set prefix "$HOME/.npm-global"
    echo 'export PATH=$HOME/.npm-global/bin:$PATH' >> "$HOME/.profile"
    source "$HOME/.profile"
fi

# 9. 安装 pm2 到用户目录
echo "[7/8] 安装 pm2..."
npm install -g pm2

# 10. 启动服务
echo "[8/8] 启动服务..."
pm2 delete all || true
pm2 start .output/server/index.mjs --name nuxt-app

echo "部署完成！"
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
