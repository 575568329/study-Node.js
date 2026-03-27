# 静态资源服务项目

## 📁 项目结构

```
02-静态资源服务/
├── public/              # 静态资源文件夹
│   ├── index.html      # 首页
│   ├── css/
│   │   └── style.css    # 样式表
│   ├── js/
│   │   └── app.js       # JavaScript
│   └── images/         # 图片文件夹
├── server.js           # 服务器代码（待实现）
└── README.md          # 项目说明
```

## 🎯 项目目标

### 阶段1：使用原生 http 模块实现（学习用）
- 创建HTTP服务器
- 解析请求URL
- 读取静态文件
- 设置正确的Content-Type
- 处理404错误

### 阶段2：使用 Express 实现（对比学习）
- 使用express.static()
- 对比原生实现
- 理解Express的优势

## 📚 涉及的知识点

- **C.6 http创建服务器**
- **C.2 fs文件读取**
- **C.5 path路径处理**
- **MIME类型**（Content-Type）

## 🚀 开始实现

### Step 1: 测试静态文件
```bash
# 直接在浏览器打开 public/index.html
# 验证样式和脚本是否正常
```

### Step 2: 用原生 http 模块实现
创建 `server-native.js`
- http.createServer()
- fs.readFile()
- path.extname() 获取文件扩展名
- 设置Content-Type映射表

### Step 3: 用 Express 实现
对比两种实现方式的差异

## ✅ 完成标准

- [ ] 原生http模块实现能正常服务静态文件
- [ ] HTML、CSS、JS都能正常加载
- [ ] 图片能正常显示
- [ ] 404错误正确处理
- [ ] 理解Express的实现原理

---

**开始时间**: 2026-03-26
**预计完成时间**: 30-45分钟
