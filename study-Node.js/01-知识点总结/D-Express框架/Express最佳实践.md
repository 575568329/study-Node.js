---
tags:
  - Express
  - 最佳实践
  - D领域
创建时间: 2026-03-24
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# Express最佳实践

## 📚 核心概念

Express最佳实践包括：日志管理、环境变量、错误处理、安全配置、项目结构、进程管理等。

---

## 1️⃣ 日志管理

### ❌ 当前的问题：console.log

```javascript
// 你现在的代码
console.log('服务器启动在端口 3000');
console.error('数据库连接失败:', error);
```

**问题**：
- ❌ 无法控制日志级别（info、warn、error）
- ❌ 无法记录到文件
- ❌ 无法按日期分割日志
- ❌ 生产环境性能差（同步操作）

---

### ✅ 最佳实践：morgan + winston

**为什么用两个日志库？**

| 库 | 用途 | 使用场景 |
|---|------|----------|
| **morgan** | HTTP请求日志 | 记录所有HTTP请求（自动） |
| **winston** | 应用日志 | 记录业务逻辑、错误（手动） |

---

#### morgan（HTTP请求日志）

```javascript
// 安装
npm install morgan

// 使用
const morgan = require('morgan');

// 开发环境：彩色输出
app.use(morgan('dev'));

// 生产环境：写入文件
app.use(morgan('combined', {
  stream: fs.createWriteStream('./logs/access.log', { flags: 'a' })
}));
```

**输出示例**：
```
GET /api/posts 200 5.234 ms
POST /api/auth/login 401 12.456 ms
```

---

#### winston（应用日志）

```javascript
// 安装
npm install winston

// 配置
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',  // 日志级别：error < warn < info < debug
  format: winston.format.json(),  // JSON格式
  transports: [
    // 错误日志单独记录
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error'
    }),
    // 所有日志
    new winston.transports.File({
      filename: './logs/combined.log'
    })
  ]
});

// 开发环境：同时输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 使用
logger.info('服务器启动成功');
logger.error('数据库连接失败', { error: error.message });
logger.warn('内存使用率过高', { usage: '90%' });
```

---

### 替换你的 console.log

```javascript
// ❌ 之前
console.log('服务器启动在端口 3000');
console.error('数据库连接失败:', error);

// ✅ 之后
logger.info('服务器启动在端口 3000');
logger.error('数据库连接失败', { error: error.message, stack: error.stack });
```

---

## 2️⃣ 环境变量管理（dotenv）

### ❌ 当前的问题：硬编码配置

```javascript
// app.js
const JWT_SECRET = 'your-secret-key';  // ❌ 硬编码
const DB_PASSWORD = 'root123456';      // ❌ 硬编码
```

**问题**：
- ❌ 密钥泄露到git仓库
- ❌ 无法在不同环境切换
- ❌ 不安全

---

### ✅ 最佳实践：dotenv

```javascript
// 安装
npm install dotenv

// 配置
require('dotenv').config();  // 最顶部加载

// .env文件（不提交到git）
JWT_SECRET=your-super-secret-key-min-32-chars
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=blog_database
PORT=3000
NODE_ENV=development

// 代码中使用
const JWT_SECRET = process.env.JWT_SECRET;
const DB_PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.PORT || 3000;
```

**重要**：
- ✅ `.env` 文件添加到 `.gitignore`
- ✅ 提供 `.env.example` 模板
- ✅ 生产环境设置真实的 `NODE_ENV=production`

---

## 3️⃣ 错误处理统一

你的博客项目已经做得很好了！✅

```javascript
// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error(err.stack);  // 改为 logger.error

  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })  // 只在开发环境返回堆栈
  });
});
```

---

## 4️⃣ 安全配置

你已经用了helmet，很棒！✅

```javascript
// 安全头
app.use(helmet());

// CORS白名单
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
}));

// 速率限制
app.use('/api/auth/login', rateLimit({
  windowMs: 60 * 1000,  // 1分钟
  max: 5,
  message: '登录尝试次数过多，请稍后再试'
}));
```

---

## 5️⃣ 项目结构最佳实践

你的结构已经很好了！✅

```
11-personal-blog/
  ├── src/
  │   ├── config/         # 配置文件
  │   │   └── database.js
  │   ├── controllers/    # 控制器（业务逻辑）
  │   │   ├── authController.js
  │   │   ├── postController.js
  │   │   └── userController.js
  │   ├── routes/         # 路由（URL映射）
  │   │   ├── auth.js
  │   │   ├── posts.js
  │   │   └── users.js
  │   ├── middleware/     # 中间件
  │   │   ├── auth.js
  │   │   ├── upload.js
  │   │   └── error.js
  │   ├── app.js          # Express配置
  │   └── server.js       # 服务器启动
  ├── logs/               # 日志目录（新增）
  │   ├── error.log
  │   ├── combined.log
  │   └── access.log
  ├── uploads/            # 上传文件
  ├── .env                # 环境变量（不提交）
  ├── .env.example        # 环境变量模板（提交）
  ├── .gitignore
  └── package.json
```

---

## 6️⃣ 进程管理（PM2）

开发环境用 `node server.js`，生产环境用 **PM2**。

```bash
# 安装
npm install -g pm2

# 启动
pm2 start server.js --name blog-api

# 查看状态
pm2 status

# 查看日志
pm2 logs blog-api

# 重启
pm2 restart blog-api

# 停止
pm2 stop blog-api
```

**PM2的优势**：
- ✅ 自动重启（崩溃后）
- ✅ 集群模式（多核CPU）
- ✅ 日志管理
- ✅ 性能监控

---

## 7️⃣ 代码规范

```javascript
// 安装
npm install --save-dev eslint
npm install --save-dev prettier

// .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-console": "warn",  // 警告使用console
    "no-unused-vars": "error"
  }
}
```

---

## 8️⃣ 性能优化

### 使用压缩中间件
```javascript
const compression = require('compression');
app.use(compression());  // gzip压缩
```

### 静态资源缓存
```javascript
app.use(express.static('public', {
  maxAge: '1d',  // 缓存1天
  etag: true
}));
```

### 数据库连接池
```javascript
// mysql2自带连接池
const pool = mysql.createPool({
  connectionLimit: 10,  // 最大连接数
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

---

## 🎯 检查清单

### 开发环境
- [ ] 使用 morgan 记录HTTP请求（dev格式）
- [ ] 使用 winston 记录应用日志（console输出）
- [ ] 使用 dotenv 管理环境变量
- [ ] 使用 nodemon 自动重启

### 生产环境
- [ ] 使用 morgan 记录HTTP请求（combined格式，写入文件）
- [ ] 使用 winston 记录应用日志（写入文件，按级别）
- [ ] 使用 dotenv 管理环境变量（NODE_ENV=production）
- [ ] 使用 PM2 管理进程（自动重启、集群模式）
- [ ] 使用 helmet 增强安全性
- [ ] 使用 compression 压缩响应
- [ ] 使用 rate-limit 防止暴力攻击

---

## 🔗 相关资源

- **相关笔记**:
  - [[Express中间件机制]]
  - [[错误处理中间件]]
- **项目实战**: [[../../projects/11-personal-blog]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-24
**应用场景**: 所有Express项目
