# Node.js 学习进度追踪器

**Last Updated**: 2026-03-20
**学习目标**: 全栈开发就业（Node.js后端 + 前端）
**计划时长**: 2-3个月（每天2-3小时）
**当前课程**: 黑马程序员 Node.js 全套教程

---

## 📊 快速统计

📈 **Overall Progress**: 29/73 topics covered = **40%**
📚 **课程进度**: P001-P090 (共约300集)
⏰ **已学习**: 6天
🎯 **目标日期**: 2026年6月中旬

⏰ **今日学习时长**: 约0.5小时
💡 **今日新增主题**: 1个（Event Loop事件循环机制复习）

---

## 📋 知识领域进度

| 领域 | 权重 | 已掌握/总数 | 状态 | 优先级 |
|------|------|-------------|------|--------|
| **A. Node.js核心基础** | 15% | 7/10 | 🟡 进行中 | HIGH |
| **B. 异步编程** | 15% | 3/8 | 🟡 进行中 | HIGH |
| **C. 内置模块** | 18% | 7/12 | 🟡 进行中 | **HIGH** |
| **D. Web框架** | 20% ⭐ | 7/10 | 🟡 进行中 | **CRITICAL** |
| **E. 数据库** | 17% | 3/10 | 🟡 进行中 | **HIGH** |
| **F. 认证与安全** | 10% | 1/8 | 🟡 进行中 | Medium |
| **G. 项目实战** | 5% | 0/5 | ⚪ 未开始 | Medium |

---

## A. Node.js核心基础 (15%)

**课程章节**: 第1-3章 | **视频范围**: P1-P40

### ✅ 已掌握 (7/10)

- [x] **A.3** CommonJS vs ES6模块化 (2026-03-15) - **High**
  - 语法对比：require/module.exports vs import/export
  - 加载时机：CommonJS运行时加载，ES6模块编译时加载
  - 值的本质：CommonJS值拷贝，ES6模块值引用
  - Tree-shaking：ES6模块支持静态分析，CommonJS不支持
  - 启用ES6模块：.mjs扩展名或package.json中设置"type": "module"
  - 模块混用：可以用.js(ES6)和.cjs(CommonJS)混用

- [x] **A.4** npm包管理器使用 (2026-03-15) - **High**
  - npm install vs npm ci：ci用于生产环境，严格按lock文件安装
  - 版本号规则：^1.2.3（兼容次版本），~1.2.3（兼容补丁），1.2.3（精确）
  - dependencies vs devDependencies：生产依赖 vs 开发依赖
  - npm vs npx：npm管理包，npx执行包（无需安装）

- [x] **A.5** package.json详解 (2026-03-15) - **High**
  - 必须字段：name, version
  - 依赖管理：dependencies, devDependencies
  - scripts：npm脚本命令
  - type: "module" | "commonjs"：模块类型

- [x] **A.6** Buffer缓冲区 (2026-03-13) - **Medium-High**
  - Buffer概念：处理二进制数据的容器
  - 创建方式：`Buffer.from()`, `Buffer.alloc()`
  - 转换方法：`.toString()` 可指定编码和位置
  - 应用场景：文件读写、图片处理、网络传输
  - 常见操作：`.concat()`, `.slice()`, 索引访问

- [x] **A.7** 全局对象 (2026-03-13) - **High**
  - `__dirname`：当前文件夹路径（文件所在位置，固定）
  - `__filename`：当前文件完整路径（包含文件名）
  - `process.argv`：获取命令行参数数组
  - `process.env`：获取环境变量
  - `process.cwd()`：当前工作目录（运行命令的位置，可变）
  - 定时器：`setTimeout`, `setInterval`
  - console对象：`log`, `error`, `warn`

- [x] **A.8** 模块加载机制 (2026-03-15) - **High**
  - require()的5个步骤：路径解析→检查缓存→读取文件→模块包装→缓存模块
  - 模块缓存机制：同一文件只执行一次，使用require.resolve()作为key
  - 路径规则：./不能省略（区分文件模块和npm包）
  - 文件查找顺序：.js → .json → .node → /index.js
  - 核心模块优先级最高（防止恶意包覆盖）
  - 模块包装函数：Node.js自动注入5个变量（require, module, exports, __filename, __dirname）

### 📚 学习中 (0/10)

- [ ] **A.1** Node.js环境安装与配置
- [ ] **A.2** ES6核心语法（let/const、箭头函数、解构）
- [ ] **A.9** Node.js的执行模型
- [ ] **A.10** 包的发布与私有npm搭建

### 🔍 知识漏洞

**暂无记录**

---

## B. 异步编程 (15%)

**课程章节**: 第4章 | **视频范围**: P41-P80

### ✅ 已掌握 (3/8)

- [x] **B.3** Promise基础 (2026-03-13) - **High**
  - Promise三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
  - 状态一旦改变就不可逆
  - `resolve()` → 处理成功，由`.then()`接收
  - `reject()` → 处理失败，由`.catch()`接收
  - Promise链式调用：`.then()`的return会传递给下一个then
  - `.catch()`可以捕获错误并return让链式调用继续

- [x] **B.5** async/await (2026-03-13) - **High**
  - `async`函数：声明异步函数，返回值永远是Promise
  - `await`：等待Promise完成，只暂停当前async函数
  - **关键理解**：await不阻塞主线程（仍是异步）
  - 错误处理：使用`try-catch`包裹await
  - 并行执行：使用`Promise.all()`同时执行多个异步任务
  - 执行顺序：await暂停当前函数，主线程继续执行其他代码

- [x] **B.6** Event Loop事件循环机制 (2026-03-20) - **High**
  - Event Loop的存在原因：JavaScript单线程 + 非阻塞I/O
  - 任务分类：同步代码（立即执行）、微任务（高优先级）、宏任务（低优先级）
  - 微任务示例：Promise.then()、process.nextTick() (Node.js)
  - 宏任务示例：setTimeout、setInterval、I/O、setImmediate (Node.js)
  - 执行顺序：同步代码 > 微任务 > 宏任务
  - 核心规则：每执行完一个宏任务，必须清空所有微任务
  - 微任务队列FIFO：先入队的先执行，新产生的微任务排在末尾
  - 宏任务产生微任务：必须等微任务清空后，才能执行下一个宏任务
  - 应用场景：理解异步代码执行顺序、面试高频考点

### 📚 学习中 (0/8)

- [ ] **B.1** 同步 vs 异步的概念
- [ ] **B.2** 回调函数与回调地狱
- [ ] **B.4** Promise链式调用
- [ ] **B.7** 宏任务 vs 微任务（深入Node.js特有阶段：timers、poll、check等）
- [ ] **B.8** 错误处理（try-catch、unhandledRejection）

---

## C. 内置模块 (18%)

**课程章节**: 第5-6章 | **视频范围**: P81-P140

### ✅ 已掌握 (5/12)

- [x] **C.1** fs文件写入 (2026-03-15) - **High**
  - 异步API：fs.writeFile() - 推荐使用，不阻塞主线程
  - 同步API：fs.writeFileSync() - 阻塞主线程，只适合启动脚本
  - 追加写入：fs.appendFile()
  - 错误处理：try-catch或回调

- [x] **C.2** fs文件读取 (2026-03-15) - **High**
  - 异步读取：fs.readFile() - 推荐使用
  - 同步读取：fs.readFileSync() - 阻塞主线程
  - 文件信息：fs.stat() - 获取文件大小、创建时间等
  - 删除文件：fs.unlink()

- [x] **C.3** fs流式操作 (2026-03-15) - **High**
  - Stream（流）概念：一点一点传输数据，节省内存
  - 创建读取流：fs.createReadStream() - 处理大文件
  - 创建写入流：fs.createWriteStream()
  - 管道pipe()：自动连接读取流和写入流，处理背压
  - highWaterMark：控制缓冲区大小（默认64KB）

- [x] **C.5** path路径处理 (2026-03-15) - **High**
  - path.join()：拼接路径，自动处理斜杠
  - path.resolve()：解析为绝对路径
  - path.basename()：获取文件名
  - path.dirname()：获取目录部分
  - path.extname()：获取扩展名
  - path.parse()：解析路径为对象
  - __dirname vs path.dirname()：当前文件目录 vs 处理任意路径

- [x] **C.6** http创建服务器 (2026-03-15) - **High**
  - 创建服务器：http.createServer()
  - req对象：包含请求信息（method, url, headers）
  - res对象：返回响应（statusCode, setHeader, end）
  - 返回JSON：设置Content-Type为application/json

- [x] **C.9** events模块 - 事件发射器 (2026-03-16) - **High**
  - EventEmitter核心类：继承后可自定义事件
  - on(eventName, handler)：监听事件，可触发多次
  - once(eventName, handler)：只监听一次，触发后自动移除
  - emit(eventName, ...args)：触发事件，传递参数
  - removeListener()：移除指定监听器
  - listenerCount()：获取监听器数量
  - 应用场景：模块解耦、异步通知、Stream/HTTP基础
  - 优势：一个事件多个监听器、完全解耦、动态添加/删除

- [x] **C.11** url模块 - URL解析 (2026-03-16) - **High**
  - url.parse(urlString)：解析URL为对象
  - 第二个参数true：自动解析query为对象
  - 核心属性：href、protocol、host、hostname、port、pathname、search、query、hash
  - 实际应用：解析URL查询参数、路由处理
  - 开发中99%场景都用url.parse(url, true)

### 📚 学习中 (0/12)

- [ ] **C.4** fs模块 - 文件信息（stat/readdir）
- [x] **C.7** http请求响应 (2026-03-15) - **High**
  - 处理不同请求方法：GET/POST/PUT/DELETE
  - 路由基础：根据URL路径处理不同请求
  - 获取URL参数：url.parse()解析查询参数
  - 接收POST数据：监听req的data和end事件
  - RESTful API：设计规范的接口
- [ ] **C.10** crypto模块 - 加密与哈希
- [ ] **C.12** 其他常用模块（os、util、querystring）

---

## D. Web框架 (20%) ⭐ **最重要**

**课程章节**: 第7-10章 | **视频范围**: P141-P220

### ✅ 已掌握 (7/10)

- [x] **D.1** Express简介与安装 (2026-03-16) - **High**
  - Express vs Axios：Express是服务端框架，axios是客户端HTTP库
  - Express vs 原生http模块：简化路由、中间件机制、丰富的生态系统
  - 安装和基本使用：`npm install express`，创建app实例

- [x] **D.2** Express路由（GET/POST/PUT/DELETE） (2026-03-16) - **High**
  - HTTP方法：GET（读）、POST（创建）、PUT（全量更新）、PATCH（部分更新）、DELETE（删除）
  - RESTful API设计：同一URL + 不同HTTP方法 = 不同操作
  - 路由定义：`app.get(path, handler)`、`app.post(path, handler)`
  - 路由参数：req.params（路径参数）、req.query（查询参数）

- [x] **D.3** Express中间件机制 (2026-03-16) - **High**
  - 中间件概念：请求和响应之间的处理函数
  - 中间件函数：`(req, res, next) => {}`
  - next()的作用：将控制权传递给下一个中间件
  - 执行顺序：洋葱模型（进入和退出顺序相反）
  - 应用级vs路由级中间件：app.use() vs router.use()

- [x] **D.4** 常用中间件（express.static、helmet、morgan、cors） (2026-03-17) - **High**
  - express.static()：托管静态资源文件
  - helmet：安全防护，设置HTTP安全头
  - morgan：日志记录，自动记录HTTP请求
  - cors：跨域资源共享，允许前端访问API
  - URL映射规则：public文件夹在URL中不出现

- [x] **D.9** 模块化路由（express.Router） (2026-03-17) - **High**
  - 为什么需要模块化：代码分离、易于维护、团队协作
  - express.Router()的使用：创建独立路由模块
  - app.use()的URL映射：剥离前缀，传递剩余路径给router
  - 项目组织结构：routes/users.js、routes/posts.js、routes/admin.js
  - 完整URL = 挂载前缀 + router路由路径

- [x] **D.8** 错误处理中间件 (2026-03-17) - **High**
  - 错误处理中间件：4个参数（err, req, res, next）
  - next(error)：传递错误，跳过所有普通中间件
  - 执行流程：路由出错 → next(error) → 错误处理中间件
  - 异步错误处理：try-catch + next(error)
  - 多个错误处理中间件：都会执行（如果调用next(err)）
  - 错误处理位置：必须在所有路由之后
  - 错误响应格式：统一的JSON格式

- [x] **Multer文件上传** (2026-03-18) - **High**
  - multipart/form-data格式：为什么文件上传需要特殊格式
  - storage配置：diskStorage（磁盘存储）vs memoryStorage（内存存储）
  - 文件命名：字段名-时间戳-随机数.扩展名（保证唯一性）
  - fileFilter：文件过滤（MIME类型检查，只允许图片）
  - limits：文件大小限制（fileSize）
  - 上传方法：single()、array()、fields()、none()、any()
  - 错误处理：MulterError vs 普通错误
  - 实际应用：用户头像上传、数据库保存失败时的文件清理

- [x] **express-validator参数验证** (2026-03-18) - **High**
  - 前端验证vs后端验证：为什么后端必须验证（安全、可靠性）
  - 验证链：body()、param()、query()、header()
  - 验证规则：trim()、notEmpty()、isLength()、isEmail()、matches()
  - 错误消息：withMessage()自定义错误消息
  - validationResult()：检查验证结果
  - 执行顺序：参数验证 → 文件上传 → 业务逻辑
  - 综合应用：用户注册+头像上传（参数验证+文件上传）

- [x] **D.1** Express简介与安装 (2026-03-16) - **High**
  - Express vs Axios：Express是服务端框架，axios是客户端HTTP库
  - Express vs 原生http模块：简化路由、中间件机制、丰富的生态系统
  - 安装和基本使用：`npm install express`，创建app实例

- [x] **D.2** Express路由（GET/POST/PUT/DELETE） (2026-03-16) - **High**
  - HTTP方法：GET（读）、POST（创建）、PUT（全量更新）、PATCH（部分更新）、DELETE（删除）
  - RESTful API设计：同一URL + 不同HTTP方法 = 不同操作
  - 路由定义：`app.get(path, handler)`、`app.post(path, handler)`
  - 路由参数：req.params（路径参数）、req.query（查询参数）

- [x] **D.3** Express中间件机制 (2026-03-16) - **High**
  - 中间件概念：请求和响应之间的处理函数
  - 中间件函数：`(req, res, next) => {}`
  - next()的作用：将控制权传递给下一个中间件
  - 执行顺序：洋葱模型（进入和退出顺序相反）
  - 应用级vs路由级中间件：app.use() vs router.use()

- [x] **D.4** 常用中间件（express.static） (2026-03-17) - **High**
  - express.static()：托管静态资源文件
  - URL映射规则：public文件夹在URL中不出现
  - 多个静态目录：按注册顺序查找，先找到的返回
  - 虚拟路径前缀：`app.use('/static', express.static('public'))`

- [x] **D.9** 模块化路由（express.Router） (2026-03-17) - **High**
  - 为什么需要模块化：代码分离、易于维护、团队协作
  - express.Router()的使用：创建独立路由模块
  - app.use()的URL映射：剥离前缀，传递剩余路径给router
  - 项目组织结构：routes/users.js、routes/posts.js、routes/admin.js
  - 完整URL = 挂载前缀 + router路由路径

- [x] **D.8** 错误处理中间件 (2026-03-17) - **High**
  - 错误处理中间件：4个参数（err, req, res, next）
  - next(error)：传递错误，跳过所有普通中间件
  - 执行流程：路由出错 → next(error) → 错误处理中间件
  - 异步错误处理：try-catch + next(error)
  - 多个错误处理中间件：都会执行（如果调用next(err)）
  - 错误处理位置：必须在所有路由之后
  - 错误响应格式：统一的JSON格式

### 📚 学习中 (4/10)

- [ ] **D.5** 静态资源服务（进阶）
- [ ] **D.6** RESTful API设计规范
- [ ] **D.7** Express路由参数处理（进阶）
- [ ] **D.10** Express最佳实践

---

## E. 数据库 (17%)

**课程章节**: 第11-13章 | **视频范围**: P221-P280

### ✅ 已掌握 (3/10)

- [x] **E.1** MySQL安装与配置 (2026-03-18) - **High**
  - MySQL 8.0.45安装（Windows，Full完全安装）
  - 环境变量配置：添加MySQL bin目录到PATH
  - MySQL服务：MySQL80服务，开机自动启动
  - Root密码设置：root123456
  - 认证方式：Use Legacy Authentication（兼容性）
  - 验证安装：mysql --version、mysql -u root -p

- [x] **E.2** SQL基础语法 (2026-03-18) - **High**
  - CREATE DATABASE：创建数据库
  - USE：切换数据库
  - CREATE TABLE：创建表（定义字段、类型、约束）
  - INSERT：插入数据（INSERT INTO ... VALUES）
  - SELECT：查询数据（SELECT * FROM、WHERE条件）
  - UPDATE：更新数据（UPDATE ... SET ... WHERE）
  - DELETE：删除数据（DELETE FROM ... WHERE）
  - WHERE子句的重要性：忘记WHERE会更新/删除所有数据

- [x] **E.3** 数据库设计基础 (2026-03-18) - **High**
  - 表结构：字段、行、列的概念
  - 字段类型：INT（整数）、VARCHAR(n)（变长字符串）、TIMESTAMP（时间戳）
  - 约束：PRIMARY KEY（主键）、NOT NULL（非空）、UNIQUE（唯一）、DEFAULT（默认值）
  - AUTO_INCREMENT：自增，自动加1
  - 关系型数据库：表与表之间通过主键外键关联
  - 数据库vs文件系统：查询速度、并发控制、事务支持

### 📚 学习中 (7/10)

- [ ] **E.4** Node.js连接mysql2包
- [ ] **E.5** CRUD操作实现
- [ ] **E.6** SQL注入攻击与预防
- [ ] **E.7** 事务处理（Transaction）
- [ ] **E.8** ORM框架（Sequelize基础）
- [ ] **E.9** Sequelize模型定义与关联
- [ ] **E.10** 数据库连接池配置

---

## F. 认证与安全 (10%)

**课程章节**: 第14-15章 | **视频范围**: P281-P320

### ✅ 已掌握 (1/8)

- [x] **F.6** 数据验证（express-validator） (2026-03-18) - **High**
  - 前端验证vs后端验证：前端可被绕过，后端必须验证
  - 验证链：body()、param()、query()
  - 常用验证：trim()、notEmpty()、isLength()、isEmail()、matches()
  - 自定义错误：withMessage()设置错误消息
  - 结果检查：validationResult(req)检查验证结果
  - 实际应用：用户注册API、数据完整性保护

### 📚 学习中 (7/8)

- [ ] **F.1** HTTP无状态性与Cookie/Session
- [ ] **F.2** JWT（JSON Web Token）原理
- [ ] **F.3** JWT在Express中的实现
- [ ] **F.4** Token刷新机制
- [ ] **F.5** CORS跨域问题与解决方案（已在03-17学习cors中间件）
- [ ] **F.7** 密码加密（bcrypt/salt）
- [ ] **F.8** XSS与CSRF防护

---

## G. 项目实战 (5%)

**课程章节**: 第16章 | **视频范围**: P321-END

### ✅ 已掌握 (0/5)

*(暂无)*

### 📚 学习中 (0/5)

- [ ] **G.1** 项目1: 文件管理工具
- [ ] **G.2** 项目2: 静态资源服务
- [ ] **G.3** 项目3: 个人博客后端API
- [ ] **G.4** 项目4: 电影管理系统（完整CRUD）
- [ ] **G.5** 项目部署（服务器、环境变量、PM2）

---

## 🔥 知识漏洞优先级

### **High Priority** - 影响后续学习

*(暂无)*

### **Medium Priority** - 需要巩固

*(暂无)*

### **Low Priority** - 可以后补

*(暂无)*

---

### ✅ **最近解决** (2026-03-13 至 2026-03-20)

**已修复漏洞**：
1. ✅ **Event Loop执行顺序** - 理解有偏差 → **完全掌握** (2026-03-20)
   - 纠正了"只执行一轮微任务"的错误理解
   - 明确了"每执行完一个宏任务，必须清空所有微任务"的规则
   - 理解了宏任务产生微任务时的执行流程

2. ✅ **Promise任务分类** - 分类错误 → **已纠正** (2026-03-20)
   - Promise是微任务，不是宏任务（关键错误修复）
   - console.log是同步代码，不是微任务
   - 明确了同步代码、微任务、宏任务的正确分类

3. ✅ **微任务队列机制** - 理解不清晰 → **已掌握** (2026-03-20)
   - 理解了FIFO（先进先出）
   - 理解了新微任务排在队列末尾
   - 掌握了复杂异步代码的执行流程追踪

4. ✅ **Buffer缓冲区** - 完全没学 → **Medium-High** (2026-03-13)
   - 补习了Buffer概念、创建方式、转换方法
   - 理解了二进制数据处理场景

5. ✅ **__filename** - 没学过 → **High** (2026-03-13)
   - 补习了__dirname和__filename的区别
   - 理解了process.cwd()的可变性

6. ✅ **process对象** - 完全没学 → **Medium-High** (2026-03-13)
   - 掌握了process.argv获取命令行参数
   - 了解了process.env环境变量

7. ✅ **Promise状态理解** - 有偏差 → **High** (2026-03-13)
   - 纠正了"reject()不管成功失败"的错误理解
   - 明确了resolve/reject的使用场景
   - 掌握了Promise三种状态及不可逆特性

8. ✅ **async/await理解** - 部分正确 → **High** (2026-03-13)
   - 纠正了"async在等await"的理解
   - 明确了await只暂停当前函数，不阻塞主线程
   - 掌握了Promise.all并行执行

---

## 📅 学习时间线

| 周 | 日期 | 学习领域 | 目标 | 状态 |
|----|------|----------|------|------|
| 1 | 3/13-3/19 | A+B | Node.js基础+异步 | 🟡 进行中（5/73已完成） |
| 2 | 3/20-3/26 | C | 内置模块 | ⏳ 计划中 |
| 3-4 | 3/27-4/9 | D | Express框架 | ⏳ 计划中 |
| 5 | 4/10-4/16 | E | MySQL数据库 | ⏳ 计划中 |
| 6 | 4/17-4/23 | F | 认证与安全 | ⏳ 计划中 |
| 7-8 | 4/24-5/7 | G | 项目实战 | ⏳ 计划中 |
| 9+ | 5/8- | - | 复习+面试准备 | ⏳ 计划中 |

---

## 🎯 每日学习检查清单

**今天要做的**:
- [ ] 看视频课程（P_-P_）
- [ ] 记录学习笔记
- [ ] 完成代码练习
- [ ] 更新进度追踪器
- [ ] 记录遇到的问题

**本周目标**:
- [ ] 完成___领域的学习
- [ ] 完成___项目
- [ ] 复习之前的漏洞

---

## 💡 学习建议

- 📌 优先学习权重高的领域（D、E、C）
- 📌 每学完一个领域，更新一次tracker
- 📌 遇到问题立即记录到problems-solved.md
- 📌 定期（每周）复习之前的代码
- 📌 代码必须自己写，不要只看视频

---

## 📈 学习统计

**总学习天数**: 6天
**总学习时长**: 约12.5小时
**完成主题数**: 29/73 (40%)
**完成项目数**: 2/4

**最近7天学习记录**:
- **2026-03-20**: Event Loop事件循环机制复习
  - 复习巩固了Event Loop的核心概念和执行流程
  - 纠正了Promise任务分类错误（Promise是微任务，不是宏任务）
  - 理解了"每执行完一个宏任务后，必须清空所有微任务"的规则
  - 掌握了微任务队列的FIFO机制（先进先出）
  - 通过4道递进式练习题，从错误中学习
  - 完全理解了Event Loop的执行顺序：同步 > 微任务 > 宏任务
  - 新增1个知识点，进度从38%提升到40%

- **2026-03-18**: Multer文件上传 + MySQL入门
  - 深入学习了Multer文件上传机制（storage、fileFilter、limits）
  - 理解了文件名唯一性设计（时间戳+随机数）
  - 掌握了upload的5个上传方法（single、array、fields、none、any）
  - 实践了文件上传的错误处理和资源清理
  - 学习了express-validator参数验证（前端vs后端验证）
  - 安装并配置了MySQL 8.0.45（Full安装）
  - 掌握了SQL基础语法（CREATE、INSERT、SELECT、UPDATE、DELETE）
  - 创建了第一个数据库（blog_database）和第一个表（users）
  - 理解了关系型数据库的核心概念（主键、外键、约束）
  - 新增4个知识点，进度从33%提升到38%

- **2026-03-17**: 深入学习Express静态资源、模块化路由、错误处理
  - 复习了url.parse()的完整用法和参数
  - 掌握了events模块（事件发射器）
  - 理解了事件驱动的设计模式和解耦优势
  - 掌握了on/once/emit/removeListener等核心API
  - 学习了Express框架安装和基本路由
  - 理解了Express vs 原生http模块的优势
  - 掌握了HTTP方法与RESTful API设计
  - 理解了Express中间件机制和next()的作用
  - 新增4个知识点，进度从25%提升到27%

- **2026-03-15**: 深入学习模块化、npm、内置模块
  - 掌握了CommonJS vs ES6模块化的区别
  - 学习了npm高级用法（ci, 版本管理, dependencies）
  - 掌握了fs模块（文件读写、流操作）
  - 掌握了path模块（路径处理）
  - 掌握了http模块（创建服务器、处理请求响应）
  - 新增10个知识点，进度从8%提升到22%

- **2026-03-13**: 知识漏洞补习（Buffer、全局对象、Promise、async/await）
  - 评估了P001-P073的学习成果
  - 补齐了5个重要知识点
  - 创建了详细的会话记录

---

**加油！每天进步一点点！💪**
