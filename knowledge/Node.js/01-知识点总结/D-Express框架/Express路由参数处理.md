---
tags:
  - Express
  - 路由参数
  - D领域
创建时间: 2026-03-24
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# Express路由参数处理

## 📚 核心概念

Express中有三种接收参数的方式：
1. **req.params** - 路径参数
2. **req.query** - 查询参数
3. **req.body** - 请求体参数

---

## 🔧 三种参数详解

### 1️⃣ req.params（路径参数）

**定义**: URL路径中的参数

```javascript
// 路由定义
router.get('/posts/:id', getPostById);
router.get('/users/:userId/posts/:postId', getUserPost);

// 访问URL
GET /api/posts/123
GET /api/users/5/posts/10

// req.params
{ id: '123' }                    // 第一个路由
{ userId: '5', postId: '10' }    // 第二个路由
```

**特点**：
- ✅ 参数是URL的一部分
- ✅ 必需参数（URL中必须有值）
- ✅ 适合获取单个资源

---

### 2️⃣ req.query（查询参数）

**定义**: URL中 `?` 后面的参数

```javascript
// 路由定义
router.get('/posts', getPosts);

// 访问URL
GET /api/posts?page=1&pageSize=10&status=published

// req.query
{
  page: '1',
  pageSize: '10',
  status: 'published'
}
```

**特点**：
- ✅ 参数在 `?` 后面，用 `&` 连接多个
- ✅ 可选参数（不传也可以）
- ✅ 适合筛选、分页、排序

---

### 3️⃣ req.body（请求体）

**定义**: POST/PUT/PATCH请求中的数据

```javascript
// 路由定义
router.post('/posts', createPost);

// 请求
POST /api/posts
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容"
}

// req.body
{
  title: "文章标题",
  content: "文章内容"
}
```

**注意**：需要使用 `express.json()` 中间件解析

```javascript
app.use(express.json());  // 解析JSON请求体
```

---

## 📊 三种参数对比表

| 参数类型 | 位置 | 示例 | 适用场景 | 中间件 |
|---------|------|------|----------|--------|
| **req.params** | URL路径 | `/posts/:id` | 获取单个资源 | 无需 |
| **req.query** | URL查询字符串 | `/posts?page=1` | 分页/筛选/排序 | 无需 |
| **req.body** | 请求体 | POST `{title}` | 创建/更新资源 | express.json() |

---

## 💡 实际应用示例

### 获取文章详情（使用params）
```javascript
router.get('/:id', postController.getPostById);

// Controller
const getPostById = async (req, res) => {
  const id = req.params.id;  // ✅ 从路径获取文章ID

  const [posts] = await pool.query(
    'SELECT * FROM posts WHERE id = ?',
    [id]
  );

  res.json({ success: true, data: posts[0] });
};
```

### 获取文章列表（使用query）
```javascript
router.get('/', postController.getPosts);

// Controller
const getPosts = async (req, res) => {
  // ✅ 从查询参数获取分页信息
  const { page = 1, pageSize = 10, status = 'published' } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  const [posts] = await pool.query(
    `SELECT * FROM posts
     WHERE status = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [status, parseInt(pageSize), offset]
  );

  res.json({ success: true, data: posts });
};
```

### 创建文章（使用body）
```javascript
router.post('/', authMiddleware, postController.createPost);

// Controller
const createPost = async (req, res) => {
  // ✅ 从请求体获取文章数据
  const { title, content, coverImage, status } = req.body;

  const [result] = await pool.query(
    'INSERT INTO posts (title, content, cover_image, author_id, status) VALUES (?, ?, ?, ?, ?)',
    [title, content, coverImage, req.user.user_id, status]
  );

  res.json({ success: true, data: { id: result.insertId } });
};
```

---

## 🎓 高级用法

### 1️⃣ 可选路径参数
```javascript
// /posts 和 /posts/:id 都能匹配
router.get('/posts/:id?', (req, res) => {
  const id = req.params.id;  // 可能是 undefined

  if (id) {
    // 获取单篇文章
  } else {
    // 获取文章列表
  }
});
```

### 2️⃣ 正则表达式限制参数
```javascript
// id 只能是数字
router.get('/posts/:id(\\d+)', (req, res) => {
  // /posts/123 ✅ 匹配
  // /posts/abc ❌ 不匹配
});

// year 必须是4位数字
router.get('/posts/:year(\\d{4})/:month', (req, res) => {
  // /posts/2026/03 ✅ 匹配
  // /posts/26/03   ❌ 不匹配
});
```

### 3️⃣ 多个路径参数
```javascript
router.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;

  // 查询特定用户的特定文章
  const [posts] = await pool.query(
    'SELECT * FROM posts WHERE id = ? AND author_id = ?',
    [postId, userId]
  );

  res.json({ success: true, data: posts[0] });
});
```

---

## 🤔 常见问题

### Q1: 搜索应该用GET还是POST？
**A**: 简单搜索用 **GET + query**，复杂搜索用 **POST + body**

```javascript
// ✅ 简单搜索（GET）
GET /api/posts/search?keyword=Node.js

// ✅ 复杂搜索（POST）
POST /api/posts/advanced-search
{
  "keyword": "Node.js",
  "tags": ["JavaScript", "Backend"],
  "dateRange": { "from": "2026-01-01", "to": "2026-12-31" }
}
```

### Q2: 为什么推荐用GET+query做搜索？
**A**:
- ✅ 可以缓存（减轻服务器压力）
- ✅ 可以分享链接（复制URL、保存书签）
- ✅ 符合RESTful语义
- ✅ 浏览器会记录历史记录

### Q3: req.params、req.query、req.body 可以同时使用吗？
**A**: 可以！

```javascript
// URL: /api/users/1/posts?page=2
router.get('/users/:userId/posts', (req, res) => {
  const userId = req.params.userId;  // "1"
  const page = req.query.page;        // "2"

  // 同时使用params和query
});

// URL: /api/posts/1/comments
router.post('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;  // "1"
  const { content } = req.body;       // { content: "评论内容" }

  // 同时使用params和body
});
```

---

## 🎯 最佳实践

1. ✅ **获取单个资源**：使用 `req.params`
   ```javascript
   GET /api/posts/:id
   ```

2. ✅ **分页/筛选/排序**：使用 `req.query`
   ```javascript
   GET /api/posts?page=1&status=published
   ```

3. ✅ **创建/更新资源**：使用 `req.body`
   ```javascript
   POST /api/posts { title, content }
   ```

4. ✅ **参数验证**：使用 express-validator
   ```javascript
   const { body, params, query } = require('express-validator');

   router.post('/posts',
     body('title').notEmpty().withMessage('标题不能为空'),
     postController.createPost
   );
   ```

5. ✅ **类型转换**：注意参数都是字符串
   ```javascript
   const id = parseInt(req.params.id);      // "123" → 123
   const page = parseInt(req.query.page) || 1;  // "2" → 2
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[Express路由]]
  - [[RESTful API设计规范]]
- **项目实战**: [[../../projects/11-personal-blog]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-24
**应用场景**: 所有API开发
