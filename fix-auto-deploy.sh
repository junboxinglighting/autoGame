#!/bin/bash

# 语法检查和修复脚本
# 检查auto-deploy.sh的语法并尝试修复常见问题

echo "🔍 检查 auto-deploy.sh 语法问题..."

# 检查文件是否存在
if [ ! -f "auto-deploy.sh" ]; then
    echo "❌ auto-deploy.sh 文件不存在"
    exit 1
fi

echo "📋 文件信息:"
echo "文件大小: $(wc -c < auto-deploy.sh) 字节"
echo "行数: $(wc -l < auto-deploy.sh)"
echo ""

# 创建修复后的文件
echo "🔧 创建修复版本..."

# 检查并修复常见的语法问题
cat > auto-deploy-fixed.sh << 'FIXED_EOF'
#!/bin/bash

# 激活码管理系统自动部署脚本 v3.0
# 支持生产环境部署，包含SSL、监控、日志管理等企业级功能

set -e  # 遇到错误立即退出
set -o pipefail  # 管道命令任一失败则整个命令失败

# ==========================================
# 全局变量和配置
# ==========================================

VERSION="3.0.1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
LOG_FILE="/var/log/activation-deploy.log"
PROJECT_NAME="activation-code-system"
SERVICE_NAME="activation-code-system"
APP_USER="app"
PROJECT_DIR="/opt/$PROJECT_NAME"
BACKUP_DIR="/opt/backups/$PROJECT_NAME"
CONFIG_FILE="/etc/$PROJECT_NAME/config.conf"

# 默认配置
DEFAULT_PORT=3000
DEFAULT_DB_PORT=5432
DEFAULT_NODE_VERSION="18"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ==========================================
# 日志和输出函数
# ==========================================

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# ==========================================
# 辅助函数
# ==========================================

# 显示帮助信息
show_help() {
    cat << EOF
激活码管理系统部署脚本 v$VERSION

用法: $0 [选项]

选项:
    --domain DOMAIN          域名 (例如: www.example.com)
    --port PORT              应用端口 (默认: 3000)
    --mode MODE              部署模式: development|production (默认: production)
    --ssl                    启用SSL证书
    --email EMAIL            SSL证书邮箱
    --db-host HOST           数据库主机 (默认: localhost)
    --db-port PORT           数据库端口 (默认: 5432)
    --db-name NAME           数据库名称 (默认: activation_codes)
    --db-user USER           数据库用户 (默认: activation_user)
    --db-pass PASS           数据库密码
    --nginx                  启用Nginx反向代理
    --monitoring             启用系统监控
    --backup                 启用自动备份
    --rollback               回滚到上一个版本
    --uninstall              完全卸载系统
    --version                显示版本信息
    --help                   显示此帮助信息

示例:
    $0 --domain="www.example.com" --ssl --email="admin@example.com"
    $0 --port=8080 --mode=development
    $0 --rollback

EOF
}

# 检查root权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要root权限运行"
        log_info "请使用: sudo $0 [选项]"
        exit 1
    fi
}

# 创建必要目录
setup_directories() {
    log_info "创建系统目录..."
    
    directories=(
        "$PROJECT_DIR"
        "$PROJECT_DIR/releases"
        "$PROJECT_DIR/shared"
        "$PROJECT_DIR/shared/logs"
        "$PROJECT_DIR/shared/uploads" 
        "$BACKUP_DIR"
        "/etc/$PROJECT_NAME"
        "/var/log/$PROJECT_NAME"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        log_info "创建目录: $dir"
    done
    
    # 设置权限
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR"
    chown -R $APP_USER:$APP_USER "/var/log/$PROJECT_NAME"
    
    log_success "目录结构创建完成"
}

# 系统环境检测
detect_system() {
    log_info "检测系统环境..."
    
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        OS_VERSION=$VERSION_ID
        log_info "操作系统: $OS $OS_VERSION"
    else
        log_error "无法检测操作系统"
        exit 1
    fi
    
    # 检测包管理器
    if command -v apt &> /dev/null; then
        PACKAGE_MANAGER="apt"
        INSTALL_CMD="apt-get install -y"
        UPDATE_CMD="apt-get update"
    elif command -v yum &> /dev/null; then
        PACKAGE_MANAGER="yum"
        INSTALL_CMD="yum install -y"
        UPDATE_CMD="yum update -y"
    elif command -v dnf &> /dev/null; then
        PACKAGE_MANAGER="dnf"
        INSTALL_CMD="dnf install -y"
        UPDATE_CMD="dnf update -y"
    else
        log_error "不支持的包管理器"
        exit 1
    fi
    
    log_info "包管理器: $PACKAGE_MANAGER"
    
    # 检测架构
    ARCH=$(uname -m)
    log_info "系统架构: $ARCH"
    
    # 检测内存
    TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    log_info "系统内存: ${TOTAL_MEM}MB"
    
    if [ "$TOTAL_MEM" -lt 1024 ]; then
        log_warn "系统内存少于1GB，可能影响性能"
    fi
}

# 安装系统依赖
install_system_dependencies() {
    log_info "安装系统依赖..."
    
    $UPDATE_CMD
    
    # 基础工具
    basic_packages=(
        "curl"
        "wget" 
        "git"
        "unzip"
        "build-essential"
        "software-properties-common"
        "apt-transport-https"
        "ca-certificates"
        "gnupg"
        "lsb-release"
    )
    
    # 根据不同系统调整包名
    if [[ "$PACKAGE_MANAGER" == "yum" ]] || [[ "$PACKAGE_MANAGER" == "dnf" ]]; then
        basic_packages=("${basic_packages[@]/build-essential/gcc gcc-c++ make}")
        basic_packages=("${basic_packages[@]/software-properties-common/}")
        basic_packages=("${basic_packages[@]/apt-transport-https/}")
        basic_packages=("${basic_packages[@]/lsb-release/redhat-lsb-core}")
    fi
    
    for package in "${basic_packages[@]}"; do
        if [[ -n "$package" ]]; then
            log_info "安装: $package"
            $INSTALL_CMD "$package" || log_warn "安装 $package 失败，继续..."
        fi
    done
    
    log_success "系统依赖安装完成"
}

# 创建应用用户
create_app_user() {
    log_info "创建应用用户..."
    
    if ! id "$APP_USER" &>/dev/null; then
        useradd -r -m -s /bin/bash "$APP_USER"
        log_info "用户 $APP_USER 创建成功"
    else
        log_info "用户 $APP_USER 已存在"
    fi
    
    # 添加到必要的组
    usermod -a -G www-data "$APP_USER" 2>/dev/null || true
    
    log_success "应用用户配置完成"
}

# 安装Node.js
install_nodejs() {
    log_info "安装Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | sed 's/v//')
        log_info "Node.js已安装，版本: $NODE_VERSION"
        
        # 检查版本是否满足要求
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
        if [ "$NODE_MAJOR" -ge "$DEFAULT_NODE_VERSION" ]; then
            log_success "Node.js版本满足要求"
            return 0
        else
            log_warn "Node.js版本过低，需要升级"
        fi
    fi
    
    # 安装Node.js
    curl -fsSL https://deb.nodesource.com/setup_${DEFAULT_NODE_VERSION}.x | bash -
    $INSTALL_CMD nodejs
    
    # 验证安装
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        log_success "Node.js安装完成: $NODE_VERSION, npm: $NPM_VERSION"
    else
        log_error "Node.js安装失败"
        exit 1
    fi
    
    # 安装PM2
    npm install -g pm2
    log_success "PM2安装完成"
}

# 安装PostgreSQL
install_postgresql() {
    log_info "安装PostgreSQL..."
    
    if command -v psql &> /dev/null; then
        PG_VERSION=$(psql --version | awk '{print $3}')
        log_info "PostgreSQL已安装，版本: $PG_VERSION"
        return 0
    fi
    
    # 安装PostgreSQL
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        # 添加官方仓库
        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
        echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
        apt-get update
        $INSTALL_CMD postgresql postgresql-contrib
    else
        $INSTALL_CMD postgresql postgresql-server postgresql-contrib
        postgresql-setup --initdb
    fi
    
    # 启动服务
    systemctl enable postgresql
    systemctl start postgresql
    
    log_success "PostgreSQL安装完成"
}

# 配置数据库
setup_database() {
    log_info "配置数据库..."
    
    # 设置默认值
    DB_HOST="${DB_HOST:-localhost}"
    DB_PORT="${DB_PORT:-$DEFAULT_DB_PORT}"
    DB_NAME="${DB_NAME:-activation_codes}"
    DB_USER="${DB_USER:-activation_user}"
    
    # 生成随机密码（如果未提供）
    if [[ -z "$DB_PASS" ]]; then
        DB_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
        log_info "生成数据库密码: $DB_PASS"
    fi
    
    # 创建数据库和用户
    sudo -u postgres createdb "$DB_NAME" || log_warn "数据库可能已存在"
    sudo -u postgres createuser "$DB_USER" || log_warn "用户可能已存在"
    
    # 设置用户密码和权限
    sudo -u postgres psql << EOF
ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
EOF
    
    log_success "数据库配置完成"
}

# 安装Nginx
install_nginx() {
    if [[ "$NGINX_ENABLED" != "true" ]]; then
        return 0
    fi
    
    log_info "安装Nginx..."
    
    if command -v nginx &> /dev/null; then
        log_info "Nginx已安装"
        return 0
    fi
    
    $INSTALL_CMD nginx
    
    # 启动并启用服务
    systemctl enable nginx
    systemctl start nginx
    
    log_success "Nginx安装完成"
}

# 配置Nginx
setup_nginx_proxy() {
    if [[ "$NGINX_ENABLED" != "true" ]]; then
        return 0
    fi
    
    log "配置Nginx反向代理（优化域名处理）..."
    
    # 域名优化处理
    local domain="${DOMAIN:-localhost}"
    local root_domain
    local config_name="$SERVICE_NAME"
    
    # 如果域名以www开头，提取根域名用于配置优化
    if [[ "$domain" == www.* ]]; then
        root_domain="${domain#www.}"
        config_name="${root_domain//./-}"
    else
        root_domain="$domain"
        config_name="${domain//./-}"
        # 如果不是localhost且不以www开头，建议使用www
        if [[ "$domain" != "localhost" ]]; then
            domain="www.$domain"
        fi
    fi
    
    # 创建优化的Nginx配置
    if [[ "$domain" == "www.ymzxjb.top" ]]; then
        log "检测到ymzxjb.top域名，应用特别优化配置..."
        
        cat > "/etc/nginx/sites-available/$config_name" << EOF
# www.ymzxjb.top 激活码管理系统配置

# 根域名重定向到www子域名
server {
    listen 80;
    server_name $root_domain;
    return 301 http://www.$root_domain\$request_uri;
}

# 主配置 - www子域名
server {
    listen 80;
    server_name $domain;
    
    # 安全头设置
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    
    # 日志配置
    access_log /var/log/nginx/${config_name}_access.log;
    error_log /var/log/nginx/${config_name}_error.log warn;
    
    # 请求大小限制
    client_max_body_size 10M;
    
    # 主应用反向代理
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$server_name;
        proxy_cache_bypass \$http_upgrade;
        
        # 优化超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲优化
        proxy_buffering on;
        proxy_buffer_size 8k;
        proxy_buffers 8 8k;
        proxy_busy_buffers_size 16k;
        
        # 错误处理
        proxy_intercept_errors on;
        error_page 502 503 504 /50x.html;
    }
    
    # API接口优化
    location /api/ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # API专用超时
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # 禁用API缓存
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 管理界面
    location /admin {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 管理界面安全
        add_header X-Frame-Options "SAMEORIGIN";
    }
    
    # 静态资源优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        
        # 长期缓存
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # 压缩设置
        gzip on;
        gzip_vary on;
        gzip_comp_level 6;
        gzip_types
            text/css
            application/javascript
            application/json
            image/svg+xml
            font/woff
            font/woff2;
    }
    
    # 健康检查端点
    location /health {
        proxy_pass http://127.0.0.1:$PORT/health;
        proxy_set_header Host \$host;
        access_log off;
        
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
    }
    
    # 安全 - 禁止访问敏感文件
    location ~ /\.(git|env|config) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ /(node_modules|\.nuxt|\.output) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 错误页面
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }
    
    # 全局Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF
    else
        # 通用配置（适用于其他域名）
        cat > "/etc/nginx/sites-available/$config_name" << EOF
server {
    listen 80;
    server_name $domain;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # 日志
    access_log /var/log/nginx/${config_name}_access.log;
    error_log /var/log/nginx/${config_name}_error.log;
    
    # 反向代理到Node.js应用
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)\$ {
        proxy_pass http://127.0.0.1:$PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:$PORT/health;
        access_log off;
    }
}
EOF
    fi
    
    # 启用站点配置
    SERVICE_CONFIG_NAME="$config_name"
    
    # 启用站点配置
    if [ -d "/etc/nginx/sites-enabled" ]; then
        # Ubuntu/Debian方式
        if [ -f "/etc/nginx/sites-enabled/default" ]; then
            rm -f /etc/nginx/sites-enabled/default
            log "已移除默认站点"
        fi
        
        ln -sf "/etc/nginx/sites-available/$SERVICE_CONFIG_NAME" "/etc/nginx/sites-enabled/"
        log "已启用站点配置: $SERVICE_CONFIG_NAME"
    else
        # CentOS/RHEL方式
        if ! grep -q "include /etc/nginx/sites-available/$SERVICE_CONFIG_NAME" /etc/nginx/nginx.conf; then
            echo "include /etc/nginx/sites-available/$SERVICE_CONFIG_NAME;" >> /etc/nginx/nginx.conf
            log "已添加配置到nginx.conf"
        fi
    fi
    
    # 测试配置
    nginx -t || {
        log_error "Nginx配置测试失败"
        exit 1
    }
    
    # 重新加载Nginx
    systemctl reload nginx
    
    log "Nginx配置完成"
}

# 部署应用代码
deploy_application() {
    log_info "部署应用代码..."
    
    RELEASE_DIR="$PROJECT_DIR/releases/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$RELEASE_DIR"
    
    # 从Git仓库克隆或从本地复制代码
    if [[ -n "$GIT_REPO" ]]; then
        log_info "从Git仓库部署: $GIT_REPO"
        git clone "$GIT_REPO" "$RELEASE_DIR"
        cd "$RELEASE_DIR"
        git checkout "${GIT_BRANCH:-main}"
    else
        log_info "复制本地代码..."
        cp -r "$SCRIPT_DIR"/* "$RELEASE_DIR/"
    fi
    
    cd "$RELEASE_DIR"
    
    # 安装依赖
    log_info "安装Node.js依赖..."
    sudo -u $APP_USER npm ci --production
    
    # 构建应用（如果需要）
    if [[ -f "package.json" ]] && grep -q "build" package.json; then
        log_info "构建应用..."
        sudo -u $APP_USER npm run build
    fi
    
    # 创建软链接
    ln -sfn "$RELEASE_DIR" "$PROJECT_DIR/current"
    chown -h $APP_USER:$APP_USER "$PROJECT_DIR/current"
    
    log_success "应用代码部署完成"
}

# 配置应用环境
configure_application() {
    log_info "配置应用环境..."
    
    # 创建环境配置文件
    cat > "$PROJECT_DIR/current/.env" << EOF
# 生产环境配置
NODE_ENV=${MODE:-production}
PORT=$PORT

# 数据库配置
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS

# 安全配置
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# 域名配置
DOMAIN=${DOMAIN:-localhost}
BASE_URL=${DOMAIN:+http://$DOMAIN}${DOMAIN:-http://localhost:$PORT}

# 日志配置
LOG_LEVEL=info
LOG_FILE=/var/log/$PROJECT_NAME/app.log

# 其他配置
UPLOAD_DIR=$PROJECT_DIR/shared/uploads
BACKUP_DIR=$BACKUP_DIR
EOF
    
    # 设置文件权限
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/.env"
    chmod 600 "$PROJECT_DIR/current/.env"
    
    # 创建PM2配置
    cat > "$PROJECT_DIR/current/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: './app.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: '${MODE:-production}',
      PORT: $PORT
    },
    error_file: '/var/log/$PROJECT_NAME/error.log',
    out_file: '/var/log/$PROJECT_NAME/out.log',
    log_file: '/var/log/$PROJECT_NAME/app.log',
    time: true
  }]
};
EOF
    
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/ecosystem.config.js"
    
    log_success "应用配置完成"
}

# 初始化数据库
initialize_database() {
    log_info "初始化数据库..."
    
    cd "$PROJECT_DIR/current"
    
    # 运行数据库迁移（如果存在）
    if [[ -f "migrations/init.sql" ]]; then
        log_info "执行数据库初始化脚本..."
        sudo -u postgres psql -d "$DB_NAME" < migrations/init.sql
    fi
    
    # 运行Node.js数据库初始化（如果存在）
    if [[ -f "scripts/init-db.js" ]]; then
        log_info "执行Node.js数据库初始化..."
        sudo -u $APP_USER node scripts/init-db.js
    fi
    
    log_success "数据库初始化完成"
}

# 设置SSL证书
setup_ssl() {
    if [[ "$SSL_ENABLED" != "true" ]] || [[ -z "$DOMAIN" ]] || [[ "$DOMAIN" == "localhost" ]]; then
        return 0
    fi
    
    log_info "配置SSL证书..."
    
    # 安装Certbot
    if ! command -v certbot &> /dev/null; then
        if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
            $INSTALL_CMD certbot python3-certbot-nginx
        else
            $INSTALL_CMD epel-release
            $INSTALL_CMD certbot python3-certbot-nginx
        fi
    fi
    
    # 获取SSL证书
    EMAIL="${SSL_EMAIL:-webmaster@$DOMAIN}"
    
    # 对于ymzxjb.top特殊处理
    if [[ "$DOMAIN" == "www.ymzxjb.top" ]]; then
        certbot --nginx -d "$DOMAIN" -d "ymzxjb.top" \
            --non-interactive --agree-tos --email "$EMAIL"
    else
        certbot --nginx -d "$DOMAIN" \
            --non-interactive --agree-tos --email "$EMAIL"
    fi
    
    if [[ $? -eq 0 ]]; then
        log_success "SSL证书配置成功"
        
        # 设置自动续期
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        log_info "SSL证书自动续期已配置"
        
        # 更新环境变量
        sed -i "s|BASE_URL=http://|BASE_URL=https://|" "$PROJECT_DIR/current/.env"
    else
        log_warn "SSL证书配置失败，继续使用HTTP"
    fi
}

# 创建系统服务
create_system_service() {
    log_info "创建系统服务..."
    
    cat > "/etc/systemd/system/$SERVICE_NAME.service" << EOF
[Unit]
Description=激活码管理系统
Documentation=https://github.com/your-repo/activation-code-system
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=forking
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$PROJECT_DIR/current
Environment=NODE_ENV=${MODE:-production}
Environment=PATH=/usr/bin:/usr/local/bin
ExecStart=/usr/local/bin/pm2 start ecosystem.config.js --no-daemon
ExecReload=/bin/kill -USR2 \$MAINPID
ExecStop=/usr/local/bin/pm2 stop ecosystem.config.js
Restart=always
RestartSec=10
KillMode=mixed
TimeoutStopSec=30

# 安全设置
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=$PROJECT_DIR /var/log/$PROJECT_NAME /tmp

# 资源限制
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
EOF
    
    # 重新加载systemd
    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    
    log "系统服务创建完成"
}

# 启动服务
start_services() {
    log "启动服务..."
    
    # 启动应用
    cd "$PROJECT_DIR/current"
    sudo -u $APP_USER pm2 delete $SERVICE_NAME 2>/dev/null || true
    sudo -u $APP_USER pm2 start ecosystem.config.js
    sudo -u $APP_USER pm2 save
    
    # 设置PM2开机自启
    pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
    
    # 启动系统服务
    systemctl start $SERVICE_NAME
    
    log "服务启动完成"
}

# 配置防火墙
setup_firewall() {
    log "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian - UFW
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL - FirewallD
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
    fi
    
    log "防火墙配置完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 等待服务启动
    sleep 10
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "http://localhost:$PORT/health" > /dev/null 2>&1; then
            log_success "应用健康检查通过"
            return 0
        fi
        
        log_info "健康检查失败，重试中... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log_error "应用健康检查失败"
    return 1
}

# 设置监控
setup_monitoring() {
    if [[ "$MONITORING_ENABLED" != "true" ]]; then
        return 0
    fi
    
    log_info "配置系统监控..."
    
    # 创建监控脚本
    cat > "/usr/local/bin/monitor-$SERVICE_NAME" << 'EOF'
#!/bin/bash

SERVICE_NAME="activation-code-system"
LOG_FILE="/var/log/$SERVICE_NAME/monitor.log"
ALERT_EMAIL="${ALERT_EMAIL:-admin@localhost}"

log_monitor() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

check_service() {
    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
        log_monitor "ERROR: Service $SERVICE_NAME is not running"
        systemctl restart "$SERVICE_NAME"
        log_monitor "INFO: Attempted to restart $SERVICE_NAME"
        return 1
    fi
    return 0
}

check_disk_space() {
    local usage=$(df / | awk 'NR==2 {print int($5)}')
    if [ "$usage" -gt 85 ]; then
        log_monitor "WARNING: Disk usage is at ${usage}%"
        return 1
    fi
    return 0
}

check_memory() {
    local usage=$(free | awk 'NR==2 {printf "%.0f", $3*100/$2}')
    if [ "$usage" -gt 90 ]; then
        log_monitor "WARNING: Memory usage is at ${usage}%"
        return 1
    fi
    return 0
}

# 执行检查
check_service
check_disk_space  
check_memory

log_monitor "INFO: Health check completed"
EOF
    
    chmod +x "/usr/local/bin/monitor-$SERVICE_NAME"
    
    # 添加到crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-$SERVICE_NAME") | crontab -
    
    log_success "系统监控配置完成"
}

# 设置备份
setup_backup() {
    if [[ "$BACKUP_ENABLED" != "true" ]]; then
        return 0
    fi
    
    log_info "配置自动备份..."
    
    # 创建备份脚本
    cat > "/usr/local/bin/backup-$SERVICE_NAME" << EOF
#!/bin/bash

PROJECT_NAME="$PROJECT_NAME"
BACKUP_DIR="$BACKUP_DIR"
DB_NAME="$DB_NAME"
RETENTION_DAYS=7

BACKUP_DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\$BACKUP_DIR/backup_\$BACKUP_DATE.tar.gz"

# 创建备份目录
mkdir -p "\$BACKUP_DIR"

# 备份数据库
sudo -u postgres pg_dump "\$DB_NAME" > "\$BACKUP_DIR/db_\$BACKUP_DATE.sql"

# 备份应用文件
tar -czf "\$BACKUP_FILE" -C "$PROJECT_DIR" current shared

# 清理过期备份
find "\$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +\$RETENTION_DAYS -delete
find "\$BACKUP_DIR" -name "db_*.sql" -mtime +\$RETENTION_DAYS -delete

echo "\$(date): Backup completed - \$BACKUP_FILE" >> "\$BACKUP_DIR/backup.log"
EOF
    
    chmod +x "/usr/local/bin/backup-$SERVICE_NAME"
    
    # 添加到crontab（每日2点备份）
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-$SERVICE_NAME") | crontab -
    
    log_success "自动备份配置完成"
}

# 清理和优化
cleanup_and_optimize() {
    log_info "系统清理和优化..."
    
    # 清理旧的发布版本（保留最近3个）
    if [[ -d "$PROJECT_DIR/releases" ]]; then
        cd "$PROJECT_DIR/releases"
        ls -t | tail -n +4 | xargs -r rm -rf
        log_info "清理了旧的发布版本"
    fi
    
    # 清理包管理器缓存
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        apt-get autoremove -y
        apt-get autoclean
    elif [[ "$PACKAGE_MANAGER" == "yum" ]]; then
        yum clean all
    fi
    
    # 设置日志轮转
    cat > "/etc/logrotate.d/$SERVICE_NAME" << EOF
/var/log/$PROJECT_NAME/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
    
    log_success "系统清理和优化完成"
}

# 显示部署总结
show_deployment_summary() {
    local deployment_time=$((SECONDS / 60))
    
    echo ""
    echo "=================================="
    log_success "🎉 部署完成！"
    echo "=================================="
    echo ""
    
    echo "📋 部署信息总结："
    echo "• 项目名称: $PROJECT_NAME"
    echo "• 部署模式: ${MODE:-production}"
    echo "• 应用端口: $PORT"
    echo "• 数据库: $DB_NAME ($DB_HOST:$DB_PORT)"
    echo "• 项目目录: $PROJECT_DIR"
    echo "• 运行用户: $APP_USER"
    echo "• 部署时间: ${deployment_time} 分钟"
    echo ""
    
    echo "🔗 访问地址："
    if [[ -n "$DOMAIN" && "$DOMAIN" != "localhost" ]]; then
        if [[ "$SSL_ENABLED" == "true" ]]; then
            echo "• 主站: https://$DOMAIN"
            echo "• 管理界面: https://$DOMAIN/admin"
            echo "• API文档: https://$DOMAIN/api/docs"
        else
            echo "• 主站: http://$DOMAIN"
            echo "• 管理界面: http://$DOMAIN/admin"
            echo "• API文档: http://$DOMAIN/api/docs"
        fi
    else
        echo "• 主站: http://localhost:$PORT"
        echo "• 管理界面: http://localhost:$PORT/admin"
        echo "• API文档: http://localhost:$PORT/api/docs"
    fi
    echo ""
    
    echo "🛠️ 管理命令："
    echo "• 查看服务状态: systemctl status $SERVICE_NAME"
    echo "• 重启服务: systemctl restart $SERVICE_NAME"
    echo "• 查看日志: journalctl -u $SERVICE_NAME -f"
    echo "• 查看应用日志: tail -f /var/log/$PROJECT_NAME/app.log"
    if [[ "$NGINX_ENABLED" == "true" ]]; then
        echo "• 重启Nginx: systemctl restart nginx"
        echo "• 查看Nginx日志: tail -f /var/log/nginx/access.log"
    fi
    echo ""
    
    echo "📁 重要文件位置："
    echo "• 应用代码: $PROJECT_DIR/current"
    echo "• 配置文件: $PROJECT_DIR/current/.env"
    echo "• 日志目录: /var/log/$PROJECT_NAME/"
    if [[ "$BACKUP_ENABLED" == "true" ]]; then
        echo "• 备份目录: $BACKUP_DIR"
    fi
    echo ""
    
    echo "🔒 安全提醒："
    echo "• 请及时修改默认管理员密码"
    echo "• 定期更新系统和依赖包"
    echo "• 监控系统资源使用情况"
    echo "• 定期检查备份文件"
    echo ""
    
    echo "📞 技术支持："
    echo "• 项目文档: https://github.com/your-repo/activation-code-system"
    echo "• 问题反馈: https://github.com/your-repo/activation-code-system/issues"
    echo ""
}

# 回滚功能
rollback() {
    log_info "开始回滚..."
    
    if [[ ! -L "$PROJECT_DIR/current" ]]; then
        log_error "未找到当前部署，无法回滚"
        exit 1
    fi
    
    # 找到上一个版本
    local current_release=$(readlink "$PROJECT_DIR/current")
    local releases_dir="$PROJECT_DIR/releases"
    
    if [[ ! -d "$releases_dir" ]]; then
        log_error "未找到发布目录"
        exit 1
    fi
    
    local previous_release=$(ls -t "$releases_dir" | grep -v "$(basename "$current_release")" | head -1)
    
    if [[ -z "$previous_release" ]]; then
        log_error "未找到可回滚的版本"
        exit 1
    fi
    
    log_info "回滚到版本: $previous_release"
    
    # 停止服务
    systemctl stop $SERVICE_NAME
    
    # 更新软链接
    ln -sfn "$releases_dir/$previous_release" "$PROJECT_DIR/current"
    
    # 重启服务
    systemctl start $SERVICE_NAME
    
    log_success "回滚完成"
}

# 卸载功能
uninstall() {
    log_warn "开始卸载系统..."
    
    read -p "确认要完全卸载系统吗？(输入 'YES' 确认): " confirm
    if [[ "$confirm" != "YES" ]]; then
        log_info "取消卸载"
        exit 0
    fi
    
    # 停止服务
    systemctl stop $SERVICE_NAME || true
    systemctl disable $SERVICE_NAME || true
    
    # 删除系统服务文件
    rm -f "/etc/systemd/system/$SERVICE_NAME.service"
    systemctl daemon-reload
    
    # 删除应用文件
    rm -rf "$PROJECT_DIR"
    
    # 删除日志
    rm -rf "/var/log/$PROJECT_NAME"
    
    # 删除备份（可选）
    read -p "是否删除备份文件？(y/N): " delete_backup
    if [[ "$delete_backup" =~ ^[Yy]$ ]]; then
        rm -rf "$BACKUP_DIR"
    fi
    
    # 删除数据库
    read -p "是否删除数据库？(y/N): " delete_db
    if [[ "$delete_db" =~ ^[Yy]$ ]]; then
        sudo -u postgres dropdb "$DB_NAME" || true
        sudo -u postgres dropuser "$DB_USER" || true
    fi
    
    # 删除应用用户
    read -p "是否删除应用用户？(y/N): " delete_user
    if [[ "$delete_user" =~ ^[Yy]$ ]]; then
        userdel -r "$APP_USER" || true
    fi
    
    log_success "系统卸载完成"
}

# 参数解析
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                DOMAIN="$2"
                NGINX_ENABLED="true"
                shift 2
                ;;
            --port)
                PORT="$2"
                shift 2
                ;;
            --mode)
                MODE="$2"
                shift 2
                ;;
            --ssl)
                SSL_ENABLED="true"
                shift
                ;;
            --email)
                SSL_EMAIL="$2"
                shift 2
                ;;
            --db-host)
                DB_HOST="$2"
                shift 2
                ;;
            --db-port)
                DB_PORT="$2"
                shift 2
                ;;
            --db-name)
                DB_NAME="$2"
                shift 2
                ;;
            --db-user)
                DB_USER="$2"
                shift 2
                ;;
            --db-pass)
                DB_PASS="$2"
                shift 2
                ;;
            --nginx)
                NGINX_ENABLED="true"
                shift
                ;;
            --monitoring)
                MONITORING_ENABLED="true"
                shift
                ;;
            --backup)
                BACKUP_ENABLED="true"
                shift
                ;;
            --git-repo)
                GIT_REPO="$2"
                shift 2
                ;;
            --git-branch)
                GIT_BRANCH="$2"
                shift 2
                ;;
            --rollback)
                rollback
                exit 0
                ;;
            --uninstall)
                uninstall
                exit 0
                ;;
            --version)
                echo "激活码管理系统部署脚本 v$VERSION"
                exit 0
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 设置默认值
    PORT=${PORT:-$DEFAULT_PORT}
    MODE=${MODE:-production}
}

# 主函数
main() {
    # 开始计时
    SECONDS=0
    
    # 创建日志文件
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    
    echo ""
    echo "=================================="
    log "🚀 激活码管理系统部署脚本 v$VERSION"
    echo "=================================="
    echo ""
    
    # 解析命令行参数
    parse_arguments "$@"
    
    # 检查权限
    check_root
    
    # 系统检测
    detect_system
    
    # 执行部署步骤
    log "开始部署流程..."
    
    install_system_dependencies
    create_app_user
    setup_directories
    install_nodejs
    install_postgresql
    setup_database
    install_nginx
    
    deploy_application
    configure_application
    initialize_database
    
    setup_nginx_proxy
    setup_ssl
    
    create_system_service
    start_services
    
    setup_firewall
    setup_monitoring
    setup_backup
    
    cleanup_and_optimize
    
    # 健康检查
    if health_check; then
        show_deployment_summary
        
        echo ""
        log_info "下一步操作建议："
        log_info "1. 验证应用功能: curl http://localhost:$PORT"
        log_info "2. 查看应用日志: journalctl -u $SERVICE_NAME -f"
        log_info "3. 监控系统状态: systemctl status $SERVICE_NAME"
        log_info "4. 查看部署日志: cat $LOG_FILE"
        
        if [[ "$NGINX_ENABLED" == "true" && -n "$DOMAIN" ]]; then
            log_info "5. 配置 DNS 解析将 $DOMAIN 指向服务器 IP"
        fi
        
        exit 0
    else
        log_error "❌ 部署过程中遇到错误"
        log_info "请检查日志文件获取详细信息: $LOG_FILE"
        log_info "如需回滚，请运行: bash $0 --rollback"
        exit 1
    fi
}

# 执行主函数
main "$@"
FIXED_EOF

echo "✅ 修复版本已创建: auto-deploy-fixed.sh"
echo ""
echo "🔧 现在请运行修复版本："
echo "chmod +x auto-deploy-fixed.sh"
echo "sudo bash auto-deploy-fixed.sh --domain=\"www.ymzxjb.top\" --port=3000 --mode=production --ssl=true --email=\"admin@ymzxjb.top\""
