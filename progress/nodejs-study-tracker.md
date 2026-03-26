# Node.js 学习进度追踪器

**Last Updated**: 2026-03-26
**学习目标**: AI应用开发全栈工程师（Node.js + Next.js + LangChain）
**计划时长**: 4-6个月
**当前课程**: 黑马程序员 Node.js 全套教程 + Vue/React + Next.js + LangChain

---

## 📊 快速统计

📈 **Overall Progress**: 61/73 topics covered = **84%**
📚 **课程进度**: P001-P090+ (共约300集)
⏰ **已学习**: 12天
🎯 **目标日期**: 2026年6月中旬

⏰ **今日学习时长**: 约2.5小时
💡 **今日新增主题**: 9个（B领域5个 + C领域4个）+ 完成B领域和C领域（100%）🎉🎉

---

## 📋 知识领域进度

| 领域 | 权重 | 已掌握/总数 | 状态 | 优先级 |
|------|------|-------------|------|--------|
| **A. Node.js核心基础** | 15% | 7/10 | 🟡 进行中 | HIGH |
| **B. 异步编程** | 15% | 8/8 | 🟢 **已完成** | HIGH |
| **C. 内置模块** | 18% | 12/12 | 🟢 **已完成** | **HIGH** |
| **D. Web框架** | 20% ⭐ | 10/10 | 🟢 **已完成** | **CRITICAL** |
| **E. 数据库** | 17% | 10/10 | 🟢 **已完成** | **HIGH** |
| **F. 认证与安全** | 10% | 8/8 | 🟢 **已完成** | Medium |
| **G. 项目实战** | 5% | 2/5 | 🟡 进行中 | Medium |

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

### ✅ 已掌握 (8/8) 🎉 **B领域100%完成**

- [x] **B.1** 同步 vs 异步的概念 (2026-03-26) - **High**
  - 同步（Synchronous）：代码按顺序执行，**必须等待**当前操作完成才能继续
  - 异步（Asynchronous）：发起操作后**不等待**结果，继续往下执行
  - 同步的特点：逻辑简单，但**阻塞**（耗时的操作会卡住整个程序）
  - 异步的特点：**非阻塞**，适合I/O密集型操作
  - 性能对比：同步串行（6秒）vs 异步并行（2秒）- 3个文件读取
  - Node.js大量使用异步的原因：单线程 + 高并发I/O处理

- [x] **B.2** 回调函数与回调地狱 (2026-03-26) - **High**
  - 回调函数定义：作为参数传递给另一个函数的函数
  - 回调函数用途：在异步操作完成后被调用
  - 回调地狱问题：多层嵌套导致代码横向增长（金字塔形状）
  - 回调地狱的缺点：难以阅读、难以维护、错误处理复杂
  - 三种解决方案：命名函数、Promise链式调用、async/await

- [x] **B.3** Promise基础 (2026-03-13) - **High**
  - Promise三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
  - 状态一旦改变就不可逆
  - `resolve()` → 处理成功，由`.then()`接收
  - `reject()` → 处理失败，由`.catch()`接收
  - Promise链式调用：`.then()`的return会传递给下一个then
  - `.catch()`可以捕获错误并return让链式调用继续

- [x] **B.4** Promise链式调用 (2026-03-26) - **High**
  - 核心原理：`.then()` 方法**返回一个新的Promise**
  - 返回值传递：`.then()`的return会传递给下一个`.then()`
  - 返回Promise会等待：如果返回Promise，下一个`.then()`会等待完成
  - 错误冒泡：任意`.then()`出错会跳过后面的`.then()`，直接到`.catch()`
  - 实际应用：登录流程的Promise链（登录 → 获取个人信息 → 跳转首页）
  - Promise链 vs 回调地狱：代码扁平、逻辑清晰、统一错误处理

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

- [x] **B.7** 宏任务 vs 微任务（深入Node.js特有阶段）(2026-03-26) - **High**
  - Node.js的6个Event Loop阶段：timers、pending callbacks、idle/prepare、poll、check、close callbacks
  - timers阶段：执行setTimeout、setInterval的回调
  - poll阶段：执行I/O回调（fs.readFile等）⭐ 最重要
  - check阶段：执行setImmediate的回调
  - 微任务执行时机：每个阶段**执行完后**，都会检查并执行微任务队列
  - setTimeout vs setImmediate：顺序不确定（取决于Event Loop启动时的时间）
  - I/O回调中的顺序固定：poll → check → timers（setImmediate优先于setTimeout）

- [x] **B.8** 错误处理 (2026-03-26) - **High**
  - 为什么异步错误无法被try-catch捕获：异步回调在未来的宏任务/微任务中执行，那时try-catch早就执行完了
  - 方式1 - 回调函数的err参数：Node.js风格，第一个参数是err，先检查if(err)
  - 方式2 - Promise的.catch()：链式调用的错误冒泡，一个.catch()可捕获前面所有.then()的错误
  - 方式3 - async/await的try-catch：最接近同步代码的写法，推荐使用
  - unhandledRejection定义：Promise被rejected，但没有.catch()处理
  - unhandledRejection的危害：内存泄漏、资源未释放、程序状态不一致
  - 全局捕获unhandledRejection：process.on('unhandledRejection', callback)

### 📚 学习中 (0/8)

*(B领域已全部完成)* 🎉

---

## C. 内置模块 (18%)

**课程章节**: 第5-6章 | **视频范围**: P81-P140

### ✅ 已掌握 (12/12) 🎉 **C领域100%完成**

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

- [x] **C.4** fs文件信息（stat/readdir）(2026-03-26) - **High**
  - fs.stat()获取文件详细信息（大小、时间、类型）
  - stats.isFile()和stats.isDirectory()判断文件类型
  - stats.size获取文件大小（字节）
  - stats.mtime获取修改时间
  - fs.readdir()读取目录内容
  - 实际应用：列出文件、递归获取目录树、统计目录大小
  - 异步陷阱：fs.stat是异步的，需要await或回调
  - Array.reduce()详解：数组归纳、求和、去重
  - includes() vs some()的区别

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

- [x] **C.7** http请求响应（复习巩固）(2026-03-26) - **High**
  - HTTP请求响应流程：客户端→服务器→响应
  - req对象：method、url、headers、body（需要手动解析）
  - res对象：statusCode、setHeader、write、end
  - RESTful API实现：GET、POST、DELETE
  - 原生http vs Express对比
  - 常见HTTP状态码：200、201、400、401、403、404、500
  - 请求体解析：监听data和end事件

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

- [x] **C.10** crypto加密模块 (2026-03-26) - **High**
  - 哈希函数：MD5（不安全，已被破解）、SHA-256（推荐）
  - createHash()创建哈希对象、update()添加数据、digest()输出哈希值
  - 文件完整性验证：计算文件哈希、对比官方哈希、验证是否被篡改
  - 哈希的雪崩效应：原始数据微小变化→哈希值完全不同
  - HMAC（带密钥的哈希）：createHmac()、API签名验证、验证数据来源
  - AES对称加密：createCipheriv()加密、createDecipheriv()解密、加密敏感数据
  - 生成随机数：randomBytes()、randomInt()、UUID
  - crypto vs bcrypt对比：crypto快速（文件校验）、bcrypt慢速（密码存储）
  - 安全体系：HTTPS（TLS/SSL）、bcrypt（密码）、SHA-256（完整性）、HMAC（签名）、AES（加密）

- [x] **C.12** 其他常用模块（os、util）(2026-03-26) - **High**
  - os模块系统信息：os.type()、os.release()、os.platform()、os.arch()、os.hostname()
  - os模块CPU信息：os.cups()[0].model（型号）、os.cpus().length（核心数）
  - os模块内存信息：os.totalmem()（总内存）、os.freemem()（空闲内存）、使用率计算
  - os模块网络信息：os.networkInterfaces()、获取IP地址和MAC地址
  - os模块用户信息：os.homedir()（主目录）、os.userInfo().username（用户名）、os.tmpdir()（临时目录）
  - os模块运行时间：os.uptime()（系统运行时间）、process.uptime()（Node运行时间）
  - util模块格式化：util.format()、占位符%s/%d/%j
  - util模块类型检查：util.isArray()、util.isDate()、util.isError()、util.isRegExp()
  - util.promisify：回调函数转Promise、兼容旧代码、优雅的异步处理
  - util.inspect：深度查看对象、设置depth、colors彩色输出
  - 实际应用：系统监控（CPU、内存、网络）、批量处理文件、环境检测

### 📚 学习中 (0/12)

*(C领域已全部完成)* 🎉

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

- [x] **D.6** RESTful API设计规范 (2026-03-24) - **High**
  - HTTP方法的语义：GET（读）、POST（创建）、PUT（全量更新）、PATCH（部分更新）、DELETE（删除）
  - RESTful API设计原则：同一URL + 不同HTTP方法 = 不同操作
  - 搜索功能设计：GET + query（可缓存、可分享、可书签）vs POST + body（复杂条件、敏感数据）
  - 点赞/浏览次数统计：POST（创建记录）vs PATCH（更新计数）
  - GET vs POST的选择：缓存、分享、书签、历史记录、语义
  - 接口设计案例：文章CRUD、点赞、浏览、阅读时长统计

- [x] **D.7** Express路由参数处理（进阶）(2026-03-24) - **High**
  - req.params（路径参数）：`/posts/:id` → `{ id: '123' }`
  - req.query（查询参数）：`/posts?page=1` → `{ page: '1' }`
  - req.body（请求体）：POST请求的JSON数据
  - 可选路径参数：`/posts/:id?`（id可为undefined）
  - 正则表达式限制：`:id(\\d+)`（只匹配数字）
  - 多个路径参数：`/users/:userId/posts/:postId`
  - 三种参数的对比和使用场景

- [x] **D.10** Express最佳实践 (2026-03-24) - **High**
  - 日志管理：
    - morgan（HTTP请求日志，自动记录）：`dev`、`combined`格式
    - winston（应用日志，手动记录）：分级（info、warn、error）、写入文件
    - 替换console.log为logger.info/error/warn
  - 环境变量管理：
    - dotenv包：`require('dotenv').config()`
    - .env文件：不提交到git（.gitignore）
    - .env.example：提供模板（提交到git）
    - process.env读取：`process.env.JWT_SECRET`
  - 错误处理统一：
    - 错误处理中间件（4个参数）
    - 开发环境返回stack，生产环境隐藏
  - 安全配置：
    - helmet（安全头）
    - CORS白名单
    - rate-limit（速率限制）
  - 项目结构：
    - 分层清晰（routes/controllers/middleware/config）
    - 日志目录（logs/）
  - 进程管理：
    - 开发环境：node server.js
    - 生产环境：PM2（自动重启、集群、日志管理）

### 📚 学习中 (0/10)

*(已全部完成)*

---

## E. 数据库 (17%)

**课程章节**: 第11-13章 | **视频范围**: P221-P280

### ✅ 已掌握 (10/10) 🎉 **E领域100%完成**

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

- [x] **E.4** Node.js连接mysql2 (2026-03-20) - **High**
  - mysql2包安装：`npm install mysql2`
  - 创建连接池：`mysql.createPool()` 配置host、user、password、database
  - 连接池优势：复用连接、提高性能、自动管理、限制最大连接数
  - 执行查询：`pool.promise().query()` 使用async/await
  - 参数化查询：使用`?`占位符，防止SQL注入
  - 错误处理：try-catch捕获数据库错误

- [x] **E.5** CRUD操作实现 (2026-03-20) - **High**
  - CREATE（INSERT）：`INSERT INTO users (username, password) VALUES (?, ?)`
  - READ（SELECT）：`SELECT * FROM users WHERE id = ?`
  - UPDATE（UPDATE）：`UPDATE users SET username = ? WHERE id = ?`
  - DELETE（DELETE）：`DELETE FROM users WHERE id = ?`
  - WHERE子句重要性：忘记WHERE会更新/删除所有数据
  - 查询结果：`[rows, fields]`解构获取结果集
  - insertId：获取插入后的自增ID

- [x] **E.6** SQL注入攻击与防护 (2026-03-24) - **High**
  - SQL注入的原理：通过输入恶意SQL代码改变查询逻辑
  - SQL注入的危害：数据泄露、绕过登录、删除数据
  - 字符串拼接的危险：`SELECT * FROM users WHERE id = ${id}` → `1 OR 1=1` 查询所有数据
  - 参数化查询防护：使用`?`占位符，数据库驱动自动转义
  - 参数化查询原理：参数被视为数据，不是SQL代码
  - 检查博客项目代码：✅ 所有查询都使用了参数化查询（安全）
  - ORM框架防护：Sequelize自动防止SQL注入
  - 错误的写法：字符串拼接、模板字符串拼接
  - 正确的写法：使用`?`占位符传递所有参数

- [x] **E.7** 事务处理（Transaction）(2026-03-24) - **High**
  - 事务的概念：一组SQL操作，要么全部成功，要么全部失败
  - 事务的必要性：银行转账（A-100，B+100，中间失败会导致钱消失）
  - ACID四大特性：
    - A - 原子性（Atomicity）：要么全部成功，要么全部失败
    - C - 一致性（Consistency）：数据始终保持一致（A+B总金额不变）
    - I - 隔离性（Isolation）：多个事务之间互不干扰
    - D - 持久性（Durability）：事务提交后永久保存
  - MySQL事务操作：
    - `START TRANSACTION` - 开始事务
    - `COMMIT` - 提交事务（全部成功）
    - `ROLLBACK` - 回滚事务（有错误，全部撤销）
  - Node.js实现事务：
    - `connection.beginTransaction()` - 开始事务
    - `connection.commit()` - 提交
    - `connection.rollback()` - 回滚
    - `connection.release()` - 释放连接回连接池（不是关闭）
  - 应用场景：
    - 银行转账（扣款+收款）
    - 发布文章（保存文章+更新用户文章数）
    - 删除文章（删除文章+删除评论+更新文章数）
    - 用户注册（创建用户+创建用户资料）
  - 连接池的重要性：复用连接，提高性能

- [x] **E.8** ORM框架（Sequelize基础）(2026-03-25) - **High**
  - 为什么需要ORM：
    - 代码简洁：`User.findOne()` vs `SELECT * FROM users WHERE id = ?`
    - 可读性：JavaScript对象vsSQL字符串
    - 数据库无关：切换数据库只需改配置
  - Sequelize vs mysql2对比：
    - mysql2返回`[rows, fields]`，Sequelize返回模型实例或对象
    - mysql2需要手写SQL，Sequelize用JavaScript方法
    - mysql2的insertId vs Sequelize的id属性
  - 模型定义：
    - DataTypes类型：INTEGER, STRING, TEXT, ENUM
    - 字段映射：field选项（驼峰→蛇形）
    - timestamps：自动管理created_at和updated_at
  - CRUD操作：
    - Create：`Model.create(data)` → 返回创建的对象
    - Read：`Model.findOne()`, `Model.findAll()`, `Model.findAndCountAll()`
    - Update：`instance.update(data)` 或 `Model.update(data, {where})`
    - Delete：`instance.destroy()` 或 `Model.destroy({where})`
  - 查询构建器：
    - where：条件查询 `{ username: 'admin' }`
    - order：排序 `[['created_at', 'DESC']]`
    - limit/offset：分页查询
  - 实战项目：重构个人博客API（从mysql2迁移到Sequelize）

- [x] **E.9** Sequelize模型定义与关联(2026-03-25) - **High**
  - 模型关联：
    - 一对一：hasOne/belongsTo（用户→用户资料）
    - 一对多：hasMany/belongsTo（用户→文章，文章→评论）
    - 多对多：belongsToMany（文章↔标签）
  - hasMany/belongsTo关联：
    - User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' })
    - Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' })
  - include联表查询（LEFT JOIN）：
    - 单层关联：`include: [{ model: User, as: 'author' }]`
    - 多层关联：`include: [{ model: User, include: [{ model: Profile }] }]`
  - as别名使用：
    - 定义关联时设置as
    - 查询时使用as匹配关联
    - 避免默认名称冲突（user, user等）
  - attributes字段选择：
    - 选择特定字段：`attributes: ['username', 'email']`
    - 排除字段：`attributes: { exclude: ['password'] }`
  - 实战应用：文章查询包含作者信息、评论查询包含用户信息

- [x] **E.10** 数据库连接池配置(2026-03-25) - **High**
  - 连接池的概念和作用：
    - 复用数据库连接，避免频繁创建/断开
    - 提高性能：连接建立耗时（3-way握手）
    - 控制并发：限制最大连接数，保护数据库
  - 连接池配置参数：
    - max：最大连接数（根据应用并发量设置）
    - min：最小连接数（保持的空闲连接）
    - acquire：获取连接超时时间（30秒）
    - idle：空闲连接超时时间（10秒后收回）
  - 连接池工作原理：
    - 请求连接→从池中获取→执行查询→归还连接
    - 无可用连接→等待acquire时间→超时报错
  - 大型应用的连接池策略：
    - 微服务：每个服务独立连接池（max: 5-10）
    - 单体应用：根据并发设置max（20-50）
    - Redis缓存：减少95%数据库请求，连接池压力减小
  - 实战配置：博客项目连接池配置（max: 10, min: 0）
  - 大型架构认知：
    - 负载均衡：多台应用服务器
    - 读写分离：1主N从，主库写，从库读
    - 分库分表：水平拆分数据（微信10万表）
    - Redis缓存：最重要，减少数据库压力
    - CDN缓存：静态资源缓存

### 📚 学习中 (0/10)

*(E领域已全部完成)* 🎉

---

## F. 认证与安全 (10%)

**课程章节**: 第14-15章 | **视频范围**: P281-P320

### ✅ 已掌握 (6/8)

- [x] **F.1** HTTP无状态性与Cookie/Session (2026-03-22) - **High**
  - Cookie存在客户端（浏览器），自动发送，4KB容量
  - Session存在服务端（内存/数据库），存储用户完整信息
  - Session流程：登录 → 创建Session → 返回Cookie（session_id） → 以后自动发送Cookie → 服务器查Session
  - HTTP无状态性：每个请求独立，默认不记住之前的状态
  - Cookie vs localStorage vs sessionStorage：
    - Cookie：自动发送，可设置过期，4KB
    - localStorage：永久存储，手动发送，5-10MB
    - sessionStorage：关闭标签页清除，5-10MB

- [x] **F.2** JWT（JSON Web Token）原理 (2026-03-21) - **High**
  - JWT的三个部分：Header（算法和类型）、Payload（用户信息）、Signature（防伪签名）
  - Base64编码 vs 加密：Header和Payload只是编码（可解码），Signature是加密（无法伪造）
  - 防伪造原理：HMACSHA256(header + payload + 密钥)，修改payload会导致signature不匹配
  - JWT的优势：无状态（服务器不存储session）、跨域友好、移动端友好
  - 安全注意：不要在Payload存敏感信息（密码、信用卡），Base64可解码
  - 应用场景：API认证、单点登录、微服务架构

- [x] **F.3** JWT在Express中的实现 (2026-03-21) - **High**
  - jsonwebtoken包安装：`npm install jsonwebtoken`
  - 生成token：`jwt.sign(payload, secret, { expiresIn: '7d' })`
  - 验证token：`jwt.verify(token, secret)`，返回解码后的payload
  - 认证中间件：从Authorization header提取token → 验证token → 挂载用户信息到req.user
  - 密钥管理：使用环境变量`process.env.JWT_SECRET`，生产环境使用复杂密钥
  - Token过期：设置合理的过期时间（Access Token短期15分钟，Refresh Token长期7天）
  - 前端存储：localStorage存储token（存在客户端）
  - 前端发送：`headers: { 'Authorization': 'Bearer ' + token }`
  - 完整流程：注册（加密密码）→ 登录（验证密码+生成token）→ 访问API（验证token）
  - 实战项目：09-jwt-auth（完整的用户认证系统）

- [x] **F.4** Token刷新机制 (2026-03-21) - **High**
  - 双token设计：Access Token（15分钟）+ Refresh Token（7天）
  - Access Token用途：访问API（短期，被盗损失小）
  - Refresh Token用途：刷新Access Token（长期，存储更安全）
  - 刷新流程：Access Token过期 → 前端收到401 → 自动调用/refresh-token → 获取新Access Token → 重新发送请求
  - 前端实现：fetchWithRefresh拦截401错误，自动刷新token
  - 后端实现：/refresh-token接口验证refreshToken，生成新accessToken
  - 用户体验：用户无感知（不需要重新登录）
  - 安全优势：Access Token短期降低风险，Refresh Token可撤销
  - 生产环境建议：Refresh Token轮换、黑名单、httpOnly cookie

- [x] **F.5** CORS跨域问题与解决方案 (2026-03-22) - **High**
  - 跨域定义：协议+域名+端口任一不同即为跨域
  - 为什么需要CORS：防止恶意网站窃取用户数据（CSRF攻击防护）
  - 浏览器限制：只有浏览器限制跨域，Postman/curl不受限制
  - 解决方案：后端设置`Access-Control-Allow-Origin`白名单
  - 简单请求vs复杂请求：
    - 简单：GET、简单POST，不需要预检
    - 复杂：PUT、DELETE、自定义头，需要OPTIONS预检请求
  - 生产环境：不要用`origin: '*'`，使用白名单指定可信域名
  - cors中间件配置：
    - `app.use(cors())` - 允许所有（不安全）
    - `app.use(cors({ origin: ['http://localhost:3000'] }))` - 白名单（推荐）

- [x] **F.6** 数据验证（express-validator） (2026-03-18) - **High**
  - 前端验证vs后端验证：前端可被绕过，后端必须验证
  - 验证链：body()、param()、query()
  - 常用验证：trim()、notEmpty()、isLength()、isEmail()、matches()
  - 自定义错误：withMessage()设置错误消息
  - 结果检查：validationResult(req)检查验证结果
  - 实际应用：用户注册API、数据完整性保护

- [x] **F.7** 密码加密（bcrypt） (2026-03-22) - **High**
  - bcrypt vs MD5：自动加盐防止彩虹表、慢速计算防止暴力破解、可调强度
  - Salt Rounds：加密强度（2^10=1024次加密循环），不是过期时间
  - 每次加密结果不同：因为使用随机盐，但验证时能正确匹配
  - 推荐值：10-12（平衡安全性和性能）
  - 使用方式：
    - 加密：`await bcrypt.hash(password, 10)`
    - 验证：`await bcrypt.compare(plainPassword, hashedPassword)`
  - 哈希值结构：`$2b$10$盐+哈希`（算法$成本$盐+哈希）
  - 为什么不能用明文：数据库泄露、撞库攻击、信任崩塌

- [x] **F.8** XSS与CSRF防护 (2026-03-22) - **High**
  - XSS攻击（跨站脚本攻击）：注入恶意JavaScript代码到网页
    - 本质：攻击浏览器，执行恶意代码
    - 危害：窃取Cookie、用户信息、重定向到钓鱼网站
    - 三种类型：反射型（URL参数）、存储型（数据库）、DOM型（前端JS）
    - 实际例子：`<script>steal(document.cookie)</script>`
  - XSS防护：输出转义、输入验证、CSP内容安全策略
    - 转义函数：`escapeHtml('<script>')` → `&lt;script&gt;`
    - CSP作用：限制脚本来源，刚才的错误就是CSP在工作
    - 生产环境：使用helmet中间件启用CSP
  - CSRF攻击（跨站请求伪造）：伪造HTTP请求，利用浏览器自动发送Cookie
    - 本质：攻击服务器，发送伪造请求
    - 危害：冒充用户操作（转账、发帖、修改密码）
    - 关键：黑客不需要获取Cookie，浏览器自动发送
    - 实际流程：登录银行 → 访问恶意网站 → 自动发送Cookie → 钱被转走
  - CSRF防护：CSRF Token、SameSite Cookie、验证Referer
    - CSRF Token流程：生成Token → 前端获取 → 请求携带 → 后端验证
    - 为什么有效：跨站请求无法读取Token（同源策略）
    - 实际测试：带Token成功，不带Token失败 ✅
  - XSS vs CSRF核心区别：
    - XSS：注入代码（攻击浏览器），通过转义防护
    - CSRF：伪造请求（攻击服务器），通过Token防护
  - 防护优先级：XSS > CSRF
    - 原因：XSS可以绕过CSRF防护（通过注入代码读取Token）
    - 策略：先防XSS（第一优先级），再防CSRF（双重保险）
  - 实际测试：成功测试XSS攻击（弹窗）、XSS防护（转义）、CSRF Token验证（带Token成功，不带Token失败）

- [x] **F.9** 安全最佳实践 (2026-03-23) - **High**
  - 速率限制（rate-limiting）：防止暴力破解攻击
    - express-rate-limit中间件：windowMs（时间窗口）、max（最大请求数）
    - 登录接口5次/分钟：防止密码暴力破解
    - API接口100次/15分钟：防止恶意刷接口
    - 返回429状态码：Too Many Requests
  - Helmet安全头（helmet）：防御常见Web攻击
    - X-Frame-Options: SAMEORIGIN - 防止点击劫持
    - X-Content-Type-Options: nosniff - 防止MIME嗅探攻击
    - Strict-Transport-Security - 强制HTTPS（生产环境）
    - Content-Security-Policy - 防止XSS攻击
    - X-XSS-Protection - 浏览器XSS保护
  - 数据脱敏：不在日志和响应中暴露敏感信息
    - SQL查询排除：SELECT时排除password字段（性能+安全）
    - 响应删除：delete user.password手动删除
    - 日志脱敏：禁止记录token、password等敏感数据
    - 风险：日志文件被窃取、发送到第三方平台、员工内部泄露
  - 环境变量管理：生产环境配置安全
    - JWT_SECRET（至少32位随机字符串）
    - DB_PASSWORD（数据库密码）
    - SESSION_SECRET（Session密钥）
    - CORS_ORIGIN（白名单）
    - RATE_LIMIT配置（窗口时间和最大请求数）
    - .env文件不提交到git（添加到.gitignore）
  - 完成了综合演示项目（10-security-best-practice）
  - F领域达到100%（8/8全部完成）✅

### 📚 学习中 (0/8)

---

## G. 项目实战 (5%)

**课程章节**: 第16章 | **视频范围**: P321-END

### ✅ 已掌握 (1/5)

- [x] **G.3** 个人博客后端API（2026-03-23 ~ 2026-03-24）- **High** ✅ **100%完成**
  - **项目结构**: Express + MySQL + JWT认证 + Multer文件上传
  - **用户认证系统**:
    - 用户注册：bcrypt密码加密、参数验证、重复检查
    - 用户登录：bcrypt验证、JWT token生成
    - JWT认证中间件：验证token、挂载用户信息到req.user
    - 速率限制：登录接口5次/分钟
    - 参数验证：express-validator（username、password、email）
  - **文章管理系统**:
    - 获取文章列表：分页查询、联表查询作者信息、按创建时间倒序
    - 获取文章详情：联表查询、浏览次数统计
    - 发表文章：JWT认证、参数验证、状态管理（draft/published）
    - 编辑文章：权限验证（只能编辑自己的文章）、动态SQL构建
    - 删除文章：权限验证（只能删除自己的文章）
  - **评论系统**:
    - 发表评论：检查文章存在性、JWT认证
    - 删除评论：权限验证、边界检查
    - 获取评论列表：联表查询评论者信息
  - **用户中心**:
    - 获取个人信息：排除password字段
    - 更新个人信息：动态SQL、email重复检查
  - **文件上传系统**（2026-03-24新增）:
    - Multer配置：3个upload实例（avatar、cover、any）
    - 上传用户头像：POST /api/upload/avatar
    - 上传文章封面：POST /api/upload/cover
    - 删除文件：DELETE /api/upload/file/:filename
    - 文件类型验证：只允许图片（JPG、PNG、GIF、WEBP）
    - 文件大小限制：2MB
    - 文件名唯一性：时间戳+随机数
    - 错误处理：失败时自动删除已上传文件
    - 路径遍历防护：删除文件时检查非法字符
  - **数据库设计**: 4张表（users、posts、comments、uploads）
  - **安全措施**:
    - SQL参数化查询（防止SQL注入）
    - 密码加密存储（bcrypt，Salt Rounds: 10）
    - JWT认证（无状态token）
    - 权限验证（作者身份检查）
    - 速率限制（防止暴力破解）
    - Helmet安全头
    - CORS白名单
  - **技术亮点**:
    - 联表查询（LEFT JOIN）
    - 分页查询（LIMIT、OFFSET）
    - 动态SQL构建（根据参数动态生成UPDATE语句）
    - 中间件机制（认证、错误处理、日志）
    - 数据脱敏（不返回password字段）
    - 文件上传（Multer + 错误清理）
  - **解决的关键Bug**:
    - 变量命名一致性（existingUsers vs existingEmails）
    - 返回正确的新记录ID（result.insertId）
    - 动态SQL逻辑修复（条件判断错误）
    - 数组判断错误（user.length === 0）
    - morgan日志GET请求body为undefined
    - forEach陷阱（el是字符串，不是变量名）
    - 数据检查逻辑（nickname !== undefined）
  - **代码质量**: ⭐⭐⭐⭐⭐ 生产级别
  - **项目状态**: ✅ **100%完成**（认证+文章+评论+用户中心+文件上传）

*(暂无)*

### 📚 学习中 (4/5)

- [ ] **G.1** 项目1: 文件管理工具
- [ ] **G.2** 项目2: 静态资源服务
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

**总学习天数**: 11天
**总学习时长**: 约28.5小时
**完成主题数**: 48/73 (66%)
**完成项目数**: 2/5（G.3完整完成，G.1/G.2/G.4待完成）

**最近7天学习记录**:
- **2026-03-24**: D.6/D.7/D.10 + E.6/E.7 + 文件上传测试（2小时）
  - **Part 1: G.3 文件上传测试**（15分钟）
    - 学生自己测试了文件上传功能
    - 确认接口正常工作
    - 理解了静态文件服务机制（express.static）
  - **Part 2: D.6 RESTful API设计规范**（30分钟）
    - 理解HTTP方法的语义（GET/POST/PUT/PATCH/DELETE）
    - 掌握RESTful API设计原则
    - 深入讨论搜索功能的设计（GET vs POST）
    - 理解点赞/浏览/阅读时长统计的接口设计
    - 学生的理解非常深入（"不需要保密,且链接可以复制分享使用"）
  - **Part 3: D.7 Express路由参数处理**（20分钟）
    - 掌握req.params、req.query、req.body的区别
    - 理解不同参数的使用场景
    - GET vs POST的选择原则（缓存、分享、书签）
    - 学生完全理解（"params获取路径上的数据, query获取?后面拼接的参数, body获取post接口保存的数据"）
  - **Part 4: D.10 Express最佳实践**（30分钟）
    - 日志管理：morgan（HTTP请求）+ winston（应用日志）
    - 环境变量：dotenv、.env不提交、.env.example模板
    - PM2进程管理：自动重启、集群、日志管理
    - 项目结构：分层清晰、配置独立
    - 学生理解正确（"morgan自动记录http请求.windston是记录应用日志"）
  - **Part 5: E.6 SQL注入防护**（20分钟）
    - SQL注入的原理和危害（数据泄露、绕过登录、删除数据）
    - 字符串拼接 vs 参数化查询
    - 检查博客项目代码：✅ 全部使用参数化查询（安全）
    - 学生快速理解（"查询所有信息"）
  - **Part 6: E.7 事务处理**（25分钟）
    - 事务的概念：要么全部成功，要么全部失败
    - ACID四大特性（原子性、一致性、隔离性、持久性）
    - Node.js实现事务（beginTransaction、commit、rollback、release）
    - 银行转账案例（完整代码）
    - 学生理解正确（"步骤1成功步骤2失败应该全部都失败"）
  - **成果**：
    - 新增5个知识点（D.6、D.7、D.10、E.6、E.7）
    - **D领域100%完成**（10/10）✅
    - 进度从60%提升到66%（+6%）
    - 理解能力非常强，对"为什么"有深刻理解

- **2026-03-23**: F.9 安全最佳实践 + G.3 个人博客API（完整核心功能）
  - **Part 1: F.9 安全最佳实践**（1.5小时）
    - 深入学习了安全最佳实践的综合应用
    - 掌握了速率限制（rate-limiting）：防止暴力破解攻击
    - 学习了helmet中间件：自动添加7个安全响应头
    - 掌握了数据脱敏的3个方法：SQL查询排除、响应删除、日志脱敏
    - 理解了日志安全的5大风险
    - 创建了生产环境配置模板（.env.example）
    - 完成了综合安全演示项目（10-security-best-practice）
    - **F领域100%完成**（8/8全部掌握）✅
  - **Part 2: G.3 个人博客后端API**（4小时，完整核心功能）
    - 设计了数据库表结构（4张表：users、posts、comments、uploads）
    - **用户认证系统**：
      - 用户注册：bcrypt密码加密、参数验证、重复检查
      - 用户登录：bcrypt验证、JWT token生成
      - JWT认证中间件：验证token、挂载用户信息到req.user
      - 速率限制：登录接口5次/分钟防止暴力破解
    - **文章管理系统**：
      - 获取文章列表：分页查询、联表查询作者信息
      - 获取文章详情：联表查询、浏览次数自动+1
      - 发表文章：JWT认证、参数验证、状态管理
      - 编辑文章：权限验证（只能编辑自己的文章）、动态SQL构建
      - 删除文章：权限验证（只能删除自己的文章）
    - **评论系统**（新增）：
      - 获取文章评论列表：联表查询评论者信息
      - 发表评论：检查文章存在性、JWT认证
      - 删除评论：权限验证、边界检查
    - **用户中心**（新增）：
      - 获取个人信息：排除password字段
      - 更新个人信息：动态SQL、email重复检查、边界检查
      - 修复了数据检查逻辑（`!== undefined`）
    - **关键技术**：
      - MySQL联表查询（LEFT JOIN）
      - 分页查询（LIMIT、OFFSET）
      - 动态SQL构建（根据参数动态生成UPDATE语句）
      - 权限验证模式（作者身份检查）
      - JWT完整流程（注册→登录→认证）
    - **解决的Bug**（共7个）：
      - authController: 变量命名一致性
      - postController: 返回空列表、返回错误的ID、动态SQL逻辑错误
      - app.js: morgan日志配置（GET请求body为undefined）
      - userController: 数组判断错误、email检查逻辑、返回值错误、数据检查逻辑
    - **测试完成度**: 100%（所有接口测试通过）✅
    - **代码质量**：⭐⭐⭐⭐⭐ 生产级别
    - **项目状态**: 核心功能100%完成，可选功能（文件上传）未实现
  - 新增1个知识点 + 1个项目（完整核心功能），进度从57%提升到59%

- **2026-03-22**: Cookie/Session + CORS跨域 + 密码加密（bcrypt）+ XSS与CSRF防护
  - 深入学习了Cookie和Session的工作原理（会员卡类比）
  - 理解了HTTP无状态性：每个请求独立，默认不记住状态
  - 掌握了Session流程：创建Session → 返回Cookie（session_id） → 自动发送 → 查Session
  - 对比了Session vs JWT：有状态vs无状态，需要共享存储vs每个服务都能验证
  - 掌握了三种存储的区别：Cookie（自动发送4KB）、localStorage（永久5-10MB）、sessionStorage（临时5-10MB）
  - 学习了CORS跨域问题：协议+域名+端口任一不同即为跨域
  - 理解了为什么需要CORS：防止恶意网站窃取用户数据（CSRF攻击防护）
  - 掌握了CORS解决方案：后端设置Access-Control-Allow-Origin白名单
  - 理解了简单请求vs复杂请求：PUT/DELETE/自定义头需要OPTIONS预检
  - 深入学习了bcrypt密码加密：自动加盐、慢速计算、可调强度
  - 纠正了错误理解：Salt Rounds是加密强度（2^10=1024次），不是过期时间
  - 理解了bcrypt vs MD5优势：防止彩虹表攻击、防止暴力破解
  - 学习了XSS攻击（跨站脚本攻击）：注入恶意JavaScript代码到网页
  - 理解了XSS的本质：攻击浏览器，窃取Cookie和用户信息
  - 掌握了XSS防护：输出转义、输入验证、CSP内容安全策略
  - 亲眼看到了CSP的实际作用：内联脚本被阻止（刚才的错误）
  - 学习了CSRF攻击（跨站请求伪造）：伪造HTTP请求，利用Cookie自动发送
  - 理解了CSRF的本质：攻击服务器，冒充用户操作
  - 掌握了CSRF防护：CSRF Token、SameSite Cookie、验证Referer
  - 理解了XSS vs CSRF的区别和防护优先级（XSS > CSRF）
  - 成功测试了XSS攻击（弹窗）、XSS防护（转义）、CSRF Token验证
  - 完成了bcrypt演示、CORS演示、XSS/CSRF防护演示项目
  - 新增4个知识点，F领域达到7/8 (87.5%)，进度从47%提升到57%

- **2026-03-21**: JWT认证系统 + Token刷新机制
  - 深入学习了JWT（JSON Web Token）的原理和三个部分（Header、Payload、Signature）
  - 理解了Base64编码vs加密的区别（Header/Payload可解码，Signature加密）
  - 掌握了JWT的防伪造原理（密钥签名，修改payload会导致signature不匹配）
  - 实现了完整的JWT认证系统（注册、登录、获取个人信息）
  - 使用了jsonwebtoken包（jwt.sign生成、jwt.verify验证）
  - 编写了authMiddleware中间件验证token并提取用户信息
  - 添加了email字段验证（格式验证、唯一性验证）
  - **实现了Token刷新机制**（Access Token 15分钟 + Refresh Token 7天）
  - **前端自动刷新**：fetchWithRefresh拦截401错误，自动刷新token
  - **用户无感知体验**：token过期时自动刷新，不需要重新登录
  - **理解了双token设计的安全优势**：Access Token短期降低风险
  - 完成了前端测试页面的完整流程测试
  - 新增3个知识点，进度从42%提升到47%

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
