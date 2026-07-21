---
tags:
  - 异步编程
  - Event Loop
  - 事件循环
  - B领域
创建时间: 2026-03-21
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# Event Loop事件循环机制

## 📚 核心概念

Event Loop是**JavaScript的异步执行机制**，让JavaScript能够**非阻塞**地执行异步操作。

---

## 🎯 为什么需要Event Loop？

JavaScript是**单线程**语言，同一时间只能做一件事。

```javascript
// ❌ 如果没有Event Loop，这会阻塞整个程序
while (true) {
  // 这个循环会永远执行，后面的代码永远无法执行
}

console.log('永远无法执行');
```

**Event Loop的作用**：
- ✅ 让JavaScript能够处理异步操作
- ✅ 不会阻塞主线程
- ✅ 协调同步代码和异步回调的执行顺序

---

## 🔄 Event Loop工作流程

### 执行顺序

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// 输出顺序：1 → 3 → 2
```

**执行过程**：

```
1. 执行同步代码：
   - console.log('1')  → 输出 '1'
   - setTimeout()      → 回调进入宏任务队列
   - console.log('3')  → 输出 '3'

2. 同步代码执行完毕，检查微任务队列：
   - 微任务队列为空

3. 检查宏任务队列：
   - 发现setTimeout的回调
   - 执行回调：console.log('2') → 输出 '2'
```

---

## 📊 任务队列

### 宏任务（Macrotask）

**来源**：
- `setTimeout()`
- `setInterval()`
- `setImmediate()`（Node.js）
- I/O操作
- UI渲染（浏览器）

### 微任务（Microtask）

**来源**：
- `Promise.then()`
- `process.nextTick()`（Node.js）
- `MutationObserver`（浏览器）
- `queueMicrotask()`

---

## 🎯 执行顺序规则

### 规则：同步 → 微任务 → 宏任务

```javascript
console.log('1');  // 同步

setTimeout(() => {
  console.log('2');  // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3');  // 微任务
});

console.log('4');  // 同步

// 输出顺序：1 → 4 → 3 → 2
```

**执行过程**：

```
1. 执行同步代码：
   console.log('1')  → 输出 '1'
   setTimeout()      → 回调进入宏任务队列
   Promise.then()    → 回调进入微任务队列
   console.log('4')  → 输出 '4'

2. 同步代码执行完毕

3. 检查微任务队列：
   执行Promise.then() → 输出 '3'

4. 微任务队列为空

5. 检查宏任务队列：
   执行setTimeout() → 输出 '2'
```

---

## 💡 复杂示例

### 示例1：嵌套的微任务和宏任务

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => {
    console.log('5');
  }, 0);
});

console.log('6');

// 输出：1 → 6 → 4 → 2 → 3 → 5
```

**执行过程**：

```
第1轮循环：
  1. 同步：console.log('1') → '1'
  2. setTimeout() → 宏任务队列：[任务1]
  3. Promise.then() → 微任务队列：[任务A]
  4. 同步：console.log('6') → '6'
  5. 执行微任务：任务A → '4'
     任务A中的setTimeout() → 宏任务队列：[任务1, 任务B]

第2轮循环：
  1. 执行宏任务：任务1 → '2'
     任务1中的Promise.then() → 微任务队列：[任务C]
  2. 执行微任务：任务C → '3'

第3轮循环：
  1. 执行宏任务：任务B → '5'
```

---

### 示例2：Promise链

```javascript
Promise.resolve()
  .then(() => {
    console.log('1');
    Promise.resolve().then(() => {
      console.log('2');
    });
  })
  .then(() => {
    console.log('3');
  });

// 输出：1 → 2 → 3
```

**为什么？**

```
第1轮循环：
  1. Promise.resolve().then(任务A) → 微任务队列：[任务A]
  2. 执行任务A → '1'
     任务A中的Promise.then(任务B) → 微任务队列：[任务B, 任务C]

第2轮循环：
  1. 执行任务B → '2'
  2. 执行任务C → '3'
```

---

## 🆚 宏任务 vs 微任务对比

| 特性 | 宏任务 | 微任务 |
|------|--------|--------|
| **优先级** | 低 | 高 |
| **执行时机** | 每次循环执行一个 | 每次循环执行全部 |
| **来源** | setTimeout、I/O | Promise.then() |
| **执行顺序** | 同步代码 → 微任务 → 宏任务 |

---

## 🎓 Node.js中的Event Loop

### Node.js的6个阶段

```
┌───────────────────────────┐
│   timers（定时器）         │ → setTimeout()、setInterval()
├───────────────────────────┤
│   pending callbacks       │ → I/O回调（某些系统操作）
├───────────────────────────┤
│   idle, prepare           │ → 内部使用
├───────────────────────────┤
│   poll（轮询）            │ → 新的I/O事件
├───────────────────────────┤
│   check（检查）           │ → setImmediate()
├───────────────────────────┤
│   close callbacks         │ → 关闭回调（如socket.on('close')）
└───────────────────────────┘
         ↺ （循环）
```

### process.nextTick()

**优先级最高的微任务**：

```javascript
console.log('1');

process.nextTick(() => {
  console.log('2');
});

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出：1 → 4 → 2 → 3
```

**注意**：
- `process.nextTick()`在**每个阶段之后**、**下个阶段之前**执行
- 优先级**高于Promise.then()**

---

## 🤔 常见面试题

### 面试题1

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

new Promise((resolve) => {
  console.log('3');
  resolve();
}).then(() => {
  console.log('4');
});

console.log('5');

// 输出：1 → 3 → 5 → 4 → 2
```

**关键点**：
- Promise构造函数中的代码是**同步**的
- `.then()`中的回调是**异步**（微任务）

---

### 面试题2

```javascript
setTimeout(() => {
  console.log('1');
  Promise.resolve().then(() => {
    console.log('2');
  });
}, 0);

setTimeout(() => {
  console.log('3');
  Promise.resolve().then(() => {
    console.log('4');
  });
}, 0);

// 输出：1 → 3 → 2 → 4
```

**关键点**：
- 两个setTimeout**同时**进入宏任务队列
- 第1个宏任务执行完后，会执行它产生的微任务
- 然后才执行第2个宏任务

---

### 面试题3

```javascript
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}

async function async2() {
  console.log('3');
}

async1();

console.log('4');

setTimeout(() => {
  console.log('5');
}, 0);

new Promise(resolve => {
  console.log('6');
  resolve();
}).then(() => {
  console.log('7');
});

console.log('8');

// 输出：1 → 3 → 4 → 6 → 8 → 2 → 7 → 5
```

**关键点**：
- `async2()`是同步执行的
- `await async2()`后面的代码被包装成微任务
- 多个微任务按注册顺序执行

---

## 🎯 最佳实践

### 1️⃣ 避免阻塞Event Loop

```javascript
// ❌ 不好：阻塞Event Loop
function heavyComputation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // 阻塞5秒
  }
}

// ✅ 好：使用setImmediate分片
function heavyComputationChunked() {
  setImmediate(() => {
    // 处理一小部分
    if (还有数据) {
      setImmediate(heavyComputationChunked);
    }
  });
}
```

### 2️⃣ 微任务优先

```javascript
// ✅ 优先使用Promise（微任务）
Promise.resolve().then(() => {
  // 尽快执行
});

// ⚠️ setTimeout（宏任务）会延迟
setTimeout(() => {
  // 至少延迟1ms（Node.js最小延迟）
}, 0);
```

### 3️⃣ process.nextTick vs Promise.then

```javascript
// ✅ process.nextTick（更快）
process.nextTick(() => {
  // 立即执行
});

// ⚠️ Promise.then（稍慢）
Promise.resolve().then(() => {
  // 下一轮微任务
});
```

---

## 🔗 相关资源

- **相关笔记**:
  - [[Promise基础]]
  - [[async await]]
- **易错点**: [[../../../03-易错点与陷阱/易错点汇总]]

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-21
**重要性**: ⭐⭐⭐⭐⭐（面试必考！）
