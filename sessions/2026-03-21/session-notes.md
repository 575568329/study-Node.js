# 2026-03-21 学习会话记录

## 📊 会话概述

- **日期**: 2026-03-21
- **学习时长**: 进行中
- **学习形式**: 理论学习 + AI导师指导
- **主要主题**:
  - F.2 JWT（JSON Web Token）原理
  - F.3 JWT在Express中的实现

---

## 🎓 学习前的知识评估

### 学生对JWT的初始理解

学生准确选择了方案C（门票机制），说明对JWT的核心概念有直觉理解：
- 理解了"给用户一张门票，以后凭票入场"的类比
- 理解了JWT是无状态的认证方式

---

## 💡 核心概念讲解

### 1. JWT是什么

**JWT = JSON Web Token**，就是一张**加密的数字门票**

**三个部分**：
1. **Header**（Base64编码）：算法和类型
2. **Payload**（Base64编码）：用户信息（**不加密！不要存密码！**）
3. **Signature**（加密签名）：防伪标识（**只有服务器能生成**）

### 2. JWT的防伪造原理

**Signature计算方式**：
```
Signature = HMACSHA256(header + payload + 密钥)
```

- 前端修改payload → signature不匹配 → 后端拒绝请求
- 前端无法伪造signature（因为没有密钥）

### 3. 认证流程

1. **登录**：验证密码 → 生成JWT token → 返回给前端
2. **存储**：前端保存token（localStorage）
3. **访问API**：每次请求携带token（Authorization: Bearer xxx）
4. **验证**：后端验证token签名 → 提取用户信息 → 执行业务逻辑

---

## 🔍 理解检查

### 问题1：前端修改payload能否绕过验证？

**学生回答**：
- ✅ 前端能修改userId
- ✅ 后端能发现伪造
- ✅ 通过编码规则和密钥加密实现防伪

**纠正**：
1. ❌ 不是"重新登录"，而是"直接拒绝401"
2. ❌ 不是"用name编码"，而是"用密钥签名"
3. ✅ 理解了防伪造的核心原理

### 问题2：黑客偷到token后的风险

**需要掌握**：
- 黑盗可以直接使用原token冒充用户
- 必须设置token过期时间（如7天）
- 必须使用HTTPS传输
- 不要存敏感信息在payload（Base64可解码）

---

## 💻 代码实践

### 项目：09-jwt-auth（完整JWT认证系统）

**技术栈**：
- Express（路由）
- jsonwebtoken（生成和验证JWT）
- bcrypt（密码加密）
- mysql2（数据库）
- express-validator（参数验证）

**实现功能**：
1. ✅ 用户注册（用户名、邮箱、密码）
2. ✅ 用户登录（生成JWT token，7天过期）
3. ✅ 获取个人信息（验证JWT token）
4. ✅ 参数验证（邮箱格式、密码长度）
5. ✅ 唯一性验证（用户名、邮箱）
6. ✅ 前端测试页面（完整的注册→登录→获取信息流程）

**核心代码**：
- `jwtUtils.js`：生成token（`jwt.sign()`）和验证token（`jwt.verify()`）
- `authMiddleware.js`：中间件验证token，提取用户信息
- `authRoutes.js`：注册、登录、获取个人信息的路由

**密钥管理**：
- 使用环境变量 `JWT_SECRET=your-secret-key`
- 生产环境必须使用复杂密钥（至少32位随机字符）

---

## 📊 进度更新

总体进度：42% → 43% (+1%)
新增主题：2个（F.2 JWT原理、F.3 JWT实现）

### 已掌握主题

- ✅ **F.2** JWT（JSON Web Token）原理 (2026-03-21) - **High**
  - JWT的三个部分：Header、Payload、Signature
  - Base64编码 vs 加密的区别
  - Signature的防伪造原理（密钥签名）
  - JWT的优势：无状态、跨域友好、移动端友好

- ✅ **F.3** JWT在Express中的实现 (2026-03-21) - **High**
  - jsonwebtoken包：`jwt.sign()`生成、`jwt.verify()`验证
  - 认证流程：登录→生成token→存储token→携带token→验证token
  - authMiddleware中间件：验证token并提取用户信息
  - 密钥管理：使用环境变量
  - Token过期时间：设置合理的过期时间（如7天）
  - 前端存储：localStorage存储token
  - 前端发送：Authorization: Bearer <token>

---

## 📝 下一步计划

### ✅ 已完成：Token刷新机制（F.4）

学习内容：
- ✅ Access Token（15分钟短期token）
- ✅ Refresh Token（7天长期token）
- ✅ 刷新流程：Access Token过期 → 自动用Refresh Token换取新的Access Token
- ✅ 前端自动刷新机制（fetchWithRefresh拦截401错误）
- ✅ 用户无感知的token刷新体验

---

### 推荐学习内容

**F.5 CORS跨域**（深入）
- 同源策略的限制
- CORS配置
- 预检请求（OPTIONS）

**F.7 密码加密**（深入）
- bcrypt的加密原理
- Salt Rounds的作用
- 为什么不能用明文密码

**或开始实战项目**
- 综合项目：完整的用户系统（注册、登录、修改密码、忘记密码）

---

## 💡 学习心得

**学生表现**：
- ✅ 对JWT的理解很准确（选择了正确的类比）
- ✅ 成功完成了完整的认证流程测试
- ✅ 理解了防伪造的核心原理（密钥签名）
- ✅ 快速掌握了Token刷新机制（前后端完整实现）
- ✅ 理解了双token设计的安全优势

**关键理解**：
1. ✅ Cookie vs localStorage安全性（Cookie的httpOnly更安全）
2. ✅ Token过期时间的作用（限制被盗后的风险期）
3. ✅ 自动刷新流程（用户体验与安全的平衡）
4. ✅ 双token设计（Access Token短期 + Refresh Token长期）

**需要巩固**：
- Refresh Token轮换策略（每次刷新时更新refreshToken）
- Refresh Token黑名单（撤销机制）
- 安全性最佳实践（HTTPS、httpOnly cookie）
