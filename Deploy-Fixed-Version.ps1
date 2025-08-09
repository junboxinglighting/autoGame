# PowerShell一键部署脚本 - 使用修复版本
param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$ServerUser = "admin",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "www.ymzxjb.top"
)

Write-Host "🚀 开始一键部署激活码管理系统（修复版本）" -ForegroundColor Green
Write-Host "服务器: $ServerUser@$ServerIP" -ForegroundColor Cyan
Write-Host "域名: $Domain" -ForegroundColor Cyan
Write-Host ""

# 检查修复版本文件
if (-not (Test-Path "auto-deploy-fixed.sh")) {
    Write-Host "❌ auto-deploy-fixed.sh 文件不存在" -ForegroundColor Red
    Write-Host "请确保修复版本的部署脚本存在" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 找到修复版本部署脚本" -ForegroundColor Green

# 上传文件
Write-Host "📤 上传部署脚本到服务器..." -ForegroundColor Yellow
try {
    scp "auto-deploy-fixed.sh" "$ServerUser@${ServerIP}:~/"
    Write-Host "✅ 上传成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 上传失败" -ForegroundColor Red
    exit 1
}

# 远程执行部署
Write-Host "🎯 开始远程部署..." -ForegroundColor Yellow

$deployScript = @"
echo "🔧 设置文件权限..."
chmod +x auto-deploy-fixed.sh

echo "🔍 验证脚本语法..."
if bash -n auto-deploy-fixed.sh; then
    echo "✅ 脚本语法检查通过"
else
    echo "❌ 脚本语法错误"
    exit 1
fi

echo "🚀 开始部署..."
sudo bash auto-deploy-fixed.sh --domain="$Domain" --port=3000 --mode=production --ssl=true --email="admin@ymzxjb.top"

echo ""
echo "🎉 部署完成！检查服务状态..."
sudo -u app pm2 status
systemctl status nginx --no-pager
"@

try {
    $deployScript | ssh $ServerUser@$ServerIP
    
    Write-Host ""
    Write-Host "✅ 部署完成！" -ForegroundColor Green
    Write-Host "🌐 网站地址: https://$Domain" -ForegroundColor Cyan
    Write-Host "🔧 管理地址: https://$Domain/admin" -ForegroundColor Cyan
    Write-Host "📊 API地址: https://$Domain/api/admin/stats" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ 部署过程中出现问题" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 验证命令:" -ForegroundColor Yellow
Write-Host "curl -I https://$Domain" -ForegroundColor Cyan
Write-Host "ssh $ServerUser@$ServerIP 'sudo -u app pm2 logs activation-code-system'" -ForegroundColor Cyan
