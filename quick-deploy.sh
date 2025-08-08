#!/bin/bash

# 激活码管理系统 - 一键部署脚本 v2.0
# 支持多平台快速部署 (Linux/Windows/macOS/Docker)
# 作者: GitHub Copilot

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 配置变量
PROJECT_NAME="activation-code-system"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 日志函数
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "\n${CYAN}==== $1 ====${NC}"; }

# 显示欢迎信息
show_welcome() {
    clear
    echo -e "${PURPLE}"
    cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════════╗
║                      激活码管理系统 - 一键部署脚本 v2.0                          ║
║                                                                               ║
║  🚀 支持多种部署方式:                                                          ║
║     1. Linux服务器自动部署 (Ubuntu/CentOS)                                    ║
║     2. Windows服务器自动部署 (Windows 10+/Server)                             ║
║     3. Docker容器化部署 (跨平台)                                               ║
║     4. 开发环境快速启动                                                        ║
║                                                                               ║
║  ⚡ 功能特性:                                                                 ║
║     • 零配置快速部署                                                           ║
║     • 自动环境检测和依赖安装                                                    ║
║     • 完整的服务监控和日志管理                                                  ║
║     • 生产级安全配置                                                           ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# 检测操作系统
detect_platform() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [[ -f /etc/os-release ]]; then
            . /etc/os-release
            PLATFORM="linux-$ID"
        else
            PLATFORM="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        PLATFORM="macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        PLATFORM="windows"
    else
        PLATFORM="unknown"
    fi
    
    log_info "检测到平台: $PLATFORM"
}

# 检查Docker环境
check_docker() {
    if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
        if docker info >/dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# 检查Node.js环境
check_nodejs() {
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -ge 18 ]]; then
            return 0
        fi
    fi
    return 1
}

# 显示部署选项菜单
show_menu() {
    echo -e "${CYAN}请选择部署方式:${NC}\n"
    
    echo "  ${GREEN}1.${NC} Linux服务器部署 (推荐生产环境)"
    echo "     • 自动安装 Node.js, MySQL, Nginx, PM2"
    echo "     • 配置系统服务和防火墙"
    echo "     • 完整的监控和备份方案"
    echo
    
    echo "  ${GREEN}2.${NC} Windows服务器部署"
    echo "     • 自动安装依赖和配置"
    echo "     • Windows服务集成"
    echo "     • 图形化管理界面"
    echo
    
    echo "  ${GREEN}3.${NC} Docker容器化部署 (推荐开发和测试)"
    if check_docker; then
        echo "     • ✅ Docker环境已就绪"
    else
        echo "     • ❌ 需要安装Docker和Docker Compose"
    fi
    echo "     • 一键启动完整环境"
    echo "     • 支持水平扩展"
    echo
    
    echo "  ${GREEN}4.${NC} 开发环境快速启动"
    if check_nodejs; then
        echo "     • ✅ Node.js环境已就绪"
    else
        echo "     • ❌ 需要安装Node.js 18+"
    fi
    echo "     • 热重载开发模式"
    echo "     • SQLite本地数据库"
    echo
    
    echo "  ${GREEN}5.${NC} 环境检测和诊断"
    echo "     • 检查系统环境和依赖"
    echo "     • 生成诊断报告"
    echo "     • 修复常见问题"
    echo
    
    echo "  ${GREEN}0.${NC} 退出"
    echo
}

# Linux服务器部署
deploy_linux() {
    log_step "Linux服务器部署"
    
    if [[ $EUID -ne 0 ]]; then
        log_error "Linux部署需要root权限"
        log_info "请使用: sudo $0"
        return 1
    fi
    
    local script_path="$PROJECT_DIR/auto-deploy.sh"
    if [[ -f "$script_path" ]]; then
        log_info "执行Linux自动部署脚本..."
        bash "$script_path"
    else
        log_error "Linux部署脚本未找到: $script_path"
        return 1
    fi
}

# Windows服务器部署
deploy_windows() {
    log_step "Windows服务器部署"
    
    local script_path="$PROJECT_DIR/auto-deploy.bat"
    if [[ -f "$script_path" ]]; then
        log_info "请以管理员身份运行Windows部署脚本:"
        log_info "右键点击 -> 以管理员身份运行: $script_path"
        
        read -p "按回车键打开文件位置..." -r
        if command -v explorer.exe >/dev/null 2>&1; then
            explorer.exe "$(wslpath -w "$PROJECT_DIR")" || true
        elif command -v xdg-open >/dev/null 2>&1; then
            xdg-open "$PROJECT_DIR" || true
        fi
    else
        log_error "Windows部署脚本未找到: $script_path"
        return 1
    fi
}

# Docker部署
deploy_docker() {
    log_step "Docker容器化部署"
    
    cd "$PROJECT_DIR"
    
    if ! check_docker; then
        log_error "Docker环境未就绪"
        log_info "请先安装Docker和Docker Compose:"
        log_info "  Ubuntu: sudo apt install docker.io docker-compose"
        log_info "  CentOS: sudo yum install docker docker-compose"
        log_info "  macOS: https://docs.docker.com/docker-for-mac/install/"
        return 1
    fi
    
    # 检查docker-compose.yml
    if [[ ! -f "docker/docker-compose.yml" ]]; then
        log_error "Docker配置文件未找到: docker/docker-compose.yml"
        return 1
    fi
    
    # 创建.env文件
    if [[ ! -f ".env" ]]; then
        log_info "创建环境配置文件..."
        cat > .env << EOF
# 应用配置
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# 数据库配置
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_DATABASE=activation_code_system
MYSQL_USER=activation_app
MYSQL_PASSWORD=$(openssl rand -base64 32)
DB_HOST=mysql
DB_PORT=3306

# 安全配置
JWT_SECRET=$(openssl rand -base64 64)
HASH_SALT=$(openssl rand -base64 32)

# 域名配置 (可选)
# DOMAIN=your-domain.com
# SSL_EMAIL=your@email.com
EOF
        log_info "环境配置文件已创建: .env"
    fi
    
    # 停止现有服务
    log_info "停止现有Docker服务..."
    docker-compose -f docker/docker-compose.yml down >/dev/null 2>&1 || true
    
    # 构建和启动服务
    log_info "构建和启动Docker服务..."
    cd docker
    docker-compose build --no-cache
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -sf http://localhost/health >/dev/null 2>&1; then
            log_info "Docker部署成功完成！"
            break
        fi
        
        log_info "等待服务启动... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        log_error "服务启动超时，请检查Docker日志"
        docker-compose logs --tail=20
        return 1
    fi
    
    # 显示访问信息
    echo -e "\n${GREEN}✅ Docker部署完成！${NC}"
    echo -e "${CYAN}访问地址:${NC}"
    echo "  • 主页: http://localhost"
    echo "  • 健康检查: http://localhost/health"
    echo -e "\n${CYAN}管理命令:${NC}"
    echo "  • 查看状态: docker-compose ps"
    echo "  • 查看日志: docker-compose logs -f"
    echo "  • 停止服务: docker-compose down"
    echo "  • 重启服务: docker-compose restart"
}

# 开发环境启动
deploy_dev() {
    log_step "开发环境快速启动"
    
    cd "$PROJECT_DIR"
    
    if ! check_nodejs; then
        log_error "Node.js环境未就绪"
        log_info "请先安装Node.js 18+: https://nodejs.org/"
        return 1
    fi
    
    # 安装依赖
    if [[ ! -d "node_modules" ]]; then
        log_info "安装项目依赖..."
        npm install
    fi
    
    # 创建开发环境配置
    if [[ ! -f ".env" ]]; then
        log_info "创建开发环境配置..."
        cat > .env << EOF
# 开发环境配置
NODE_ENV=development
PORT=3000
HOST=localhost

# 使用SQLite数据库
DB_TYPE=sqlite
DB_FILE=./data/dev.sqlite

# 安全配置
JWT_SECRET=dev_jwt_secret_key
HASH_SALT=dev_hash_salt

# 日志配置
LOG_LEVEL=debug
EOF
        mkdir -p data
    fi
    
    # 启动开发服务器
    log_info "启动开发服务器..."
    echo -e "${GREEN}✅ 开发环境启动中...${NC}"
    echo -e "${CYAN}访问地址: http://localhost:3000${NC}"
    echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
    echo
    
    npm run dev
}

# 环境检测和诊断
diagnose_environment() {
    log_step "系统环境诊断"
    
    echo -e "${CYAN}=== 系统信息 ===${NC}"
    echo "操作系统: $(uname -s) $(uname -r)"
    echo "架构: $(uname -m)"
    echo "当前用户: $(whoami)"
    echo "当前目录: $(pwd)"
    echo "脚本目录: $SCRIPT_DIR"
    echo "项目目录: $PROJECT_DIR"
    echo
    
    echo -e "${CYAN}=== 环境检查 ===${NC}"
    
    # Node.js检查
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js:${NC} $(node -v)"
        echo -e "${GREEN}✅ npm:${NC} $(npm -v)"
    else
        echo -e "${RED}❌ Node.js: 未安装${NC}"
    fi
    
    # Docker检查
    if command -v docker >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker:${NC} $(docker --version)"
        if docker info >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Docker服务: 运行中${NC}"
        else
            echo -e "${YELLOW}⚠️  Docker服务: 未运行${NC}"
        fi
    else
        echo -e "${RED}❌ Docker: 未安装${NC}"
    fi
    
    # Docker Compose检查
    if command -v docker-compose >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker Compose:${NC} $(docker-compose --version)"
    else
        echo -e "${RED}❌ Docker Compose: 未安装${NC}"
    fi
    
    # Git检查
    if command -v git >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Git:${NC} $(git --version)"
    else
        echo -e "${YELLOW}⚠️  Git: 未安装${NC}"
    fi
    
    # 数据库检查
    if command -v mysql >/dev/null 2>&1; then
        echo -e "${GREEN}✅ MySQL:${NC} $(mysql --version)"
    else
        echo -e "${YELLOW}⚠️  MySQL: 未安装${NC}"
    fi
    
    # 进程检查
    echo
    echo -e "${CYAN}=== 相关进程 ===${NC}"
    ps aux | grep -E "(node|nginx|mysql|pm2)" | grep -v grep || echo "未找到相关进程"
    
    # 端口检查
    echo
    echo -e "${CYAN}=== 端口占用 ===${NC}"
    if command -v ss >/dev/null 2>&1; then
        ss -tulpn | grep -E ":3000|:80|:443|:3306" || echo "目标端口未被占用"
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tulpn | grep -E ":3000|:80|:443|:3306" || echo "目标端口未被占用"
    else
        echo "无法检查端口占用情况"
    fi
    
    # 磁盘空间检查
    echo
    echo -e "${CYAN}=== 磁盘空间 ===${NC}"
    df -h . || echo "无法检查磁盘空间"
    
    # 内存使用检查
    echo
    echo -e "${CYAN}=== 内存使用 ===${NC}"
    if command -v free >/dev/null 2>&1; then
        free -h
    elif command -v vm_stat >/dev/null 2>&1; then
        vm_stat
    else
        echo "无法检查内存使用情况"
    fi
    
    # 项目文件检查
    echo
    echo -e "${CYAN}=== 项目文件检查 ===${NC}"
    local critical_files=(
        "package.json"
        "nuxt.config.ts"
        "auto-deploy.sh"
        "auto-deploy.bat"
        "docker/docker-compose.yml"
        "docker/Dockerfile"
    )
    
    for file in "${critical_files[@]}"; do
        if [[ -f "$PROJECT_DIR/$file" ]]; then
            echo -e "${GREEN}✅ $file${NC}"
        else
            echo -e "${RED}❌ $file${NC}"
        fi
    done
    
    echo
    echo -e "${GREEN}=== 诊断完成 ===${NC}"
    echo "如果发现问题，请根据上述信息进行修复"
}

# 主菜单循环
main_menu() {
    while true; do
        show_menu
        read -p "请选择 (0-5): " -n 1 -r
        echo
        
        case $REPLY in
            1)
                deploy_linux
                ;;
            2)
                deploy_windows
                ;;
            3)
                deploy_docker
                ;;
            4)
                deploy_dev
                ;;
            5)
                diagnose_environment
                ;;
            0)
                log_info "退出部署脚本"
                exit 0
                ;;
            *)
                log_error "无效选择，请输入0-5"
                ;;
        esac
        
        echo
        read -p "按回车键返回主菜单..." -r
    done
}

# 主函数
main() {
    show_welcome
    detect_platform
    
    # 检查是否在项目目录
    if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
        log_error "请在项目根目录执行此脚本"
        log_info "当前目录: $(pwd)"
        log_info "期望目录: $PROJECT_DIR"
        exit 1
    fi
    
    # 如果有参数，直接执行对应功能
    if [[ $# -gt 0 ]]; then
        case "$1" in
            "linux"|"1")
                deploy_linux
                ;;
            "windows"|"2")
                deploy_windows
                ;;
            "docker"|"3")
                deploy_docker
                ;;
            "dev"|"4")
                deploy_dev
                ;;
            "diagnose"|"5")
                diagnose_environment
                ;;
            *)
                log_error "未知参数: $1"
                log_info "支持的参数: linux, windows, docker, dev, diagnose"
                exit 1
                ;;
        esac
    else
        # 交互式菜单
        main_menu
    fi
}

# 信号处理
trap 'echo -e "\n${YELLOW}部署被中断${NC}"; exit 1' INT TERM

# 启动脚本
main "$@"
