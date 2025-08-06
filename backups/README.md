# 备份文件目录

此目录用于存储数据库备份文件。

## 使用维护脚本进行备份

### Linux/Mac:
```bash
./maintenance.sh backup
```

### Windows:
手动执行MySQL备份命令：
```
cmd
mysqldump -u root -p activation_code_system > backups/backup_YYYYMMDD_HHMMSS.sql
```

## 备份文件命名规则

格式：`backup_YYYYMMDD_HHMMSS.sql`
例如：`backup_20231215_143022.sql`

## 恢复数据库

### Linux/Mac:
```bash
./maintenance.sh restore backup_20231215_143022.sql
```

### Windows:
```cmd
mysql -u root -p activation_code_system < backups/backup_20231215_143022.sql
```

## 定期备份建议

建议设置定期备份任务：
1. 每日备份：保留最近7天
2. 每周备份：保留最近4周
3. 每月备份：保留最近12个月
