# 09-jwt-auth - JWT用户认证系统

## 📚 项目简介

这是一个完整的JWT用户认证系统，实现了**双Token刷新机制**（Access Token + Refresh Token），是学习Node.js后端安全认证的实战项目。

**学习日期**: 2026-03-21
**课程主题**: F.2 JWT原理、F.3 JWT实现、F.4 Token刷新机制

---

## 🎯 核心功能

### ✅ 已实现功能

1. **用户注册**
   - 用户名唯一性验证
   - 邮箱格式验证 + 唯一性验证
   - 密码加密存储（bcrypt）
   - 参数验证（express-validator）

2. **用户登录**
   - 密码验证
   - 生成双Token（Access Token 15分钟 + Refresh Token 7天）
   - 返回用户信息

3. **Token刷新** ⭐
   - 自动刷新Access Token
   - 验证Refresh Token有效性
   - 处理Token过期错误

4. **获取个人信息**
   - JWT验证中间件
   - 返回完整用户信息

5. **前端自动刷新** ⭐
   - 拦截401错误
   - 自动调用刷新接口
   - 用户无感知体验

---

## 🛠️ 技术栈

### 后端
- **Express** - Web框架
- **jsonwebtoken** - JWT生成和验证
- **bcrypt** - 密码加密
- **mysql2** - 数据库连接
- **express-validator** - 参数验证
- **cookie-parser** - Cookie解析

### 前端
- **原生JavaScript** - 无框架
- **Fetch API** - HTTP请求
- **localStorage** - Token存储

### 数据库
- **MySQL 8.0** - 关系型数据库
- **blog_database** - 数据库名
- **users表** - 用户表（id, username, email, password, avatar, created_at）

---

## 📦 安装和运行

### 1. 安装依赖

```bash
cd projects/09-jwt-auth
npm install
```

### 2. 配置数据库

确保MySQL服务已启动，并创建数据库：

```sql
CREATE DATABASE blog_database;
```

### 3. 启动服务器

```bash
npm start
```

服务器运行在 `http://localhost:3000`

### 4. 测试功能

打开浏览器访问 `test.html` 文件，测试完整流程：

1. 注册新用户
2. 登录获取双Token
3. 访问个人信息（需要Token）
4. 测试Token自动刷新

---

## 🔑 API接口

### 1. 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@example.com",
  "password": "123456"
}
```

**响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userId": 1,
    "username": "alice",
    "email": "alice@example.com"
  }
}
```

### 2. 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "alice",
  "password": "123456"
}
```

**响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "username": "alice"
    }
  }
}
```

### 3. 刷新Token ⭐
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应**:
```json
{
  "success": true,
  "message": "刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. 获取个人信息
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

**响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "created_at": "2026-03-21T12:00:00.000Z"
  }
}
```

---

## 🔐 JWT工作原理

### JWT结构

```
Header.Payload.Signature
```

1. **Header**: 算法和类型（Base64编码）
2. **Payload**: 用户信息（Base64编码，不加密！）
3. **Signature**: 数字签名（加密，防伪造）

### 防伪造原理

```javascript
// 后端验证流程
新signature = HMACSHA256(header + payload + 密钥)

if (新signature === token中的signature) {
  // Token未被篡改 ✅
} else {
  // Token已被篡改 ❌ 拒绝请求
}
```

---

## 🔄 Token刷新机制

### 为什么需要双Token？

| Token类型 | 过期时间 | 用途 | 存储位置 |
|-----------|---------|------|---------|
| **Access Token** | 15分钟 | 访问API | localStorage |
| **Refresh Token** | 7天 | 刷新Access Token | localStorage（生产环境建议httpOnly cookie） |

### 刷新流程

```
1. 用户登录 → 获取 Access Token + Refresh Token
2. 访问API → 携带 Access Token
3. Access Token过期 → 收到401错误
4. 前端自动调用 /refresh-token → 携带 Refresh Token
5. 后端验证 Refresh Token → 返回新的 Access Token
6. 前端重新发送原请求 → 使用新的 Access Token
7. 用户无感知 ✅
```

---

## 📁 项目结构

```
09-jwt-auth/
├── src/
│   ├── server.js           # Express服务器
│   ├── db.js              # 数据库连接池
│   ├── jwtUtils.js        # JWT工具函数
│   ├── authMiddleware.js  # JWT验证中间件
│   └── authRoutes.js      # 认证路由
├── test.html              # 前端测试页面
├── package.json           # 项目配置
└── README.md              # 项目说明
```

---

## 🎓 学习要点

### 1. JWT vs Session

| 对比项 | Session | JWT |
|--------|---------|-----|
| **存储** | 服务器 | 客户端 |
| **状态** | 有状态 | 无状态 |
| **扩展性** | 需要session共享 | 天然支持分布式 |
| **性能** | 每次查session | 直接验证token |

### 2. 安全性最佳实践

- ✅ Access Token短期（15分钟）
- ✅ Refresh Token长期（7天）
- ✅ 使用HTTPS传输
- ✅ 密钥复杂且保密
- ⚠️ 不要在Payload存敏感信息（Base64可解码）
- ⚠️ 生产环境用httpOnly cookie存储Refresh Token

### 3. Cookie vs localStorage

| 存储方式 | 安全性 | 原因 |
|---------|-------|------|
| **localStorage** | ⚠️ 较低 | 易受XSS攻击 |
| **Cookie（httpOnly）** | ✅ 更高 | 防止XSS窃取 |

---

## 🚀 后续优化方向

1. **Refresh Token轮换**
   - 每次刷新时生成新的Refresh Token
   - 旧的Refresh Token立即失效

2. **Refresh Token黑名单**
   - 用户登出时将Refresh Token加入黑名单
   - 实现Token撤销机制

3. **httpOnly Cookie**
   - 将Refresh Token存储在httpOnly cookie
   - 防止XSS攻击窃取

4. **设备指纹**
   - 绑定Refresh Token到设备/IP
   - 检测异常登录

---

## 📝 学习笔记

完整学习笔记请查看：
- [今日会话记录](../../sessions/2026-03-21/session-notes.md)
- [进度追踪器](../../progress/nodejs-study-tracker.md)

---

## 🎉 学习成果

通过本项目，你学会了：

- ✅ JWT的原理和结构（Header、Payload、Signature）
- ✅ JWT的防伪造机制（密钥签名）
- ✅ 双Token设计（Access Token + Refresh Token）
- ✅ Token自动刷新流程
- ✅ 前端401错误拦截
- ✅ 用户无感知的认证体验
- ✅ Cookie vs localStorage安全性对比

**进度提升**: 42% → 47% (+5%)

---

**最后更新**: 2026-03-21
**作者**: Node.js学习笔记
**GitHub**: [study-Node.js](https://github.com/575568329/study-Node.js)
