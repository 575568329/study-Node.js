---
tags:
  - url模块
  - URL解析
  - C领域
创建时间: 2026-03-19
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# url模块

## 📚 核心概念

url模块用于**处理和解析URL**，常用于Web开发中解析请求参数。

---

## 🔧 基本用法

### 解析URL

```javascript
const url = require('url');

const urlString = 'https://user:pass@example.com:8080/path/to/page?query=string#hash';

const parsed = url.parse(urlString);

console.log(parsed);
// {
//   protocol: 'https:',
//   slashes: true,
//   auth: 'user:pass',
//   host: 'example.com:8080',
//   port: '8080',
//   hostname: 'example.com',
//   hash: '#hash',
//   search: '?query=string',
//   query: 'query=string',
//   pathname: '/path/to/page',
//   path: '/path/to/page?query=string',
//   href: 'https://user:pass@example.com:8080/path/to/page?query=string#hash'
// }
```

---

## 💡 常用方法

### url.parse() - 解析URL

```javascript
const url = require('url');

const parsed = url.parse('http://example.com:3000/path?name=value');

console.log(parsed.hostname);  // 'example.com'
console.log(parsed.port);      // '3000'
console.log(parsed.pathname);  // '/path'
console.log(parsed.query);     // 'name=value'（字符串）
```

---

### url.parse() - 解析查询参数

```javascript
const url = require('url');

// parse查询参数为对象
const parsed = url.parse('http://example.com?name=Alice&age=20', true);

console.log(parsed.query);
// { name: 'Alice', age: '20' }

// 访问参数
console.log(parsed.query.name);  // 'Alice'
console.log(parsed.query.age);   // '20'
```

---

### url.format() - 组装URL

```javascript
const url = require('url');

const urlObj = {
  protocol: 'https:',
  hostname: 'example.com',
  port: '443',
  pathname: '/path/to/page',
  query: { key: 'value' }
};

const urlString = url.format(urlObj);
console.log(urlString);
// 'https://example.com:443/path/to/page?key=value'
```

---

### url.resolve() - 解析相对路径

```javascript
const url = require('url');

const base = 'http://example.com/path/to/page';
const relative = '../other/page';

const resolved = url.resolve(base, relative);
console.log(resolved);
// 'http://example.com/path/other/page'
```

---

## 🎯 实际应用示例

### 示例1：解析请求URL（旧版API）

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // 解析URL
  const parsed = url.parse(req.url, true);

  console.log(parsed.pathname);  // '/api/posts'
  console.log(parsed.query);     // { page: '1', limit: '10' }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true }));
});

server.listen(3000);
```

---

### 示例2：构建查询字符串

```javascript
const url = require('url');

const params = {
  search: 'Node.js',
  page: 1,
  limit: 10,
  filters: ['javascript', 'programming']
};

const queryString = url.stringify(params);
console.log(queryString);
// 'search=Node.js&page=1&limit=10&filters=javascript&filters=programming'

// 组装完整URL
const fullUrl = 'http://example.com/search?' + queryString;
console.log(fullUrl);
// 'http://example.com/search?search=Node.js&page=1&limit=10&filters=javascript&filters=programming'
```

---

### 示例3：重定向

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);

  if (parsed.pathname === '/old-path') {
    // 重定向到新路径
    const newPath = '/new-path';
    const redirectUrl = url.format({
      protocol: req.headers.protocol || 'http:',
      host: req.headers.host,
      pathname: newPath
    });

    res.writeHead(301, { 'Location': redirectUrl });
    res.end();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Page Found</h1>');
  }
});

server.listen(3000);
```

---

## 📊 URL结构

```javascript
https://user:pass@example.com:8080/path/to/page?name=value#hash
│       │     │                    │    │             │         │
│       │     │                    │    │             │         └─ hash
│       │     │                    │    │             └─────────── search (查询参数)
│       │     │                    │    └─────────────────────────── pathname (路径)
│       │     │                    └───────────────────────────────── port (端口)
│       │     └──────────────────────────────────────────────────── host (主机)
│       └────────────────────────────────────────────────────────── auth (认证)
└─────────────────────────────────────────────────────────────────── protocol (协议)
```

---

## 🆚 新版API（URL类）

Node.js v8+ 提供了**WHATWG URL API**（新版），更推荐使用：

```javascript
// ✅ 新版API（推荐）
const myUrl = new URL('https://example.com/path?name=value');

console.log(myUrl.hostname);  // 'example.com'
console.log(myUrl.pathname);  // '/path'
console.log(myUrl.search);    // '?name=value'

// 查询参数自动解析为URLSearchParams
console.log(myUrl.searchParams.get('name'));  // 'value'

// 添加参数
myUrl.searchParams.append('key', 'value');
```

---

## 🤔 常见错误

### 错误1：忘记parse第二个参数

```javascript
// ❌ 错误：query为字符串
const parsed = url.parse('http://example.com?name=Alice');
console.log(parsed.query);  // 'name=Alice'（字符串）
console.log(parsed.query.name);  // undefined

// ✅ 正确：parse第二个参数为true
const parsed = url.parse('http://example.com?name=Alice', true);
console.log(parsed.query);  // { name: 'Alice' }（对象）
console.log(parsed.query.name);  // 'Alice'
```

---

### 错误2：硬编码URL

```javascript
// ❌ 不好：硬编码URL
const apiUrl = 'http://example.com/api/data';

// ✅ 好：使用URL类组装
const apiUrl = new URL('/api/data', 'http://example.com');
```

---

## 🎯 最佳实践

1. ✅ **使用新版URL API**
   ```javascript
   const myUrl = new URL('https://example.com');
   ```

2. ✅ **使用URLSearchParams处理查询参数**
   ```javascript
   const params = new URLSearchParams();
   params.append('name', 'Alice');
   params.append('age', '20');
   ```

3. ✅ **验证URL格式**
   ```javascript
   try {
     const myUrl = new URL(userInput);
   } catch (error) {
     console.error('无效的URL');
   }
   ```

---

## 🔗 相关资源

- **相关笔记**:
  - [[http创建服务器]]
  - [[Express路由]]
- **Node.js官方文档**: https://nodejs.org/docs/latest/api/url.html

---

**掌握程度**: ✅ 已掌握
**学习时间**: 2026-03-19
**重要性**: ⭐⭐⭐
