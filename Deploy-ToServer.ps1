# PowerShell版本的一键部署脚本
# 在Windows本地运行，自动上传并部署到Linux服务器

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$ServerUser = "admin",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "www.ymzxjb.top",
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 3000,
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "admin@ymzxjb.top"
)

Write-Host "🚀 开始一键部署到 $Domain" -ForegroundColor Green
Write-Host "服务器: $ServerUser@$ServerIP" -ForegroundColor Cyan
Write-Host ""

# 检查必需的工具
Write-Host "🔧 检查部署工具..." -ForegroundColor Yellow

# 检查SCP
try {
    scp 2>$null
    Write-Host "✅ SCP 可用" -ForegroundColor Green
} catch {
    Write-Host "❌ SCP 不可用，请安装 OpenSSH 客户端" -ForegroundColor Red
    Write-Host "   可以通过 Windows 功能或 Git for Windows 安装" -ForegroundColor Yellow
    exit 1
}

# 检查SSH
try {
    ssh -V 2>$null
    Write-Host "✅ SSH 可用" -ForegroundColor Green
} catch {
    Write-Host "❌ SSH 不可用" -ForegroundColor Red
    exit 1
}

# 检查本地文件
Write-Host "📋 检查本地部署文件..." -ForegroundColor Yellow
$requiredFiles = @("auto-deploy.sh", "optimize-nginx-for-ymzxjb.sh", "check-admin-permissions.sh")

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file 存在" -ForegroundColor Green
    } else {
        Write-Host "❌ $file 不存在" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# 上传文件
Write-Host "📤 上传部署文件到服务器..." -ForegroundColor Yellow
foreach ($file in $requiredFiles) {
    Write-Host "上传 $file..." -ForegroundColor Cyan
    $scpCommand = "scp `"$file`" $ServerUser@${ServerIP}:~/"
    try {
        Invoke-Expression $scpCommand
        Write-Host "✅ $file 上传成功" -ForegroundColor Green
    } catch {
        Write-Host "❌ $file 上传失败" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# 生成远程执行脚本
$remoteScript = @"
echo "🔧 设置脚本权限..."
chmod +x auto-deploy.sh optimize-nginx-for-ymzxjb.sh check-admin-permissions.sh

echo "🔍 运行环境检查..."
bash check-admin-permissions.sh

echo "🚀 开始部署激活码管理系统..."
sudo bash auto-deploy.sh --domain="$Domain" --port=$Port --mode=production --ssl=true --email="$Email"

echo ""
echo "🎉 部署完成！"
echo "🔗 访问地址: https://$Domain"
echo "🔧 管理界面: https://$Domain/admin"
"@

# 执行远程部署
Write-Host "🎯 开始远程部署..." -ForegroundColor Yellow
try {
    $remoteScript | ssh $ServerUser@$ServerIP
    Write-Host ""
    Write-Host "✅ 一键部署完成！" -ForegroundColor Green
    Write-Host "🌐 网站地址: https://$Domain" -ForegroundColor Cyan
    Write-Host "🔧 管理地址: https://$Domain/admin" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 远程部署失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 后续操作提醒:" -ForegroundColor Yellow
Write-Host "1. 等待几分钟让服务完全启动"
Write-Host "2. 在浏览器中访问 https://$Domain"
Write-Host "3. 使用管理界面 https://$Domain/admin 进行系统配置"
Write-Host "4. 检查服务状态: ssh $ServerUser@$ServerIP 'sudo systemctl status activation-code-system'"
