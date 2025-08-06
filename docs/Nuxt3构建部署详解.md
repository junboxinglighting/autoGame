# Nuxt 3 构建与部署详解

## 为什么需要构建？

### Nuxt 3不是简单的Node.js应用

与传统的Node.js应用不同，Nuxt 3是一个**全栈框架**，需要经过构建过程才能在生产环境运行：

```
源代码 → 构建过程 → 生产可执行文件
```

### 构建过程做了什么？

1. **TypeScript编译** - 将TS代码转换为JS
2. **Vue组件编译** - 将.vue文件转换为可执行代码
3. **服务端渲染(SSR)预处理** - 准备SSR运行时
4. **代码分割与优化** - 自动代码分割和Tree Shaking
5. **静态资源处理** - 压缩图片、CSS、JS文件
6. **API路由生成** - 将server/api/转换为可执行的接口
7. **Nitro引擎打包** - 使用Nitro引擎打包为高性能应用

## 构建流程详解

### 1. 开发环境 vs 生产环境

```bash
# 开发环境（不需要构建）
npm run dev    # 实时编译，热重载

# 生产环境（必须构建）
npm run build  # 构建生产版本
npm run start  # 或者直接运行构建后的文件
```

### 2. 构建命令详解

```bash
# 完整构建过程
npm run build

# 构建过程等价于：
npx nuxt build

# 构建时会看到类似输出：
✔ Nuxt Nitro built in 2.3s
  .output/server/index.mjs (gzip: 123 KB)
  .output/public/_nuxt/ (15 files, gzip: 456 KB)
```

### 3. 构建产物说明

构建完成后，`.output`目录结构：

```
.output/
├── server/
│   ├── index.mjs          # 服务端入口文件（这是实际运行的文件）
│   ├── chunks/            # 代码块
│   └── ...
├── public/                # 静态资源
│   ├── _nuxt/            # 编译后的前端资源
│   ├── favicon.ico       # 静态文件
│   └── ...
└── nitro.json            # 构建配置
```

## 部署方式对比

### 方式一：源码部署（推荐生产环境）

```bash
# 在服务器上构建
git clone https://github.com/your-repo/activation-code-system.git
cd activation-code-system
npm install        # 安装所有依赖（包括开发依赖）
npm run build      # 在服务器上构建
npm prune --production  # 删除开发依赖节省空间

# 运行
pm2 start .output/server/index.mjs --name activation-code-system
```

**优点**：
- ✅ 适应服务器环境，兼容性好
- ✅ 可以针对生产环境优化
- ✅ 安全性高，构建过程可控

**缺点**：
- ❌ 需要在服务器安装构建工具
- ❌ 构建时间较长
- ❌ 需要更多服务器资源

### 方式二：本地构建后部署

```bash
# 在本地开发机构建
npm run build

# 上传构建产物到服务器
rsync -av .output/ user@server:/path/to/app/
rsync -av package.json user@server:/path/to/app/
rsync -av node_modules/ user@server:/path/to/app/node_modules/

# 或者打包上传
tar -czf app.tar.gz .output package.json node_modules
scp app.tar.gz user@server:/path/to/app/
```

**优点**：
- ✅ 服务器资源消耗少
- ✅ 部署速度快
- ✅ 服务器环境简单

**缺点**：
- ❌ 可能有平台兼容性问题
- ❌ 需要上传大量文件
- ❌ 本地环境和服务器环境可能不一致

### 方式三：CI/CD自动化部署（推荐企业环境）

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to server
        run: |
          rsync -av .output/ ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }}:/path/to/app/
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} "pm2 reload activation-code-system"
```

## 生产环境最佳实践

### 1. 优化的部署脚本

```bash
#!/bin/bash
# deploy.sh - 生产部署脚本

set -e  # 遇到错误立即退出

APP_DIR="/home/appuser/activation-code-system"
BACKUP_DIR="/home/appuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "开始部署..."

# 1. 备份当前版本
if [ -d "$APP_DIR" ]; then
    echo "备份当前版本..."
    cp -r "$APP_DIR" "$BACKUP_DIR/backup_$DATE"
fi

# 2. 拉取最新代码
echo "拉取最新代码..."
cd "$APP_DIR"
git pull origin main

# 3. 安装依赖
echo "安装依赖..."
npm ci  # 使用ci而不是install，更适合生产环境

# 4. 构建应用
echo "构建应用..."
npm run build

# 5. 检查构建结果
if [ ! -f ".output/server/index.mjs" ]; then
    echo "构建失败！找不到入口文件"
    exit 1
fi

# 6. 清理开发依赖
echo "清理开发依赖..."
npm prune --production

# 7. 重启应用
echo "重启应用..."
pm2 reload activation-code-system || pm2 start .output/server/index.mjs --name activation-code-system

# 8. 验证部署
echo "验证部署..."
sleep 5
if pm2 list | grep -q "activation-code-system.*online"; then
    echo "部署成功！"
else
    echo "部署失败！应用未正常启动"
    # 回滚
    pm2 stop activation-code-system
    rm -rf "$APP_DIR"
    mv "$BACKUP_DIR/backup_$DATE" "$APP_DIR"
    cd "$APP_DIR"
    pm2 start .output/server/index.mjs --name activation-code-system
    echo "已回滚到上一个版本"
    exit 1
fi

echo "部署完成！"
```

### 2. 环境变量配置

```bash
# .env.production
NODE_ENV=production
NITRO_PORT=3000
NITRO_HOST=0.0.0.0

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=activation_code_system
DB_USER=activation_app
DB_PASSWORD=your_strong_password

# 安全配置
JWT_SECRET=your_very_long_and_secure_secret_key
CORS_ORIGIN=https://your-domain.com

# 日志配置
LOG_LEVEL=error
```

### 3. PM2配置优化

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'activation-code-system',
    script: './.output/server/index.mjs',  // 注意：指向构建后的文件
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      NITRO_PORT: 3000,
      NITRO_HOST: '127.0.0.1'
    },
    error_file: '/var/log/activation-code-system/error.log',
    out_file: '/var/log/activation-code-system/out.log',
    log_file: '/var/log/activation-code-system/combined.log',
    time: true,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 5,
    autorestart: true,
    watch: false,  // 生产环境不需要监听文件变化
    ignore_watch: ['.git', 'node_modules', 'logs'],
    node_args: '--max-old-space-size=2048'
  }]
}
```

## 常见问题解决

### 1. 构建失败

```bash
# 问题：构建时报错
Error: Cannot resolve module...

# 解决：
# 1. 检查依赖是否完整安装
npm install

# 2. 清理缓存重新构建
rm -rf .nuxt .output node_modules
npm install
npm run build

# 3. 检查TypeScript错误
npm run typecheck
```

### 2. 运行时错误

```bash
# 问题：构建成功但运行时报错
Error: Cannot find module...

# 解决：
# 1. 检查生产依赖
npm prune --production
npm install --production

# 2. 检查环境变量
cat .env
```

### 3. 性能问题

```bash
# 问题：应用启动慢或内存占用高

# 解决：
# 1. 检查构建产物大小
du -sh .output/

# 2. 分析打包内容
npm run analyze

# 3. 优化配置
# nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    minify: true,
    compressPublicAssets: true
  },
  experimental: {
    payloadExtraction: false  // 减少文件数量
  }
})
```

## 部署检查清单

### 构建前检查
- [ ] 所有依赖已安装 (`npm install`)
- [ ] TypeScript无错误 (`npm run typecheck`)
- [ ] 测试通过 (`npm run test`)
- [ ] 环境变量配置正确

### 构建过程检查
- [ ] 构建命令执行成功 (`npm run build`)
- [ ] `.output`目录生成
- [ ] `index.mjs`文件存在
- [ ] 静态资源生成正确

### 部署后检查
- [ ] 应用正常启动
- [ ] API接口可访问
- [ ] 数据库连接正常
- [ ] 日志记录正常
- [ ] 性能指标正常

## 总结

**关键要点**：

1. **Nuxt 3必须构建**：不能直接运行源代码
2. **构建产物是关键**：运行的是`.output/server/index.mjs`
3. **环境一致性**：开发、测试、生产环境保持一致
4. **自动化部署**：使用脚本或CI/CD减少人工错误
5. **监控和回滚**：确保部署成功，失败时快速回滚

选择合适的部署方式：
- **小型项目**：方式一（服务器构建）
- **中型项目**：方式三（CI/CD）
- **大型项目**：容器化 + Kubernetes

记住：**构建不是可选的，而是必须的！**
