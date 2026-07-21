---
tags:
  - fs模块
  - 文件操作
  - C领域
创建时间: 2026-03-15
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# fs文件读取

## 📚 核心概念

fs模块提供多种文件读取方式：同步、异步回调、异步Promise。

---

## 🔧 基本用法

### 1️⃣ 同步读取

```javascript
const fs = require('fs');

// 读取整个文件
const data = fs.readFileSync('./file.txt', 'utf-8');
console.log(data);

// 读取为Buffer
const buffer = fs.readFileSync('./file.txt');
console.log(buffer);
```

**特点**：
- ✅ 简单直接
- ❌ 阻塞主线程
- ✅ 适合配置文件等小文件

---

### 2️⃣ 异步读取（回调）

```javascript
const fs = require('fs');

// 读取文件
fs.readFile('./file.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('读取失败:', err);
    return;
  }
  console.log(data);
});
```

---

### 3️⃣ 异步读取（Promise）

```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('./file.txt', 'utf-8');
    console.log(data);
  } catch (err) {
    console.error('读取失败:', err);
  }
}

readFile();
```

**优点**：
- ✅ 不阻塞主线程
- ✅ 可以使用async/await
- ✅ 推荐使用

---

## 💡 实际应用示例

### 示例1：读取配置文件

```javascript
const fs = require('fs').promises;

async function loadConfig() {
  try {
    const data = await fs.readFile('./config.json', 'utf-8');
    const config = JSON.parse(data);
    return config;
  } catch (err) {
    console.error('加载配置失败:', err);
    return null;
  }
}

// 使用
const config = await loadConfig();
console.log(config);
```

---

### 示例2：读取多个文件

```javascript
const fs = require('fs').promises;

// ❌ 慢：顺序读取
async function readFilesSequential(files) {
  const results = [];
  for (const file of files) {
    const data = await fs.readFile(file, 'utf-8');
    results.push(data);
  }
  return results;
}

// ✅ 快：并行读取
async function readFilesParallel(files) {
  const promises = files.map(file => fs.readFile(file, 'utf-8'));
  const results = await Promise.all(promises);
  return results;
}

// 使用
const files = ['./file1.txt', './file2.txt', './file3.txt'];
const contents = await readFilesParallel(files);
```

---

### 示例3：读取图片

```javascript
const fs = require('fs').promises;

async function readImage(imagePath) {
  try {
    // 读取为Buffer
    const buffer = await fs.readFile(imagePath);

    console.log('文件大小:', buffer.length);
    console.log('文件类型:', buffer.slice(0, 4));  // 查看文件头

    return buffer;
  } catch (err) {
    console.error('读取图片失败:', err);
  }
}

// 使用
const imageBuffer = await readImage('./photo.jpg');
```

---

### 示例4：按行读取文本

```javascript
const fs = require('fs').promises;

async function readLines(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.split('\n');
    return lines;
  } catch (err) {
    console.error('读取失败:', err);
    return [];
  }
}

// 使用
const lines = await readLines('./log.txt');
console.log(`共${lines.length}行`);
```

---

## 📊 读取方式对比

| 方式 | 函数 | 返回值 | 特点 |
|------|------|--------|------|
| **同步** | `fs.readFileSync()` | String/Buffer | 阻塞主线程 |
| **异步回调** | `fs.readFile()` | 回调参数 | 不阻塞 |
| **异步Promise** | `fs.promises.readFile()` | Promise | 可async/await |

---

## 🎯 读取选项

### 文件编码

```javascript
// utf-8（推荐）
const data = await fs.readFile('./file.txt', 'utf-8');

// 不指定编码（返回Buffer）
const buffer = await fs.readFile('./file.txt');

// base64
const base64 = await fs.readFile('./file.txt', 'base64');

// hex
const hex = await fs.readFile('./file.txt', 'hex');
```

---

### 读取部分内容

```javascript
const fs = require('fs').promises;

// 读取前100字节
const buffer = await fs.readFile('./file.txt', {
  encoding: null,
  flag: 'r'
});

const first100Bytes = buffer.slice(0, 100);
console.log(first100Bytes.toString());
```

---

## 🤔 常见错误

### 错误1：文件不存在

```javascript
// ❌ 错误：文件不存在
const data = await fs.readFile('./not-exist.txt', 'utf-8');
// Error: ENOENT: no such file or directory

// ✅ 正确：先检查文件是否存在
const fs = require('fs').promises;

async function safeReadFile(path) {
  try {
    await fs.access(path);  // 检查文件是否存在
    const data = await fs.readFile(path, 'utf-8');
    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('文件不存在');
      return null;
    }
    throw err;
  }
}
```

### 错误2：编码错误

```javascript
// ❌ 错误：编码不匹配
const data = await fs.readFile('./gbk.txt', 'utf-8');
// 可能出现乱码

// ✅ 正确：指定正确的编码
const iconv = require('iconv-lite');
const buffer = await fs.readFile('./gbk.txt');
const data = iconv.decode(buffer, 'gbk');
```

### 错误3：读取大文件

```javascript
// ❌ 不好：读取大文件到内存
const data = await fs.readFile('./huge-file.txt', 'utf-8');
// 可能导致内存溢出

// ✅ 好：使用流式读取
const fs = require('fs');
const readStream = fs.createReadStream('./huge-file.txt', 'utf-8');

readStream.on('data', (chunk) => {
  console.log('收到数据块:', chunk);
});

readStream.on('end', () => {
  console.log('读取完成');
});
```

---

## 🎯 最佳实践

1. ✅ **使用Promise版本**
   ```javascript
   const fs = require('fs').promises;
   ```

2. ✅ **始终处理错误**
   ```javascript
   try {
     const data = await fs.readFile('./file.txt', 'utf-8');
   } catch (err) {
     if (err.code === 'ENOENT') {
       console.error('文件不存在');
     } else {
       console.error('读取失败:', err);
     }
   }
   ```

3. ✅ **指定编码**
   ```javascript
   await fs.readFile('./file.txt', 'utf-8');
   ```

4. ✅ **大文件使用流**
   ```javascript
   const fs = require('fs');
   const readStream = fs.createReadStream('./large-file.txt');
   ```

5. ✅ **并行读取多个文件**
   ```javascript
   const [file1, file2, file3] = await Promise.all([
     fs.readFile('./file1.txt', 'utf-8'),
     fs.readFile('./file2.txt', 'utf-8'),
     fs.readFile('./file3.txt', 'utf-8')
   ]);
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[fs文件写入]]
  - [[fs流式操作]]
- **Node.js官方文档**: https://nodejs.org/docs/latest/api/fs.html

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-15
**重要性**: ⭐⭐⭐⭐
