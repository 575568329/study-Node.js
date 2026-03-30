---
tags:
  - http模块
  - 服务器
  - C领域
创建时间: 2026-03-17
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# http创建服务器

## 📚 核心概念

http模块是Node.js的**核心模块**，用于创建HTTP服务器和客户端。

---

## 🔧 创建服务器

### 基本服务器

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req: 请求对象
  // res: 响应对象

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

---

## 💡 请求处理

### 获取请求信息

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // 请求方法
  console.log(req.method);  // 'GET', 'POST', etc.

  // 请求URL
  console.log(req.url);  // '/path?query=string'

  // 请求头
  console.log(req.headers);

  // 响应
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Hello World!</h1>');
});

server.listen(3000);
```

---

### 路由处理

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>首页</h1>');
  } else if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: '数据' }));
  } else if (req.url === '/api/users' && req.method === 'POST') {
    // 处理POST请求
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data = JSON.parse(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(3000);
```

---

## 🎯 响应方法

### res.writeHead()

```javascript
// 设置状态码和响应头
res.writeHead(200, {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
});
```

### res.setHeader()

```javascript
// 设置单个响应头
res.setHeader('Content-Type', 'text/html');
res.setHeader('Authorization', 'Bearer token');
```

### res.write()

```javascript
// 发送响应数据（可以多次调用）
res.write('<h1>Hello</h1>');
res.write('<p>World</p>');
res.end();  // 结束响应
```

### res.end()

```javascript
// 结束响应（可以带数据）
res.end('响应结束');
```

---

## 🔍 实际应用示例

### 示例1：RESTful API

```javascript
const http = require('http');

const server = http.createServer(async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/posts' && req.method === 'GET') {
    // 获取文章列表
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, title: '文章1' },
      { id: 2, title: '文章2' }
    ]));
  } else if (req.url.match(/\/api\/posts\/\d+/) && req.method === 'GET') {
    // 获取单篇文章
    const id = req.url.split('/')[3];
    res.writeHead(200);
    res.end(JSON.stringify({ id, title: `文章${id}` }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

server.listen(3000);
```

---

### 示例2：静态文件服务

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 构建文件路径
  const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // 读取文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    } else {
      // 根据扩展名设置Content-Type
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
      }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(3000);
```

---

## 🤔 常见错误

### 错误1：忘记res.end()

```javascript
// ❌ 错误：没有结束响应
res.writeHead(200);
res.write('Hello');
// 浏览器一直等待

// ✅ 正确
res.writeHead(200);
res.write('Hello');
res.end();  // 结束响应
```

---

### 错误2：重复设置响应头

```javascript
// ❌ 错误：重复设置响应头
res.writeHead(200, { 'Content-Type': 'text/html' });
res.setHeader('Content-Type', 'application/json');  // 错误

// ✅ 正确：只设置一次
res.writeHead(200, { 'Content-Type': 'text/html' });
```

---

## 🎯 最佳实践

1. ✅ **使用Express简化开发**
   ```javascript
   const express = require('express');
   const app = express();
   app.listen(3000);
   ```

2. ✅ **始终处理错误**
   ```javascript
   req.on('error', (err) => {
     console.error('请求错误:', err);
   });
   ```

3. ✅ **设置正确的Content-Type**
   ```javascript
   res.setHeader('Content-Type', 'application/json');
   ```

4. ✅ **使用状态码**
   ```javascript
   res.writeHead(404);  // Not Found
   res.writeHead(500);  // Internal Server Error
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[Express简介与安装]]
  - [[Express路由]]
- **Node.js官方文档**: https://nodejs.org/docs/latest/api/http.html

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-17
**重要性**: ⭐⭐⭐⭐⭐
