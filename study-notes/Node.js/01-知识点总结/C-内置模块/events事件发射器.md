---
tags:
  - events模块
  - EventEmitter
  - 事件驱动
  - C领域
创建时间: 2026-03-18
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# events事件发射器

## 📚 核心概念

EventEmitter是Node.js的**事件驱动**核心，用于实现**发布-订阅模式**。

---

## 🔧 基本用法

### 创建事件发射器

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
```

---

## 💡 事件监听与触发

### on() - 监听事件

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 监听事件
myEmitter.on('event', () => {
  console.log('事件发生了！');
});

// 触发事件
myEmitter.emit('event');
```

---

### 带参数的事件

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 监听事件（接收参数）
myEmitter.on('user-login', (username, userId) => {
  console.log(`用户 ${username} (ID: ${userId}) 登录了`);
});

// 触发事件（传递参数）
myEmitter.emit('user-login', 'Alice', 123);
// 输出：用户 Alice (ID: 123) 登录了
```

---

### once() - 只监听一次

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 只监听一次
myEmitter.once('event', () => {
  console.log('这只执行一次');
});

// 触发第1次
myEmitter.emit('event');  // 输出
// 触发第2次
myEmitter.emit('event');  // 不输出
```

---

## 🎯 实际应用示例

### 示例1：用户注册系统

```javascript
const EventEmitter = require('events');

class UserSystem extends EventEmitter {
  register(username, password) {
    console.log(`正在注册用户: ${username}`);

    // 触发注册前事件
    this.emit('beforeRegister', username);

    // 模拟注册
    const userId = Math.floor(Math.random() * 1000);

    // 触发注册成功事件
    this.emit('registerSuccess', { username, userId });

    return userId;
  }
}

const userSystem = new UserSystem();

// 监听注册前事件
userSystem.on('beforeRegister', (username) => {
  console.log(`准备注册: ${username}`);
});

// 监听注册成功事件
userSystem.on('registerSuccess', (user) => {
  console.log(`注册成功: ${user.username}, ID: ${user.userId}`);
  // 发送欢迎邮件
  console.log('发送欢迎邮件...');
});

// 注册用户
userSystem.register('Alice', 'password123');
```

---

### 示例2：日志系统

```javascript
const EventEmitter = require('events');
const fs = require('fs').promises;

class Logger extends EventEmitter {
  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;

    // 触发日志事件
    this.emit('log', logMessage);

    // 写入文件
    await fs.appendFile('./app.log', logMessage + '\n');
  }
}

const logger = new Logger();

// 监听日志事件（可以添加多个监听器）
logger.on('log', (message) => {
  console.log(message);
});

logger.on('log', (message) => {
  // 发送到远程服务器
  // sendToRemote(message);
});

// 使用
logger.log('服务器启动');
logger.log('用户登录');
```

---

### 示例3：文件处理进度

```javascript
const EventEmitter = require('events');
const fs = require('fs');

class FileProcessor extends EventEmitter {
  process(filePath) {
    const readStream = fs.createReadStream(filePath);

    readStream.on('data', (chunk) => {
      this.emit('progress', chunk.length);
    });

    readStream.on('end', () => {
      this.emit('complete');
    });

    readStream.on('error', (error) => {
      this.emit('error', error);
    });
  }
}

const processor = new FileProcessor();

// 监听进度
let totalBytes = 0;
processor.on('progress', (bytes) => {
  totalBytes += bytes;
  console.log(`已处理: ${totalBytes} 字节`);
});

// 监听完成
processor.on('complete', () => {
  console.log('处理完成！');
});

// 监听错误
processor.on('error', (error) => {
  console.error('处理失败:', error);
});

// 处理文件
processor.process('./large-file.txt');
```

---

## 📊 EventEmitter方法

### 常用方法

| 方法 | 说明 |
|------|------|
| `on(event, listener)` | 添加监听器 |
| `once(event, listener)` | 添加一次性监听器 |
| `emit(event, ...args)` | 触发事件 |
| `off(event, listener)` | 移除监听器 |
| `removeAllListeners(event)` | 移除所有监听器 |
| `listenerCount(event)` | 返回监听器数量 |

---

### 移除监听器

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 定义监听器
const handler = () => {
  console.log('处理事件');
};

// 添加监听器
myEmitter.on('event', handler);

// 触发事件
myEmitter.emit('event');  // 输出

// 移除监听器
myEmitter.off('event', handler);

// 再次触发（无输出）
myEmitter.emit('event');
```

---

### 监听器数量

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});

// 获取监听器数量
const count = myEmitter.listenerCount('event');
console.log(count);  // 3
```

---

## 🤔 常见错误

### 错误1：忘记移除监听器

```javascript
// ❌ 不好：监听器一直存在
myEmitter.on('data', () => {
  // 处理数据
});

// ✅ 好：使用once
myEmitter.once('data', () => {
  // 只处理一次
});

// 或者手动移除
const handler = () => {
  // 处理数据
  myEmitter.off('data', handler);
};
myEmitter.on('data', handler);
```

---

### 错误2：错误事件未处理

```javascript
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// ❌ 不好：没有监听错误事件
myEmitter.emit('error', new Error('出错了'));
// 错误会抛出，可能导致程序崩溃

// ✅ 好：监听错误事件
myEmitter.on('error', (error) => {
  console.error('发生错误:', error);
});

myEmitter.emit('error', new Error('出错了'));
```

---

## 🎯 最佳实践

1. ✅ **事件名使用驼峰命名**
   ```javascript
   myEmitter.on('userLogin', handler);  // ✅ 好
   myEmitter.on('user-login', handler);  // ❌ 不推荐
   ```

2. ✅ **始终处理错误事件**
   ```javascript
   myEmitter.on('error', (error) => {
     console.error(error);
   });
   ```

3. ✅ **移除不需要的监听器**
   ```javascript
   myEmitter.off('event', handler);
   ```

4. ✅ **使用once处理一次性事件**
   ```javascript
   myEmitter.once('init', () => {
     // 初始化代码
   });
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[Express中间件机制]]
  - [[Event Loop事件循环机制]]
- **Node.js官方文档**: https://nodejs.org/docs/latest/api/events.html

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-18
**重要性**: ⭐⭐⭐⭐
