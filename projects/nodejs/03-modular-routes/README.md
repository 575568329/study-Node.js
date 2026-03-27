# Express 模块化路由示例

## 📚 学习目标

- 理解为什么需要模块化路由
- 掌握 `express.Router()` 的使用
- 学会组织大型项目的路由结构
- 理解路由挂载和URL前缀

## 🚀 运行方式

```bash
# 进入项目目录
cd projects/03-modular-routes

# 启动服务器
node app.js
```

## 📁 项目结构

```
03-modular-routes/
├── app.js              # 主文件（组装路由）
├── README.md           # 说明文档
└── routes/             # 路由模块目录
    ├── users.js        # 用户路由（6个接口）
    ├── posts.js        # 文章路由（6个接口）
    └── admin.js        # 后台管理路由（8个接口）
```

## 🎯 核心概念

### 1. 为什么需要模块化路由？

**❌ 传统方式的问题**：
```javascript
// app.js - 所有路由写在一个文件
app.post('/api/users/register', ...);
app.post('/api/users/login', ...);
app.get('/api/users/profile', ...);
app.post('/api/posts', ...);
app.get('/api/posts', ...);
// ... 90+个路由，文件有几千行！
```

**问题**：
- 文件太大，难以维护
- 多人协作困难（频繁冲突）
- 代码难以复用
- 测试困难

**✅ 模块化路由的优势**：
```javascript
// app.js - 清爽简洁
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/admin', adminRouter);
```

**优势**：
- ✅ 代码清晰，每个文件只关注一个领域
- ✅ 易于维护，修改功能只需打开对应文件
- ✅ 团队协作，不同人负责不同模块
- ✅ 代码复用，路由模块可在多项目使用
- ✅ 易于测试，每个模块可单独测试

### 2. express.Router() 的使用

**创建路由模块**：
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 定义路由（相对路径）
router.post('/register', ...);
router.get('/profile', ...);

module.exports = router;
```

**挂载路由模块**：
```javascript
// app.js
const usersRouter = require('./routes/users');

// 挂载时添加URL前缀
app.use('/api/users', usersRouter);

// 实际访问路径：/api/users/register
//             /api/users/profile
```

### 3. URL路径拼接规则

```javascript
// 挂载前缀：/api/users
// 路由路径：/profile
// 实际访问：/api/users/profile

app.use('/api/users', usersRouter);
     └─ 挂载前缀
              router.get('/profile', ...);
              └─ 路由路径

最终：/api/users + /profile = /api/users/profile
```

### 4. 路由模块的中间件

可以为每个路由模块单独添加中间件：

```javascript
// routes/admin.js
const router = express.Router();

// 权限验证中间件
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: '无权访问' });
    }
    next();
};

// 所有后台路由都先验证权限
router.use(checkAdmin);

router.get('/stats', ...);
router.get('/users', ...);

module.exports = router;
```

## 💡 实际应用场景

### 场景1：大型Web应用

```javascript
// 电商系统
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/users', usersRouter);
app.use('/admin', adminRouter);
```

### 场景2：版本控制

```javascript
// API版本管理
const v1Router = express.Router();
const v2Router = express.Router();

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

### 场景3：功能模块复用

```javascript
// 用户认证模块可以在多个项目中复用
// auth/
//   ├── routes/
//   │   └── auth.js
//   ├── controllers/
//   ├── models/
//   └── middleware/
```

## 🔍 测试API

```bash
# 获取API文档
curl http://localhost:3000/

# 用户相关
curl http://localhost:3000/api/users/profile
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'

# 文章相关
curl http://localhost:3000/api/posts
curl http://localhost:3000/api/posts/1

# 后台管理
curl http://localhost:3000/admin/stats
curl http://localhost:3000/admin/users
```

## 📖 下一步学习

- 错误处理中间件
- 常用第三方中间件（cors、morgan、helmet）
- 参数验证（express-validator）
- 文件上传（multer）
