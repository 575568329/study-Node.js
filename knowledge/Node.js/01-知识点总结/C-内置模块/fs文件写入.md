---
tags:
  - fs模块
  - 文件操作
  - C领域
创建时间: 2026-03-15
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# fs文件写入

## 📚 核心概念

fs模块是Node.js的**文件系统模块**，用于文件读写操作。

---

## 🔧 基本用法

### 1️⃣ 同步写入

```javascript
const fs = require('fs');

// 写入文件（覆盖）
fs.writeFileSync('./output.txt', 'Hello World', 'utf-8');

// 追加内容
fs.appendFileSync('./output.txt', '\n追加的内容', 'utf-8');
```

**特点**：
- ✅ 简单直接
- ❌ 阻塞主线程（不推荐用于大文件）

---

### 2️⃣ 异步写入（回调）

```javascript
const fs = require('fs');

// 写入文件
fs.writeFile('./output.txt', 'Hello World', 'utf-8', (err) => {
  if (err) {
    console.error('写入失败:', err);
    return;
  }
  console.log('写入成功');
});

// 追加内容
fs.appendFile('./output.txt', '\n追加的内容', 'utf-8', (err) => {
  if (err) {
    console.error('追加失败:', err);
    return;
  }
  console.log('追加成功');
});
```

---

### 3️⃣ 异步写入（Promise）

```javascript
const fs = require('fs').promises;

async function writeFile() {
  try {
    await fs.writeFile('./output.txt', 'Hello World', 'utf-8');
    console.log('写入成功');

    await fs.appendFile('./output.txt', '\n追加的内容', 'utf-8');
    console.log('追加成功');
  } catch (err) {
    console.error('操作失败:', err);
  }
}

writeFile();
```

**优点**：
- ✅ 不阻塞主线程
- ✅ 可以使用async/await

---

## 💡 实际应用示例

### 示例1：写入JSON数据

```javascript
const fs = require('fs').promises;

async function saveConfig(config) {
  try {
    const json = JSON.stringify(config, null, 2);
    await fs.writeFile('./config.json', json, 'utf-8');
    console.log('配置文件已保存');
  } catch (err) {
    console.error('保存失败:', err);
  }
}

// 使用
saveConfig({
  port: 3000,
  database: 'mysql'
});
```

---

### 示例2：创建日志文件

```javascript
const fs = require('fs').promises;

async function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  try {
    await fs.appendFile('./app.log', logMessage, 'utf-8');
  } catch (err) {
    console.error('写入日志失败:', err);
  }
}

// 使用
writeLog('服务器启动');
writeLog('用户登录');
```

---

### 示例3：保存用户上传的文件

```javascript
const fs = require('fs').promises;

async function saveUploadedFile(file, filename) {
  try {
    await fs.writeFile(`./uploads/${filename}`, file.buffer);
    console.log('文件保存成功');
    return { success: true, filename };
  } catch (err) {
    console.error('文件保存失败:', err);
    return { success: false, error: err.message };
  }
}

// 使用（在Express中）
router.post('/upload', upload.single('file'), async (req, res) => {
  const result = await saveUploadedFile(req.file, req.file.originalname);
  res.json(result);
});
```

---

## 🎯 写入选项

### 文件编码

```javascript
// utf-8（推荐）
await fs.writeFile('./file.txt', '内容', 'utf-8');

// base64（二进制数据）
const buffer = Buffer.from('Hello');
await fs.writeFile('./file.txt', buffer.toString('base64'), 'base64');

// hex（十六进制）
await fs.writeFile('./file.txt', buffer.toString('hex'), 'hex');
```

---

### 写入标志（Flag）

```javascript
const fs = require('fs').promises;

// 'w' - 写入（默认，覆盖文件）
await fs.writeFile('./file.txt', '内容', { flag: 'w' });

// 'a' - 追加
await fs.writeFile('./file.txt', '内容', { flag: 'a' });

// 'wx' - 排他性写入（文件不存在时才创建）
await fs.writeFile('./file.txt', '内容', { flag: 'wx' });

// 'ax' - 排他性追加
await fs.writeFile('./file.txt', '内容', { flag: 'ax' });
```

---

## 🤔 常见错误

### 错误1：目录不存在

```javascript
// ❌ 错误：目录不存在
await fs.writeFile('./new-dir/file.txt', '内容');
// Error: ENOENT: no such file or directory

// ✅ 正确：先创建目录
const fs = require('fs').promises;
await fs.mkdir('./new-dir', { recursive: true });
await fs.writeFile('./new-dir/file.txt', '内容');
```

### 错误2：权限不足

```javascript
// ❌ 错误：没有写入权限
await fs.writeFile('/root/file.txt', '内容');
// Error: EACCES: permission denied

// ✅ 正确：检查权限
try {
  await fs.writeFile('./file.txt', '内容');
} catch (err) {
  if (err.code === 'EACCES') {
    console.error('权限不足');
  }
}
```

### 错误3：忘记await

```javascript
// ❌ 错误：没有await
function writeFile() {
  fs.writeFile('./file.txt', '内容');  // 没有await
  console.log('写入成功');  // 可能在写入前就执行
}

// ✅ 正确：使用await
async function writeFile() {
  await fs.writeFile('./file.txt', '内容');
  console.log('写入成功');  // 等待写入完成
}
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
     await fs.writeFile('./file.txt', '内容');
   } catch (err) {
     console.error(err);
   }
   ```

3. ✅ **指定编码**
   ```javascript
   await fs.writeFile('./file.txt', '内容', 'utf-8');
   ```

4. ✅ **检查目录是否存在**
   ```javascript
   const fs = require('fs').promises;

   async function safeWriteFile(path, content) {
     const dir = path.dirname(path);

     try {
       await fs.mkdir(dir, { recursive: true });
       await fs.writeFile(path, content);
     } catch (err) {
       console.error('写入失败:', err);
     }
   }
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[fs文件读取]]
  - [[fs流式操作]]
- **Node.js官方文档**: https://nodejs.org/docs/latest/api/fs.html

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-15
**重要性**: ⭐⭐⭐⭐
