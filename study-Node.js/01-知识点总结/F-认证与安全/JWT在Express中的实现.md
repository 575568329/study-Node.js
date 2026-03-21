---
tags:
  - JWT
  - Express
  - 认证
  - F-认证与安全
创建时间: 2026-03-21
更新时间: 2026-03-21
相关主题: [[JWT原理]] [[Token刷新机制]]
难度: ⭐⭐⭐⭐
重要性: ⭐⭐⭐⭐⭐
---

# JWT在Express中的实现

## 📚 概述

在Express中使用JWT实现用户认证系统，包括注册、登录、Token验证等完整流程。

---

## 🛠️ 技术栈

```bash
npm install jsonwebtoken   # JWT生成和验证
npm install bcrypt         # 密码加密
npm install express-validator  # 参数验证
```

---

## 📦 项目结构

```
09-jwt-auth/
├── src/
│   ├── server.js           # Express服务器
│   ├── db.js              # 数据库连接池
│   ├── jwtUtils.js        # JWT工具函数
│   ├── authMiddleware.js  # JWT验证中间件
│   └── authRoutes.js      # 认证路由
└── test.html              # 前端测试页面
```

---

## 🔑 核心实现

### 1️⃣ JWT工具函数 (jwtUtils.js)

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成JWT token
export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// 验证JWT token
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
```

**关键点**：
- `jwt.sign()` - 生成token
- `jwt.verify()` - 验证token
- `expiresIn` - 过期时间（'7d' = 7天，'15m' = 15分钟）

---

### 2️⃣ 认证中间件 (authMiddleware.js)

```javascript
import { verifyToken } from './jwtUtils.js';

export function authMiddleware(req, res, next) {
  // 1. 从请求头提取token
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '未提供认证token'
    });
  }

  // 2. 解析token（格式：Bearer <token>）
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token格式错误'
    });
  }

  // 3. 验证token
  try {
    const decoded = verifyToken(token);

    // 4. 将用户信息挂载到req上
    req.user = decoded;

    // 5. 继续执行
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token已过期'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token无效'
      });
    }

    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
}
```

**关键点**：
- Token格式：`Authorization: Bearer <token>`
- 验证成功 → `req.user` 挂载用户信息
- 验证失败 → 返回401错误

---

### 3️⃣ 用户注册 (authRoutes.js)

```javascript
router.post('/register', [
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('email').trim().isEmail().withMessage('请输入有效的邮箱'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位')
], async (req, res) => {
  // 1. 参数验证
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }

  const { username, email, password } = req.body;

  try {
    // 2. 检查用户是否存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 3. 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. 插入数据库
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        userId: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('注册失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});
```

**关键点**：
- 参数验证（express-validator）
- 用户名/邮箱唯一性检查
- 密码加密（bcrypt）
- SQL注入防护（参数化查询）

---

### 4️⃣ 用户登录 (authRoutes.js) ⭐

```javascript
router.post('/login', [
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. 查询用户
    const [users] = await pool.query(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 3. 生成JWT token ⭐ 核心步骤！
    const token = generateToken({
      userId: user.id,
      username: user.username
    }, '7d');

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,  // 🔑 返回token给前端
        user: {
          userId: user.id,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('登录失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});
```

**关键点**：
- 查询用户 → 验证密码 → 生成token
- `bcrypt.compare()` - 验证密码
- Token payload只存非敏感信息

---

### 5️⃣ 获取个人信息 (authRoutes.js)

```javascript
router.get('/profile', authMiddleware, async (req, res) => {
  // authMiddleware已经验证了token
  const { userId, username } = req.user;

  try {
    // 从数据库获取完整用户信息
    const [users] = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '获取成功',
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户信息失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});
```

**关键点**：
- `authMiddleware` 自动验证token
- `req.user` 获取用户信息
- 不返回密码等敏感信息

---

## 🌐 前端使用

### 存储Token

```javascript
// 登录成功后
function saveToken(token) {
  localStorage.setItem('access_token', token);
}
```

### 发送请求（携带Token）

```javascript
async function fetchProfile() {
  const token = localStorage.getItem('access_token');

  const response = await fetch('http://localhost:3000/api/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`  // ⭐ 携带token
    }
  });

  const data = await response.json();
  console.log(data);
}
```

**关键点**：
- Token存储在localStorage（或cookie）
- 每次请求都在请求头携带：`Authorization: Bearer <token>`

---

## 🔐 完整认证流程

```
1. 用户注册
   前端 → POST /register {username, password}
   → 后端验证 + 加密密码 + 存数据库
   → 返回成功

2. 用户登录
   前端 → POST /login {username, password}
   → 后端验证密码
   → 生成JWT token
   → 返回token给前端
   → 前端存储token

3. 访问受保护API
   前端 → GET /profile + Authorization: Bearer <token>
   → 后端authMiddleware验证token
   → 提取用户信息到req.user
   → 返回数据
```

---

## ⚠️ 常见错误

### 1. Token格式错误

**错误**：
```
Authorization: Bearer  (缺少token)
Authorization: token (缺少Bearer)
```

**正确**：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Token过期

**错误信息**：
```json
{
  "success": false,
  "message": "Token已过期"
}
```

**解决**：使用 [[Token刷新机制]] 或重新登录

### 3. 密钥不匹配

**原因**：生成token和验证token使用的密钥不一致

**解决**：确保使用同一个 `JWT_SECRET`

---

## 🎯 最佳实践

1. **使用环境变量存储密钥**
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET;
   ```

2. **设置合理的过期时间**
   ```javascript
   jwt.sign(payload, secret, { expiresIn: '15m' }); // Access Token
   ```

3. **参数验证**
   ```javascript
   body('username').trim().notEmpty().withMessage('用户名不能为空')
   ```

4. **密码加密**
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

5. **SQL注入防护**
   ```javascript
   'SELECT * FROM users WHERE username = ?', [username]
   ```

6. **错误处理**
   ```javascript
   try {
     // ...
   } catch (error) {
     console.error('错误：', error);
     res.status(500).json({ message: '服务器错误' });
   }
   ```

---

## 🔗 相关主题

- [[JWT原理]] - JWT的结构和原理
- [[Token刷新机制]] - Access Token + Refresh Token
- [[bcrypt密码加密]] - 密码加密详解
- [[CORS跨域]] - 前后端跨域问题

---

## 📝 完整代码示例

详见：`../../projects/09-jwt-auth/`

**测试步骤**：
1. 启动服务器：`cd projects/09-jwt-auth && npm start`
2. 打开浏览器：访问 `test.html`
3. 测试注册、登录、获取个人信息

---

## 💡 关键要点

1. **jwt.sign()** - 生成token
2. **jwt.verify()** - 验证token
3. **authMiddleware** - 验证中间件
4. **Authorization: Bearer <token>** - 请求头格式
5. **req.user** - 验证后的用户信息
6. **密码必须加密** - bcrypt.hash()

---

**学习日期**: 2026-03-21
**掌握程度**: ⭐⭐⭐⭐⭐
**复习频率**: 每周复习一次
