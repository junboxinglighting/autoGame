# PowerShell一键修复和部署脚本
param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$ServerUser = "admin",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "www.ymzxjb.top"
)

Write-Host "🔧 开始修复和部署激活码管理系统" -ForegroundColor Green
Write-Host "服务器: $ServerUser@$ServerIP" -ForegroundColor Cyan
Write-Host "域名: $Domain" -ForegroundColor Cyan
Write-Host ""

# 检查本地文件
Write-Host "📋 检查本地文件..." -ForegroundColor Yellow
$requiredFiles = @("fix-auto-deploy.sh")

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file 存在" -ForegroundColor Green
    } else {
        Write-Host "❌ $file 不存在，请先运行修复脚本生成" -ForegroundColor Red
        Write-Host "请先运行: bash fix-auto-deploy.sh" -ForegroundColor Yellow
        exit 1
    }
}

# 上传修复脚本
Write-Host "📤 上传修复脚本到服务器..." -ForegroundColor Yellow
try {
    scp "fix-auto-deploy.sh" "$ServerUser@${ServerIP}:~/"
    Write-Host "✅ 修复脚本上传成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 上传失败" -ForegroundColor Red
    exit 1
}

# 远程执行修复和部署
Write-Host "🎯 开始远程修复和部署..." -ForegroundColor Yellow

$remoteScript = @"
echo "🔧 运行修复脚本..."
bash fix-auto-deploy.sh

echo ""
echo "🚀 开始部署..."
chmod +x auto-deploy-fixed.sh
sudo bash auto-deploy-fixed.sh --domain="$Domain" --port=3000 --mode=production --ssl=true --email="admin@ymzxjb.top"
"@

try {
    $remoteScript | ssh $ServerUser@$ServerIP
    Write-Host ""
    Write-Host "✅ 修复和部署完成！" -ForegroundColor Green
    Write-Host "🌐 网站地址: https://$Domain" -ForegroundColor Cyan
    Write-Host "🔧 管理地址: https://$Domain/admin" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 部署过程出现问题" -ForegroundColor Red
    Write-Host "请检查服务器日志获取详细信息" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 后续检查命令:" -ForegroundColor Yellow
Write-Host "ssh $ServerUser@$ServerIP 'sudo systemctl status activation-code-system'" -ForegroundColor Cyan
Write-Host "ssh $ServerUser@$ServerIP 'sudo journalctl -u activation-code-system -f'" -ForegroundColor Cyan
