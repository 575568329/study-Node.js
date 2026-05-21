# Node HTTP 与认证跨域

更新时间：2026-05-21

## 学习目标

把 HTTP 请求生命周期、状态码、请求头、响应结构、Cookie / Session / JWT、CORS 和预检请求讲清楚，并能映射到 Next.js Route Handler 和 RAG 项目的接口设计。

## HTTP 请求生命周期

一次典型 API 请求在服务端可以拆成：

```text
1. 建立连接 / 接收请求
2. 解析 method、path、query、headers、body
3. 路由匹配
4. Content-Type / body 解析
5. schema 参数校验
6. 认证 authentication
7. 授权 authorization
8. 业务处理 service
9. 错误分类和日志记录
10. 组装 HTTP status + response body + response headers
11. 返回响应
```

以请求为例：

```http
GET /api/users?id=1
Authorization: Bearer xxx
```

可以拆成：

```text
GET                 -> method
/api/users          -> path
id=1                -> query
Authorization       -> header
```

## GET 和 POST

不要只从“参数放 URL 还是 body”理解 GET / POST。

```text
GET：
- 语义是获取资源
- 通常不修改服务端状态
- 通常是幂等的
- 参数通常放 query
- 更容易被浏览器、代理、CDN 缓存

POST：
- 语义是提交数据，让服务端处理
- 通常用于创建资源或触发动作
- 通常不是幂等的
- 数据通常放 body
- 默认不适合缓存
```

接口设计应遵循：

```text
URL 表示资源
method 表示动作
```

推荐：

```text
GET    /api/articles        查询文章列表
GET    /api/articles/123    查询文章详情
POST   /api/articles        创建文章
PATCH  /api/articles/123    局部更新文章
DELETE /api/articles/123    删除文章
```

不推荐：

```text
GET /api/articles/delete?id=1
POST /api/createArticle
```

因为 GET 不应该触发删除这类副作用，创建动作也不应该硬编码到 URL 中。

## 常见状态码

```text
200 OK                    查询成功
201 Created               创建成功
400 Bad Request           非法 JSON、字段缺失、字段类型错误
401 Unauthorized          未登录、token 无效、token 过期
403 Forbidden             已登录但权限不足
404 Not Found             资源不存在
409 Conflict              资源冲突，如标题重复、唯一索引冲突
413 Payload Too Large     请求体或文件过大
415 Unsupported Media Type Content-Type 不支持
500 Internal Server Error 服务端代码、数据库或依赖异常
```

关键区分：

```text
非法 JSON / 字段错误       -> 400
文件太大                   -> 413
Content-Type 不支持        -> 415
标题重复 / 唯一冲突        -> 409
服务端异常                 -> 500
```

不是所有 throw 都是 500，要看错误来源。

## Content-Type

`Content-Type` 告诉服务端请求体是什么格式。

```text
application/json
  -> JSON 请求体

multipart/form-data
  -> 文件上传、表单 + 文件

application/x-www-form-urlencoded
  -> 普通 HTML 表单提交

text/plain
  -> 纯文本
```

JSON 请求：

```ts
await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'tom' }),
})
```

文件上传：

```ts
const formData = new FormData()
formData.append('file', file)

await fetch('/api/kb/1/upload', {
  method: 'POST',
  body: formData,
})
```

使用 `FormData` 时，通常不要手写 `Content-Type: multipart/form-data`，让浏览器自动带上 boundary。

## 参数校验

参数校验不要全部散落成手写 if。字段多时，建议用 schema 集中定义契约。

```ts
import { z } from 'zod'

const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})
```

分层：

```text
req.json()
  -> 判断 body 是否是合法 JSON

schema.safeParse()
  -> 判断字段结构、类型、长度是否符合接口契约
```

非法 JSON 和字段校验失败都属于客户端请求错误，通常返回 400。

## 统一响应结构

成功：

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Node.js HTTP"
  }
}
```

失败：

```json
{
  "success": false,
  "error": {
    "code": "ARTICLE_TITLE_DUPLICATED",
    "message": "文章标题已存在"
  }
}
```

状态码表达 HTTP 层结果，业务 code 表达具体业务原因。未登录不要返回 HTTP 200 + `success: false`，而应返回 HTTP 401，并在 body 中补充错误详情。

## 创建文章接口设计

推荐接口：

```http
POST /api/articles
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Node.js HTTP",
  "content": "..."
}
```

设计要点：

```text
1. path 使用 /api/articles，method 使用 POST 表示创建。
2. body 只传 title、content 等业务字段。
3. userId、role、permission 从 Authorization token 解析，不让前端传 userId。
4. JSON 解析失败返回 400。
5. schema 校验失败返回 400。
6. 未登录返回 401。
7. 没权限返回 403。
8. 创建成功返回 201 和文章数据。
9. 标题重复返回 409。
10. 数据库或代码异常返回 500。
```

面试表达：

> 创建文章我会设计成 `POST /api/articles`，请求体用 `application/json`，只传 `title` 和 `content`，用户身份从 `Authorization` token 里解析，不让前端传 `userId`。服务端先解析 JSON，解析失败返回 400；再用 schema 校验字段，校验失败也返回 400；然后做认证鉴权，未登录返回 401，没权限返回 403；创建成功返回 201 和文章数据；如果标题重复返回 409；如果是数据库或代码异常，返回 500。

## Cookie 和 Session

Cookie 和 Session 不是一回事。

```text
Cookie：
- 存在浏览器端
- 请求同域接口时会自动带上
- 可以设置过期时间、HttpOnly、Secure、SameSite

Session：
- 存在服务端
- 通常存在 Redis / 数据库 / 服务端内存
- 用 sessionId 作为索引查出用户身份
```

典型流程：

```text
1. 用户登录
2. 服务端校验账号密码
3. 服务端生成 sessionId
4. 服务端保存 sessionId -> userId / role / loginTime
5. 服务端通过 Set-Cookie 写入 sid
6. 浏览器后续请求自动带 Cookie
7. 服务端根据 sid 查用户身份
```

Cookie 里通常只放 sessionId，不放完整用户信息。原因：

```text
1. Cookie 单个大小通常约 4KB
2. 不把完整用户信息暴露到浏览器
3. 服务端删除 session 后，登录可以立刻失效
```

## Cookie 属性

```http
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax
```

```text
HttpOnly：
  禁止 JavaScript 通过 document.cookie 读取 Cookie，降低 XSS 窃取 Cookie 的风险。

Secure：
  只有 HTTPS 请求才会携带这个 Cookie。它不是加密 Cookie 内容。

SameSite：
  控制跨站请求时 Cookie 是否会被自动携带，用来降低 CSRF 风险。
```

Cookie 和 localStorage：

```text
Cookie：
  单个约 4KB
  每次同域 HTTP 请求会自动携带
  适合身份标识

localStorage：
  通常约 5MB
  不会自动随请求发送
  只能前端 JS 读写
  适合非敏感前端缓存
```

敏感 token 放 localStorage 的主要风险是 XSS，因为 JS 可以读取。HttpOnly Cookie 能降低 token 被 JS 直接读取的风险，但要重点防 CSRF。

## JWT / Bearer Token

JWT 常见流程：

```text
1. 用户登录
2. 服务端签发 access token
3. 前端保存 token
4. 请求接口时手动带 Authorization
5. 服务端校验 token 签名、过期时间和用户信息
```

```http
Authorization: Bearer <token>
```

JWT payload 默认不是加密，只是编码 + 签名。payload 可以被解码看到，所以不要放密码、密钥、身份证号等敏感信息。

```json
{
  "userId": "1",
  "role": "admin",
  "exp": 1760000000
}
```

JWT 优点：

```text
服务端可以无状态验签。
适合前后端分离、移动端、小程序、第三方 API。
```

JWT 缺点：

```text
签发后，在过期前默认不容易主动失效。
权限变化、封禁用户时，需要黑名单、tokenVersion 或短 access token + refresh token 机制。
```

## access token 和 refresh token

常见设计：

```text
access token 有效期短
refresh token 有效期长
```

原因：

```text
access token：
  用于访问业务接口，有效期短，降低泄露后的风险窗口。

refresh token：
  用于换取新的 access token，有效期长，保证用户不需要频繁登录。
```

refresh token 更敏感，通常要支持服务端撤销、轮换、异常检测，最好配合 HttpOnly Cookie。

## 401 和 403

```text
401 Unauthorized：
  没登录，或者 token 无效 / 过期。

403 Forbidden：
  已经登录，但权限不足。
```

例如：

```text
没带 Authorization             -> 401
Token 过期                     -> 401
普通用户访问管理员接口          -> 403
```

## Cookie + Session 和 JWT 怎么选

Cookie + Session 适合：

```text
1. 传统 Web 应用
2. 浏览器访问为主
3. 登录状态希望服务端可控
4. 需要随时踢用户下线
5. 服务端有 Redis 这类 session 存储
```

JWT / Token 适合：

```text
1. 前后端分离
2. 移动端 / 小程序 / 第三方 API
3. 多端统一认证
4. 希望服务端少存状态
```

面试回答：

> 如果是传统浏览器 Web 应用，我更倾向 Cookie + Session，服务端可控，配合 HttpOnly、Secure、SameSite 安全性更好。如果是前后端分离、多端 API、移动端或第三方调用，JWT / Bearer Token 更通用。JWT 的优势是服务端可以无状态验签，但缺点是主动失效困难，所以通常会配合短期 access token、refresh token、黑名单或 tokenVersion。

## CORS 和跨域

同源要求：

```text
协议 + 域名 + 端口 都相同
```

下面不是同源：

```text
http://localhost:3000
http://localhost:3001
```

端口不同，所以跨域。

跨域限制主要是浏览器限制，不是服务端不能处理请求。服务端可能已经收到了请求，只是浏览器不让前端 JS 读取响应。

服务端通过 CORS 响应头告诉浏览器哪些源可以访问：

```http
Access-Control-Allow-Origin: http://localhost:3000
```

## 跨域携带 Cookie

前端：

```ts
fetch('http://localhost:8080/api/me', {
  credentials: 'include',
})
```

axios：

```ts
axios.get('http://localhost:8080/api/me', {
  withCredentials: true,
})
```

后端：

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

不能写：

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Cookie 通常还要：

```http
Set-Cookie: sid=abc; HttpOnly; SameSite=None; Secure
```

注意本地开发坑：

```text
SameSite=None 通常要求 Secure。
Secure 通常要求 HTTPS。
本地 HTTP 开发可以考虑 dev proxy 或本地 HTTPS。
```

## Bearer Token 跨域

Bearer Token 不依赖浏览器自动带 Cookie，而是前端手动加请求头：

```ts
fetch('https://api.example.com/me', {
  headers: {
    Authorization: 'Bearer xxx',
  },
})
```

通常不需要 `credentials: 'include'`，但 `Authorization` 不是简单请求头，会触发 CORS 预检。

## 预检请求 OPTIONS

有些跨域请求浏览器不会直接发真正请求，而是先发：

```http
OPTIONS /api/articles
```

浏览器先问服务端：

```text
我这个跨域请求能不能发？
我要用 POST
我要带 Content-Type: application/json
我要带 Authorization
```

服务端要响应：

```http
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

触发预检的常见原因：

```text
1. Content-Type 是 application/json
2. 带了 Authorization
3. 带了自定义 header
4. 使用了非简单 method
```

如果预检响应里没有允许 `Authorization`，浏览器不会继续发真正的 POST。

## OPTIONS 不能先鉴权

常见坑：

```text
所有接口都先进 requireAuth()
OPTIONS 预检请求没有业务 token
OPTIONS 被拦成 401
真正请求永远发不出去
```

处理方式：

```text
OPTIONS 预检请求先放行，返回 CORS headers。
真正的 GET / POST / PATCH 再做认证鉴权。
```

伪代码：

```ts
if (req.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

const user = await requireAuth(req)
```

## CORS 排查顺序

面试回答：

> 我排查 CORS 一般先确认是不是同源问题，比如协议、域名、端口是否不一致。确认跨域后，我会看请求里的 `Origin`，以及后端响应的 `Access-Control-Allow-Origin` 是否回了当前前端地址，不能在带凭证时写成 `*`。如果请求需要携带 Cookie，前端 fetch 要配置 `credentials: 'include'`，axios 要配置 `withCredentials: true`，后端要返回 `Access-Control-Allow-Credentials: true`，同时 Cookie 本身要检查 `SameSite` 和 `Secure`。如果请求带了 `Authorization`、`Content-Type: application/json` 或自定义 header，我还会看预检 `OPTIONS` 是否通过，后端有没有单独放行 OPTIONS，以及 `Access-Control-Allow-Headers` 是否包含这些请求头，`Access-Control-Allow-Methods` 是否包含实际请求方法。

## 易错点

- `Cookie` 存在浏览器端，`Session` 存在服务端。
- `HttpOnly` 不是“只有 HTTP 可用”，而是禁止 JS 读取 Cookie。
- `Secure` 不是加密 Cookie 内容，而是只在 HTTPS 请求中携带。
- JWT payload 默认可被解码，不要放敏感信息。
- `401` 是未认证，`403` 是已认证但没权限。
- 带 Cookie 的 CORS 响应不能使用 `Access-Control-Allow-Origin: *`。
- Bearer Token 通常不需要 `credentials: include`，但 `Authorization` 会触发预检。
- OPTIONS 预检请求应先放行，真正业务请求再鉴权。

