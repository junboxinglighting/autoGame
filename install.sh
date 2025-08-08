#!/bin/bash

# 激活码管理系统 - 一键安装器 v2.0
# 自动检测环境并选择最佳部署方案
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

# 全局变量
SCRIPT_URL="https://raw.githubusercontent.com/your-repo/activation-code-system/main"
PROJECT_NAME="activation-code-system"
TEMP_DIR="/tmp/${PROJECT_NAME}-installer"

# 日志函数
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "\n${CYAN}==== $1 ====${NC}"; }

# 显示安装器横幅
show_banner() {
    clear
    echo -e "${PURPLE}"
    cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════════╗
║                      激活码管理系统 - 一键安装器 v2.0                           ║
║                                                                               ║
║  🌟 智能化部署解决方案:                                                        ║
║     • 自动环境检测和依赖安装                                                    ║
║     • 支持多种操作系统和部署方式                                                ║
║     • 零配置快速启动                                                           ║
║     • 生产级安全配置                                                           ║
║                                                                               ║
║  📦 支持的部署方式:                                                           ║
║     • Linux服务器 (Ubuntu/CentOS/Debian)                                      ║
║     • Docker容器化 (推荐)                                                      ║
║     • Windows服务器 (PowerShell)                                              ║
║     • macOS开发环境                                                           ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# 检测操作系统
detect_os() {
    log_step "检测系统环境"
    
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$ID
        VERSION=$VERSION_ID
        OS_NAME="$PRETTY_NAME"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        OS_NAME="macOS $(sw_vers -productVersion)"
    else
        OS="unknown"
        OS_NAME="Unknown OS"
    fi
    
    ARCH=$(uname -m)
    
    log_info "操作系统: $OS_NAME"
    log_info "系统架构: $ARCH"
    log_info "内核版本: $(uname -r)"
    
    # 检查是否为支持的系统
    case $OS in
        ubuntu|debian|centos|rhel|rocky|almalinux|fedora)
            PLATFORM="linux"
            ;;
        macos)
            PLATFORM="macos"
            ;;
        *)
            log_warn "未完全测试的操作系统: $OS"
            PLATFORM="linux"
            ;;
    esac
}

# 检查系统权限
check_permissions() {
    log_step "检查系统权限"
    
    if [[ $PLATFORM == "linux" ]]; then
        if [[ $EUID -eq 0 ]]; then
            HAS_ROOT=true
            log_info "当前用户: root (完整权限)"
        elif sudo -n true 2>/dev/null; then
            HAS_ROOT=true
            log_info "当前用户: $(whoami) (sudo权限)"
        else
            HAS_ROOT=false
            log_warn "当前用户: $(whoami) (受限权限)"
            log_warn "部分功能可能需要sudo权限"
        fi
    else
        HAS_ROOT=false
        log_info "当前用户: $(whoami)"
    fi
}

# 检查必要工具
check_tools() {
    log_step "检查必要工具"
    
    TOOLS_STATUS=""
    
    # 基础工具
    for tool in curl wget git; do
        if command -v $tool >/dev/null 2>&1; then
            log_info "✅ $tool: $(command -v $tool)"
            TOOLS_STATUS="${TOOLS_STATUS}${tool}:ok "
        else
            log_warn "❌ $tool: 未安装"
            TOOLS_STATUS="${TOOLS_STATUS}${tool}:missing "
        fi
    done
    
    # Node.js检查
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -ge 18 ]]; then
            log_info "✅ Node.js: $(node -v) (兼容)"
            HAS_NODEJS=true
        else
            log_warn "❌ Node.js: $(node -v) (版本过低，需要18+)"
            HAS_NODEJS=false
        fi
    else
        log_warn "❌ Node.js: 未安装"
        HAS_NODEJS=false
    fi
    
    # Docker检查
    if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
        if docker info >/dev/null 2>&1; then
            log_info "✅ Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
            log_info "✅ Docker Compose: $(docker-compose --version | cut -d' ' -f3 | tr -d ',')"
            HAS_DOCKER=true
        else
            log_warn "❌ Docker: 已安装但未运行"
            HAS_DOCKER=false
        fi
    else
        log_warn "❌ Docker: 未安装或配置不完整"
        HAS_DOCKER=false
    fi
    
    # 数据库检查
    if command -v mysql >/dev/null 2>&1; then
        log_info "✅ MySQL: $(mysql --version | cut -d' ' -f6)"
        HAS_MYSQL=true
    else
        log_warn "❌ MySQL: 未安装"
        HAS_MYSQL=false
    fi
}

# 智能推荐部署方案
recommend_deployment() {
    log_step "分析推荐部署方案"
    
    RECOMMENDATIONS=()
    
    # Docker部署推荐（最高优先级）
    if [[ $HAS_DOCKER == true ]]; then
        RECOMMENDATIONS+=("docker:Docker容器化部署:推荐 - 隔离性好，易于管理")
    elif [[ $HAS_ROOT == true ]]; then
        RECOMMENDATIONS+=("docker:Docker容器化部署:可安装 - 需要安装Docker")
    fi
    
    # Linux原生部署推荐
    if [[ $PLATFORM == "linux" && $HAS_ROOT == true ]]; then
        RECOMMENDATIONS+=("linux:Linux原生部署:推荐 - 性能最优，完整功能")
    elif [[ $PLATFORM == "linux" && $HAS_ROOT == false ]]; then
        RECOMMENDATIONS+=("linux:Linux原生部署:受限 - 需要sudo权限")
    fi
    
    # 开发环境推荐
    if [[ $HAS_NODEJS == true ]]; then
        RECOMMENDATIONS+=("dev:开发环境启动:推荐 - 快速测试和开发")
    else
        RECOMMENDATIONS+=("dev:开发环境启动:需要安装Node.js 18+")
    fi
    
    # Windows支持提示
    if [[ $PLATFORM == "linux" ]]; then
        RECOMMENDATIONS+=("windows:Windows部署:不适用 - 当前为Linux环境")
    fi
    
    echo -e "${CYAN}📋 推荐的部署方案:${NC}\n"
    
    for i in "${!RECOMMENDATIONS[@]}"; do
        IFS=':' read -r method name desc <<< "${RECOMMENDATIONS[$i]}"
        case $desc in
            *"推荐"*)
                echo -e "  ${GREEN}$((i+1)). $name${NC} - $desc"
                ;;
            *"可安装"*)
                echo -e "  ${YELLOW}$((i+1)). $name${NC} - $desc"
                ;;
            *)
                echo -e "  ${RED}$((i+1)). $name${NC} - $desc"
                ;;
        esac
    done
    
    echo
}

# 安装必要工具
install_prerequisites() {
    local install_type="$1"
    
    log_step "安装必要组件"
    
    case $PLATFORM in
        linux)
            install_linux_prerequisites "$install_type"
            ;;
        macos)
            install_macos_prerequisites "$install_type"
            ;;
        *)
            log_error "不支持的平台: $PLATFORM"
            return 1
            ;;
    esac
}

# Linux环境安装
install_linux_prerequisites() {
    local install_type="$1"
    
    if [[ $HAS_ROOT != true ]]; then
        log_error "需要sudo权限来安装系统组件"
        return 1
    fi
    
    # 更新包管理器
    case $OS in
        ubuntu|debian)
            sudo apt-get update -y
            sudo apt-get install -y curl wget git gnupg2 software-properties-common
            ;;
        centos|rhel|rocky|almalinux)
            sudo yum update -y
            sudo yum install -y curl wget git epel-release
            ;;
        fedora)
            sudo dnf update -y
            sudo dnf install -y curl wget git
            ;;
    esac
    
    # 根据部署类型安装组件
    case $install_type in
        docker)
            install_docker
            ;;
        linux)
            install_nodejs
            install_mysql
            ;;
        dev)
            install_nodejs
            ;;
    esac
}

# macOS环境安装
install_macos_prerequisites() {
    local install_type="$1"
    
    # 检查Homebrew
    if ! command -v brew >/dev/null 2>&1; then
        log_info "安装Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    case $install_type in
        docker)
            log_info "请手动安装Docker Desktop for Mac"
            log_info "下载地址: https://docs.docker.com/docker-for-mac/install/"
            ;;
        dev)
            brew install node@18
            ;;
    esac
}

# 安装Docker
install_docker() {
    log_info "安装Docker..."
    
    case $OS in
        ubuntu|debian)
            curl -fsSL https://download.docker.com/linux/$OS/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/$OS $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            ;;
        centos|rhel|rocky|almalinux)
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            ;;
    esac
    
    # 启动Docker服务
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # 安装docker-compose (如果不存在)
    if ! command -v docker-compose >/dev/null 2>&1; then
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    # 添加当前用户到docker组
    if [[ $EUID -ne 0 ]]; then
        sudo usermod -aG docker "$(whoami)"
        log_warn "请重新登录以使docker组权限生效，或使用 'newgrp docker'"
    fi
    
    HAS_DOCKER=true
}

# 安装Node.js
install_nodejs() {
    log_info "安装Node.js 18..."
    
    # 使用NodeSource仓库
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    
    case $OS in
        ubuntu|debian)
            sudo apt-get install -y nodejs
            ;;
        centos|rhel|rocky|almalinux)
            sudo yum install -y nodejs npm
            ;;
    esac
    
    # 全局安装PM2
    sudo npm install -g pm2
    
    HAS_NODEJS=true
}

# 安装MySQL
install_mysql() {
    log_info "安装MySQL..."
    
    case $OS in
        ubuntu|debian)
            sudo apt-get install -y mysql-server mysql-client
            ;;
        centos|rhel|rocky|almalinux)
            sudo yum install -y mysql-server mysql
            ;;
    esac
    
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    HAS_MYSQL=true
}

# 下载项目文件
download_project() {
    log_step "下载项目文件"
    
    # 创建临时目录
    rm -rf "$TEMP_DIR"
    mkdir -p "$TEMP_DIR"
    cd "$TEMP_DIR"
    
    # 下载项目（如果有Git则克隆，否则下载压缩包）
    if command -v git >/dev/null 2>&1; then
        log_info "克隆项目仓库..."
        git clone https://github.com/your-repo/activation-code-system.git .
    else
        log_info "下载项目压缩包..."
        wget -O project.zip "https://github.com/your-repo/activation-code-system/archive/refs/heads/main.zip"
        unzip -q project.zip
        mv activation-code-system-main/* .
        rm -rf activation-code-system-main project.zip
    fi
    
    log_info "项目文件下载完成: $TEMP_DIR"
}

# 执行部署
execute_deployment() {
    local method="$1"
    
    log_step "执行 $method 部署"
    
    case $method in
        docker)
            execute_docker_deployment
            ;;
        linux)
            execute_linux_deployment
            ;;
        dev)
            execute_dev_deployment
            ;;
        *)
            log_error "未知的部署方法: $method"
            return 1
            ;;
    esac
}

# Docker部署执行
execute_docker_deployment() {
    if [[ ! -f "docker/docker-compose.yml" ]]; then
        log_error "Docker配置文件未找到"
        return 1
    fi
    
    cd docker
    
    # 创建环境配置
    if [[ ! -f "../.env" ]]; then
        log_info "创建环境配置..."
        cat > ../.env << EOF
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_DATABASE=activation_code_system
MYSQL_USER=activation_app
MYSQL_PASSWORD=$(openssl rand -base64 32)
DB_HOST=mysql
DB_PORT=3306

JWT_SECRET=$(openssl rand -base64 64)
HASH_SALT=$(openssl rand -base64 32)
EOF
    fi
    
    # 启动服务
    log_info "启动Docker服务..."
    docker-compose down || true
    docker-compose build --no-cache
    docker-compose up -d
    
    # 等待服务启动
    local max_wait=60
    local waited=0
    
    while [[ $waited -lt $max_wait ]]; do
        if curl -sf http://localhost/health >/dev/null 2>&1; then
            break
        fi
        sleep 2
        ((waited+=2))
        echo -n "."
    done
    
    echo
    if [[ $waited -ge $max_wait ]]; then
        log_error "服务启动超时"
        docker-compose logs --tail=10
        return 1
    fi
    
    show_docker_success
}

# Linux部署执行
execute_linux_deployment() {
    if [[ ! -f "auto-deploy.sh" ]]; then
        log_error "Linux部署脚本未找到"
        return 1
    fi
    
    log_info "执行Linux自动部署脚本..."
    chmod +x auto-deploy.sh
    
    if [[ $HAS_ROOT == true ]]; then
        ./auto-deploy.sh
    else
        sudo ./auto-deploy.sh
    fi
}

# 开发环境部署执行
execute_dev_deployment() {
    log_info "配置开发环境..."
    
    # 安装依赖
    npm install
    
    # 创建开发配置
    if [[ ! -f ".env" ]]; then
        cat > .env << EOF
NODE_ENV=development
PORT=3000
HOST=localhost

DB_TYPE=sqlite
DB_FILE=./data/dev.sqlite

JWT_SECRET=dev_secret
HASH_SALT=dev_salt
LOG_LEVEL=debug
EOF
        mkdir -p data
    fi
    
    log_info "启动开发服务器..."
    echo -e "${GREEN}开发环境已配置完成！${NC}"
    echo -e "${CYAN}访问地址: http://localhost:3000${NC}"
    echo -e "${YELLOW}在项目目录运行 'npm run dev' 启动开发服务器${NC}"
    
    # 询问是否立即启动
    read -p "是否立即启动开发服务器？(Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        npm run dev
    fi
}

# 显示Docker部署成功信息
show_docker_success() {
    echo -e "\n${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                         🎉 Docker部署成功完成！                                 ║"
    echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${CYAN}📋 系统信息:${NC}"
    echo "  • 部署目录: $TEMP_DIR"
    echo "  • 部署方式: Docker Compose"
    echo "  • 服务状态: 运行中"
    
    echo -e "\n${CYAN}🌐 访问地址:${NC}"
    echo "  • 主页: http://localhost"
    echo "  • 健康检查: http://localhost/health"
    echo "  • 管理界面: http://localhost"
    
    echo -e "\n${CYAN}🛠️ 管理命令:${NC}"
    echo "  • 查看状态: cd $TEMP_DIR/docker && docker-compose ps"
    echo "  • 查看日志: cd $TEMP_DIR/docker && docker-compose logs -f"
    echo "  • 重启服务: cd $TEMP_DIR/docker && docker-compose restart"
    echo "  • 停止服务: cd $TEMP_DIR/docker && docker-compose down"
    
    echo -e "\n${YELLOW}📁 项目目录: $TEMP_DIR${NC}"
    echo -e "${YELLOW}💡 建议将项目移动到合适的位置，如 /opt/activation-code-system${NC}"
}

# 交互式部署选择
interactive_deployment() {
    recommend_deployment
    
    if [[ ${#RECOMMENDATIONS[@]} -eq 0 ]]; then
        log_error "没有找到合适的部署方案"
        return 1
    fi
    
    echo -e "${CYAN}请选择部署方案:${NC}"
    read -p "请输入选项编号 (1-${#RECOMMENDATIONS[@]}): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[1-9]$ ]] || [[ $REPLY -gt ${#RECOMMENDATIONS[@]} ]]; then
        log_error "无效的选择"
        return 1
    fi
    
    local selected_index=$((REPLY-1))
    IFS=':' read -r method name desc <<< "${RECOMMENDATIONS[$selected_index]}"
    
    log_info "选择的部署方案: $name"
    
    # 检查是否需要安装依赖
    case $method in
        docker)
            if [[ $HAS_DOCKER != true ]]; then
                log_info "需要安装Docker环境"
                install_prerequisites "docker"
            fi
            ;;
        linux)
            if [[ $HAS_NODEJS != true ]] || [[ $HAS_MYSQL != true ]]; then
                log_info "需要安装Linux环境依赖"
                install_prerequisites "linux"
            fi
            ;;
        dev)
            if [[ $HAS_NODEJS != true ]]; then
                log_info "需要安装Node.js环境"
                install_prerequisites "dev"
            fi
            ;;
    esac
    
    # 下载项目并执行部署
    download_project
    execute_deployment "$method"
}

# 清理函数
cleanup() {
    if [[ -d "$TEMP_DIR" ]]; then
        log_info "清理临时文件..."
        rm -rf "$TEMP_DIR"
    fi
}

# 主函数
main() {
    show_banner
    
    # 设置清理钩子
    trap cleanup EXIT
    
    detect_os
    check_permissions
    check_tools
    
    # 检查网络连接
    if ! curl -s --head --request GET https://github.com >/dev/null; then
        log_error "无法连接到GitHub，请检查网络连接"
        exit 1
    fi
    
    # 如果有命令行参数，直接执行
    if [[ $# -gt 0 ]]; then
        case "$1" in
            "auto"|"recommend")
                # 自动选择最佳方案
                if [[ $HAS_DOCKER == true ]]; then
                    METHOD="docker"
                elif [[ $PLATFORM == "linux" && $HAS_ROOT == true ]]; then
                    METHOD="linux"
                elif [[ $HAS_NODEJS == true ]]; then
                    METHOD="dev"
                else
                    log_error "无法自动选择部署方案，请手动选择"
                    exit 1
                fi
                
                download_project
                execute_deployment "$METHOD"
                ;;
            "docker"|"linux"|"dev")
                download_project
                execute_deployment "$1"
                ;;
            *)
                log_error "未知参数: $1"
                log_info "支持的参数: auto, docker, linux, dev"
                exit 1
                ;;
        esac
    else
        # 交互式部署
        interactive_deployment
    fi
    
    log_info "安装完成！"
}

# 启动安装器
main "$@"
