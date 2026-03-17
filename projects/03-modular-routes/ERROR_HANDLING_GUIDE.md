# Express 错误处理完整指南

## 📚 学习目标

- 理解为什么需要错误处理
- 掌握Express错误处理中间件的使用
- 学会处理各种错误场景（404、500、参数验证等）
- 了解最佳实践和生产环境配置

## 🚀 运行示例

```bash
# 进入项目目录
cd projects/03-modular-routes

# 运行错误处理示例
node error-handling-demo.js
```

## 🎯 核心概念

### 1. 什么是错误处理中间件？

Express中间件有4个参数时，就是错误处理中间件：

```javascript
// 普通中间件：3个参数
app.use((req, res, next) => {
    // 处理逻辑
});

// 错误处理中间件：4个参数（第一个是err）
app.use((err, req, res, next) => {
    // 错误处理逻辑
});
```

### 2. 错误传递的流程

```
路由中发生错误
   ↓
调用 next(error)
   ↓
跳过后续普通中间件
   ↓
直接到达错误处理中间件
   ↓
返回错误响应给客户端
```

## 📖 常见错误处理模式

### 模式1：next(error) - 传递错误

```javascript
app.get('/users/:id', (req, res, next) => {
    const user = database.findUser(req.params.id);

    if (!user) {
        const error = new Error('用户不存在');
        error.status = 404;
        return next(error);  // 传递给错误处理中间件
    }

    res.json(user);
});
```

### 模式2：try-catch - 捕获异步错误

```javascript
app.get('/async', async (req, res, next) => {
    try {
        const data = await someAsyncFunction();
        res.json(data);
    } catch (error) {
        next(error);  // 捕获后传递
    }
});
```

### 模式3：Promise.catch() - 链式调用

```javascript
app.get('/promise', (req, res, next) => {
    someAsyncFunction()
        .then(data => res.json(data))
        .catch(error => next(error));  // 捕获Promise错误
});
```

### 模式4：包装函数（高级技巧）

```javascript
// 创建一个包装函数，自动处理try-catch
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 使用
app.get('/users', asyncHandler(async (req, res) => {
    const users = await database.getAllUsers();
    res.json(users);
    // 不需要try-catch，包装函数会自动处理错误！
}));
```

## 🔍 常见错误场景

### 场景1：资源不存在（404）

```javascript
app.get('/users/:id', (req, res, next) => {
    const user = await findUser(req.params.id);

    if (!user) {
        const error = new Error('用户不存在');
        error.status = 404;
        return next(error);
    }

    res.json(user);
});
```

### 场景2：参数验证失败（400）

```javascript
app.post('/users', (req, res, next) => {
    const { username, email } = req.body;

    if (!username || !email) {
        const error = new Error('用户名和邮箱必填');
        error.status = 400;
        return next(error);
    }

    const user = await createUser(username, email);
    res.status(201).json(user);
});
```

### 场景3：权限不足（403）

```javascript
app.delete('/users/:id', (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        const error = new Error('无权删除此用户');
        error.status = 403;
        return next(error);
    }

    await deleteUser(req.params.id);
    res.json({ message: '删除成功' });
});
```

### 场景4：数据库错误（500）

```javascript
app.get('/posts', async (req, res, next) => {
    try {
        const posts = await database.getAllPosts();
        res.json(posts);
    } catch (error) {
        // 数据库错误通常由统一的错误处理中间件处理
        error.message = '数据库查询失败';
        next(error);
    }
});
```

### 场景5：404处理（必须在最后）

```javascript
// 所有路由之后
app.use((req, res, next) => {
    const error = new Error(`API不存在: ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});
```

## 🛡️ 统一错误处理中间件

```javascript
app.use((err, req, res, next) => {
    // 1. 记录错误日志
    console.error(err);

    // 2. 确定状态码
    const status = err.status || 500;

    // 3. 返回错误响应
    res.status(status).json({
        success: false,
        message: err.message,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            status: status
        }
    });
});
```

## 🎨 自定义错误类

```javascript
class AppError extends Error {
    constructor(message, status = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'AppError';
    }
}

// 使用
app.get('/protected', (req, res, next) => {
    if (!req.user) {
        throw new AppError('需要登录', 401, 'UNAUTHORIZED');
    }
    res.json({ data: 'protected data' });
});
```

## ⚠️ 全局错误处理（防止进程崩溃）

```javascript
// 捕获未处理的异常
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    // 清理资源（关闭数据库等）
    process.exit(1);
});

// 捕获未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    // 不要退出，只记录日志
});
```

## 📊 错误响应格式

**推荐格式**：
```json
{
    "success": false,
    "message": "错误描述",
    "error": {
        "code": "ERROR_CODE",
        "status": 400,
        "details": {}
    }
}
```

## 🚫 常见错误

### 错误1：错误处理中间件位置不对

```javascript
// ❌ 错误：错误处理中间件放在前面
app.use((err, req, res, next) => { /* ... */ });
app.get('/users', ...);  // 这个路由永远执行不到

// ✅ 正确：错误处理中间件放在最后
app.get('/users', ...);
app.use((err, req, res, next) => { /* ... */ });
```

### 错误2：忘记调用next(error)

```javascript
// ❌ 错误：创建错误但没有传递
app.get('/users/:id', (req, res) => {
    if (!user) {
        const error = new Error('用户不存在');
        error.status = 404;
        // 忘记了 next(error);
    }
    res.json(user);
});

// ✅ 正确：传递错误
app.get('/users/:id', (req, res, next) => {
    if (!user) {
        const error = new Error('用户不存在');
        error.status = 404;
        return next(error);  // 必须传递！
    }
    res.json(user);
});
```

### 错误3：异步错误没有try-catch

```javascript
// ❌ 错误：异步错误没有被捕获
app.get('/async', async (req, res) => {
    const data = await someAsyncFunction();  // 可能抛出错误
    res.json(data);
});

// ✅ 正确：使用try-catch
app.get('/async', async (req, res, next) => {
    try {
        const data = await someAsyncFunction();
        res.json(data);
    } catch (error) {
        next(error);
    }
});
```

## 📖 下一步学习

- 参数验证中间件（express-validator）
- 日志记录中间件（morgan、winston）
- 安全中间件（helmet、cors）
