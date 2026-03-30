---
tags:
  - 数据库
  - 安全
  - SQL注入
  - E领域
创建时间: 2026-03-24
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# SQL注入防护

## 📚 核心概念

SQL注入是**OWASP Top 10**安全风险之一，攻击者可以通过恶意SQL代码窃取数据、破坏数据库。

---

## ⚠️ 什么是SQL注入？

### 示例：不安全的代码

```javascript
// ❌ 危险：字符串拼接
const userId = req.params.id;  // "1 OR 1=1"
const sql = `SELECT * FROM users WHERE id = ${userId}`;

// 实际执行的SQL：
SELECT * FROM users WHERE id = 1 OR 1=1
```

**结果**：
- `1=1` 永远为真
- 返回**所有用户**（数据泄露！）

---

## 💥 SQL注入的危害

### 1️⃣ 数据泄露
```javascript
// 黑客请求：GET /api/users/1 OR 1=1
// 返回所有用户信息（包括密码、邮箱）
SELECT * FROM users WHERE id = 1 OR 1=1
```

### 2️⃣ 绕过登录
```javascript
// 登录接口
const username = req.body.username;  // "admin' OR '1'='1"
const password = req.body.password;  // "123456"
const sql = `
  SELECT * FROM users
  WHERE username = '${username}' AND password = '${password}'
`;

// 实际执行的SQL：
SELECT * FROM users
WHERE username = 'admin' OR '1'='1' AND password = '123456'
// '1'='1' 永远为真，绕过密码验证！
```

### 3️⃣ 删除数据
```javascript
// 黑客请求：DELETE /api/posts/1; DROP TABLE posts;
const postId = "1; DROP TABLE posts;";
const sql = `DELETE FROM posts WHERE id = ${postId}`;

// 实际执行的SQL：
DELETE FROM posts WHERE id = 1; DROP TABLE posts;
// 分号！SQL注入攻击删除了整张表！
```

---

## 🛡️ 如何防止SQL注入

### ✅ 方法1：参数化查询（推荐）

```javascript
// ✅ 正确：使用 ? 占位符
await pool.query(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

await pool.query(
  'SELECT * FROM users WHERE username = ? AND password = ?',
  [username, password]
);

await pool.query(
  'INSERT INTO users (username, password) VALUES (?, ?)',
  [username, hashedPassword]
);

await pool.query(
  'UPDATE users SET email = ? WHERE id = ?',
  [newEmail, userId]
);

await pool.query(
  'DELETE FROM posts WHERE id = ?',
  [postId]
);
```

**原理**：
- 数据库驱动会自动转义参数
- 参数被视为**数据**，不是SQL代码
- 即使参数包含SQL关键字，也不会被执行

---

### ✅ 方法2：ORM框架（Sequelize）

```javascript
// Sequelize会自动防止SQL注入
const user = await User.findOne({
  where: {
    id: userId  // 自动参数化
  }
});

await User.create({
  username: 'user',
  password: 'hashed'  // 自动参数化
});

await User.update(
  { email: 'new@example.com' },
  { where: { id: userId } }  // 自动参数化
);
```

---

## ❌ 错误的写法

```javascript
// ❌ 字符串拼接
const sql = `SELECT * FROM users WHERE id = ${userId}`;

// ❌ 模板字符串拼接
const sql = `SELECT * FROM users WHERE username = '${username}'`;

// ❌ 字符串拼接（使用+）
const sql = 'SELECT * FROM users WHERE id = ' + userId;

// ❌ ES6模板字符串（不使用占位符）
const sql = `SELECT * FROM posts WHERE author_id = ${authorId} AND status = '${status}'`;
```

---

## 🔍 如何检查代码是否存在SQL注入

### 使用grep搜索危险模式

```bash
# 搜索字符串拼接
grep -r "query.*\+" src/
grep -r "query.*\`" src/

# 搜索没有占位符的query
grep -r "pool.query.*[^?]" src/
```

**你的博客项目检查结果**：✅ 全部安全！

---

## 🎯 实际应用示例

### ✅ 安全的代码

#### 查询
```javascript
const getUserById = async (req, res) => {
  const userId = req.params.id;

  const [users] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [userId]  // ✅ 参数化查询
  );

  res.json({ success: true, data: users[0] });
};
```

#### 创建
```javascript
const createPost = async (req, res) => {
  const { title, content, status } = req.body;

  const [result] = await pool.query(
    'INSERT INTO posts (title, content, status, author_id) VALUES (?, ?, ?, ?)',
    [title, content, status, req.user.user_id]  // ✅ 参数化查询
  );

  res.json({ success: true, data: { id: result.insertId } });
};
```

#### 更新
```javascript
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  await pool.query(
    'UPDATE posts SET title = ?, content = ? WHERE id = ?',
    [title, content, postId]  // ✅ 参数化查询
  );

  res.json({ success: true, message: '更新成功' });
};
```

#### 删除
```javascript
const deletePost = async (req, res) => {
  const postId = req.params.id;

  await pool.query(
    'DELETE FROM posts WHERE id = ?',
    [postId]  // ✅ 参数化查询
  );

  res.json({ success: true, message: '删除成功' });
};
```

---

## 🤔 常见问题

### Q1: 参数化查询为什么能防止SQL注入？
**A**:
- 参数化查询将SQL语句和数据**分离**
- 数据库驱动会自动转义特殊字符（如 `'`、`;`、`=`）
- 参数始终被视为**数据**，不会被解释为SQL代码

### Q2: 所有SQL操作都应该用参数化查询吗？
**A**: 是的！
- ✅ 查询（SELECT）
- ✅ 插入（INSERT）
- ✅ 更新（UPDATE）
- ✅ 删除（DELETE）

**例外**：表名、字段名不能用参数化（但这些通常来自代码，不是用户输入）

### Q3: ORM框架如何防止SQL注入？
**A**:
- ORM自动使用参数化查询
- 你不需要手动写SQL
- 更安全、更简洁

---

## 🎯 最佳实践

1. ✅ **永远使用参数化查询**
   ```javascript
   'SELECT * FROM users WHERE id = ?'
   ```

2. ✅ **永远不要拼接SQL字符串**
   ```javascript
   // ❌ 错误
   `SELECT * FROM users WHERE id = ${userId}`
   ```

3. ✅ **使用ORM框架（如Sequelize）**
   ```javascript
   User.findOne({ where: { id: userId } })
   ```

4. ✅ **验证用户输入**
   ```javascript
   const userId = parseInt(req.params.id);
   if (isNaN(userId)) {
     return res.status(400).json({ message: '无效的ID' });
   }
   ```

5. ✅ **使用最小权限原则**
   ```javascript
   // 数据库用户不要用root，用只读或有限权限账号
   ```

6. ✅ **定期安全审计**
   ```bash
   # 使用工具扫描SQL注入漏洞
   npm install -g sqlmap
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[CRUD操作实现]]
  - [[Node.js连接mysql2]]
- **项目实战**: [[../../projects/11-personal-blog]]
- **安全相关**: [[XSS与CSRF防护]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-24
**重要性**: ⭐⭐⭐⭐⭐（必考！）
