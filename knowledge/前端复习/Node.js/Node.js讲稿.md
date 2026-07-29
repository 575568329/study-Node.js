# Node.js 面试讲稿

**复习方法**：费曼学习法（合上资料自己讲 → 标红卡壳 → 补漏 → 产出讲稿）
**复习日期**：2026-07-24 启动
**状态**：进行中
**最近更新**：2026-07-29（新增 JWT 认证、CORS 跨域）

---

## Q1：事件循环 ✅

（已完成，详见进度文档）

---

## Q2：模块化（CJS vs ESM）✅

（已完成，详见进度文档）

---

## Q3：Stream（流式处理）✅

### 3 分钟讲稿

**问题**：什么是 Stream？为什么要用 Stream？背压（backpressure）是什么？

**我的回答**：

**Stream 是分片处理数据的机制**，核心是"边读边处理"，不用等全部数据到齐。

**对比一次性读取**：
```js
// ❌ 一次性读取，内存峰值 = 文件大小
const data = fs.readFileSync('huge.mp4');  // 2GB 全塞进内存

// ✅ 流式读取，内存峰值 = 一个 chunk（默认 64KB）
fs.createReadStream('huge.mp4').pipe(res);
```

**核心价值**：
- **省内存**：不管文件多大，内存只占一个 chunk
- **低延迟**：第一片到了就能处理，不用等全部
- **可组合**：通过 pipe 串联多个处理步骤

---

### Stream 的 4 种类型

| 类型 | 作用 | 例子 |
|------|------|------|
| **Readable**（可读流） | 数据源 | `fs.createReadStream()`、HTTP 请求 |
| **Writable**（可写流） | 数据目的地 | `fs.createWriteStream()`、HTTP 响应 |
| **Duplex**（双工流） | 可读可写（两个独立通道） | TCP socket |
| **Transform**（转换流） | 可读可写 + 转换数据 | `zlib.createGzip()`（压缩） |

**记忆技巧**：
- Readable = 水源（只出水）
- Writable = 水池（只进水）
- Duplex = 双向管道（进出独立，如电话）
- Transform = 净水器（进水→过滤→出水，边流边变）

**Duplex vs Transform**（高频追问）：
- Duplex：读和写是两个独立通道（读的数据 ≠ 写的数据）
- Transform：读和写是同一份数据的转换（输入→处理→输出）

---

### 背压（backpressure）

**背压 = 生产速度 > 消费速度，导致数据堆积**

**经典场景**：读快（100MB/s）写慢（10MB/s），差值堆积在内存缓冲区 → 内存暴涨 → 崩溃。

**处理机制**：
```js
const canContinue = writeStream.write(chunk);
if (!canContinue) {
  readStream.pause();  // 缓冲区满，暂停读取
  writeStream.once('drain', () => {
    readStream.resume();  // 缓冲区排空，恢复读取
  });
}
```

**核心**：`write()` 返回 `false` → 暂停读取；`drain` 事件 → 恢复读取。这就是"流量控制"。

---

### pipe() vs pipeline()

**`pipe()`**：自动处理背压 + 简洁 + 链式
```js
readStream.pipe(writeStream);  // 自动 pause/resume/end
```

**`pipeline()`**（现代推荐）：
```js
const { pipeline } = require('stream');
pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.txt.gz'),
  (err) => { if (err) console.error('失败', err); }
);
```

**为什么 pipeline 更好**：
1. 出错时**自动销毁所有流**（pipe 不会，可能内存泄漏）
2. **统一错误回调**（不用每个流都加 `on('error')`）
3. 同样自动处理背压

---

### 可能的追问及回答

- **追问1**：Stream 有哪 4 种类型？
  - Readable / Writable / Duplex / Transform

- **追问2**：什么时候会出现背压？怎么处理？
  - 生产快于消费时。用 pause/resume 控制流量（pipe/pipeline 自动处理）

- **追问3**：`pipe()` 最关键的优势是什么？
  - **自动处理背压**（不只是代码简洁），防止内存爆炸

---

### 我曾经的盲区

- ✅ 核心理解正确（分片处理、避免内存溢出）
- ⚠️ 一开始说"没拿到足够内容导致溢出"，其实是"主动只拿一小片"（分片 + 边读边处理）
- ⚠️ 4 种 Stream 类型忘了（Readable/Writable/Duplex/Transform）
- ⚠️ `pipe()` 优势漏了最关键的"自动处理背压"，只说了"简洁+链式"

---

## Q4：中间件洋葱模型 ✅

（已完成，详见进度文档）

---

## Q5：JWT 认证 ✅

### 3 分钟讲稿

**问题**：什么是 JWT？为什么要用 JWT 而不是 session？JWT 怎么防篡改？

**我的回答**：

**JWT = JSON Web Token，无状态认证方案**。本质是"把身份数据写在 token 里，让客户端自己带着走"。

---

### Session vs JWT

**Session（传统方案）**：
```
登录 → 服务器创建 session 存内存/Redis，返回 sessionId
     → 浏览器存 Cookie，每次请求带上
     → 服务器拿 sessionId 查 session → 知道你是谁
```

**痛点**：
1. **多服务器共享难**：session 存在 A 内存，B 不认识（需 Redis 共享）
2. **服务器存储压力**：100 万用户 = 存 100 万个 session
3. **跨域/跨端麻烦**：Cookie 有域名限制

**JWT（现代方案）**：
```
登录 → 服务器签发 token（身份数据 + 签名），返回给客户端
     → 客户端存 localStorage/Cookie，每次请求带上
     → 服务器只验证签名，不查存储 → 无状态 ✅
```

**核心区别**：
- Session：身份数据存后端，前端只拿"钥匙"（sessionId）
- JWT：身份数据存 token 里，前端自己带着走

---

### JWT 的三段结构

```
eyJhbGc...  .  eyJ1c2Vy...  .  SflKxwRJ...
  Header       Payload         Signature
  头部         载荷            签名
```

**Header**（算法声明）：
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload**（身份数据，明文！）：
```json
{ "userId": "张三", "role": "admin", "exp": 1700000000 }
```

**Signature**（签名，防篡改）：
```
HMAC-SHA256(
  base64url(Header) + "." + base64url(Payload),
  密钥  // 只有服务器知道
)
```

**关键点**：
- Payload 是 **Base64 编码，不是加密**，谁都能看（去 jwt.io 粘贴就能解）
- 安全靠的是**签名**，不是藏数据

---

### 签名防篡改机制

**为什么前端看得见 Payload，却改不了？**

```
前端想伪造：
  改 Payload（role: user → admin）✅ 能改（明文）
  重新算签名？❌ 没密钥，算不出对的签名
  用假签名？❌ 后端一验就露馅

验证流程：
  后端收到 token → 用密钥重新算签名 → 和 token 里的签名比对
                                      ↓
  一致 → 没被篡改，放行 ✅
  不一致 → 被改过，拒绝 ❌
```

**签名 vs 加密**（易混淆）：
| | 签名（JWT 用这个） | 加密 |
|---|---|---|
| **目的** | 防篡改（改了会被发现） | 防窥视（看不见内容） |
| **内容可见性** | 明文可见 | 密文不可见 |
| **类比** | 信封上盖骑缝章 | 把信装进保险箱 |

**记住**：JWT 默认不加密，**Payload 里不能放密码、敏感信息**。

---

### 双 Token 机制（Access + Refresh）

**问题**：
- Token 过期短（15 分钟）→ 用户频繁掉线，体验差
- Token 过期长（30 天）→ 被盗后攻击者能用 30 天，不安全

**解法**：用"短命 + 长命"组合

| | Access Token | Refresh Token |
|---|---|---|
| **有效期** | 15 分钟 ~ 1 小时 | 7 天 ~ 30 天 |
| **用途** | 每次请求都带，访问业务接口 | **只用来换新 Access Token** |
| **暴露频率** | 高（每个请求） | 低（只在刷新时用） |
| **存哪** | localStorage / 内存 | httpOnly Cookie（更安全） |

**流程**：
```
1. 登录 → 签发 access(15min) + refresh(7天)
2. 正常请求 → 带 access token → 验证 → 放行
3. access 过期（16 分钟）→ 401 → 前端自动拿 refresh 换新 access → 重发请求（用户无感知）
4. refresh 也过期（8 天）→ 跳登录页
```

**为什么更安全**：
- Access 短命但高频暴露 → 被盗也只能用 15 分钟
- Refresh 长命但低频暴露 + httpOnly → 不易被盗，且 JS 读不到（防 XSS）

---

### JWT 的致命痛点：无法主动失效

**问题场景**：
- 用户点"退出登录" → token 还在有效期，别人捡到照样能用
- 发现账号被盗，想"踢下线" → 踢不掉
- 用户改密码 → 旧 token 还有效

**根本原因**：JWT 验证只靠"密钥 + token 内容"算签名，**不查任何存储**。无状态 = 快 = 无法主动作废。

**四种解法**：

| 方案 | 思路 | 代价 |
|---|---|---|
| ① 黑名单 | 退出时把 token 存 Redis，验证时查黑名单 | 又变回有状态 |
| ② 短 access + 作废 refresh | access 只活 15 分钟，真要踢人就作废 refresh | 最多 15 分钟窗口期 |
| ③ 版本号 | 用户表存 tokenVersion，验证时比对；改密码就 version+1 | 每次验证要查库 |
| ④ 改密钥 | 换掉 SECRET，所有 token 全失效 | 核弹级，所有人下线 |

**最常用**：方案② + 方案①（平时靠短过期，真要踢人就黑名单 refresh）

---

### 可能的追问及回答

- **追问1**：JWT 的 Payload 能放密码吗？
  - **不能**。Payload 是 Base64 编码（明文可读），任何人都能解开看。只能放非敏感信息（userId/role/过期时间）。

- **追问2**：签名用的是对称加密还是非对称加密？
  - **都可以**。HMAC（对称，HS256）最常用；也可用 RSA（非对称，RS256），私钥签发、公钥验证。

- **追问3**：JWT 怎么实现"退出登录"？
  - **原生做不到**（无状态）。要么加黑名单（变有状态），要么靠短过期 + 作废 refresh token。

- **追问4**：Access Token 存 localStorage 还是 Cookie？
  - **各有利弊**。localStorage 易被 XSS 窃取；Cookie 要设 httpOnly + SameSite 防 CSRF。现代推荐：**httpOnly Cookie 存 refresh，内存存 access**。

---

### 🤖 AI 时代视角

**AI 已接管**：
- JWT 库的调用（`jwt.sign/verify` API）
- Base64url/HMAC 的编码细节
- 标准中间件模板

**反而更值钱**：
- **安全模型的本质**：为什么 Payload 不能存敏感信息、为什么 refresh 要 httpOnly
- **攻击面分析**：XSS 偷 token、CSRF、token 泄露后果
- **权衡取舍**：过期时间设多久？存哪里？要不要双 token？—— 需要懂原理才能拍板

**学习深度调整**：
- ❌ 不用背：JWT 三段的编码细节、库的 API
- ✅ 重点吃透：**安全边界**（什么能放 Payload）、**双 token 的权衡逻辑**、**主动失效的四种解法**
- 💡 手写 sign/verify 的价值：理解签名机制，用库时知道每个参数背后在做什么

---

### 我曾经的盲区

- ❌ 一开始混淆"签名"和"加密"，以为 JWT 是加密的
- ❌ 不知道 Payload 是明文可读（Base64 ≠ 加密）
- ❌ 漏了"主动失效"这个致命痛点
- ✅ 理解了"无状态"的代价：快但无法撤销

---

## Q6：CORS 跨域 ✅

### 3 分钟讲稿

**问题**：什么是 CORS？为什么会有跨域限制？什么是预检请求？

**我的回答**：

**CORS = Cross-Origin Resource Sharing（跨域资源共享）**，是浏览器的安全策略。

---

### 为什么要有 CORS？

**HTTP 天生无状态 → 浏览器用 Cookie 记住身份 → 恶意网站能冒充你**

**攻击场景（无 CORS 保护时）**：
```
1. 你登录了 bank.com，Cookie 存着 session/token
2. 你访问 evil.com（钓鱼网站）
3. evil.com 的 JS：
   fetch('https://bank.com/api/transfer', {
     method: 'POST',
     credentials: 'include',  // 自动带上 bank.com 的 Cookie
     body: JSON.stringify({ to: '黑客账户', amount: 10000 })
   });
4. 请求带着你的 Cookie → 后端认为是你本人 → 转账成功 ❌
```

**CORS 的拦截机制**：
```
请求发出 ✅ → 后端收到并执行 ✅ → 响应返回 ✅
                                       ↓
浏览器检查响应头有没有 Access-Control-Allow-Origin
                ↓
没有 / 不匹配 → 扔掉响应，JS 拿不到 ❌
有且匹配 → 交给 JS ✅
```

**关键点**：
- **请求已发出**，后端已执行（数据可能已改）
- 浏览器只是**不让 JS 拿到响应**
- **只有浏览器拦**，Postman/curl 不拦（因为不涉及"恶意网站滥用 Cookie"）

---

### 简单请求 vs 预检请求

**简单请求（不预检，直接发）**：
- 方法：GET / POST / HEAD
- Content-Type：`application/x-www-form-urlencoded` / `multipart/form-data` / `text/plain`
- 请求头：只有安全头（Accept / Accept-Language 等）

**非简单请求（触发预检）**：
- 方法：PUT / DELETE / PATCH
- Content-Type：`application/json` ⚠️（最常见触发点）
- 自定义请求头：如 `Authorization`、`X-Custom-Header`

**记忆锚点**：
> **简单请求 = 1995 年 HTML 表单能发的请求**（form 只能发 GET/POST，Content-Type 只能是那三种）。**任何"比表单高级"的操作都要预检。**

---

### 预检请求（Preflight）

**为什么需要预检？**

对于 GET（读数据），就算后端执行了、前端拿不到响应，影响不大。但对于 DELETE/PUT（改数据）：

```
前端发 DELETE → 后端收到，用户被删了 ✅
              ↓
响应返回 → 浏览器检查 CORS → 没有 Allow-Origin → 拦截 ❌
         ↓
前端拿不到响应，但数据已经被删了！💥
```

**预检的解决方案**：
```
前端要发 DELETE
    ↓
浏览器先发 OPTIONS（预检）："你允许 DELETE 吗？允许 Authorization 头吗？"
    ↓
后端回复："允许 DELETE，允许 Authorization"
    ↓
浏览器："好，那我发真正的 DELETE"
    ↓
后端执行 DELETE，返回响应
    ↓
浏览器检查 CORS 头，放行
```

**关键点**：
- 预检通过后，**真正的请求才发出去**
- 避免了"数据已改，但前端不知道结果"的尴尬
- **OPTIONS 路径必须和真实请求匹配**（例如 `/api/users/:id`，不能只配 `/api/users`）

---

### 预检请求的细节

**OPTIONS 请求头**（浏览器自动发的）：
```http
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization,content-type
```

**OPTIONS 响应头**（后端必须返回的）：
```http
Access-Control-Allow-Origin: http://frontend.com
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Max-Age: 86400  // 预检结果缓存 1 天
```

**状态码**：
- **204 No Content**（标准）：表示"处理了但没有响应体"
- 200 也行，但 204 语义更精确

---

### 三种 CORS 配置方式

| 配置 | 写法 | 场景 | 安全性 |
|---|---|---|---|
| **允许所有** | `'*'` | 公开 API、CDN 静态资源 | ⚠️ 不安全，任何网站都能访问 |
| **单个域名** | `'http://example.com'` | 单一前端域名 | ✅ 安全 |
| **白名单数组** | 后端维护数组，动态返回请求方的 origin | 多个前端域名 | ✅ 安全 |

**白名单实现**（关键）：
```js
const whitelist = ['http://a.com', 'http://b.com'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (whitelist.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);  // 只能设一个域名
  }
  next();
});
```

**注意**：`Access-Control-Allow-Origin` **只能设一个值**（单个域名或 `*`），不能写多个域名逗号分隔。

---

### 可能的追问及回答

- **追问1**：`POST + JSON` 会触发预检吗？
  - **会**。虽然 POST 是简单方法，但 `Content-Type: application/json` 不在简单请求的三个允许值里。

- **追问2**：预检请求用什么方法？为什么？
  - **OPTIONS**。HTTP 里 OPTIONS 的语义是"查询资源支持哪些操作"，幂等且无副作用，最适合做预检。

- **追问3**：怎么优化预检的性能开销？
  - 设置 `Access-Control-Max-Age`（如 86400 秒 = 1 天），浏览器会缓存预检结果。

- **追问4**：为什么 Postman 不受 CORS 限制？
  - CORS 是**浏览器的安全策略**，保护用户 Cookie 不被恶意网站滥用。Postman 是开发工具，不涉及"钓鱼网站冒充用户"的风险。

---

### 🤖 AI 时代视角

**AI 已接管**：
- CORS 中间件配置代码（`cors()` 参数）
- 各种 CORS 报错的调试（看 Network 截图诊断）

**反而更值钱**：
- **安全边界判断**：什么接口该用 `*`、什么该白名单、什么该加 CSRF Token
- **预检的性能优化**：高频接口被预检拖慢怎么办？Max-Age 设多久？
- **CORS + 其他安全机制的配合**：CORS + SameSite Cookie + CSRF Token 怎么组合

**学习深度调整**：
- ❌ 不用背：各种 CORS 头的拼写、cors 库的 API
- ✅ 重点吃透：**简单请求判定规则**（面试必考）、**预检的触发条件和时序**、**为什么 JSON 要预检**
- 💡 实战观察 Network 的价值：理解"浏览器和服务器的协商对话"，出问题时能一眼定位

---

### 我曾经的盲区

- ❌ 以为"跨域"就是"请求发不出去"，实际是"响应被拦截"
- ❌ 不知道 `POST + JSON` 也会预检（以为 POST 就是简单请求）
- ❌ 预检实战时发现 OPTIONS 路径和 DELETE 路径不匹配（`/api/users` vs `/api/users/:id`）
- ✅ 通过实战看到了完整的"OPTIONS + DELETE"两次请求

---

## 复习总结

**已完成**：6/?（事件循环 ✅、模块化 ✅、Stream ✅、中间件 ✅、JWT ✅、CORS ✅）
**关键盲区**：
- JWT：签名 vs 加密混淆、Payload 明文可读、主动失效难题
- CORS：POST+JSON 触发预检、OPTIONS 路径匹配问题

**下次重点**：异步错误处理 / HTTP / Express / 数据库
