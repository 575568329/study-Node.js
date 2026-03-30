---
tags:
  - 异步编程
  - async/await
  - B领域
创建时间: 2026-03-21
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# async/await

## 📚 核心概念

async/await是**Promise的语法糖**，让异步代码看起来像同步代码，更易读易写。

---

## 🎯 基本语法

### async函数

```javascript
// 声明async函数
async function fetchData() {
  return '数据';
}

// 等价于
function fetchData() {
  return Promise.resolve('数据');
}

// 使用
fetchData().then(data => console.log(data));  // '数据'
```

**特点**：
- ✅ async函数**总是返回Promise**
- ✅ 返回值会被自动包装成Promise.resolve()

---

### await表达式

```javascript
async function getData() {
  const promise = new Promise(resolve => {
    setTimeout(() => resolve('数据'), 1000);
  });

  // 等待Promise完成
  const data = await promise;
  console.log(data);  // '数据'
}
```

**特点**：
- ✅ await**只能在async函数中使用**
- ✅ await会**暂停函数执行**，等待Promise完成
- ✅ 返回Promise的resolve值

---

## 💡 实际应用示例

### 1️⃣ 文件读取

```javascript
const fs = require('fs').promises;

// ❌ Promise方式
fs.readFile('./file.txt', 'utf-8')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

// ✅ async/await方式
async function readFile() {
  try {
    const data = await fs.readFile('./file.txt', 'utf-8');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

---

### 2️⃣ 顺序执行多个异步操作

```javascript
// ❌ Promise链（嵌套）
fs.readFile('./file1.txt', 'utf-8')
  .then(data1 => {
    console.log(data1);
    return fs.readFile('./file2.txt', 'utf-8');
  })
  .then(data2 => {
    console.log(data2);
    return fs.readFile('./file3.txt', 'utf-8');
  })
  .then(data3 => {
    console.log(data3);
  });

// ✅ async/await（扁平）
async function readFiles() {
  try {
    const data1 = await fs.readFile('./file1.txt', 'utf-8');
    console.log(data1);

    const data2 = await fs.readFile('./file2.txt', 'utf-8');
    console.log(data2);

    const data3 = await fs.readFile('./file3.txt', 'utf-8');
    console.log(data3);
  } catch (error) {
    console.error(error);
  }
}
```

---

### 3️⃣ 数据库查询

```javascript
// ❌ 回调方式
function getUser(id, callback) {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results[0]);
    }
  });
}

// ✅ async/await方式
async function getUser(id) {
  try {
    const [results] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return results[0];
  } catch (error) {
    throw error;
  }
}

// 使用
const user = await getUser(1);
console.log(user);
```

---

### 4️⃣ Express路由

```javascript
// ✅ async/await在路由中使用
router.get('/posts/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;

    // 获取文章
    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 获取文章评论
    const [comments] = await pool.query(
      'SELECT * FROM comments WHERE post_id = ?',
      [postId]
    );

    res.json({
      success: true,
      data: {
        post: posts[0],
        comments
      }
    });
  } catch (error) {
    next(error);  // 传递给错误处理中间件
  }
});
```

---

## 📊 Promise.all vs await

### 顺序执行（await）

```javascript
// ❌ 慢：每个await都要等待前一个完成
async function sequential() {
  const start = Date.now();

  const user = await fetchUser(1);      // 耗时1秒
  const posts = await fetchPosts();     // 耗时1秒
  const comments = await fetchComments(); // 耗时1秒

  console.log('总耗时:', Date.now() - start);  // 约3秒
}
```

### 并行执行（Promise.all）

```javascript
// ✅ 快：多个请求同时执行
async function parallel() {
  const start = Date.now();

  const [user, posts, comments] = await Promise.all([
    fetchUser(1),      // 耗时1秒
    fetchPosts(),      // 耗时1秒
    fetchComments()    // 耗时1秒
  ]);

  console.log('总耗时:', Date.now() - start);  // 约1秒
}
```

---

## 🎓 错误处理

### try-catch-finally

```javascript
async function fetchData() {
  try {
    const data = await fetch(url);
    const json = await data.json();
    return json;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;  // 重新抛出错误
  } finally {
    console.log('无论成功失败都执行');
  }
}
```

### 多个catch

```javascript
async function handleRequest() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes('HTTP错误')) {
      console.error('HTTP错误:', error.message);
    } else if (error.message.includes('网络错误')) {
      console.error('网络错误:', error.message);
    } else {
      console.error('未知错误:', error);
    }
    throw error;
  }
}
```

---

## 🤔 常见错误

### 错误1：忘记async

```javascript
// ❌ 错误：在普通函数中使用await
function getData() {
  const data = await promise;  // SyntaxError
}

// ✅ 正确：声明为async
async function getData() {
  const data = await promise;
}
```

### 错误2：忘记await

```javascript
// ❌ 错误：忘记await
async function getData() {
  const data = promise;  // 没有await，data是Promise对象
  console.log(data);  // Promise {<pending>}
}

// ✅ 正确：使用await
async function getData() {
  const data = await promise;  // 等待Promise完成
  console.log(data);  // 实际数据
}
```

### 错误3：在循环中使用await

```javascript
// ❌ 慢：顺序执行
async function processItems(items) {
  for (const item of items) {
    await processItem(item);  // 每个都等待
  }
}

// ✅ 快：并行执行
async function processItems(items) {
  await Promise.all(
    items.map(item => processItem(item))
  );
}
```

---

## 🎯 最佳实践

### 1️⃣ 使用Promise.all并行执行

```javascript
// ✅ 并行执行多个独立操作
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(),
  fetchComments()
]);
```

### 2️⃣ 错误要传递

```javascript
// ✅ 在Express中传递错误
router.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await getPost(req.params.id);
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);  // 传递给错误处理中间件
  }
});
```

### 3️⃣ 始终处理错误

```javascript
// ✅ 使用try-catch
async function getData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

### 4️⃣ 不要混用回调

```javascript
// ❌ 不好：混用回调和async/await
async function getData() {
  fs.readFile('./file.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

// ✅ 好：只用async/await
async function getData() {
  const data = await fs.promises.readFile('./file.txt', 'utf-8');
  console.log(data);
}
```

---

## 🆚 Promise vs async/await对比

| 特性 | Promise | async/await |
|------|---------|-------------|
| **代码可读性** | 中等（链式调用） | 高（像同步代码） |
| **错误处理** | .catch() | try-catch |
| **中间值** | 难以获取 | 容易获取 |
| **条件语句** | 复杂 | 简单 |
| **调试** | 困难 | 容易 |

---

## 🔗 相关资源

- **相关笔记**:
  - [[Promise基础]]
  - [[Event Loop事件循环机制]]
- **项目实战**: [[../../projects/11-personal-blog]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-21
**重要性**: ⭐⭐⭐⭐⭐
