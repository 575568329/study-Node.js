# Express 静态资源服务示例

## 📚 学习目标

- 理解什么是静态资源
- 掌握 `express.static()` 的使用
- 理解静态资源的URL路径规则
- 学会组织和管理静态文件

## 🚀 运行方式

```bash
# 进入项目目录
cd projects/02-static-server

# 启动服务器
node server.js
```

然后在浏览器访问：http://localhost:3000

## 📁 项目结构

```
02-static-server/
├── server.js           # Express服务器
├── README.md           # 说明文档
└── public/             # 静态资源文件夹（被express.static托管）
    ├── index.html      # 首页
    ├── css/
    │   └── style.css   # 样式表
    └── js/
        └── app.js      # JavaScript
```

## 🎯 核心知识点

### 1. 基本用法

```javascript
app.use(express.static('public'));
```

- **public文件夹**：存储静态文件的目录
- **URL路径**：会**去掉public这一层**
  - 文件：`public/css/style.css`
  - 访问：`/css/style.css` ✅
  - 访问：`/public/css/style.css` ❌

### 2. 多个静态目录

```javascript
app.use(express.static('public'));   // 先查找
app.use(express.static('assets'));   // 找不到再查找
```

- 按注册顺序查找
- 第一个找到就返回
- 找不到就next()给下一个中间件

### 3. 虚拟路径前缀

```javascript
app.use('/static', express.static('public'));
```

- 访问：`/static/css/style.css` → `public/css/style.css`
- 用于区分不同类型的静态资源

### 4. 缓存控制

```javascript
app.use(express.static('public', {
    maxAge: '1d'  // 缓存1天
}));
```

- 提升加载速度
- 减少服务器压力

## 💡 实际应用场景

### 网站托管

```javascript
app.use(express.static('public'));  // 托管整个网站
```

### 分离静态资源

```javascript
app.use('/static', express.static('public'));     // 网站静态文件
app.use('/uploads', express.static('uploads'));   // 用户上传文件
app.use('/dist', express.static('dist'));         // 构建产物
```

### 单页应用（SPA）

```javascript
// 托管构建后的React/Vue应用
app.use(express.static('dist'));

// 所有路由都返回index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
```

## 🔍 常见问题

### Q1: 为什么CSS/JS加载404？

检查：
1. 文件路径是否正确（去掉public层）
2. 文件是否真的存在于public文件夹
3. express.static()是否在路由之前注册

### Q2: 如何设置首页？

```javascript
// 方式1: 使用重定向
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// 方式2: 直接发送文件
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
```

### Q3: 静态资源和API路由冲突怎么办？

```javascript
// 先注册API路由（优先级高）
app.use('/api', apiRouter);

// 后注册静态资源
app.use(express.static('public'));
```

## 📖 下一步学习

- 模块化路由（express.Router）
- 错误处理中间件
- 常用第三方中间件（cors、morgan、helmet）
