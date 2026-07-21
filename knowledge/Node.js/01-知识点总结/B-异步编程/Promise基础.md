---
tags:
  - 异步编程
  - Promise
  - B领域
创建时间: 2026-03-21
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# Promise基础

## 📚 核心概念

Promise是JavaScript中处理异步操作的解决方案，用于避免回调地狱。

---

## 🎯 什么是Promise？

Promise是**异步操作**的**最终结果**（成功或失败）的**占位符**。

### 三种状态

```javascript
const promise = new Promise((resolve, reject) => {
  // pending（进行中）→ 初始状态

  // 异步操作成功
  resolve(value);  // → fulfilled（已成功）

  // 异步操作失败
  reject(error);   // → rejected（已失败）
});
```

**状态特点**：
- ✅ **pending** → **fulfilled**（成功）
- ✅ **pending** → **rejected**（失败）
- ❌ **状态不可逆**：一旦改变就不会再变
- ❌ 不能从 fulfilled → rejected 或相反

---

## 🔧 基本用法

### 创建Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;

    if (success) {
      resolve('操作成功！');  // 成功时调用
    } else {
      reject(new Error('操作失败！'));  // 失败时调用
    }
  }, 1000);
});
```

### 使用Promise

```javascript
promise
  .then(result => {
    console.log(result);  // '操作成功！'
  })
  .catch(error => {
    console.error(error.message);  // '操作失败！'
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

---

## 💡 实际应用示例

### 1️⃣ 文件读取（Promise版）

```javascript
const fs = require('fs').promises;

// Promise自动处理回调
fs.readFile('./file.txt', 'utf-8')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('读取失败:', error);
  });
```

### 2️⃣ 网络请求

```javascript
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: 'User' });
      } else {
        reject(new Error('无效的用户ID'));
      }
    }, 1000);
  });
}

// 使用
fetchUser(1)
  .then(user => {
    console.log(user);  // { id: 1, name: 'User' }
  })
  .catch(error => {
    console.error(error);
  });
```

### 3️⃣ 数据库查询

```javascript
function queryUser(id) {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

// 使用
queryUser(1)
  .then(user => {
    console.log(user);
  })
  .catch(error => {
    console.error(error);
  });
```

---

## 📊 Promise链式调用

### ❌ 回调地狱

```javascript
setTimeout(() => {
  console.log('第1步');
  setTimeout(() => {
    console.log('第2步');
    setTimeout(() => {
      console.log('第3步');
    }, 1000);
  }, 1000);
}, 1000);
```

### ✅ Promise链

```javascript
new Promise(resolve => {
  setTimeout(() => {
    console.log('第1步');
    resolve();
  }, 1000);
})
  .then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('第2步');
        resolve();
      }, 1000);
    });
  })
  .then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('第3步');
        resolve();
      }, 1000);
    });
  });
```

---

## 🎓 Promise静态方法

### Promise.all()

**所有Promise都成功才成功，有一个失败就失败**

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(values => {
    console.log(values);  // [1, 2, 3]
  })
  .catch(error => {
    console.error(error);
  });
```

**实际应用**：
```javascript
// 同时获取用户信息和文章列表
Promise.all([
  fetchUser(1),
  fetchPosts()
])
  .then(([user, posts]) => {
    console.log(user, posts);
  });
```

### Promise.race()

**哪个先完成就用哪个结果**

```javascript
const p1 = new Promise(resolve => setTimeout(() => resolve('A'), 1000));
const p2 = new Promise(resolve => setTimeout(() => resolve('B'), 500));

Promise.race([p1, p2])
  .then(value => {
    console.log(value);  // 'B'（先完成）
  });
```

**实际应用**：
```javascript
// 请求超时控制
Promise.race([
  fetch(url),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('超时')), 5000)
  )
])
  .then(response => response.json())
  .catch(error => console.error(error));
```

### Promise.resolve() / Promise.reject()

**快速创建已完成的Promise**

```javascript
// 立即成功
Promise.resolve('成功')
  .then(value => console.log(value));  // '成功'

// 立即失败
Promise.reject(new Error('失败'))
  .catch(error => console.error(error));
```

---

## 🤔 常见错误

### 错误1：忘记return

```javascript
// ❌ 错误：没有return
promise
  .then(() => {
    doSomething();  // 没有return
  })
  .then(() => {
    // 这里会立即执行，不会等待doSomething()
  });

// ✅ 正确：有return
promise
  .then(() => {
    return doSomething();  // 返回Promise
  })
  .then(() => {
    // 这里会等待doSomething()完成
  });
```

### 错误2：忘记catch

```javascript
// ❌ 错误：没有catch
promise.then(result => {
  console.log(result);
});
// 如果promise失败，错误会被吞掉

// ✅ 正确：有catch
promise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

### 错误3：在Promise中混用同步和异步

```javascript
// ❌ 不好
const promise = new Promise((resolve, reject) => {
  if (someCondition) {
    resolve('直接同步成功');
  } else {
    setTimeout(() => {
      resolve('异步成功');
    }, 1000);
  }
});

// ✅ 更清晰：统一使用异步
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (someCondition) {
      resolve('成功');
    } else {
      reject(new Error('失败'));
    }
  }, 0);
});
```

---

## 🎯 最佳实践

1. ✅ **总是处理错误**
   ```javascript
   promise.catch(error => {
     console.error(error);
   });
   ```

2. ✅ **总是return Promise**
   ```javascript
   .then(() => {
     return someAsyncOperation();  // 必须return
   })
   ```

3. ✅ **使用finally清理资源**
   ```javascript
   promise
     .then(result => { ... })
     .catch(error => { ... })
     .finally(() => {
       // 无论成功失败都执行
       console.log('完成');
     });
   ```

4. ✅ **Promise命名清晰**
   ```javascript
   // ✅ 好的命名
   const fetchUserPromise = fetchUser(1);

   // ❌ 不好的命名
   const p = fetchUser(1);
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[async await]]
  - [[Event Loop事件循环机制]]
- **项目实战**: [[../../projects/08-user-register-complete]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-21
**重要性**: ⭐⭐⭐⭐⭐
