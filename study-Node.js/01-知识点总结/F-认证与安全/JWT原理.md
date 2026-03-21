---
tags:
  - JWT
  - 认证
  - 安全
  - F-认证与安全
创建时间: 2026-03-21
更新时间: 2026-03-21
相关主题: [[JWT在Express中的实现]] [[Token刷新机制]]
难度: ⭐⭐⭐
重要性: ⭐⭐⭐⭐⭐
---

# JWT（JSON Web Token）原理

## 📚 定义

**JWT (JSON Web Token)** = 一种开放标准（RFC 7519），用于在各方之间安全地传输信息的**紧凑的、URL安全的**方式。

**本质**：一张**加密的数字门票**

---

## 🔐 JWT的三个部分

### 结构示意

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWxpY2UifQ.signature
```

三个部分用`.`分隔：

### 1️⃣ Header（头部）

**作用**：描述JWT的元数据

**内容**：
```json
{
  "alg": "HS256",  // 签名算法（HMACSHA256、RSA等）
  "typ": "JWT"     // 令牌类型
}
```

**编码方式**：Base64编码（可解码，不加密）

---

### 2️⃣ Payload（载荷）⭐

**作用**：存储**实际的用户信息**（Claims，声明）

**内容**：
```json
{
  "userId": 1,
  "username": "alice",
  "email": "alice@example.com",
  "iat": 1690000000,  // Issued At - 签发时间
  "exp": 1690086400   // Expiration - 过期时间
}
```

**编码方式**：Base64编码（**可解码，不加密！**）

**⚠️ 安全警告**：
- ❌ 不要存密码、信用卡号等敏感信息
- ❌ Base64可以轻易解码，任何人都能看到
- ✅ 只存非敏感的用户标识（userId、username等）

---

### 3️⃣ Signature（签名）🔑

**作用**：**防伪标识**，防止JWT被篡改

**计算方式**：
```
Signature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key  // 🔑 只有服务器知道的密钥
)
```

**特点**：
- ✅ **加密**（无法伪造）
- ✅ 任何对payload的修改都会导致signature不匹配
- ✅ 只有拥有密钥的服务器才能生成

---

## 🛡️ 防伪造原理

### 场景：黑客尝试伪造token

**原始token**：
```
header.payload.signature
```

**黑客修改payload**：
```javascript
// 把userId从1改成999
header.修改后的payload.signature  // ⚠️ 注意：signature还是原来的
```

**后端验证流程**：
```javascript
// 1. 解析token，得到header、payload、signature
// 2. 用密钥重新计算签名
const 新signature = HMACSHA256(header + 修改后的payload, 密钥);

// 3. 对比签名
if (新signature === token中的signature) {
  // ✅ token未被篡改
} else {
  // ❌ token已被篡改，拒绝请求
  res.status(401).json({ message: 'Token无效' });
}
```

**结果**：黑客的修改被检测到！❌

---

## 📊 JWT vs Session

| 对比项 | Session | JWT |
|--------|---------|-----|
| **存储位置** | 服务器（内存/Redis） | 客户端（localStorage/cookie） |
| **状态** | 有状态 | 无状态 |
| **扩展性** | 需要session共享（分布式难） | 天然支持分布式 |
| **性能** | 每次查session数据库 | 直接验证token（快） |
| **服务器负担** | 高（存储session） | 低（不存储） |
| **撤销** | 容易（删除session） | 困难（无状态） |

---

## ✅ JWT的优势

1. **无状态**（Stateless）
   - 服务器不需要存储session
   - 降低服务器负担

2. **跨域友好**（CORS）
   - 适合前后端分离
   - 适合微服务架构

3. **移动端友好**
   - 一次登录，多端使用
   - 不受cookie限制

4. **性能好**
   - 不需要查询session数据库
   - 直接验证签名

---

## ⚠️ JWT的劣势

1. **无法撤销**
   - Token签发后无法失效（除非过期）
   - 解决方案：短过期时间 + Refresh Token

2. **Payload可见**
   - Base64可解码，不要存敏感信息

3. **Token体积大**
   - 比session ID大
   - 每次请求都要携带

4. **刷新复杂**
   - 需要额外的刷新机制

---

## 🔑 密钥管理

### 开发环境
```javascript
const JWT_SECRET = 'your-secret-key-change-in-production';
```

### 生产环境 ⚠️
```javascript
// 使用环境变量
const JWT_SECRET = process.env.JWT_SECRET;

// 密钥要求：
// ✅ 至少32位随机字符
// ✅ 定期更换
// ✅ 严格保密，不要泄露
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **设置合理的过期时间**
   ```javascript
   jwt.sign(payload, secret, { expiresIn: '15m' }); // Access Token
   jwt.sign(payload, secret, { expiresIn: '7d' });  // Refresh Token
   ```

2. **使用HTTPS传输**
   - 防止中间人窃取token

3. **敏感操作二次验证**
   - 修改密码、支付等需要重新输入密码

4. **密钥复杂且保密**
   - 至少32位随机字符
   - 存储在环境变量中

### ❌ 避免做法

1. ❌ 在payload存敏感信息（密码、信用卡）
2. ❌ 密钥写在代码里
3. ❌ 用HTTP传输token
4. ❌ 设置过长的过期时间（如30天）
5. ❌ 忘记处理token过期错误

---

## 🔗 相关主题

- [[JWT在Express中的实现]] - 如何在代码中使用JWT
- [[Token刷新机制]] - Access Token + Refresh Token
- [[Cookie vs localStorage]] - Token存储位置安全性对比

---

## 📝 代码示例

完整代码见：[[../../projects/09-jwt-auth]]

**生成token**：
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: 1, username: 'alice' },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

**验证token**：
```javascript
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded.userId); // 1
} catch (error) {
  // Token无效或过期
}
```

---

## 💡 关键要点

1. **JWT = Header.Payload.Signature**
2. **Header和Payload只是Base64编码（可解码）**
3. **Signature是加密的（防伪造）**
4. **不要在Payload存敏感信息**
5. **密钥必须保密**
6. **生产环境必须用HTTPS**

---

**学习日期**: 2026-03-21
**掌握程度**: ⭐⭐⭐⭐⭐
**复习频率**: 每周复习一次
