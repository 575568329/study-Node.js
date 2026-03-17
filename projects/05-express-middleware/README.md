# Express第三方中间件学习项目

## 📚 学习目标

掌握Express的4个核心第三方中间件：
1. **helmet** - 安全防护
2. **morgan** - 日志记录
3. **cors** - 跨域资源共享
4. **express-validator** - 参数验证（待学习）

---

## 🚀 快速启动

### 1️⃣ 启动后端服务器

```bash
# 进入项目目录
cd d:\study\Node.js-Study\projects\05-express-middleware

# 启动后端（端口3001）
node server.js
```

**后端启动成功后，你会看到**：
```
🚀 服务器运行在 http://localhost:3001
📝 已启用的中间件:
   - helmet: 安全防护
   - morgan: 日志记录
   - cors: 跨域支持 (源: http://localhost:3000)
```

### 2️⃣ 启动前端服务器

**新开一个终端窗口**：

```bash
# 进入前端目录
cd d:\study\Node.js-Study\projects\05-express-middleware\frontend

# 启动前端（端口3000）
python -m http.server 3000
```

**或者使用其他HTTP服务器**：
```bash
# 使用Node.js的http-server
npx http-server -p 3000

# 使用PHP
php -S localhost:3000
```

### 3️⃣ 打开浏览器测试

访问：`http://localhost:3000`

---

## 🧪 测试内容

### 测试1：查看Morgan日志
- 点击任意按钮
- 查看后端控制台的彩色日志输出
- 观察请求方法、路径、状态码、响应时间

### 测试2：验证CORS跨域
- 打开浏览器开发者工具（F12）
- 点击"获取用户列表"
- 在Network标签查看请求
- ✅ 成功：没有CORS错误
- ❌ 失败：看到CORS错误提示

### 测试3：查看安全响应头（Helmet）
- 在Network标签点击任意API请求
- 查看Response Headers
- ✅ 你会看到helmet添加的安全头部：
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: ...`
  - 等等...

---

## 📂 项目结构

```
05-express-middleware/
├── backend/
│   └── server.js          # Express服务器（集成helmet/morgan/cors）
├── frontend/
│   └── index.html         # 测试页面（调用后端API）
├── package.json           # 项目依赖
└── README.md              # 本文件
```

---

## 🔧 技术栈

### 后端
- Express.js 4.18.2
- cors 2.8.5
- morgan 1.10.0
- helmet 7.1.0

### 前端
- 纯HTML + CSS + JavaScript（无框架）
- Fetch API进行HTTP请求

---

## 📖 中间件详解

### 1. helmet - 安全防护

**作用**：设置各种安全相关的HTTP响应头

**防护内容**：
- XSS攻击
- 点击劫持
- MIME类型嗅探

**代码**：
```javascript
import helmet from 'helmet';
app.use(helmet());
```

---

### 2. morgan - 日志记录

**作用**：自动记录HTTP请求的详细信息

**日志格式**：
- `dev` - 开发环境（彩色输出）
- `combined` - 生产环境（Apache标准格式）
- `common` - 简洁格式

**代码**：
```javascript
import morgan from 'morgan';
app.use(morgan('dev'));
```

**日志示例**：
```
GET /api/users 200 4.231 ms - 298
POST /api/users 201 2.145 ms - 105
```

---

### 3. cors - 跨域资源共享

**作用**：允许前端跨域访问后端API

**配置选项**：
```javascript
import cors from 'cors';

// 开发环境：允许所有源
app.use(cors());

// 生产环境：指定允许的源
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

---

## 🎯 API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users` | 获取用户列表 |
| POST | `/api/users` | 创建用户 |
| PUT | `/api/users/:id` | 更新用户 |
| DELETE | `/api/users/:id` | 删除用户 |
| GET | `/api/error` | 测试错误处理 |

---

## ❓ 常见问题

### Q1: 前端请求失败，报CORS错误？

**A**：检查后端是否正确配置了cors中间件，并且origin是否正确。

### Q2: 看不到Morgan日志？

**A**：确认后端服务器正在运行，并且有请求发送到后端。

### Q3: 前端页面无法打开？

**A**：确保前端HTTP服务器已启动在端口3000。

---

## 📝 学习笔记

**日期**：2026-03-17
**学习主题**：Express第三方中间件
**掌握程度**：helmet✅ morgan✅ cors✅

---

**下一步学习**：express-validator（参数验证中间件）
