#!/bin/bash

# 激活码管理系统维护脚本

source .env

DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME:-activation_code_system}

case "$1" in
    backup)
        echo "🗄️  备份数据库..."
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > "backups/$BACKUP_FILE"
        echo "✅ 备份完成: backups/$BACKUP_FILE"
        ;;
    
    restore)
        if [ -z "$2" ]; then
            echo "❌ 请指定备份文件: ./maintenance.sh restore backup_file.sql"
            exit 1
        fi
        echo "🔄 恢复数据库..."
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < "backups/$2"
        echo "✅ 恢复完成"
        ;;
    
    clean-codes)
        echo "🧹 清理过期激活码..."
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            DELETE FROM activation_code 
            WHERE expiryDate < NOW() AND status = 'unused';
        "
        echo "✅ 清理完成"
        ;;
    
    stats)
        echo "📊 系统统计信息"
        echo "===================="
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            SELECT 
                '总用户数' as metric, 
                COUNT(*) as value 
            FROM user
            UNION ALL
            SELECT 
                '激活码总数', 
                COUNT(*) 
            FROM activation_code
            UNION ALL
            SELECT 
                '已使用激活码', 
                COUNT(*) 
            FROM activation_code 
            WHERE status = 'used'
            UNION ALL
            SELECT 
                '过期激活码', 
                COUNT(*) 
            FROM activation_code 
            WHERE expiryDate < NOW()
            UNION ALL
            SELECT 
                '黑名单条目', 
                COUNT(*) 
            FROM blacklist;
        "
        ;;
    
    logs)
        echo "📋 最近的系统日志"
        echo "===================="
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
            SELECT 
                DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as time,
                operation,
                details,
                userAgent
            FROM operation_log 
            ORDER BY createdAt DESC 
            LIMIT 20;
        "
        ;;
    
    create-admin)
        echo "👤 创建管理员用户"
        read -p "用户名: " username
        read -s -p "密码: " password
        echo
        read -p "邮箱: " email
        
        # 这里需要调用API或直接插入数据库
        echo "请使用管理界面创建管理员用户"
        ;;
    
    *)
        echo "激活码管理系统维护脚本"
        echo "======================"
        echo "用法: $0 {backup|restore|clean-codes|stats|logs|create-admin}"
        echo ""
        echo "命令说明:"
        echo "  backup        - 备份数据库"
        echo "  restore FILE  - 从备份文件恢复数据库"
        echo "  clean-codes   - 清理过期的未使用激活码"
        echo "  stats         - 显示系统统计信息"
        echo "  logs          - 显示最近的操作日志"
        echo "  create-admin  - 创建管理员用户"
        exit 1
        ;;
esac
