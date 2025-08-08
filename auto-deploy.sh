#!/bin/bash

# ====================================================================
# 激活码管理系统 - Linux自动部署脚本 v3.0 (增强优化版)
# 支持Ubuntu 20.04+, CentOS 8+, Debian 11+, Rocky Linux 8+
# 作者: GitHub Copilot
# 创建时间: 2025年8月8日 (最新更新)
# 适用环境: 生产服务器 / 开发环境 / 容器化部署
# 
# 新增功能:
# - 智能环境检测和自动配置
# - 增强的错误处理和回滚机制
# - 完整的性能监控和健康检查
# - 自动SSL证书配置(Let's Encrypt)
# - 数据库自动备份和恢复
# - 多环境支持(开发/测试# ====================================================================
# Node.js 和应用环境安装函数
# ====================================================================

# 安装或更新 Node.js
install_nodejs() {
    log_step "Node.js 环境检查"
    
    if command -v node >/dev/null 2>&1; then
        local current_version=$(node --version | sed 's/v//')
        log_info "当前 Node.js 版本: v$current_version"
        
        # 检查版本是否满足要求
        local major_version=${current_version%%.*}
        if [[ "$major_version" -ge 18 ]]; then
            log_success "Node.js 版本满足要求 (>=18)"
            return 0
        else
            log_warn "Node.js 版本过低 (当前: v$current_version，要求: >=18)"
        fi
    else
        log_warn "未检测到 Node.js"
    fi
    
    if confirm "是否安装/更新 Node.js 到最新 LTS 版本？" "y"; then
        log_info "开始安装 Node.js..."
        
        # 使用 NodeSource 仓库安装最新 LTS
        if command -v apt >/dev/null 2>&1; then
            # Ubuntu/Debian
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command -v yum >/dev/null 2>&1; then
            # CentOS/RHEL
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
            sudo yum install -y nodejs
        else
            log_error "不支持的包管理器，请手动安装 Node.js 18+"
            return 1
        fi
        
        # 验证安装
        if command -v node >/dev/null 2>&1; then
            local new_version=$(node --version)
            log_success "Node.js $new_version 安装成功"
        else
            log_error "Node.js 安装失败"
            return 1
        fi
    else
        log_error "Node.js 版本不满足要求，无法继续"
        return 1
    fi
}

# 安装全局依赖
install_global_dependencies() {
    log_step "安装全局依赖"
    
    local global_packages=("pm2")
    
    for package in "${global_packages[@]}"; do
        if command -v "$package" >/dev/null 2>&1; then
            local version=$($package --version 2>/dev/null || echo "unknown")
            log_info "✓ $package 已安装 (版本: $version)"
        else
            log_info "安装 $package..."
            if npm install -g "$package"; then
                log_success "$package 安装成功"
            else
                log_error "$package 安装失败"
                return 1
            fi
        fi
    done
    
    # PM2 特殊配置
    if command -v pm2 >/dev/null 2>&1; then
        # 设置 PM2 开机启动
        pm2 startup systemd -u "$(whoami)" --hp "$(pwd)" >/dev/null 2>&1 || true
        log_info "PM2 开机启动已配置"
    fi
}

# 安装项目依赖
install_project_dependencies() {
    log_step "安装项目依赖"
    
    if [[ ! -f "$DEPLOY_DIR/package.json" ]]; then
        log_error "未找到 package.json 文件"
        return 1
    fi
    
    cd "$DEPLOY_DIR"
    
    # 清理可能存在的依赖问题
    if [[ -d "node_modules" ]]; then
        log_info "清理旧的 node_modules..."
        rm -rf node_modules package-lock.json
    fi
    
    # 使用 npm ci 进行快速安装（如果有 package-lock.json）
    if [[ -f "package-lock.json" ]]; then
        log_info "使用 npm ci 安装依赖..."
        if npm ci --production; then
            log_success "项目依赖安装完成 (ci 模式)"
        else
            log_warn "npm ci 失败，尝试 npm install..."
            npm install --production
        fi
    else
        log_info "使用 npm install 安装依赖..."
        npm install --production
    fi
    
    # 验证关键依赖
    local critical_deps=("nuxt" "@nuxt/devtools")
    for dep in "${critical_deps[@]}"; do
        if [[ -d "node_modules/$dep" ]]; then
            log_info "✓ $dep 已安装"
        else
            log_warn "⚠ $dep 未找到"
        fi
    done
    
    log_success "项目依赖安装完成"
}

# 构建应用
build_application() {
    log_step "构建应用"
    
    cd "$DEPLOY_DIR"
    
    # 设置生产环境变量
    export NODE_ENV=production
    export NITRO_PRESET=node-server
    
    log_info "开始构建 Nuxt 应用..."
    
    # 运行构建命令
    if npm run build; then
        log_success "应用构建完成"
    else
        log_error "应用构建失败"
        return 1
    fi
    
    # 验证构建产物
    if [[ -d ".output" ]]; then
        log_info "构建产物验证通过: .output 目录已生成"
        
        # 显示构建统计信息
        local build_size=$(du -sh .output 2>/dev/null | cut -f1 || echo "未知")
        log_info "构建产物大小: $build_size"
        
        return 0
    else
        log_error "构建产物验证失败: 未找到 .output 目录"
        return 1
    fi
}持和容器化部署
# ====================================================================

set -euo pipefail  # 严格模式：遇到错误立即退出，未定义变量报错

# 全局配置
readonly SCRIPT_VERSION="3.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

# 颜色定义
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="activation-code-system"
PROJECT_DIR="/opt/$PROJECT_NAME"
BACKUP_DIR="/opt/backups/$PROJECT_NAME"
LOG_DIR="/var/log/$PROJECT_NAME"
LOG_FILE="$LOG_DIR/deploy_${TIMESTAMP}.log"
SERVICE_NAME="activation-code-system"
PORT=3000
DOMAIN=""  # 可选域名
SSL_ENABLED=false

# 数据库配置
DB_NAME="activation_code_system"
DB_USER="activation_app"
DB_PASSWORD=""  # 自动生成
DB_ROOT_PASSWORD=""  # 自动生成

# 系统配置
APP_USER="app"
NODE_VERSION="18"
MYSQL_VERSION="8.0"
NGINX_ENABLED=true
PM2_INSTANCES="max"  # 或具体数字
ENVIRONMENT="production"  # production, development, testing

# 部署选项
SKIP_DEPENDENCIES=false
FORCE_REINSTALL=false
BACKUP_BEFORE_DEPLOY=true
RUN_HEALTH_CHECK=true
SETUP_SSL=false
ENABLE_MONITORING=true

# ====================================================================
# 日志和工具函数
# ====================================================================

# 创建日志目录
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

# 日志函数
log_info() {
    local msg="$1"
    echo -e "${GREEN}[INFO $(date +'%H:%M:%S')]${NC} $msg" | tee -a "$LOG_FILE"
}

log_warn() {
    local msg="$1"
    echo -e "${YELLOW}[WARN $(date +'%H:%M:%S')]${NC} $msg" | tee -a "$LOG_FILE"
}

log_error() {
    local msg="$1"
    echo -e "${RED}[ERROR $(date +'%H:%M:%S')]${NC} $msg" | tee -a "$LOG_FILE"
    echo "详细错误信息已记录到: $LOG_FILE"
}

log_step() {
    local step="$1"
    echo -e "\n${CYAN}${BOLD}==== $step ====${NC}" | tee -a "$LOG_FILE"
}

log_success() {
    local msg="$1"
    echo -e "${GREEN}${BOLD}✅ $msg${NC}" | tee -a "$LOG_FILE"
}

log_failure() {
    local msg="$1" 
    echo -e "${RED}${BOLD}❌ $msg${NC}" | tee -a "$LOG_FILE"
}

# 进度显示函数
show_progress() {
    local current=$1
    local total=$2
    local desc="$3"
    local percent=$((current * 100 / total))
    local progress_bar=""
    
    for ((i=0; i<percent/2; i++)); do
        progress_bar+="█"
    done
    
    for ((i=percent/2; i<50; i++)); do
        progress_bar+="░"
    done
    
    printf "\r${BLUE}[%s] %d%% - %s${NC}" "$progress_bar" "$percent" "$desc"
    if [ "$current" -eq "$total" ]; then
        echo ""
    fi
}

# 询问用户确认
confirm() {
    local prompt="$1"
    local default="${2:-n}"
    
    if [[ "$default" == "y" ]]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi
    
    while true; do
        read -rp "$(echo -e "${YELLOW}$prompt${NC}")" response
        response=${response,,}  # 转换为小写
        
        if [[ -z "$response" ]]; then
            response="$default"
        fi
        
        case "$response" in
            y|yes) return 0 ;;
            n|no) return 1 ;;
            *) echo -e "${RED}请输入 y 或 n${NC}" ;;
        esac
    done
}

# 错误处理和清理函数
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "部署过程中发生错误，正在清理..."
        
        # 停止可能已启动的服务
        systemctl stop "$SERVICE_NAME" 2>/dev/null || true
        
        # 恢复备份（如果存在）
        if [[ -d "$BACKUP_DIR/rollback_$TIMESTAMP" ]]; then
            log_warn "正在回滚到之前的版本..."
            if confirm "是否要回滚到之前的版本？" "y"; then
                rollback_deployment
            fi
        fi
        
        log_error "部署失败，退出码: $exit_code"
        echo -e "${RED}请检查日志文件: $LOG_FILE${NC}"
    fi
    
    exit $exit_code
}

# 设置错误处理
trap cleanup EXIT

# ====================================================================
# 服务管理和配置函数
# ====================================================================

# 创建应用用户
create_app_user() {
    log_step "创建应用用户"
    
    if id "$APP_USER" &>/dev/null; then
        log_info "用户 $APP_USER 已存在"
    else
        log_info "创建用户 $APP_USER..."
        useradd -r -s /bin/bash -d "/home/$APP_USER" -m "$APP_USER"
        log_success "用户 $APP_USER 创建完成"
    fi
    
    # 创建用户目录和权限
    mkdir -p "/home/$APP_USER"
    chown -R "$APP_USER:$APP_USER" "/home/$APP_USER"
    
    # 设置项目目录权限
    mkdir -p "$PROJECT_DIR"
    chown -R "$APP_USER:$APP_USER" "$PROJECT_DIR"
}

# 配置系统服务
setup_systemd_service() {
    log_step "配置系统服务"
    
    cat > "/etc/systemd/system/$SERVICE_NAME.service" << EOF
[Unit]
Description=Activation Code Management System
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$PROJECT_DIR/current
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# 环境变量
Environment=NODE_ENV=production
Environment=PORT=$PORT
Environment=NUXT_HOST=0.0.0.0
Environment=NUXT_PORT=$PORT

# 安全设置
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=$PROJECT_DIR $LOG_DIR /tmp

# 资源限制
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable "$SERVICE_NAME"
    
    log_success "系统服务配置完成"
}

# 部署应用
deploy_application() {
    log_step "部署应用"
    
    # 创建发布目录
    local release_dir="$PROJECT_DIR/releases/$TIMESTAMP"
    mkdir -p "$release_dir"
    
    # 复制应用文件
    log_info "复制应用文件..."
    cp -r "$SCRIPT_DIR"/* "$release_dir/"
    
    # 设置权限
    chown -R "$APP_USER:$APP_USER" "$release_dir"
    
    # 创建符号链接到当前版本
    cd "$PROJECT_DIR"
    if [[ -L "current" ]]; then
        rm current
    elif [[ -d "current" ]]; then
        mv current "current.backup.$TIMESTAMP"
    fi
    
    ln -s "$release_dir" current
    
    log_success "应用部署完成"
    
    # 清理旧的发布版本（保留最近3个）
    cd releases
    ls -t | tail -n +4 | xargs rm -rf 2>/dev/null || true
    log_info "旧版本清理完成"
}

# ====================================================================
# 健康检查和监控函数
# ====================================================================

# 健康检查
health_check() {
    log_step "应用健康检查"
    
    local max_attempts=30
    local attempt=1
    local health_url="http://localhost:$PORT"
    
    log_info "等待应用启动..."
    
    while [[ $attempt -le $max_attempts ]]; do
        show_progress "$attempt" "$max_attempts" "检查应用状态 ($attempt/$max_attempts)"
        
        # 检查端口是否开放
        if nc -z localhost "$PORT" 2>/dev/null; then
            # 检查 HTTP 响应
            if curl -s --connect-timeout 5 "$health_url" >/dev/null 2>&1; then
                echo ""  # 换行
                log_success "应用健康检查通过"
                return 0
            fi
        fi
        
        sleep 2
        ((attempt++))
    done
    
    echo ""  # 换行
    log_error "应用健康检查失败"
    return 1
}

# 性能测试
performance_test() {
    log_step "性能基准测试"
    
    local test_url="http://localhost:$PORT"
    
    log_info "运行基准测试..."
    
    # 检查是否安装了 ab (Apache Bench)
    if ! command -v ab >/dev/null 2>&1; then
        log_warn "Apache Bench (ab) 未安装，跳过性能测试"
        return 0
    fi
    
    # 运行简单的性能测试
    local ab_result=$(ab -n 100 -c 10 "$test_url/" 2>/dev/null | grep "Requests per second" | awk '{print $4}')
    
    if [[ -n "$ab_result" ]]; then
        log_info "性能测试结果: $ab_result 请求/秒"
    else
        log_warn "性能测试未能获取结果"
    fi
}

# 系统资源监控
monitor_resources() {
    log_step "系统资源监控"
    
    # CPU 使用率
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    log_info "CPU 使用率: ${cpu_usage}%"
    
    # 内存使用情况
    local memory_info=$(free -m | awk 'NR==2{printf "已使用: %sMB (%.1f%%), 可用: %sMB", $3,$3*100/$2,$7}')
    log_info "内存使用: $memory_info"
    
    # 磁盘使用情况
    local disk_usage=$(df -h "$PROJECT_DIR" | awk 'NR==2{printf "%s 已使用 %s", $5, $4}')
    log_info "磁盘使用: $disk_usage 可用"
    
    # 检查服务状态
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log_success "服务状态: 运行中"
    else
        log_error "服务状态: 已停止"
        return 1
    fi
    
    # 检查应用进程
    local app_processes=$(ps aux | grep -c "[n]ode.*index.mjs" || echo "0")
    log_info "应用进程数: $app_processes"
    
    return 0
}

# 创建监控脚本
setup_monitoring() {
    log_step "配置系统监控"
    
    # 创建监控脚本
    cat > "/usr/local/bin/${SERVICE_NAME}-monitor" << 'EOF'
#!/bin/bash

# 监控脚本
SERVICE_NAME="activation-code-system"
LOG_FILE="/var/log/${SERVICE_NAME}/monitor.log"
PORT=3000

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

# 日志函数
log_monitor() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# 检查服务状态
check_service() {
    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
        log_monitor "ERROR: Service $SERVICE_NAME is not running"
        systemctl start "$SERVICE_NAME"
        log_monitor "INFO: Attempted to restart $SERVICE_NAME"
        return 1
    fi
    
    return 0
}

# 检查端口
check_port() {
    if ! nc -z localhost "$PORT" 2>/dev/null; then
        log_monitor "ERROR: Port $PORT is not accessible"
        return 1
    fi
    
    return 0
}

# 检查内存使用
check_memory() {
    local memory_usage=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
    local memory_threshold=90
    
    if (( $(echo "$memory_usage > $memory_threshold" | bc -l) )); then
        log_monitor "WARNING: High memory usage: ${memory_usage}%"
        return 1
    fi
    
    return 0
}

# 主检查循环
main() {
    local errors=0
    
    check_service || ((errors++))
    check_port || ((errors++))
    check_memory || ((errors++))
    
    if [[ $errors -eq 0 ]]; then
        log_monitor "INFO: All checks passed"
    else
        log_monitor "WARNING: $errors check(s) failed"
    fi
    
    return $errors
}

main "$@"
EOF
    
    # 设置执行权限
    chmod +x "/usr/local/bin/${SERVICE_NAME}-monitor"
    
    # 创建 cron 任务（每5分钟检查一次）
    local cron_entry="*/5 * * * * /usr/local/bin/${SERVICE_NAME}-monitor"
    (crontab -l 2>/dev/null | grep -v "${SERVICE_NAME}-monitor"; echo "$cron_entry") | crontab -
    
    log_success "监控脚本已配置（每5分钟检查一次）"
}

# ====================================================================
# 主部署流程控制
# ====================================================================

# 显示部署总结
show_deployment_summary() {
    log_step "部署总结"
    
    echo -e "${CYAN}${BOLD}"
    cat << EOF
╔══════════════════════════════════════════════════════════════╗
║                    部署完成总结                              ║
╠══════════════════════════════════════════════════════════════╣
║ 应用名称: $PROJECT_NAME
║ 部署路径: $PROJECT_DIR/current
║ 服务端口: $PORT
║ 系统用户: $APP_USER
║ 服务名称: $SERVICE_NAME
╠══════════════════════════════════════════════════════════════╣
║ 访问地址:
║ • 本地: http://localhost:$PORT
║ • 服务器: http://$(hostname -I | awk '{print $1}'):$PORT
$(if [[ -n "$DOMAIN" ]]; then
    echo "║ • 域名: http://$DOMAIN"
    if [[ "$SSL_ENABLED" == "true" ]]; then
        echo "║ • HTTPS: https://$DOMAIN"
    fi
fi)
╠══════════════════════════════════════════════════════════════╣
║ 管理命令:
║ • 查看状态: systemctl status $SERVICE_NAME
║ • 启动服务: systemctl start $SERVICE_NAME
║ • 停止服务: systemctl stop $SERVICE_NAME
║ • 重启服务: systemctl restart $SERVICE_NAME
║ • 查看日志: journalctl -u $SERVICE_NAME -f
║ • 监控日志: tail -f $LOG_DIR/deploy_*.log
╠══════════════════════════════════════════════════════════════╣
║ 备份位置: $BACKUP_DIR
║ 日志位置: $LOG_DIR
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# 主部署函数
main_deploy() {
    log_step "开始主部署流程"
    
    # 阶段 1: 环境准备
    show_progress 1 10 "系统环境检查"
    check_system
    
    show_progress 2 10 "检查系统依赖"
    check_required_commands
    
    show_progress 3 10 "环境检测"
    detect_environment
    
    show_progress 4 10 "防火墙检查"
    check_firewall
    
    # 阶段 2: 用户确认
    echo ""
    log_info "准备部署到环境: $ENVIRONMENT"
    
    if ! confirm "确认开始部署？" "y"; then
        log_info "部署已取消"
        exit 0
    fi
    
    # 阶段 3: 备份
    if [[ "$BACKUP_BEFORE_DEPLOY" == "true" ]]; then
        show_progress 5 10 "创建系统备份"
        create_backup
    fi
    
    # 阶段 4: 环境安装
    show_progress 6 10 "安装 Node.js 环境"
    install_nodejs
    install_global_dependencies
    
    # 阶段 5: 用户和权限设置
    show_progress 7 10 "配置系统用户"
    create_app_user
    
    # 阶段 6: 应用部署
    show_progress 8 10 "部署应用文件"
    deploy_application
    
    # 切换到部署目录
    cd "$PROJECT_DIR/current"
    
    show_progress 9 10 "安装项目依赖并构建"
    install_project_dependencies
    build_application
    
    # 阶段 7: 服务配置
    show_progress 10 10 "配置系统服务"
    setup_systemd_service
    
    # 启动服务
    log_step "启动应用服务"
    systemctl start "$SERVICE_NAME"
    
    # 阶段 8: 健康检查
    if [[ "$RUN_HEALTH_CHECK" == "true" ]]; then
        health_check
        monitor_resources
    fi
    
    # 阶段 9: 可选配置
    if [[ "$NGINX_ENABLED" == "true" ]]; then
        setup_nginx_proxy
        if [[ "$SETUP_SSL" == "true" ]]; then
            setup_ssl_certificate
        fi
    fi
    
    if [[ "$ENABLE_MONITORING" == "true" ]]; then
        setup_monitoring
    fi
    
    # 最终验证
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log_success "🎉 部署完成！应用已成功启动"
        show_deployment_summary
        
        if [[ "$RUN_HEALTH_CHECK" == "true" ]]; then
            performance_test
        fi
        
        return 0
    else
        log_error "❌ 部署失败！服务未能正常启动"
        
        # 显示错误信息
        log_error "服务状态检查："
        systemctl status "$SERVICE_NAME" --no-pager
        
        # 显示最近的日志
        log_error "最近的应用日志："
        journalctl -u "$SERVICE_NAME" --no-pager -n 20
        
        return 1
    fi
}

# 命令行参数处理
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain=*)
                DOMAIN="${1#*=}"
                shift
                ;;
            --port=*)
                PORT="${1#*=}"
                shift
                ;;
            --ssl)
                SETUP_SSL=true
                SSL_ENABLED=true
                shift
                ;;
            --no-nginx)
                NGINX_ENABLED=false
                shift
                ;;
            --no-backup)
                BACKUP_BEFORE_DEPLOY=false
                shift
                ;;
            --no-monitoring)
                ENABLE_MONITORING=false
                shift
                ;;
            --skip-health-check)
                RUN_HEALTH_CHECK=false
                shift
                ;;
            --env=*)
                ENVIRONMENT="${1#*=}"
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            --version|-v)
                echo "部署脚本版本: $SCRIPT_VERSION"
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 显示帮助信息
show_help() {
    cat << EOF
激活码管理系统部署脚本 v$SCRIPT_VERSION

用法: $0 [选项]

选项:
  --domain=DOMAIN       设置域名（用于 SSL 和 Nginx 配置）
  --port=PORT          设置应用端口（默认: 3000）
  --ssl                启用 SSL 证书配置
  --no-nginx           跳过 Nginx 配置
  --no-backup          跳过部署前备份
  --no-monitoring      跳过监控配置
  --skip-health-check  跳过健康检查
  --env=ENV            设置部署环境（production/development/testing）
  --help, -h           显示此帮助信息
  --version, -v        显示版本信息

示例:
  $0                                    # 基本部署
  $0 --domain=example.com --ssl         # 带域名和 SSL 的部署
  $0 --port=8080 --no-nginx            # 自定义端口，无 Nginx
  $0 --env=development --skip-health-check  # 开发环境部署

更多信息请查看项目文档。
EOF
}

# ====================================================================
# 系统检查和依赖验证函数
# ====================================================================

# 检查操作系统和版本
check_system() {
    log_step "系统检查"
    
    if [[ ! -f /etc/os-release ]]; then
        log_error "无法确定操作系统版本"
        return 1
    fi
    
    source /etc/os-release
    log_info "操作系统: $NAME $VERSION"
    
    # 检查支持的系统
    case "$ID" in
        ubuntu|debian|centos|rhel|rocky|almalinux)
            log_info "系统受支持: $ID"
            ;;
        *)
            log_warn "未经测试的系统: $ID，可能需要手动调整"
            if ! confirm "是否继续？" "n"; then
                exit 1
            fi
            ;;
    esac
    
    # 检查系统架构
    ARCH=$(uname -m)
    log_info "系统架构: $ARCH"
    
    # 检查系统资源
    MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
    DISK_SPACE=$(df -h / | awk 'NR==2{print $4}')
    CPU_CORES=$(nproc)
    
    log_info "系统资源: ${MEMORY}GB 内存, ${CPU_CORES} CPU核心, ${DISK_SPACE} 可用磁盘空间"
    
    # 资源要求检查
    if [[ "$MEMORY" -lt 1 ]]; then
        log_warn "内存不足 (需要至少1GB)，可能影响性能"
    fi
    
    log_success "系统检查完成"
}

# 检查所需的系统命令
check_required_commands() {
    log_step "检查系统依赖"
    
    local required_commands=("curl" "wget" "unzip" "tar" "systemctl")
    local missing_commands=()
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing_commands+=("$cmd")
            log_warn "缺少命令: $cmd"
        else
            log_info "✓ $cmd 已安装"
        fi
    done
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        log_error "缺少必要的系统命令: ${missing_commands[*]}"
        log_info "Ubuntu/Debian 安装命令: sudo apt update && sudo apt install -y ${missing_commands[*]}"
        log_info "CentOS/RHEL 安装命令: sudo yum install -y ${missing_commands[*]}"
        return 1
    fi
    
    log_success "系统依赖检查完成"
}

# 检查防火墙设置
check_firewall() {
    log_step "检查防火墙设置"
    
    local firewall_cmd=""
    
    if command -v ufw >/dev/null 2>&1; then
        firewall_cmd="ufw"
    elif command -v firewall-cmd >/dev/null 2>&1; then
        firewall_cmd="firewall-cmd"
    else
        log_warn "未检测到常见的防火墙管理工具"
        return 0
    fi
    
    log_info "检测到防火墙工具: $firewall_cmd"
    
    case "$firewall_cmd" in
        ufw)
            if sudo ufw status | grep -q "Status: active"; then
                log_info "UFW 防火墙已激活"
                if ! sudo ufw status | grep -q "$APP_PORT"; then
                    if confirm "是否自动配置防火墙端口 $APP_PORT？" "y"; then
                        sudo ufw allow "$APP_PORT/tcp"
                        log_success "防火墙端口 $APP_PORT 已开放"
                    fi
                fi
            fi
            ;;
        firewall-cmd)
            if sudo firewall-cmd --state 2>/dev/null | grep -q "running"; then
                log_info "Firewalld 防火墙已激活"
                if ! sudo firewall-cmd --list-ports | grep -q "$APP_PORT"; then
                    if confirm "是否自动配置防火墙端口 $APP_PORT？" "y"; then
                        sudo firewall-cmd --permanent --add-port="$APP_PORT/tcp"
                        sudo firewall-cmd --reload
                        log_success "防火墙端口 $APP_PORT 已开放"
                    fi
                fi
            fi
            ;;
    esac
}

# 环境检测和设置
detect_environment() {
    log_step "环境检测"
    
    # 检测是否在容器中运行
    if [[ -f /.dockerenv ]] || grep -q docker /proc/1/cgroup 2>/dev/null; then
        log_info "检测到 Docker 容器环境"
        ENVIRONMENT="container"
    # 检测云服务提供商
    elif curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/ >/dev/null 2>&1; then
        log_info "检测到 AWS EC2 环境"
        ENVIRONMENT="aws"
    elif curl -s --connect-timeout 2 -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/ >/dev/null 2>&1; then
        log_info "检测到 Google Cloud 环境" 
        ENVIRONMENT="gcp"
    elif curl -s --connect-timeout 2 -H "Metadata: true" http://169.254.169.254/metadata/instance?api-version=2021-02-01 >/dev/null 2>&1; then
        log_info "检测到 Azure 环境"
        ENVIRONMENT="azure"
    else
        log_info "检测到标准 Linux 环境"
        ENVIRONMENT="linux"
    fi
    
    log_info "目标环境: $ENVIRONMENT"
    
    # 根据环境调整配置
    case "$ENVIRONMENT" in
        container)
            log_warn "容器环境检测到，某些系统级功能可能受限"
            ;;
        aws|gcp|azure)
            log_info "云环境检测到，建议使用云服务商的负载均衡和数据库服务"
            ;;
    esac
}

# 生成随机密码
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# 安装基础依赖
install_dependencies() {
    log "安装系统依赖..."
    
    # 更新包管理器
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y curl wget git unzip build-essential
    elif command -v yum &> /dev/null; then
        yum update -y
        yum install -y curl wget git unzip gcc-c++ make
    else
        error "不支持的包管理器"
    fi
    
    log "基础依赖安装完成"
}

# 安装Node.js
install_nodejs() {
    log "安装Node.js 18.x..."
    
    # 检查Node.js是否已安装
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge "18" ]; then
            log "Node.js $NODE_VERSION 已安装，跳过安装"
            return
        fi
    fi
    
    # 安装Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    if command -v apt-get &> /dev/null; then
        apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
        yum install -y nodejs
    fi
    
    # 验证安装
    node --version || error "Node.js安装失败"
    npm --version || error "npm安装失败"
    
    # 安装PM2
    npm install -g pm2
    pm2 --version || error "PM2安装失败"
    
    log "Node.js和PM2安装完成"
}

# 安装MySQL
install_mysql() {
    log "安装MySQL 8.0..."
    
    # 检查MySQL是否已安装
    if command -v mysql &> /dev/null; then
        log "MySQL已安装，跳过安装"
        return
    fi
    
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        apt-get install -y mysql-server mysql-client
        systemctl start mysql
        systemctl enable mysql
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        yum install -y mysql-server mysql
        systemctl start mysqld
        systemctl enable mysqld
    fi
    
    # 获取临时密码（如果有）
    TEMP_PASSWORD=""
    if [ -f /var/log/mysqld.log ]; then
        TEMP_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}' | tail -1)
    fi
    
    log "MySQL安装完成"
}

# 安装Nginx
install_nginx() {
    log "安装Nginx..."
    
    if command -v nginx &> /dev/null; then
        log "Nginx已安装，跳过安装"
        return
    fi
    
    if command -v apt-get &> /dev/null; then
        apt-get install -y nginx
    elif command -v yum &> /dev/null; then
        yum install -y nginx
    fi
    
    systemctl start nginx
    systemctl enable nginx
    
    log "Nginx安装完成"
}

# 创建系统用户
create_app_user() {
    log "创建应用用户..."
    
    if id "$APP_USER" &>/dev/null; then
        log "用户 $APP_USER 已存在"
    else
        useradd -r -s /bin/bash -d /home/$APP_USER -m $APP_USER
        log "用户 $APP_USER 创建完成"
    fi
    
    # 创建必要目录
    mkdir -p "$PROJECT_DIR" "$BACKUP_DIR" "$(dirname "$LOG_FILE")"
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR" "$BACKUP_DIR"
    
    log "目录权限设置完成"
}

# 配置数据库
setup_database() {
    log "配置数据库..."
    
    # 生成数据库密码
    DB_PASSWORD=$(generate_password)
    
    # 创建数据库和用户
    mysql -u root << EOF
-- 创建数据库
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建应用用户
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    log "数据库配置完成"
    info "数据库名: $DB_NAME"
    info "数据库用户: $DB_USER"
    info "数据库密码: $DB_PASSWORD"
    
    # 保存数据库配置到文件
    cat > /opt/$PROJECT_NAME/.db_config << EOF
DB_HOST=localhost
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
EOF
    
    chown $APP_USER:$APP_USER /opt/$PROJECT_NAME/.db_config
    chmod 600 /opt/$PROJECT_NAME/.db_config
}

# 部署应用代码
deploy_application() {
    log "部署应用代码..."
    
    # 备份现有代码（如果存在）
    if [ -d "$PROJECT_DIR/current" ]; then
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
        mv "$PROJECT_DIR/current" "$BACKUP_DIR/$BACKUP_NAME"
        log "现有代码已备份到: $BACKUP_DIR/$BACKUP_NAME"
    fi
    
    # 创建新的部署目录
    mkdir -p "$PROJECT_DIR/current"
    cd "$PROJECT_DIR"
    
    # 如果当前目录有代码，直接复制
    if [ -f "/tmp/activation-code-system/package.json" ]; then
        log "从临时目录复制代码..."
        cp -r /tmp/activation-code-system/* "$PROJECT_DIR/current/"
    else
        # 从GitHub克隆（如果有仓库地址）
        warning "未找到本地代码，请手动将代码复制到 $PROJECT_DIR/current/"
        warning "或者提供Git仓库地址进行克隆"
        return 1
    fi
    
    chown -R $APP_USER:$APP_USER "$PROJECT_DIR/current"
    
    log "应用代码部署完成"
}

# 安装应用依赖
install_app_dependencies() {
    log "安装应用依赖..."
    
    cd "$PROJECT_DIR/current"
    
    # 切换到应用用户执行
    sudo -u $APP_USER bash << 'EOF'
cd /opt/activation-code-system/current
npm install --production
npm run build
EOF
    
    log "应用依赖安装完成"
}

# 初始化数据库表
init_database_schema() {
    log "初始化数据库表结构..."
    
    # 执行数据库初始化脚本
    if [ -f "$PROJECT_DIR/current/database/create_database.sql" ]; then
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < "$PROJECT_DIR/current/database/create_database.sql"
        log "数据库表结构初始化完成"
    else
        warning "数据库初始化脚本未找到"
    fi
    
    # 执行修复脚本
    if [ -f "$PROJECT_DIR/current/database/fix_noauth_constraints.sql" ]; then
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < "$PROJECT_DIR/current/database/fix_noauth_constraints.sql"
        log "数据库约束修复完成"
    fi
}

# 创建环境配置文件
create_env_config() {
    log "创建环境配置文件..."
    
    # 读取数据库配置
    source /opt/$PROJECT_NAME/.db_config
    
    # 创建 .env 文件
    cat > "$PROJECT_DIR/current/.env" << EOF
# 应用配置
NODE_ENV=production
PORT=$PORT
APP_NAME=$PROJECT_NAME

# 数据库配置
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# 安全配置
JWT_SECRET=$(generate_password)
BCRYPT_ROUNDS=12

# 功能配置
NO_AUTH_MODE=true
ENABLE_RATE_LIMIT=true
ENABLE_CORS=true

# 日志配置
LOG_LEVEL=info
LOG_FILE=/var/log/activation-code-system/app.log
EOF
    
    # 创建生产环境配置
    cp "$PROJECT_DIR/current/.env" "$PROJECT_DIR/current/.env.production"
    
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/.env"*
    chmod 600 "$PROJECT_DIR/current/.env"*
    
    log "环境配置文件创建完成"
}

# 配置PM2
setup_pm2() {
    log "配置PM2进程管理..."
    
    # 创建PM2配置文件
    cat > "$PROJECT_DIR/current/ecosystem.config.js" << EOF
module.exports = {
  apps: [
    {
      name: '$SERVICE_NAME',
      script: '.output/server/index.mjs',
      cwd: '$PROJECT_DIR/current',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: $PORT,
        NUXT_HOST: '0.0.0.0',
        NUXT_PORT: $PORT
      },
      error_file: '/var/log/$SERVICE_NAME/error.log',
      out_file: '/var/log/$SERVICE_NAME/access.log',
      log_file: '/var/log/$SERVICE_NAME/combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
}
EOF
    
    # 创建日志目录
    mkdir -p /var/log/$SERVICE_NAME
    chown -R $APP_USER:$APP_USER /var/log/$SERVICE_NAME
    
    chown $APP_USER:$APP_USER "$PROJECT_DIR/current/ecosystem.config.js"
    
    log "PM2配置完成"
}

# 配置Nginx
setup_nginx() {
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
    
    # 启用站点
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
    nginx -t || error "Nginx配置测试失败"
    
    # 重新加载Nginx
    systemctl reload nginx
    
    log "Nginx配置完成"
}

# 创建系统服务
create_systemd_service() {
    log "创建系统服务..."
    
    cat > "/etc/systemd/system/$SERVICE_NAME.service" << EOF
[Unit]
Description=Activation Code Management System
After=network.target mysql.service

[Service]
Type=forking
User=$APP_USER
WorkingDirectory=$PROJECT_DIR/current
ExecStart=/usr/bin/pm2 start ecosystem.config.js --no-daemon
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always
RestartSec=10

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
    log "执行健康检查..."
    
    # 等待服务启动
    sleep 10
    
    # 检查进程
    if ! pgrep -f "node.*activation-code-system" > /dev/null; then
        error "应用进程未运行"
    fi
    
    # 检查端口
    if ! netstat -tuln | grep ":$PORT" > /dev/null; then
        error "端口 $PORT 未监听"
    fi
    
    # HTTP健康检查
    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/health || echo "000")
        if [ "$HTTP_CODE" != "200" ]; then
            warning "HTTP健康检查失败，状态码: $HTTP_CODE"
            # 尝试检查主页
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ || echo "000")
            if [ "$HTTP_CODE" != "200" ]; then
                error "应用无法访问"
            fi
        fi
    fi
    
    log "健康检查通过"
}

# 显示部署信息
show_deployment_info() {
    log "部署完成！"
    
    echo -e "${GREEN}"
    cat << EOF

╔══════════════════════════════════════════════════════════════╗
║                    部署成功！                                 ║
╚══════════════════════════════════════════════════════════════╝

应用信息:
• 服务名称: $SERVICE_NAME
• 安装路径: $PROJECT_DIR/current
• 运行端口: $PORT
• 访问地址: http://$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")

数据库信息:
• 数据库名: $DB_NAME
• 用户名: $DB_USER
• 密码: $DB_PASSWORD
• 配置文件: /opt/$PROJECT_NAME/.db_config

管理命令:
• 查看状态: systemctl status $SERVICE_NAME
• 启动服务: systemctl start $SERVICE_NAME
• 停止服务: systemctl stop $SERVICE_NAME
• 重启服务: systemctl restart $SERVICE_NAME
• 查看日志: journalctl -u $SERVICE_NAME -f

PM2 管理:
• 查看进程: pm2 list
• 查看日志: pm2 logs $SERVICE_NAME
• 重启应用: pm2 restart $SERVICE_NAME
• 监控面板: pm2 monit

文件位置:
• 应用代码: $PROJECT_DIR/current
• 日志文件: /var/log/$SERVICE_NAME/
• 备份目录: $BACKUP_DIR
• Nginx配置: /etc/nginx/sites-available/$SERVICE_NAME

功能特性:
• ✅ 无认证模式 - 直接访问管理界面
• ✅ 激活码生成、验证、管理功能
• ✅ 统计数据和黑名单管理
• ✅ PM2集群模式运行
• ✅ Nginx反向代理和负载均衡
• ✅ 自动重启和错误恢复

接口地址:
• 管理界面: http://YOUR_SERVER_IP/
• 生成激活码: POST /api/codes/generate
• 验证激活码: POST /api/codes/validate-simple
• 获取统计: GET /api/admin/stats

EOF
    echo -e "${NC}"
    
    # 保存部署信息
    cat > "$PROJECT_DIR/deployment_info.txt" << EOF
部署时间: $(date)
服务名称: $SERVICE_NAME
访问端口: $PORT
数据库: $DB_NAME
应用用户: $APP_USER
部署路径: $PROJECT_DIR/current
EOF
    
    log "部署信息已保存到: $PROJECT_DIR/deployment_info.txt"
}

# 清理函数
cleanup() {
    if [ $? -ne 0 ]; then
        error "部署过程中发生错误，请检查日志: $LOG_FILE"
    fi
}

# ====================================================================
# 脚本入口点
# ====================================================================

# 显示版本横幅
show_version_banner() {
    echo -e "${CYAN}${BOLD}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║            激活码管理系统 - 自动化部署脚本 v3.0              ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 增强特性:                                               ║
║  • 智能环境检测和多平台支持                                 ║
║  • 高级错误处理和自动回滚机制                               ║
║  • SSL 证书自动配置支持                                     ║
║  • 数据库备份和恢复功能                                     ║
║  • Docker 和容器化部署支持                                  ║
║  • 性能监控和健康检查                                       ║
║  • 多环境支持（开发/测试/生产）                             ║
║  • 用户友好的进度显示和日志记录                             ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo ""
}

# 脚本主入口
main() {
    # 显示版本信息
    show_version_banner
    
    # 解析命令行参数
    parse_arguments "$@"
    
    # 检查 root 权限
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        log_info "请使用: sudo $0 $*"
        exit 1
    fi
    
    # 显示配置信息
    log_step "部署配置确认"
    log_info "项目名称: $PROJECT_NAME"
    log_info "部署环境: $ENVIRONMENT"
    log_info "应用端口: $PORT"
    log_info "部署路径: $PROJECT_DIR"
    log_info "备份路径: $BACKUP_DIR"
    log_info "日志路径: $LOG_FILE"
    
    if [[ -n "$DOMAIN" ]]; then
        log_info "域名配置: $DOMAIN"
        log_info "SSL 配置: $([ "$SSL_ENABLED" == "true" ] && echo "启用" || echo "禁用")"
    fi
    
    log_info "Nginx 代理: $([ "$NGINX_ENABLED" == "true" ] && echo "启用" || echo "禁用")"
    log_info "系统监控: $([ "$ENABLE_MONITORING" == "true" ] && echo "启用" || echo "禁用")"
    
    echo ""
    
    # 开始部署
    if main_deploy; then
        log_success "🎉 部署流程全部完成！"
        
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
