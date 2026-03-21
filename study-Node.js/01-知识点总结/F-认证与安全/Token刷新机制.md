---
tags:
  - JWT
  - Token刷新
  - 认证
  - F-认证与安全
创建时间: 2026-03-21
更新时间: 2026-03-21
相关主题: [[JWT原理]] [[JWT在Express中的实现]]
难度: ⭐⭐⭐⭐⭐
重要性: ⭐⭐⭐⭐⭐
---

# Token刷新机制

## 📚 概述

**Token刷新机制** = 用两个token（Access Token + Refresh Token）实现**用户无感知的认证续期**

**解决的问题**：
- Access Token短期（15分钟）- 安全但频繁过期
- Refresh Token长期（7天）- 用于刷新Access Token
- 用户无需重新登录

---

## 🎯 为什么需要Token刷新？

### 问题场景

```
用户填写一个长表单 → 填了20分钟 → 点击提交 → ❌ Token已过期
```

### 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| **延长Token过期时间** | 用户体验好 | ❌ 被盗后风险期太长（不安全） |
| **用户重新登录** | 安全 | ❌ 用户体验差（频繁登录） |
| **Token刷新机制** | ✅ 安全 + 体验好 | 需要额外实现 |

---

## 🔑 双Token设计

### Access Token（访问令牌）

```javascript
{
  "userId": 1,
  "username": "alice",
  "exp": 15分钟  // ⏰ 短期
}
```

**特点**：
- ⏰ **过期时间短**（15分钟）
- 🔑 **用于访问API**（获取个人信息、发帖等）
- ⚠️ **被盗风险小**（只能用15分钟）

---

### Refresh Token（刷新令牌）

```javascript
{
  "userId": 1,
  "username": "alice",
  "exp": 7天  // 📅 长期
}
```

**特点**：
- 📅 **过期时间长**（7天）
- 🔑 **只用于刷新Access Token**
- 🔒 **存储更安全**（httpOnly cookie，生产环境）
- ⚠️ **用途单一**（不能访问其他API）

---

## 🔄 刷新流程

### 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│ 1. 用户登录                                              │
│    → 后端返回 Access Token (15分钟) + Refresh Token (7天)│
│    → 前端保存到localStorage                              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 用户访问API                                           │
│    → 携带 Access Token                                   │
│    → 后端验证通过 → 返回数据                             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Access Token过期（15分钟后）                          │
│    → 前端收到 401 错误                                   │
│    → 前端自动调用 /refresh-token 接口                    │
│    → 携带 Refresh Token                                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 后端验证Refresh Token                                 │
│    → 验证通过 → 生成新的 Access Token                    │
│    → 返回新的 Access Token                               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 前端自动重新发送原请求                                │
│    → 使用新的 Access Token                               │
│    → 后端验证通过 → 返回数据                             │
│    → ✅ 用户无感知（不需要重新登录）                      │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 后端实现

### 1️⃣ 生成两个Token（登录时）

```javascript
import { generateAccessToken, generateRefreshToken } from './jwtUtils.js';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // ... 验证用户名和密码 ...

  // 生成两个token ⭐
  const accessToken = generateAccessToken({
    userId: user.id,
    username: user.username
  });  // ⏰ 15分钟过期

  const refreshToken = generateRefreshToken({
    userId: user.id,
    username: user.username
  });  // 📅 7天过期

  res.json({
    success: true,
    message: '登录成功',
    data: {
      accessToken,   // ⏰ 15分钟
      refreshToken,  // 📅 7天
      user: {
        userId: user.id,
        username: user.username
      }
    }
  });
});
```

**jwtUtils.js**：
```javascript
// 生成Access Token（15分钟）
export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// 生成Refresh Token（7天）
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
```

---

### 2️⃣ 刷新Token接口 ⭐

```javascript
router.post('/refresh-token', [
  body('refreshToken').notEmpty().withMessage('Refresh Token不能为空')
], async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // 1. 验证refreshToken
    const decoded = verifyToken(refreshToken);

    // 2. 生成新的accessToken
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      username: decoded.username
    });

    res.json({
      success: true,
      message: '刷新成功',
      data: {
        accessToken: newAccessToken  // ⏰ 新的Access Token（15分钟）
      }
    });
  } catch (error) {
    // Token无效或过期
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh Token已过期，请重新登录'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Refresh Token无效'
    });
  }
});
```

**关键点**：
- 只验证Refresh Token
- 只生成新的Access Token（不生成新的Refresh Token）
- 如果Refresh Token也过期，用户必须重新登录

---

## 🌐 前端实现

### 存储两个Token

```javascript
function saveToken(accessToken, refreshToken) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

function getAccessToken() {
  return localStorage.getItem('access_token');
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}
```

---

### 刷新Access Token

```javascript
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('没有Refresh Token');
  }

  const response = await fetch('http://localhost:3000/api/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();

  if (data.success) {
    // 更新access token
    localStorage.setItem('access_token', data.data.accessToken);
    return data.data.accessToken;
  } else {
    // Refresh token也过期了，清除所有token
    clearTokens();
    throw new Error(data.message);
  }
}
```

---

### 自动刷新机制（拦截401）⭐⭐⭐

```javascript
async function fetchWithRefresh(url, options = {}) {
  const token = getAccessToken();

  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  // 第一次请求
  let response = await fetch(url, options);

  // 如果401（token过期），尝试刷新
  if (response.status === 401 && getRefreshToken()) {
    try {
      // 刷新token
      const newToken = await refreshAccessToken();

      // 用新token重新发送请求
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      };

      response = await fetch(url, options);
    } catch (error) {
      console.error('刷新token失败：', error);
      // 刷新失败，清除token并跳转到登录
      clearTokens();
      alert('登录已过期，请重新登录');
      window.location.reload();
      return response;
    }
  }

  return response;
}
```

**使用示例**：
```javascript
// 获取个人信息（自动刷新token）
async function getProfile() {
  const response = await fetchWithRefresh(
    'http://localhost:3000/api/auth/profile',
    { method: 'GET' }
  );

  const data = await response.json();
  console.log(data);
}
```

**关键点**：
- `fetchWithRefresh` 自动拦截401错误
- 自动刷新token并重新发送请求
- 用户完全无感知

---

## 🎊 用户体验

### 传统方式（没有Token刷新）

```
用户操作 → Token过期 → ❌ 提示"登录已过期" → 跳转登录页 → 重新登录
用户体验：😞 差
```

### Token刷新机制

```
用户操作 → Token过期 → 自动刷新 → ✅ 继续操作
用户体验：😊 好（无感知）
```

---

## ⚠️ 安全性考虑

### Refresh Token被盗的风险

**问题**：
- 如果Refresh Token被盗，黑客可以不断获取新的Access Token
- 风险期长达7天

**解决方案**：

1. **Refresh Token轮换**（生产环境推荐）
   ```javascript
   // 每次刷新时，生成新的Refresh Token
   const newRefreshToken = generateRefreshToken({ userId });

   // 旧的Refresh Token加入黑名单
   addToBlacklist(oldRefreshToken);
   ```

2. **Refresh Token黑名单**
   ```javascript
   // 用户登出时，将Refresh Token加入黑名单
   router.post('/logout', (req, res) => {
     const refreshToken = req.body.refreshToken;
     addToBlacklist(refreshToken);
     res.json({ message: '登出成功' });
   });
   ```

3. **httpOnly Cookie**（生产环境推荐）
   ```javascript
   // 将Refresh Token存储在httpOnly cookie
   res.cookie('refreshToken', refreshToken, {
     httpOnly: true,  // ❌ JavaScript无法读取（防止XSS）
     secure: true,    // ✅ 只能通过HTTPS传输
     sameSite: 'strict',
     maxAge: 7 * 24 * 60 * 60 * 1000
   });
   ```

4. **绑定设备/IP**
   - 检测异常登录
   - 在新设备登录时要求二次验证

---

## 📊 对比总结

| 存储方式 | Access Token | Refresh Token |
|---------|--------------|---------------|
| **过期时间** | 15分钟 | 7天 |
| **用途** | 访问API | 刷新Access Token |
| **存储位置** | localStorage | localStorage（或httpOnly cookie） |
| **被盗风险** | 低（短期） | 高（长期） |
| **可撤销性** | 困难 | 可以（黑名单） |

---

## 🔗 相关主题

- [[JWT原理]] - JWT的结构和原理
- [[JWT在Express中的实现]] - JWT的代码实现
- [[Cookie vs localStorage]] - Token存储安全性对比

---

## 💡 关键要点

1. **双Token设计**：Access Token（15分钟）+ Refresh Token（7天）
2. **刷新流程**：Access Token过期 → 401错误 → 自动刷新 → 重新请求
3. **用户无感知**：前端自动处理，用户不知道token被刷新了
4. **安全性**：Access Token短期降低风险，Refresh Token可撤销
5. **生产环境**：Refresh Token应该存储在httpOnly cookie

---

## 📝 完整代码示例

详见：`../../projects/09-jwt-auth/`

**测试步骤**：
1. 启动服务器
2. 登录获取双Token
3. 等待15分钟（或修改为1分钟测试）
4. 点击"获取个人信息"
5. 观察自动刷新token

---

**学习日期**: 2026-03-21
**掌握程度**: ⭐⭐⭐⭐⭐
**复习频率**: 每周复习一次
