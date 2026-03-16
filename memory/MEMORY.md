# Node.js 学习记忆存储

**最后更新**: 2026-03-15

---

## 🎯 学生概况

**学习目标**: Node.js全栈开发就业
**当前课程**: 黑马程序员 Node.js 全套教程 (BV1gM411W7ex)
**学习方式**: 视频学习 + AI导师苏格拉底式教学 + 代码练习
**开始日期**: 2026-03-13
**基本信息**: 熟练掌握前端JS,VUE.js开发,29岁,6年前端开发.

---

## 📊 当前进度 (2026-03-15)

**整体进度**: 16/73 topics (22%)
**当前视频**: P074-P080
**学习阶段**: 第1周 - Node.js核心基础 + 内置模块

---

## ✅ 已掌握知识点

### **A. Node.js核心基础** (7/10)
- [x] **A.3** CommonJS vs ES6模块化 (2026-03-15) - *High*
  - 编译时加载 vs 运行时加载
  - 值引用 vs 值拷贝
  - Tree-shaking支持
  - .mjs和"type": "module"启用方式

- [x] **A.4** npm包管理器使用 (2026-03-15) - *High*
  - npm install vs npm ci
  - 版本号规则（^, ~, 精确）
  - dependencies vs devDependencies
  - npm vs npx

- [x] **A.5** package.json详解 (2026-03-15) - *High*
  - 必须字段和可选字段
  - scripts脚本命令
  - type模块类型设置

- [x] **A.6** Buffer缓冲区 (2026-03-13) - *Medium-High*
- [x] **A.7** 全局对象 (2026-03-13) - *High*
- [x] **A.8** 模块加载机制 (2026-03-15) - *High*
  - require()的5个步骤
  - 模块缓存机制
  - 路径规则和优先级

### **B. 异步编程** (2/8)
- [x] **B.3** Promise基础 (2026-03-13) - *High*
- [x] **B.5** async/await (2026-03-13) - *High*

### **C. 内置模块** (5/12)
- [x] **C.1** fs文件写入 (2026-03-15) - *High*
- [x] **C.2** fs文件读取 (2026-03-15) - *High*
- [x] **C.3** fs流式操作 (2026-03-15) - *High*
- [x] **C.5** path路径处理 (2026-03-15) - *High*
- [x] **C.6-C.7** http服务器 (2026-03-15) - *High*

---

## 🔑 关键学习里程碑

### **2026-03-13: 知识漏洞补习**
- 补习了5个重要知识点（Buffer、全局对象、Promise、async/await）
- 纠正了对Promise状态的错误理解
- 掌握了async/await不阻塞主线程的核心概念
- 置信度评估：所有补习内容达到High或Medium-High

### **2026-03-15: 深入学习模块化、npm、内置模块** ⭐
- 掌握了CommonJS vs ES6模块化的区别（编译时vs运行时、值引用vs值拷贝）
- 学习了npm高级用法（ci、版本管理、dependencies分类）
- 掌握了fs模块（文件读写、流操作、管道）
- 掌握了path模块（跨平台路径处理）
- 掌握了http模块（创建服务器、处理请求响应、RESTful API）
- **新增10个知识点，进度从8%提升到22%**

---

## 📚 重要概念理解

### **CommonJS vs ES6模块化**
- **加载时机**: CommonJS运行时加载（同步），ES6模块编译时加载（异步）
- **值的本质**: CommonJS是值拷贝，ES6模块是值引用
- **Tree-shaking**: ES6模块支持静态分析，CommonJS不支持
- **启用方式**: .mjs扩展名或package.json设置"type": "module"
- **模块混用**: 可以用.js(ES6)和.cjs(CommonJS)混用

### **npm包管理**
- **npm install vs npm ci**: ci用于生产环境，严格按lock文件，更快更可靠
- **版本号**: ^1.2.3兼容次版本，~1.2.3兼容补丁，1.2.3精确版本，*总是最新（危险）
- **dependencies**: 生产依赖，部署时需要（express、axios）
- **devDependencies**: 开发依赖，生产环境不需要（webpack、eslint、nodemon）
- **npm vs npx**: npm管理包，npx执行包（无需安装）

### **模块加载机制**
- **require()的5个步骤**: 路径解析→检查缓存→读取文件→模块包装→缓存模块
- **模块缓存**: 同一文件只执行一次，使用require.resolve()作为key
- **核心模块优先级**: 最高（防止恶意包覆盖）
- **路径不能省略**: ./区分文件模块和npm包

### **fs文件系统**
- **异步API**: fs.readFile() - 推荐使用，不阻塞主线程
- **同步API**: fs.readFileSync() - 阻塞主线程，只适合启动脚本和小文件
- **Stream**: 一点一点传输数据，节省内存，适合大文件
- **管道pipe()**: 自动连接读取流和写入流，处理背压
- **highWaterMark**: 控制缓冲区大小（默认64KB）

### **path路径处理**
- **跨平台**: Windows用\，Mac/Linux用/，path模块自动适配
- **__dirname**: 全局变量，当前文件所在目录（固定）
- **path.dirname()**: 处理任意路径字符串，提取目录部分
- **path.join()**: 拼接路径，自动处理斜杠
- **path.resolve()**: 解析为绝对路径
- **path.extname()**: 获取文件扩展名

### **http服务器**
- **创建服务器**: http.createServer()
- **req对象**: req.method, req.url, req.headers
- **res对象**: res.statusCode, res.setHeader(), res.end()
- **返回JSON**: 设置Content-Type为application/json
- **路由**: 根据URL路径处理不同请求
- **POST数据**: 监听req的data和end事件分块接收

### **异步编程**（之前已学）
- **Promise状态**: pending → fulfilled/rejected（不可逆）
- **resolve/reject**: 分别处理成功和失败
- **async/await**: 只暂停当前函数，不阻塞主线程
- **错误处理**: try-catch包裹await
- **并行执行**: Promise.all()

### **全局对象**（之前已学）
- `__dirname`: 当前文件夹路径（固定）
- `__filename`: 当前文件完整路径
- `process.cwd()`: 当前工作目录（可变）
- `process.argv`: 获取命令行参数（需要slice(2)）

### **Buffer**（之前已学）
- 存储二进制数据的容器
- `Buffer.from()`, `Buffer.alloc()` 创建
- `.toString()` 转换，可指定编码和位置
- 应用：文件读写、图片处理、网络传输

---

## 🎯 下一步学习计划

### **优先级 CRITICAL** (最重要，20%权重)
1. **D.1-D.3** Express框架基础 ⭐⭐⭐
2. **D.4** Express中间件
3. **D.6** RESTful API设计

### **优先级 HIGH** (就业核心)
4. **B.6** Event Loop事件循环 ⭐⭐⭐
5. **B.7** 宏任务vs微任务
6. **E.1-E.5** MySQL数据库

### **优先级 MEDIUM**
7. **C.8-C.12** 其他内置模块（events, crypto, url）
8. **F.1-F.3** 认证与安全（Cookie/Session, JWT）

---

## 🚫 需要避免的常见错误

1. **Promise**: reject()不是"不管成功失败"，只处理失败
2. **async/await**: 不是"避免异步"，而是更好的异步处理方式
3. **Buffer**: toString的第二个参数是结束位置（不包含）
4. **模块路径**: require()时 `./` 不能省略
5. **解构赋值**: exports.add需要用`utils.add()`或解构调用
6. **npm ci vs install**: 生产环境用ci，开发用install
7. **版本号**: 不要用*，总是安装最新版本可能导致不兼容
8. **POST数据**: 必须监听data和end事件，不能直接获取
9. **路径拼接**: 不要用字符串拼接，用path.join()或path.resolve()
10. **流处理**: 大文件必须用流，不要一次性读取

---

## 💡 教学偏好

**学习风格**:
- ✅ 苏格拉底式教学（先问理解，再针对性讲解）
- ✅ 先探索学生现有知识基础
- ✅ 提供简洁解释（约200字）+ 代码示例
- ✅ 立即验证理解（问1-2个检查问题）
- ✅ 鼓励学生思考和探索
- ✅ 基于6年前端经验，用前端知识类比后端概念

**避免**:
- ❌ 直接倾倒大量信息
- ❌ 不检查理解就继续
- ❌ 让学生因不知道而感到糟糕
- ❌ 没有教授底层概念就直接给答案

---

## 📝 会话记录位置

- **详细会话**: `/sessions/YYYY-MM-DD/session-notes.md`
- **进度追踪**: `/progress/nodejs-study-tracker.md`（唯一真相源）
- **代码示例**: `/code-examples/`

---

## 🔍 快速评估检查点

每次新会话开始时，快速确认：
1. ✅ 上次学习内容（查看最近的session-notes.md）
2. ✅ 知识漏洞是否需要复习
3. ✅ 今日学习目标
4. ✅ 学生对上次内容的理解程度

---

**最后复习**: 2026-03-15 会话内容（模块化、npm、fs、path、http）
**下次更新**: 每次学习会话结束后
