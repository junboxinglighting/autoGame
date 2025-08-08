#!/bin/bash

# 激活码管理系统 - 部署前环境检查脚本
# 版本: 1.0
# 用途: 在运行自动化部署脚本前，检查服务器环境是否满足要求

echo "🔍 激活码管理系统 - 部署前环境检查"
echo "========================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查结果统计
PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

# 检查函数
check_item() {
    local description="$1"
    local command="$2"
    local required="$3"  # true/false
    
    printf "%-50s" "$description"
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASS_COUNT++))
        return 0
    else
        if [[ "$required" == "true" ]]; then
            echo -e "${RED}✗ 失败${NC}"
            ((FAIL_COUNT++))
        else
            echo -e "${YELLOW}⚠ 警告${NC}"
            ((WARN_COUNT++))
        fi
        return 1
    fi
}

# 显示信息
info_item() {
    local description="$1"
    local command="$2"
    
    printf "%-50s" "$description"
    result=$(eval "$command" 2>/dev/null || echo "未知")
    echo -e "${BLUE}$result${NC}"
}

echo -e "\n${BLUE}📋 系统基本信息${NC}"
echo "----------------------------------------"
info_item "操作系统:" "cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"'"
info_item "内核版本:" "uname -r"
info_item "系统架构:" "uname -m"
info_item "CPU核心数:" "nproc"
info_item "总内存:" "free -h | awk 'NR==2{print \$2}'"
info_item "可用内存:" "free -h | awk 'NR==2{print \$7}'"
info_item "根分区可用空间:" "df -h / | awk 'NR==2{print \$4}'"
info_item "当前用户:" "whoami"

echo -e "\n${BLUE}🔐 权限检查${NC}"
echo "----------------------------------------"
check_item "Root权限检查" "[[ \$EUID -eq 0 ]]" true

echo -e "\n${BLUE}🌐 网络连接检查${NC}"
echo "----------------------------------------"
check_item "互联网连接" "ping -c 1 8.8.8.8" true
check_item "域名解析" "ping -c 1 google.com" true
check_item "HTTPS连接" "curl -s https://www.google.com" true

echo -e "\n${BLUE}📦 系统工具检查${NC}"
echo "----------------------------------------"
check_item "curl命令" "command -v curl" true
check_item "wget命令" "command -v wget" true
check_item "git命令" "command -v git" false
check_item "unzip命令" "command -v unzip" true
check_item "tar命令" "command -v tar" true
check_item "systemctl命令" "command -v systemctl" true

echo -e "\n${BLUE}🔧 编译工具检查${NC}"
echo "----------------------------------------"
check_item "gcc编译器" "command -v gcc" false
check_item "make工具" "command -v make" false
check_item "build-essential (Debian/Ubuntu)" "dpkg -l | grep -q build-essential" false
check_item "Development Tools (CentOS/RHEL)" "yum grouplist installed | grep -q 'Development Tools'" false

echo -e "\n${BLUE}🐳 容器环境检查${NC}"
echo "----------------------------------------"
check_item "Docker环境检测" "[[ -f /.dockerenv ]]" false
check_item "Docker命令" "command -v docker" false
check_item "Docker Compose" "command -v docker-compose" false

echo -e "\n${BLUE}🔥 防火墙状态${NC}"
echo "----------------------------------------"
check_item "UFW防火墙" "command -v ufw" false
check_item "Firewalld防火墙" "command -v firewall-cmd" false
check_item "iptables" "command -v iptables" false

if command -v ufw >/dev/null 2>&1; then
    info_item "UFW状态:" "ufw status | head -1"
fi

if command -v firewall-cmd >/dev/null 2>&1; then
    info_item "Firewalld状态:" "firewall-cmd --state 2>/dev/null || echo '未运行'"
fi

echo -e "\n${BLUE}📊 系统资源要求检查${NC}"
echo "----------------------------------------"

# 内存检查
MEMORY_GB=$(free -m | awk 'NR==2{printf "%.1f", $2/1024}')
if (( $(echo "$MEMORY_GB >= 1.0" | bc -l) )); then
    echo -e "内存要求 (≥1GB)                              ${GREEN}✓ ${MEMORY_GB}GB${NC}"
    ((PASS_COUNT++))
else
    echo -e "内存要求 (≥1GB)                              ${YELLOW}⚠ ${MEMORY_GB}GB (建议增加内存)${NC}"
    ((WARN_COUNT++))
fi

# 磁盘空间检查
DISK_GB=$(df / | awk 'NR==2{printf "%.1f", $4/1024/1024}')
if (( $(echo "$DISK_GB >= 5.0" | bc -l) )); then
    echo -e "磁盘空间要求 (≥5GB)                          ${GREEN}✓ ${DISK_GB}GB${NC}"
    ((PASS_COUNT++))
else
    echo -e "磁盘空间要求 (≥5GB)                          ${RED}✗ ${DISK_GB}GB (空间不足)${NC}"
    ((FAIL_COUNT++))
fi

echo -e "\n${BLUE}📁 项目文件检查${NC}"
echo "----------------------------------------"
check_item "package.json存在" "[[ -f package.json ]]" true
check_item "nuxt.config.ts存在" "[[ -f nuxt.config.ts ]]" true
check_item "auto-deploy.sh存在" "[[ -f auto-deploy.sh ]]" true
check_item "auto-deploy.sh可执行" "[[ -x auto-deploy.sh ]]" false

if [[ -f package.json ]]; then
    info_item "项目名称:" "grep '\"name\"' package.json | cut -d'\"' -f4"
    info_item "项目版本:" "grep '\"version\"' package.json | cut -d'\"' -f4"
fi

echo -e "\n${BLUE}🚀 运行环境检查 (当前已安装)${NC}"
echo "----------------------------------------"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    if [[ $NODE_MAJOR -ge 18 ]]; then
        echo -e "Node.js版本 (≥18)                            ${GREEN}✓ $NODE_VERSION${NC}"
        ((PASS_COUNT++))
    else
        echo -e "Node.js版本 (≥18)                            ${YELLOW}⚠ $NODE_VERSION (版本过低)${NC}"
        ((WARN_COUNT++))
    fi
else
    echo -e "Node.js版本 (≥18)                            ${BLUE}- 未安装 (脚本会自动安装)${NC}"
fi

if command -v npm >/dev/null 2>&1; then
    info_item "npm版本:" "npm --version"
else
    echo -e "npm版本                                      ${BLUE}- 未安装 (随Node.js一起安装)${NC}"
fi

if command -v pm2 >/dev/null 2>&1; then
    info_item "PM2版本:" "pm2 --version"
else
    echo -e "PM2版本                                      ${BLUE}- 未安装 (脚本会自动安装)${NC}"
fi

if command -v mysql >/dev/null 2>&1; then
    info_item "MySQL版本:" "mysql --version | awk '{print \$3}' | cut -d',' -f1"
else
    echo -e "MySQL版本                                    ${BLUE}- 未安装 (脚本会自动安装)${NC}"
fi

if command -v nginx >/dev/null 2>&1; then
    info_item "Nginx版本:" "nginx -v 2>&1 | cut -d'/' -f2"
else
    echo -e "Nginx版本                                    ${BLUE}- 未安装 (脚本会自动安装)${NC}"
fi

echo -e "\n${BLUE}🔍 端口占用检查${NC}"
echo "----------------------------------------"
PORTS_TO_CHECK=(22 80 443 3000 3001 3306)

for port in "${PORTS_TO_CHECK[@]}"; do
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        PROCESS=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | head -1)
        case $port in
            22) echo -e "端口 $port (SSH)                               ${GREEN}✓ 已使用 ($PROCESS)${NC}" ;;
            3306) echo -e "端口 $port (MySQL)                           ${YELLOW}⚠ 已使用 ($PROCESS)${NC}" ;;
            80|443) echo -e "端口 $port (HTTP/HTTPS)                      ${YELLOW}⚠ 已使用 ($PROCESS)${NC}" ;;
            3000|3001) echo -e "端口 $port (应用)                            ${RED}✗ 已占用 ($PROCESS)${NC}" ;;
        esac
    else
        case $port in
            22) echo -e "端口 $port (SSH)                               ${RED}✗ 未开放 (无法SSH连接)${NC}" ;;
            *) echo -e "端口 $port                                     ${GREEN}✓ 可用${NC}" ;;
        esac
    fi
done

echo -e "\n${BLUE}📝 检查结果汇总${NC}"
echo "========================================"
echo -e "通过项目: ${GREEN}$PASS_COUNT${NC}"
echo -e "警告项目: ${YELLOW}$WARN_COUNT${NC}"
echo -e "失败项目: ${RED}$FAIL_COUNT${NC}"

echo -e "\n${BLUE}🚀 部署建议${NC}"
echo "----------------------------------------"

if [[ $FAIL_COUNT -eq 0 ]]; then
    echo -e "${GREEN}✅ 环境检查通过！可以开始部署。${NC}"
    echo ""
    echo "推荐部署命令:"
    echo -e "${BLUE}# 基础部署${NC}"
    echo "sudo bash auto-deploy.sh"
    echo ""
    echo -e "${BLUE}# 生产环境部署 (如果有域名)${NC}"
    echo "sudo bash auto-deploy.sh --domain=yourdomain.com --ssl"
else
    echo -e "${RED}❌ 环境检查发现问题，建议先解决以下问题：${NC}"
    echo ""
    
    if [[ $EUID -ne 0 ]]; then
        echo "• 请使用root权限运行: sudo $0"
    fi
    
    if ! command -v curl >/dev/null 2>&1; then
        echo "• 安装curl: apt install curl 或 yum install curl"
    fi
    
    if [[ $(echo "$MEMORY_GB < 1.0" | bc -l) ]]; then
        echo "• 增加服务器内存到至少1GB"
    fi
    
    if [[ $(echo "$DISK_GB < 5.0" | bc -l) ]]; then
        echo "• 释放磁盘空间或扩容到至少5GB"
    fi
fi

if [[ $WARN_COUNT -gt 0 ]]; then
    echo -e "\n${YELLOW}⚠️ 建议优化项:${NC}"
    
    if [[ $(echo "$MEMORY_GB < 2.0" | bc -l) ]]; then
        echo "• 建议内存升级到2GB以获得更好性能"
    fi
    
    if ! command -v build-essential >/dev/null 2>&1 && ! rpm -q gcc >/dev/null 2>&1; then
        echo "• 安装编译工具以避免某些npm包安装问题"
        echo "  Ubuntu/Debian: apt install build-essential"
        echo "  CentOS/RHEL: yum groupinstall 'Development Tools'"
    fi
fi

echo -e "\n${BLUE}📚 更多信息${NC}"
echo "----------------------------------------"
echo "• 详细部署指南: 查看 deployment-guide.md"
echo "• 脚本帮助信息: bash auto-deploy.sh --help"
echo "• 故障排除: 查看部署日志 /var/log/activation-code-system/"

echo ""
echo "🎉 准备好了？运行以下命令开始部署："
echo -e "${GREEN}sudo bash auto-deploy.sh${NC}"
