---
tags:
  - Express
  - API设计
  - RESTful
  - D领域
创建时间: 2026-03-24
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# RESTful API设计规范

## 📚 核心概念

RESTful API 是一种**软件架构风格**，用于设计网络应用的API。

---

## 🎯 核心思想

### 传统方式 vs RESTful

#### ❌ 传统方式（只用 GET + POST）
```javascript
GET /api/getPosts              // 获取文章
GET /api/getPost?id=1         // 获取单篇文章
POST /api/createPost          // 创建文章
POST /api/updatePost?id=1     // 更新文章
POST /api/deletePost?id=1     // 删除文章
```

**问题**：
- URL不统一（getPosts、getPost、createPost）
- 从URL看不出操作类型
- 无法利用HTTP的语义

#### ✅ RESTful 方式
```javascript
GET    /api/posts          // 获取文章列表
GET    /api/posts/:id      // 获取单篇文章
POST   /api/posts          // 创建文章
PUT    /api/posts/:id      // 更新文章（全部）
PATCH  /api/posts/:id      // 更新文章（部分）
DELETE /api/posts/:id      // 删除文章
```

**优势**：
- URL统一（都是 /api/posts 或 /api/posts/:id）
- HTTP方法决定操作类型
- 语义清晰，一看就懂
- 符合HTTP标准

---

## 🔧 HTTP方法对照表

| HTTP方法 | 操作 | 示例 | 幂等性 |
|---------|------|------|--------|
| **GET** | 获取资源 | `GET /api/posts/:id` | ✅ 是 |
| **POST** | 创建资源 | `POST /api/posts` | ❌ 否 |
| **PUT** | 全量更新 | `PUT /api/posts/:id` | ✅ 是 |
| **PATCH** | 部分更新 | `PATCH /api/posts/:id` | ❌ 否 |
| **DELETE** | 删除资源 | `DELETE /api/posts/:id` | ✅ 是 |

**幂等性**：多次请求结果是否相同
- ✅ 幂等：GET、PUT、DELETE（执行100次效果一样）
- ❌ 非幂等：POST、PATCH（每次执行可能产生不同结果）

---

## 💡 PUT vs PATCH 的区别

### PUT（全量更新）
```javascript
// 客户端发送
PUT /api/posts/1
{
  "title": "新标题",
  "content": "新内容",
  "status": "published"
}

// 服务端处理：用整个对象替换
UPDATE posts SET title='新标题', content='新内容', status='published' WHERE id=1
```

### PATCH（部分更新）
```javascript
// 客户端发送（只传要修改的字段）
PATCH /api/posts/1
{
  "title": "只改标题"
}

// 服务端处理：只更新指定字段
UPDATE posts SET title='只改标题' WHERE id=1
```

---

## 🎨 URL设计原则

### 1️⃣ 使用名词复数
```javascript
// ✅ 正确
GET /api/posts
GET /api/users
GET /api/comments

// ❌ 错误
GET /api/post
GET /api/getPosts
```

### 2️⃣ 层级结构清晰
```javascript
// 获取文章的评论
GET /api/posts/:id/comments

// 发表评论
POST /api/posts/:id/comments

// 获取特定评论
GET /api/posts/:id/comments/:commentId
```

### 3️⃣ 使用查询参数筛选
```javascript
// 分页
GET /api/posts?page=1&pageSize=10

// 筛选
GET /api/posts?status=published&authorId=1

// 排序
GET /api/posts?sort=created_at&order=desc

// 搜索
GET /api/posts/search?keyword=Node.js
```

---

## 🔍 实际应用示例

### 文章管理API
```javascript
// 获取文章列表
GET /api/posts?page=1&pageSize=10&status=published

// 获取单篇文章
GET /api/posts/1

// 创建文章
POST /api/posts
{
  "title": "文章标题",
  "content": "文章内容",
  "authorId": 1
}

// 全量更新文章
PUT /api/posts/1
{
  "title": "新标题",
  "content": "新内容",
  "status": "published"
}

// 部分更新文章
PATCH /api/posts/1
{
  "title": "只改标题"
}

// 删除文章
DELETE /api/posts/1

// 获取文章的评论
GET /api/posts/1/comments

// 发表评论
POST /api/posts/1/comments
{
  "content": "评论内容",
  "userId": 2
}
```

### 用户认证API
```javascript
// 注册
POST /api/auth/register
{
  "username": "user",
  "password": "123456",
  "email": "user@example.com"
}

// 登录
POST /api/auth/login
{
  "username": "user",
  "password": "123456"
}

// 刷新Token
POST /api/auth/refresh
{
  "refreshToken": "xxx"
}
```

### 点赞功能
```javascript
// 点赞（创建点赞关系）
POST /api/posts/1/like

// 取消点赞
DELETE /api/posts/1/like

// 获取点赞列表
GET /api/posts/1/likes
```

---

## 📝 响应格式规范

### 成功响应
```javascript
// 200 OK - 获取资源成功
{
  "success": true,
  "data": {
    "id": 1,
    "title": "文章标题"
  }
}

// 201 Created - 创建资源成功
{
  "success": true,
  "message": "创建成功",
  "data": {
    "id": 123
  }
}

// 204 No Content - 删除成功（无返回内容）
// DELETE /api/posts/1
```

### 错误响应
```javascript
// 400 Bad Request - 请求参数错误
{
  "success": false,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "title",
      "message": "标题不能为空"
    }
  ]
}

// 401 Unauthorized - 未授权
{
  "success": false,
  "message": "Token无效或已过期"
}

// 404 Not Found - 资源不存在
{
  "success": false,
  "message": "文章不存在"
}

// 500 Internal Server Error - 服务器错误
{
  "success": false,
  "message": "服务器内部错误"
}
```

---

## 🤔 常见问题

### Q1: 为什么搜索用GET而不是POST？
**A**:
- ✅ 可以缓存（减轻服务器压力）
- ✅ 可以分享链接（复制URL、保存书签）
- ✅ 符合RESTful语义（GET=查询）
- ✅ 浏览器会记录历史记录

**复杂搜索可以用POST**：
```javascript
POST /api/posts/advanced-search
{
  "keyword": "Node.js",
  "tags": ["JavaScript", "Backend"],
  "dateRange": { "from": "2026-01-01", "to": "2026-12-31" }
}
```

### Q2: PUT和PATCH什么时候用哪个？
**A**:
- **PUT**：全量更新（需要完整的资源对象）
- **PATCH**：部分更新（只传需要修改的字段）

### Q3: 什么是幂等性？为什么重要？
**A**:
- **幂等性**：多次请求结果相同
- **重要性**：网络重试、缓存、分布式系统的基础

---

## 🎯 最佳实践

1. ✅ **URL使用名词复数**：`/api/posts` 而不是 `/api/post`
2. ✅ **HTTP方法决定操作**：GET=读、POST=创建、PUT/PATCH=更新、DELETE=删除
3. ✅ **使用HTTP状态码**：200、201、400、401、404、500
4. ✅ **统一响应格式**：`{ success, data, message }`
5. ✅ **版本控制**：`/api/v1/posts`（当API需要升级时）
6. ✅ **使用分页**：`?page=1&pageSize=10`
7. ✅ **使用查询参数筛选**：`?status=published&authorId=1`

---

## 🔗 相关资源

- **相关笔记**: [[Express路由]]
- **项目实战**: [[../../projects/11-personal-blog]]
- **前端对比**: [[../../04-前后端对比/概念对照表]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-24
**应用场景**: 所有API设计
