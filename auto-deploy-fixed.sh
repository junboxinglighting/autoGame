#!/bin/bash

# 激活码管理系统自动部署脚本 v3.0 - 修复版本
# 专门针对 www.ymzxjb.top 域名优化
# 修复了语法错误，确保部署成功

set -e  # 遇到错误立即退出
set -o pipefail  # 管道命令任一失败则整个命令失败

# ==========================================
# 全局变量和配置
# ==========================================

VERSION="3.0.1-fixed"
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
    --domain DOMAIN          域名 (例如: www.ymzxjb.top)
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
    --version                显示版本信息
    --help                   显示此帮助信息

示例:
    $0 --domain="www.ymzxjb.top" --ssl --email="admin@ymzxjb.top"
    $0 --domain www.ymzxjb.top --ssl --email admin@ymzxjb.top
    $0 --port=8080 --mode=development
    $0 --port 8080 --mode development

注意: 参数可以使用 --key=value 或 --key value 两种格式

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
    
    log_success "目录结构创建完成"
}

# 检查并处理包管理器锁定问题
check_package_lock() {
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
        log_info "检查包管理器锁定状态..."
        
        # 检查是否有apt进程在运行
        if pgrep -x apt > /dev/null || pgrep -x apt-get > /dev/null || pgrep -x dpkg > /dev/null; then
            log_warn "检测到包管理器正在运行，等待其完成..."
            
            # 等待最多5分钟
            local max_wait=300
            local wait_time=0
            
            while (pgrep -x apt > /dev/null || pgrep -x apt-get > /dev/null || pgrep -x dpkg > /dev/null) && [ $wait_time -lt $max_wait ]; do
                log_info "等待包管理器完成... ($wait_time/$max_wait 秒)"
                sleep 10
                wait_time=$((wait_time + 10))
            done
            
            if [ $wait_time -ge $max_wait ]; then
                log_error "等待超时，尝试解决锁定问题..."
                
                # 安全地处理锁定文件
                if [ -f /var/lib/dpkg/lock-frontend ]; then
                    sudo fuser -vki /var/lib/dpkg/lock-frontend 2>/dev/null || true
                    sudo rm -f /var/lib/dpkg/lock-frontend
                fi
                
                if [ -f /var/lib/apt/lists/lock ]; then
                    sudo fuser -vki /var/lib/apt/lists/lock 2>/dev/null || true
                    sudo rm -f /var/lib/apt/lists/lock
                fi
                
                if [ -f /var/cache/apt/archives/lock ]; then
                    sudo fuser -vki /var/cache/apt/archives/lock 2>/dev/null || true
                    sudo rm -f /var/cache/apt/archives/lock
                fi
                
                # 修复可能的损坏
                sudo dpkg --configure -a
                log_info "包管理器锁定问题已处理"
            else
                log_success "包管理器已就绪"
            fi
        else
            log_info "包管理器状态正常"
        fi
    fi
}

# 安装系统依赖
install_system_dependencies() {
    log_info "安装系统依赖..."
    
    # 检查包管理器锁定
    check_package_lock
    
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
        basic_packages=("curl" "wget" "git" "unzip" "gcc" "gcc-c++" "make" "gnupg" "redhat-lsb-core")
    fi
    
    for package in "${basic_packages[@]}"; do
        log_info "安装: $package"
        $INSTALL_CMD "$package" || log_warn "安装 $package 失败，继续..."
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
    
    # 检查包管理器锁定
    check_package_lock
    
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
    
    # 检查包管理器锁定
    check_package_lock
    
    # 安装PostgreSQL
    if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
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
    sudo -u postgres createdb "$DB_NAME" 2>/dev/null || log_warn "数据库可能已存在"
    sudo -u postgres createuser "$DB_USER" 2>/dev/null || log_warn "用户可能已存在"
    
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
    
    # 检查包管理器锁定
    check_package_lock
    
    $INSTALL_CMD nginx
    
    # 启动并启用服务
    systemctl enable nginx
    systemctl start nginx
    
    log_success "Nginx安装完成"
}

# 配置Nginx（针对www.ymzxjb.top优化）
setup_nginx_proxy() {
    if [[ "$NGINX_ENABLED" != "true" ]]; then
        return 0
    fi
    
    log "配置Nginx反向代理..."
    
    local domain="${DOMAIN:-localhost}"
    local config_name="activation-codes"
    
    # 针对www.ymzxjb.top的特殊优化配置
    if [[ "$domain" == "www.ymzxjb.top" ]]; then
        log "检测到ymzxjb.top域名，应用专门优化配置..."
        
        cat > "/etc/nginx/sites-available/$config_name" << 'EOF'
# www.ymzxjb.top 激活码管理系统配置

# 根域名重定向到www子域名
server {
    listen 80;
    server_name ymzxjb.top;
    return 301 http://www.ymzxjb.top$request_uri;
}

# 主配置 - www子域名
server {
    listen 80;
    server_name www.ymzxjb.top;
    
    # 安全头设置
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 日志配置
    access_log /var/log/nginx/ymzxjb_access.log;
    error_log /var/log/nginx/ymzxjb_error.log warn;
    
    # 请求大小限制
    client_max_body_size 10M;
    
    # 主应用反向代理
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API接口优化
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 禁用API缓存
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 静态资源优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }
    
    # 安全 - 禁止访问敏感文件
    location ~ /\.(git|env|config) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 全局Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/json
        application/javascript;
}
EOF
    else
        # 通用配置
        cat > "/etc/nginx/sites-available/$config_name" << EOF
server {
    listen 80;
    server_name $domain;
    
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    fi
    
    # 启用站点
    if [[ -d "/etc/nginx/sites-enabled" ]]; then
        rm -f /etc/nginx/sites-enabled/default
        ln -sf "/etc/nginx/sites-available/$config_name" "/etc/nginx/sites-enabled/"
    fi
    
    # 测试并重载配置
    nginx -t && systemctl reload nginx
    
    log "Nginx配置完成"
}

# 部署应用代码
deploy_application() {
    log_info "部署应用代码..."
    
    # 创建简单的应用结构
    mkdir -p "$PROJECT_DIR/current"
    cd "$PROJECT_DIR/current"
    
    # 首先设置正确的目录所有者
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR"
    
    # 创建基本的package.json
    cat > package.json << 'EOF'
{
  "name": "activation-code-system",
  "version": "1.0.0",
  "description": "激活码管理系统",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  }
}
EOF
    
    # 确保package.json也有正确的所有者
    chown $APP_USER:$APP_USER package.json
    
    # 以app用户身份安装依赖，并指定缓存目录
    log_info "安装Node.js依赖包..."
    sudo -u $APP_USER -H bash -c "cd '$PROJECT_DIR/current' && npm install --cache=/tmp/.npm-cache"
    
    log_success "应用代码部署完成"
}

# 创建基础应用文件
create_basic_app() {
    log_info "创建基础应用文件..."
    
    cd "$PROJECT_DIR/current"
    
    # 创建主应用文件
    cat > app.js << 'EOF'
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基本路由
app.get('/', (req, res) => {
    res.json({ 
        message: '激活码管理系统运行正常',
        version: '1.0.0',
        time: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        time: new Date().toISOString()
    });
});

// 管理界面
app.get('/admin', (req, res) => {
    res.json({ 
        message: '管理界面',
        status: 'ok'
    });
});

// API路由
app.get('/api/admin/stats', (req, res) => {
    res.json({
        totalCodes: 0,
        activeCodes: 0,
        usedCodes: 0,
        lastUpdated: new Date().toISOString()
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ 
        error: '页面未找到',
        path: req.path 
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: '服务器内部错误' 
    });
});

app.listen(PORT, () => {
    console.log(`激活码管理系统运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
});
EOF
    
    # 确保所有文件都有正确的所有者和权限
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR"
    chmod -R 755 "$PROJECT_DIR"
    chmod 644 "$PROJECT_DIR/current/app.js"
    
    log_success "基础应用文件创建完成"
}

# 配置环境变量
configure_environment() {
    log_info "配置环境变量..."
    
    cat > "$PROJECT_DIR/current/.env" << EOF
# 生产环境配置
NODE_ENV=${MODE:-production}
PORT=$PORT

# 数据库配置
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-activation_codes}
DB_USER=${DB_USER:-activation_user}
DB_PASSWORD=$DB_PASS

# 安全配置
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# 域名配置
DOMAIN=${DOMAIN:-localhost}

# 日志配置
LOG_LEVEL=info
EOF
    
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/.env"
    chmod 600 "$PROJECT_DIR/current/.env"
    
    log_success "环境配置完成"
}

# 配置PM2
setup_pm2() {
    log_info "配置PM2..."
    
    cat > "$PROJECT_DIR/current/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: './app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: '${MODE:-production}',
      PORT: $PORT
    },
    error_file: '/var/log/$PROJECT_NAME/error.log',
    out_file: '/var/log/$PROJECT_NAME/out.log',
    log_file: '/var/log/$PROJECT_NAME/app.log'
  }]
};
EOF
    
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/ecosystem.config.js"
    
    log_success "PM2配置完成"
}

# 检查域名DNS配置
check_domain_dns() {
    if [[ -z "$DOMAIN" ]] || [[ "$DOMAIN" == "localhost" ]]; then
        return 0
    fi
    
    log_info "检查域名DNS配置..."
    
    # 获取服务器公网IP
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || curl -s icanhazip.com 2>/dev/null)
    
    if [[ -z "$SERVER_IP" ]]; then
        log_warn "无法获取服务器公网IP，跳过DNS检查"
        return 1
    fi
    
    log_info "服务器IP: $SERVER_IP"
    
    # 检查www域名
    if [[ "$DOMAIN" == "www.ymzxjb.top" ]]; then
        WWW_IP=$(dig +short A www.ymzxjb.top 2>/dev/null | head -1)
        ROOT_IP=$(dig +short A ymzxjb.top 2>/dev/null | head -1)
        
        if [[ "$WWW_IP" == "$SERVER_IP" ]]; then
            log_success "www.ymzxjb.top DNS记录正确"
            WWW_DNS_OK=true
        else
            log_warn "www.ymzxjb.top DNS记录不匹配 (当前: $WWW_IP, 需要: $SERVER_IP)"
            WWW_DNS_OK=false
        fi
        
        if [[ "$ROOT_IP" == "$SERVER_IP" ]]; then
            log_success "ymzxjb.top DNS记录正确"
            ROOT_DNS_OK=true
        else
            log_warn "ymzxjb.top DNS记录不匹配 (当前: $ROOT_IP, 需要: $SERVER_IP)"
            ROOT_DNS_OK=false
        fi
    else
        # 检查单个域名
        DOMAIN_IP=$(dig +short A "$DOMAIN" 2>/dev/null | head -1)
        if [[ "$DOMAIN_IP" == "$SERVER_IP" ]]; then
            log_success "$DOMAIN DNS记录正确"
            WWW_DNS_OK=true
            ROOT_DNS_OK=false
        else
            log_warn "$DOMAIN DNS记录不匹配 (当前: $DOMAIN_IP, 需要: $SERVER_IP)"
            WWW_DNS_OK=false
            ROOT_DNS_OK=false
        fi
    fi
}

# 设置SSL证书
setup_ssl() {
    if [[ "$SSL_ENABLED" != "true" ]] || [[ -z "$DOMAIN" ]] || [[ "$DOMAIN" == "localhost" ]]; then
        return 0
    fi
    
    log_info "配置SSL证书..."
    
    # 安装Certbot
    if ! command -v certbot &> /dev/null; then
        # 检查包管理器锁定
        check_package_lock
        
        if [[ "$PACKAGE_MANAGER" == "apt" ]]; then
            $INSTALL_CMD certbot python3-certbot-nginx
        else
            $INSTALL_CMD epel-release
            $INSTALL_CMD certbot python3-certbot-nginx
        fi
    fi
    
    # 检查DNS配置
    check_domain_dns
    
    # 获取SSL证书
    EMAIL="${SSL_EMAIL:-admin@ymzxjb.top}"
    
    if [[ "$DOMAIN" == "www.ymzxjb.top" ]]; then
        if [[ "$WWW_DNS_OK" == "true" && "$ROOT_DNS_OK" == "true" ]]; then
            log_info "为 www.ymzxjb.top 和 ymzxjb.top 申请SSL证书..."
            certbot --nginx -d "$DOMAIN" -d "ymzxjb.top" \
                --non-interactive --agree-tos --email "$EMAIL"
        elif [[ "$WWW_DNS_OK" == "true" ]]; then
            log_info "只为 www.ymzxjb.top 申请SSL证书 (根域名DNS未配置)..."
            certbot --nginx -d "$DOMAIN" \
                --non-interactive --agree-tos --email "$EMAIL"
        else
            log_error "域名DNS配置有问题，跳过SSL证书申请"
            log_info "请检查域名DNS设置后手动运行: certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive"
            return 1
        fi
    else
        if [[ "$WWW_DNS_OK" == "true" ]]; then
            log_info "为 $DOMAIN 申请SSL证书..."
            certbot --nginx -d "$DOMAIN" \
                --non-interactive --agree-tos --email "$EMAIL"
        else
            log_error "域名 $DOMAIN DNS配置有问题，跳过SSL证书申请"
            log_info "请检查域名DNS设置后手动运行: certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive"
            return 1
        fi
    fi
    
    if [[ $? -eq 0 ]]; then
        log_success "SSL证书配置成功"
        # 设置自动续期
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    else
        log_warn "SSL证书配置失败，继续使用HTTP"
        log_info "你可以稍后手动配置SSL："
        if [[ "$DOMAIN" == "www.ymzxjb.top" ]]; then
            log_info "sudo certbot --nginx -d www.ymzxjb.top -d ymzxjb.top --email $EMAIL --agree-tos --non-interactive"
        else
            log_info "sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive"
        fi
    fi
}

# 启动服务
start_services() {
    log_info "启动应用服务..."
    
    cd "$PROJECT_DIR/current"
    
    # 确保所有文件权限正确
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR"
    
    # 确保app用户对home目录有权限
    if [[ ! -d "/home/$APP_USER" ]]; then
        mkdir -p "/home/$APP_USER"
        chown $APP_USER:$APP_USER "/home/$APP_USER"
    fi
    
    # 启动PM2
    sudo -u $APP_USER pm2 delete $SERVICE_NAME 2>/dev/null || true
    sudo -u $APP_USER -H bash -c "cd '$PROJECT_DIR/current' && pm2 start ecosystem.config.js"
    sudo -u $APP_USER pm2 save
    
    # 配置PM2开机自启
    env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
    
    log_success "应用服务启动完成"
}

# 配置防火墙
setup_firewall() {
    log_info "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
        log_info "UFW防火墙配置完成"
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        log_info "Firewalld防火墙配置完成"
    fi
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

# 显示部署总结
show_deployment_summary() {
    echo ""
    echo "=================================="
    log_success "🎉 部署完成！"
    echo "=================================="
    echo ""
    
    echo "📋 部署信息："
    echo "• 项目名称: $PROJECT_NAME"
    echo "• 应用端口: $PORT"  
    echo "• 数据库: $DB_NAME"
    echo "• 项目目录: $PROJECT_DIR"
    echo ""
    
    echo "🔗 访问地址："
    if [[ -n "$DOMAIN" && "$DOMAIN" != "localhost" ]]; then
        if [[ "$SSL_ENABLED" == "true" ]]; then
            echo "• 主站: https://$DOMAIN"
            echo "• 管理界面: https://$DOMAIN/admin"
            echo "• API接口: https://$DOMAIN/api/admin/stats"
        else
            echo "• 主站: http://$DOMAIN"
            echo "• 管理界面: http://$DOMAIN/admin"
            echo "• API接口: http://$DOMAIN/api/admin/stats"
        fi
    else
        echo "• 主站: http://localhost:$PORT"
        echo "• 管理界面: http://localhost:$PORT/admin"
        echo "• API接口: http://localhost:$PORT/api/admin/stats"
    fi
    echo ""
    
    echo "🛠️ 管理命令："
    echo "• 查看应用状态: sudo -u $APP_USER pm2 status"
    echo "• 重启应用: sudo -u $APP_USER pm2 restart $SERVICE_NAME"
    echo "• 查看应用日志: sudo -u $APP_USER pm2 logs $SERVICE_NAME"
    echo "• 查看Nginx状态: systemctl status nginx"
    echo ""
}

# 参数解析
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain=*)
                DOMAIN="${1#*=}"
                NGINX_ENABLED="true"
                shift
                ;;
            --domain)
                DOMAIN="$2"
                NGINX_ENABLED="true"
                shift 2
                ;;
            --port=*)
                PORT="${1#*=}"
                shift
                ;;
            --port)
                PORT="$2"
                shift 2
                ;;
            --mode=*)
                MODE="${1#*=}"
                shift
                ;;
            --mode)
                MODE="$2"
                shift 2
                ;;
            --ssl=*)
                SSL_ENABLED="${1#*=}"
                shift
                ;;
            --ssl)
                SSL_ENABLED="true"
                shift
                ;;
            --email=*)
                SSL_EMAIL="${1#*=}"
                shift
                ;;
            --email)
                SSL_EMAIL="$2"
                shift 2
                ;;
            --db-host=*)
                DB_HOST="${1#*=}"
                shift
                ;;
            --db-host)
                DB_HOST="$2"
                shift 2
                ;;
            --db-port=*)
                DB_PORT="${1#*=}"
                shift
                ;;
            --db-port)
                DB_PORT="$2"
                shift 2
                ;;
            --db-name=*)
                DB_NAME="${1#*=}"
                shift
                ;;
            --db-name)
                DB_NAME="$2"
                shift 2
                ;;
            --db-user=*)
                DB_USER="${1#*=}"
                shift
                ;;
            --db-user)
                DB_USER="$2"
                shift 2
                ;;
            --db-pass=*)
                DB_PASS="${1#*=}"
                shift
                ;;
            --db-pass)
                DB_PASS="$2"
                shift 2
                ;;
            --nginx)
                NGINX_ENABLED="true"
                shift
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
    # 创建日志文件
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    
    echo ""
    echo "=================================="
    log "🚀 激活码管理系统部署脚本 v$VERSION"
    echo "=================================="
    echo ""
    
    # 解析参数
    parse_arguments "$@"
    
    # 检查权限
    check_root
    
    # 开始部署
    log "开始部署流程..."
    
    detect_system
    install_system_dependencies
    create_app_user
    setup_directories
    install_nodejs
    install_postgresql
    setup_database
    install_nginx
    
    deploy_application
    create_basic_app
    configure_environment
    setup_pm2
    
    setup_nginx_proxy
    setup_ssl
    
    start_services
    setup_firewall
    
    # 健康检查
    if health_check; then
        show_deployment_summary
        log_info "🎉 部署成功完成！"
        exit 0
    else
        log_error "❌ 部署过程中遇到错误"
        log_info "请检查日志文件: $LOG_FILE"
        exit 1
    fi
}

# 执行主函数
main "$@"
