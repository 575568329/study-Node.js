# 2026-03-22 学习会话记录

## 📊 会话概述

- **日期**: 2026-03-22
- **学习时长**: 进行中
- **学习形式**: 理论学习 + AI导师指导 + 代码实践
- **主要主题**:
  - F.7 密码加密（bcrypt）
  - F.1 Cookie/Session（计划中）
  - F.5 CORS跨域（计划中）

---

## 🎓 学习前的知识评估

### 1. F.7 密码加密（bcrypt）

**学生的初始理解**：
- ✅ 知道不能存明文密码（隐私保护）
- ❌ 不知道bcrypt和MD5的区别
- ❌ 误认为salt rounds是过期时间

**理解纠正**：
- 明白了bcrypt自动加盐、防止彩虹表攻击
- 理解了salt rounds是加密强度（2^10=1024次循环）
- 掌握了每次加密结果不同（随机盐），但验证能正确匹配

### 2. F.1 Cookie/Session

**学生的初始理解**：
- ❌ 不知道Cookie存在哪里
- ✅ 理解浏览器根据token判断登录状态
- ❌ 误认为JWT存在服务端（实际存在客户端）

**理解纠正**：
- Cookie存在客户端（自动发送），Session存在服务端
- JWT存在客户端（localStorage/Cookie），无状态适合微服务
- Session有状态需要共享存储，JWT每个服务都能验证

### 3. F.5 CORS跨域

**学生的初始理解**：
- ❌ 误认为跨域和访问速度有关（实际是浏览器安全限制）
- ❌ 不知道为什么需要CORS
- ✅ 知道解决方案是添加白名单

**理解纠正**：
- 跨域定义：协议+域名+端口任一不同
- 为什么需要：防止恶意网站窃取数据（CSRF攻击防护）
- 预检请求：复杂请求（PUT/DELETE）先发送OPTIONS询问

---

## 💡 核心概念讲解

### 1. F.7 密码加密（bcrypt）

**MD5的问题**：
- ❌ 彩虹表攻击：常见密码的MD5值预先计算好
- ❌ 相同密码永远生成相同哈希
- ❌ 快速计算：一秒能算几十亿次

**bcrypt的优势**：
- ✅ 自动加盐：每次加密都加随机字符串
- ✅ 慢速计算：防止暴力破解
- ✅ 可调强度：salt rounds（10-12推荐）

**关键理解**：
```javascript
bcrypt.hash(password, 10)  // 2^10 = 1024次加密
bcrypt.compare(plainPassword, hashedPassword)  // 自动提取盐验证
```

### 2. F.1 Cookie/Session

**Session流程**：
```
登录 → 服务器创建Session（内存/数据库）
    → 返回Cookie（包含session_id）
    → 以后请求自动发送Cookie
    → 服务器查Session获取用户信息
```

**JWT vs Session**：
- Session：有状态，需要共享存储，扩展性差
- JWT：无状态，每个服务都能验证，适合微服务

**三种存储**：
- Cookie：自动发送，4KB
- localStorage：永久存储，5-10MB，不自动发送
- sessionStorage：关闭标签页清除，5-10MB

### 3. F.5 CORS跨域

**跨域定义**：
```
同源 = 协议 + 域名 + 端口 完全相同
https://example.com:8000  vs  http://example.com:8000  ← 跨域（协议）
https://example.com:8000  vs  https://www.example.com:8000  ← 跨域（子域名）
https://example.com:8000  vs  https://example.com:8001  ← 跨域（端口）
```

**CORS作用**：
- 防止恶意网站窃取用户数据
- 浏览器强制执行（Postman/curl不受限制）
- 服务器必须明确允许哪些域名

**简单vs复杂请求**：
- 简单：GET、简单POST（不需要预检）
- 复杂：PUT、DELETE、自定义头（需要OPTIONS预检）

---

## 🔍 理解检查

### F.7 理解检查
- ✅ 相同密码，每次哈希都不同（随机盐）
- ✅ salt rounds每增加2，耗时增加4倍
- ✅ 哈希结构：$算法$成本$盐+哈希

### F.1 理解检查
- ✅ Cookie自动发送，所以刷新页面后保持登录
- ✅ JWT适合微服务（无需共享存储）
- ✅ Cookie、localStorage、sessionStorage的区别

### F.5 理解检查
- ✅ 正确选择测试场景答案B
- ✅ 理解了白名单的作用

---

## 💻 代码实践

### 1. bcrypt演示（bcrypt-demo.js）

**运行结果**：
- 演示1：3次加密"123456"，结果完全不同
- 演示2：验证正确密码返回true，错误返回false
- 演示3：bcrypt(8)、bcrypt(10)、bcrypt(12)耗时递增（约4倍）
- 演示4：哈希值结构$2b$10$盐+哈希

**关键代码**：
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### 2. CORS演示（cors-demo.js）

**运行结果**：
- 测试1（公开接口）：成功（允许所有域名）
- 测试2-4（白名单接口）：从localhost:8000访问成功（同源）
- 测试4（DELETE请求）：触发OPTIONS预检请求

**关键代码**：
```javascript
// 允许所有域名（不安全）
app.use(cors());

// 白名单特定域名（推荐）
app.use(cors({
  origin: ['http://localhost:3000']
}));

// 允许复杂请求
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📊 进度更新

总体进度：47% → **55%** (+8%)
新增主题：3个（F.1 Cookie/Session、F.5 CORS跨域、F.7 密码加密）

### 已掌握主题

- ✅ **F.1** Cookie/Session (2026-03-22) - **High**
  - Cookie存在客户端（自动发送），Session存在服务端
  - Session流程：session_id → Cookie → 自动发送 → 查Session
  - JWT vs Session：无状态 vs 有状态，适合微服务 vs 需要共享
  - 三种存储：Cookie（4KB自动发送）、localStorage（永久5-10MB）、sessionStorage（临时5-10MB）

- ✅ **F.5** CORS跨域 (2026-03-22) - **High**
  - 跨域定义：协议+域名+端口任一不同
  - 为什么需要：防止恶意网站窃取数据（CSRF攻击）
  - 解决方案：后端设置Access-Control-Allow-Origin白名单
  - 简单vs复杂：GET/简单POST不需要预检，PUT/DELETE需要OPTIONS预检
  - 生产环境：不要用origin: '*'，使用白名单

- ✅ **F.7** 密码加密（bcrypt） (2026-03-22) - **High**
  - bcrypt vs MD5：自动加盐、慢速计算、可调强度、防止彩虹表
  - Salt Rounds：加密强度（2^10=1024次），不是过期时间
  - 每次加密不同（随机盐），验证时自动提取盐匹配
  - 推荐值：10-12（平衡安全性和性能）
  - 使用方式：bcrypt.hash(password, 10)、bcrypt.compare(plain, hashed)

---

## 📝 下一步计划

- [ ] F领域剩余内容：F.8 XSS与CSRF防护
- [ ] 或开始实战项目：G.3 个人博客后端API
- [ ] 综合练习：完善用户系统（注册、登录、修改密码、忘记密码）

---

## 💡 学习心得

**学生表现**：
- ✅ 快速理解bcrypt的核心概念（盐、加密强度）
- ✅ 准确回答CORS测试场景（选择答案B）
- ✅ 理解了Cookie/Session/JWT的本质区别
- ✅ 纠正了多个错误理解（salt rounds、JWT存储位置、跨域原因）

**关键理解**：
1. bcrypt的Salt Rounds是加密强度，不是过期时间
2. JWT存在客户端（localStorage/Cookie），不是服务端
3. 跨域是浏览器安全限制，与访问速度无关
4. Cookie自动发送，localStorage/sessionStorage需要手动发送

**需要巩固**：
- XSS与CSRF攻击原理和防护（F.8）
- 实际项目中的综合应用
