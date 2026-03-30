---
tags:
  - fs模块
  - Stream
  - 流式操作
  - C领域
创建时间: 2026-03-16
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# fs流式操作

## 📚 核心概念

Stream（流）是Node.js中处理**流式数据**的API，可以**逐块**读取和写入数据，而不是一次性加载整个文件到内存。

---

## 🎯 为什么使用Stream？

### 问题：读取大文件

```javascript
// ❌ 不好：一次性读取大文件
const fs = require('fs').promises;

async function processLargeFile() {
  const data = await fs.readFile('./huge-file.txt');  // 可能几GB
  // 内存溢出！
}
```

### 解决：使用Stream

```javascript
// ✅ 好：流式读取
const fs = require('fs');

const readStream = fs.createReadStream('./huge-file.txt');

readStream.on('data', (chunk) => {
  // 每次只读取一小块（默认64KB）
  console.log('收到数据块，大小:', chunk.length);
});

readStream.on('end', () => {
  console.log('读取完成');
});
```

**优点**：
- ✅ 内存占用小
- ✅ 可以处理任意大小的文件
- ✅ 边读边处理，效率高

---

## 🔧 Stream的四种类型

| 类型 | 用途 | 示例 |
|------|------|------|
| **Readable** | 可读流 | 文件读取、HTTP请求 |
| **Writable** | 可写流 | 文件写入、HTTP响应 |
| **Duplex** | 双向流 | TCP socket |
| **Transform** | 转换流 | zlib压缩、crypto加密 |

---

## 💡 实际应用示例

### 示例1：复制文件

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('./input.txt');
const writeStream = fs.createWriteStream('./output.txt');

// 管道操作（pipe）
readStream.pipe(writeStream);

console.log('开始复制文件');

// 监听完成事件
writeStream.on('finish', () => {
  console.log('文件复制完成');
});

// 监听错误事件
readStream.on('error', (err) => {
  console.error('读取错误:', err);
});

writeStream.on('error', (err) => {
  console.error('写入错误:', err);
});
```

---

### 示例2：读取文件并处理

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('./large-file.txt', 'utf-8');

let lineCount = 0;
let wordCount = 0;

readStream.on('data', (chunk) => {
  // 处理每个数据块
  const lines = chunk.split('\n');
  lineCount += lines.length;
  wordCount += chunk.split(' ').length;

  console.log(`处理中：${lineCount}行，${wordCount}词`);
});

readStream.on('end', () => {
  console.log('统计完成');
  console.log(`总行数: ${lineCount}`);
  console.log(`总词数: ${wordCount}`);
});
```

---

### 示例3：文件压缩

```javascript
const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('./input.txt');
const gzip = zlib.createGzip();
const writeStream = fs.createWriteStream('./input.txt.gz');

// 链式管道：读取 → 压缩 → 写入
readStream
  .pipe(gzip)
  .pipe(writeStream);

writeStream.on('finish', () => {
  console.log('文件压缩完成');
});
```

---

### 示例4：上传文件处理

```javascript
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method === 'POST') {
    const writeStream = fs.createWriteStream('./uploaded-file.bin');

    // 将请求流（文件数据）写入文件
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('文件上传完成');
    });

    writeStream.on('error', (err) => {
      console.error('写入失败:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('上传失败');
    });
  }
});

server.listen(3000);
```

---

## 📊 Stream事件

### Readable Stream事件

```javascript
const readStream = fs.createReadStream('./file.txt');

// data：收到数据块
readStream.on('data', (chunk) => {
  console.log('数据块:', chunk);
});

// end：数据读取完成
readStream.on('end', () => {
  console.log('读取完成');
});

// error：发生错误
readStream.on('error', (err) => {
  console.error('错误:', err);
});

// close：流关闭
readStream.on('close', () => {
  console.log('流关闭');
});
```

---

### Writable Stream事件

```javascript
const writeStream = fs.createWriteStream('./output.txt');

// drain：可以继续写入
writeStream.on('drain', () => {
  console.log('可以继续写入');
});

// finish：写入完成
writeStream.on('finish', () => {
  console.log('写入完成');
});

// error：发生错误
writeStream.on('error', (err) => {
  console.error('错误:', err);
});
```

---

## 🎓 Stream模式

### 1️⃣ 暂停和恢复

```javascript
const readStream = fs.createReadStream('./large-file.txt');

// 暂停流
readStream.pause();

setTimeout(() => {
  // 恢复流
  readStream.resume();
}, 5000);
```

---

### 2️⃣ 手动写入

```javascript
const writeStream = fs.createWriteStream('./output.txt');

// 写入数据
writeStream.write('第一行\n');
writeStream.write('第二行\n');

// 结束写入
writeStream.end('最后一行\n');

// 监听完成事件
writeStream.on('finish', () => {
  console.log('写入完成');
});
```

---

## 🤔 常见错误

### 错误1：忘记处理错误

```javascript
// ❌ 不好：没有错误处理
readStream.pipe(writeStream);
// 如果出错，程序可能崩溃

// ✅ 好：监听错误事件
readStream
  .on('error', (err) => {
    console.error('读取错误:', err);
  })
  .pipe(writeStream)
  .on('error', (err) => {
    console.error('写入错误:', err);
  });
```

---

### 错误2：内存泄漏

```javascript
// ❌ 不好：读取速度 > 处理速度，导致内存积压
readStream.on('data', (chunk) => {
  // 如果处理很慢，数据会积压在内存中
  heavyComputation(chunk);
});

// ✅ 好：暂停流，处理完再恢复
readStream.on('data', (chunk) => {
  readStream.pause();  // 暂停流

  heavyComputation(chunk, () => {
    readStream.resume();  // 恢复流
  });
});
```

---

## 🎯 最佳实践

1. ✅ **使用pipe简化代码**
   ```javascript
   readStream.pipe(transformStream).pipe(writeStream);
   ```

2. ✅ **始终处理错误**
   ```javascript
   readStream.on('error', (err) => {
     console.error(err);
   });
   ```

3. ✅ **大文件使用Stream**
   ```javascript
   // 小文件（< 10MB）
   const data = await fs.readFile('./small-file.txt');

   // 大文件（> 10MB）
   const readStream = fs.createReadStream('./large-file.txt');
   ```

4. ✅ **使用pipeline代替pipe**
   ```javascript
   const { pipeline } = require('stream/promises');

   await pipeline(
     readStream,
     transformStream,
     writeStream
   );
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[fs文件读取]]
  - [[fs文件写入]]
- **Node.js官方文档**: https://nodejs.org/docs/latest/api/stream.html

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-16
**重要性**: ⭐⭐⭐⭐
