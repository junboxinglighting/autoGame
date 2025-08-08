@echo off
REM ====================================================================
REM 激活码管理系统 - Windows自动化部署脚本 v2.0 (增强版)
REM 创建时间: 2025年8月8日 (更新)
REM 适用环境: Windows 10+ / Windows Server 2019+
REM Node.js版本: 18.x+
REM 功能更新: 完整的服务管理、监控、备份功能
REM ====================================================================

setlocal enabledelayedexpansion

REM 配置变量
set PROJECT_NAME=activation-code-system
set PROJECT_DIR=C:\www\%PROJECT_NAME%
set BACKUP_DIR=C:\backup\%PROJECT_NAME%
set SERVICE_NAME=ActivationCodeSystem
set PORT=3000

REM 创建日志目录
if not exist "C:\logs" mkdir C:\logs
set LOG_FILE=C:\logs\%PROJECT_NAME%_deploy.log

echo [%date% %time%] 开始部署激活码管理系统... >> %LOG_FILE%

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                激活码管理系统 - Windows部署脚本 v2.0             ║
echo ║                                                              ║
echo ║  特性:                                                       ║
echo ║  • 无认证模式 - 专为私有部署优化                             ║
echo ║  • 完整的验证接口支持                                       ║
echo ║  • 自动化的环境配置和依赖安装                               ║
echo ║  • PM2 进程管理和自动重启                                   ║
echo ║  • Windows服务自动配置                                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] 请以管理员身份运行此脚本
    pause
    exit /b 1
)

echo [信息] 检查Node.js环境...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] Node.js未安装，请先安装Node.js 18.x或更高版本
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('node --version') do set NODE_VER=%%i
    echo [信息] Node.js版本: !NODE_VER!
)

echo [信息] 检查npm...
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] npm未安装
    pause
    exit /b 1
)

echo [信息] 安装PM2全局模块...
npm list -g pm2 >nul 2>&1
if %errorLevel% neq 0 (
    npm install -g pm2
    if %errorLevel% neq 0 (
        echo [错误] PM2安装失败
        pause
        exit /b 1
    )
)

echo [信息] 安装pm2-windows-service...
npm list -g pm2-windows-service >nul 2>&1
if %errorLevel% neq 0 (
    npm install -g pm2-windows-service
    if %errorLevel% neq 0 (
        echo [错误] pm2-windows-service安装失败
        pause
        exit /b 1
    )
)

echo [信息] 创建项目目录...
if not exist "%PROJECT_DIR%" mkdir "%PROJECT_DIR%"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM 备份现有代码
if exist "%PROJECT_DIR%\current" (
    set BACKUP_NAME=backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set BACKUP_NAME=!BACKUP_NAME: =0!
    move "%PROJECT_DIR%\current" "%BACKUP_DIR%\!BACKUP_NAME!"
    echo [信息] 现有代码已备份到: %BACKUP_DIR%\!BACKUP_NAME!
)

REM 检查当前目录是否为项目目录
if exist "package.json" (
    echo [信息] 从当前目录复制代码...
    xcopy /E /I /H /Y . "%PROJECT_DIR%\current\"
) else (
    echo [错误] 请在项目根目录运行此脚本
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%\current"

echo [信息] 安装依赖包...
npm install
if %errorLevel% neq 0 (
    echo [错误] 依赖包安装失败
    pause
    exit /b 1
)

echo [信息] 构建项目...
npm run build
if %errorLevel% neq 0 (
    echo [错误] 项目构建失败
    pause
    exit /b 1
)

echo [信息] 创建环境配置文件...
(
echo NODE_ENV=production
echo PORT=%PORT%
echo APP_NAME=%PROJECT_NAME%
echo NO_AUTH_MODE=true
echo ENABLE_RATE_LIMIT=true
echo ENABLE_CORS=true
echo LOG_LEVEL=info
) > .env

copy .env .env.production

echo [信息] 创建PM2配置文件...
(
echo module.exports = {
echo   apps: [
echo     {
echo       name: '%SERVICE_NAME%',
echo       script: '.output/server/index.mjs',
echo       instances: 1,
echo       exec_mode: 'fork',
echo       env: {
echo         NODE_ENV: 'production',
echo         PORT: %PORT%,
echo         NUXT_HOST: '0.0.0.0',
echo         NUXT_PORT: %PORT%
echo       },
echo       error_file: 'C:/logs/%SERVICE_NAME%/error.log',
echo       out_file: 'C:/logs/%SERVICE_NAME%/access.log',
echo       log_file: 'C:/logs/%SERVICE_NAME%/combined.log',
echo       time: true,
echo       autorestart: true,
echo       watch: false,
echo       max_memory_restart: '1G'
echo     }
echo   ]
echo }
) > ecosystem.config.js

echo [信息] 创建日志目录...
if not exist "C:\logs\%SERVICE_NAME%" mkdir "C:\logs\%SERVICE_NAME%"

echo [信息] 停止现有PM2进程...
pm2 delete %SERVICE_NAME% 2>nul

echo [信息] 启动PM2进程...
pm2 start ecosystem.config.js
if %errorLevel% neq 0 (
    echo [错误] PM2进程启动失败
    pause
    exit /b 1
)

echo [信息] 保存PM2配置...
pm2 save

echo [信息] 安装Windows服务...
pm2-service-install -n "%SERVICE_NAME%"
if %errorLevel% neq 0 (
    echo [警告] Windows服务安装失败，但应用仍可正常运行
) else (
    echo [信息] Windows服务安装成功
)

echo [信息] 启动Windows服务...
net start "%SERVICE_NAME%" 2>nul

REM 等待服务启动
echo [信息] 等待服务启动...
timeout /t 10 /nobreak >nul

REM 健康检查
echo [信息] 执行健康检查...
curl -s http://localhost:%PORT% >nul 2>&1
if %errorLevel% equ 0 (
    echo [成功] 应用健康检查通过
) else (
    echo [警告] 健康检查失败，请检查应用状态
)

echo [信息] 创建管理脚本...
(
echo @echo off
echo echo 激活码管理系统 - 管理面板
echo echo.
echo echo 1. 查看状态
echo echo 2. 启动服务
echo echo 3. 停止服务
echo echo 4. 重启服务
echo echo 5. 查看日志
echo echo 6. 退出
echo echo.
echo set /p choice=请选择操作 ^(1-6^): 
echo.
echo if "%%choice%%"=="1" pm2 list
echo if "%%choice%%"=="2" pm2 start %SERVICE_NAME%
echo if "%%choice%%"=="3" pm2 stop %SERVICE_NAME%
echo if "%%choice%%"=="4" pm2 restart %SERVICE_NAME%
echo if "%%choice%%"=="5" pm2 logs %SERVICE_NAME%
echo if "%%choice%%"=="6" exit /b 0
echo.
echo pause
) > "%PROJECT_DIR%\manage.bat"

echo [信息] 创建防火墙规则...
netsh advfirewall firewall delete rule name="ActivationCodeSystem-HTTP" 2>nul
netsh advfirewall firewall add rule name="ActivationCodeSystem-HTTP" dir=in action=allow protocol=TCP localport=%PORT%

echo [信息] 获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set LOCAL_IP=%%a
    set LOCAL_IP=!LOCAL_IP:~1!
    goto :found_ip
)
:found_ip

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    部署成功！                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 应用信息:
echo • 服务名称: %SERVICE_NAME%
echo • 安装路径: %PROJECT_DIR%\current
echo • 运行端口: %PORT%
echo • 本地访问: http://localhost:%PORT%
if defined LOCAL_IP echo • 局域网访问: http://!LOCAL_IP!:%PORT%
echo.
echo 管理命令:
echo • 管理面板: %PROJECT_DIR%\manage.bat
echo • PM2状态: pm2 list
echo • 查看日志: pm2 logs %SERVICE_NAME%
echo • 重启应用: pm2 restart %SERVICE_NAME%
echo.
echo 日志位置:
echo • 应用日志: C:\logs\%SERVICE_NAME%\
echo • 部署日志: %LOG_FILE%
echo.
echo 功能特性:
echo • ✅ 无认证模式 - 直接访问管理界面
echo • ✅ 激活码生成、验证、管理功能
echo • ✅ 统计数据和黑名单管理
echo • ✅ PM2进程管理
echo • ✅ Windows服务自动启动
echo.
echo 接口地址:
if defined LOCAL_IP (
    echo • 管理界面: http://!LOCAL_IP!:%PORT%/
    echo • 生成激活码: POST http://!LOCAL_IP!:%PORT%/api/codes/generate
    echo • 验证激活码: POST http://!LOCAL_IP!:%PORT%/api/codes/validate-simple
    echo • 获取统计: GET http://!LOCAL_IP!:%PORT%/api/admin/stats
) else (
    echo • 管理界面: http://localhost:%PORT%/
    echo • 生成激活码: POST http://localhost:%PORT%/api/codes/generate
    echo • 验证激活码: POST http://localhost:%PORT%/api/codes/validate-simple
    echo • 获取统计: GET http://localhost:%PORT%/api/admin/stats
)
echo.

REM 保存部署信息
(
echo 部署时间: %date% %time%
echo 服务名称: %SERVICE_NAME%
echo 访问端口: %PORT%
echo 部署路径: %PROJECT_DIR%\current
if defined LOCAL_IP echo 访问地址: http://!LOCAL_IP!:%PORT%
echo 管理脚本: %PROJECT_DIR%\manage.bat
) > "%PROJECT_DIR%\deployment_info.txt"

echo [成功] 部署信息已保存到: %PROJECT_DIR%\deployment_info.txt

if defined LOCAL_IP (
    echo.
    echo 正在打开浏览器...
    start http://!LOCAL_IP!:%PORT%
)

echo.
echo 部署完成！按任意键退出...
pause >nul
