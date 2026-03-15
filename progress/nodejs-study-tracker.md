# Node.js 学习进度追踪器

**Last Updated**: 2025-03-15
**学习目标**: 全栈开发就业（Node.js后端 + 前端）
**计划时长**: 2-3个月（每天2-3小时）
**当前课程**: 黑马程序员 Node.js 全套教程

---

## 📊 快速统计

📈 **Overall Progress**: 16/73 topics covered = **22%**
📚 **课程进度**: P001-P080 (共约300集)
⏰ **已学习**: 2天
🎯 **目标日期**: 2025年6月中旬

---

## 📋 知识领域进度

| 领域 | 权重 | 已掌握/总数 | 状态 | 优先级 |
|------|------|-------------|------|--------|
| **A. Node.js核心基础** | 15% | 7/10 | 🟡 进行中 | HIGH |
| **B. 异步编程** | 15% | 2/8 | 🟡 进行中 | HIGH |
| **C. 内置模块** | 18% | 5/12 | 🟡 进行中 | **HIGH** |
| **D. Web框架** | 20% ⭐ | 0/10 | ⚪ 未开始 | **CRITICAL** |
| **E. 数据库** | 17% | 0/10 | ⚪ 未开始 | **HIGH** |
| **F. 认证与安全** | 10% | 0/8 | ⚪ 未开始 | Medium |
| **G. 项目实战** | 5% | 0/5 | ⚪ 未开始 | Medium |

---

## A. Node.js核心基础 (15%)

**课程章节**: 第1-3章 | **视频范围**: P1-P40

### ✅ 已掌握 (7/10)

- [x] **A.3** CommonJS vs ES6模块化 (2025-03-15) - **High**
  - 语法对比：require/module.exports vs import/export
  - 加载时机：CommonJS运行时加载，ES6模块编译时加载
  - 值的本质：CommonJS值拷贝，ES6模块值引用
  - Tree-shaking：ES6模块支持静态分析，CommonJS不支持
  - 启用ES6模块：.mjs扩展名或package.json中设置"type": "module"
  - 模块混用：可以用.js(ES6)和.cjs(CommonJS)混用

- [x] **A.4** npm包管理器使用 (2025-03-15) - **High**
  - npm install vs npm ci：ci用于生产环境，严格按lock文件安装
  - 版本号规则：^1.2.3（兼容次版本），~1.2.3（兼容补丁），1.2.3（精确）
  - dependencies vs devDependencies：生产依赖 vs 开发依赖
  - npm vs npx：npm管理包，npx执行包（无需安装）

- [x] **A.5** package.json详解 (2025-03-15) - **High**
  - 必须字段：name, version
  - 依赖管理：dependencies, devDependencies
  - scripts：npm脚本命令
  - type: "module" | "commonjs"：模块类型

- [x] **A.6** Buffer缓冲区 (2025-03-13) - **Medium-High**
  - Buffer概念：处理二进制数据的容器
  - 创建方式：`Buffer.from()`, `Buffer.alloc()`
  - 转换方法：`.toString()` 可指定编码和位置
  - 应用场景：文件读写、图片处理、网络传输
  - 常见操作：`.concat()`, `.slice()`, 索引访问

- [x] **A.7** 全局对象 (2025-03-13) - **High**
  - `__dirname`：当前文件夹路径（文件所在位置，固定）
  - `__filename`：当前文件完整路径（包含文件名）
  - `process.argv`：获取命令行参数数组
  - `process.env`：获取环境变量
  - `process.cwd()`：当前工作目录（运行命令的位置，可变）
  - 定时器：`setTimeout`, `setInterval`
  - console对象：`log`, `error`, `warn`

- [x] **A.8** 模块加载机制 (2025-03-15) - **High**
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

### ✅ 已掌握 (2/8)

- [x] **B.3** Promise基础 (2025-03-13) - **High**
  - Promise三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
  - 状态一旦改变就不可逆
  - `resolve()` → 处理成功，由`.then()`接收
  - `reject()` → 处理失败，由`.catch()`接收
  - Promise链式调用：`.then()`的return会传递给下一个then
  - `.catch()`可以捕获错误并return让链式调用继续

- [x] **B.5** async/await (2025-03-13) - **High**
  - `async`函数：声明异步函数，返回值永远是Promise
  - `await`：等待Promise完成，只暂停当前async函数
  - **关键理解**：await不阻塞主线程（仍是异步）
  - 错误处理：使用`try-catch`包裹await
  - 并行执行：使用`Promise.all()`同时执行多个异步任务
  - 执行顺序：await暂停当前函数，主线程继续执行其他代码

### 📚 学习中 (0/8)

- [ ] **B.1** 同步 vs 异步的概念
- [ ] **B.2** 回调函数与回调地狱
- [ ] **B.4** Promise链式调用
- [ ] **B.6** Event Loop事件循环机制
- [ ] **B.7** 宏任务 vs 微任务
- [ ] **B.8** 错误处理（try-catch、unhandledRejection）

---

## C. 内置模块 (18%)

**课程章节**: 第5-6章 | **视频范围**: P81-P140

### ✅ 已掌握 (5/12)

- [x] **C.1** fs文件写入 (2025-03-15) - **High**
  - 异步API：fs.writeFile() - 推荐使用，不阻塞主线程
  - 同步API：fs.writeFileSync() - 阻塞主线程，只适合启动脚本
  - 追加写入：fs.appendFile()
  - 错误处理：try-catch或回调

- [x] **C.2** fs文件读取 (2025-03-15) - **High**
  - 异步读取：fs.readFile() - 推荐使用
  - 同步读取：fs.readFileSync() - 阻塞主线程
  - 文件信息：fs.stat() - 获取文件大小、创建时间等
  - 删除文件：fs.unlink()

- [x] **C.3** fs流式操作 (2025-03-15) - **High**
  - Stream（流）概念：一点一点传输数据，节省内存
  - 创建读取流：fs.createReadStream() - 处理大文件
  - 创建写入流：fs.createWriteStream()
  - 管道pipe()：自动连接读取流和写入流，处理背压
  - highWaterMark：控制缓冲区大小（默认64KB）

- [x] **C.5** path路径处理 (2025-03-15) - **High**
  - path.join()：拼接路径，自动处理斜杠
  - path.resolve()：解析为绝对路径
  - path.basename()：获取文件名
  - path.dirname()：获取目录部分
  - path.extname()：获取扩展名
  - path.parse()：解析路径为对象
  - __dirname vs path.dirname()：当前文件目录 vs 处理任意路径

- [x] **C.6** http创建服务器 (2025-03-15) - **High**
  - 创建服务器：http.createServer()
  - req对象：包含请求信息（method, url, headers）
  - res对象：返回响应（statusCode, setHeader, end）
  - 返回JSON：设置Content-Type为application/json

### 📚 学习中 (0/12)

- [ ] **C.4** fs模块 - 文件信息（stat/readdir）
- [x] **C.7** http请求响应 (2025-03-15) - **High**
  - 处理不同请求方法：GET/POST/PUT/DELETE
  - 路由基础：根据URL路径处理不同请求
  - 获取URL参数：url.parse()解析查询参数
  - 接收POST数据：监听req的data和end事件
  - RESTful API：设计规范的接口
- [ ] **C.9** events模块 - 事件发射器
- [ ] **C.10** crypto模块 - 加密与哈希
- [ ] **C.11** url模块 - URL解析
- [ ] **C.12** 其他常用模块（os、util、querystring）

---

## D. Web框架 (20%) ⭐ **最重要**

**课程章节**: 第7-10章 | **视频范围**: P141-P220

### ✅ 已掌握 (0/10)

*(暂无)*

### 📚 学习中 (0/10)

- [ ] **D.1** Express框架简介与安装
- [ ] **D.2** Express路由（GET/POST/PUT/DELETE）
- [ ] **D.3** Express中间件机制
- [ ] **D.4** 常用中间件（body-parser、cors、morgan）
- [ ] **D.5** 静态资源服务
- [ ] **D.6** RESTful API设计规范
- [ ] **D.7** Express路由参数处理
- [ ] **D.8** 错误处理中间件
- [ ] **D.9** 模块化路由（express.Router）
- [ ] **D.10** Express最佳实践

---

## E. 数据库 (17%)

**课程章节**: 第11-13章 | **视频范围**: P221-P280

### ✅ 已掌握 (0/10)

*(暂无)*

### 📚 学习中 (0/10)

- [ ] **E.1** MySQL安装与配置
- [ ] **E.2** SQL基础语法（SELECT/INSERT/UPDATE/DELETE）
- [ ] **E.3** 数据库设计基础（表、字段、类型、约束）
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

### ✅ 已掌握 (0/8)

*(暂无)*

### 📚 学习中 (0/8)

- [ ] **F.1** HTTP无状态性与Cookie/Session
- [ ] **F.2** JWT（JSON Web Token）原理
- [ ] **F.3** JWT在Express中的实现
- [ ] **F.4** Token刷新机制
- [ ] **F.5** CORS跨域问题与解决方案
- [ ] **F.6** 数据验证（express-validator/joi）
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

### ✅ **最近解决** (2025-03-13)

**已修复漏洞**：
1. ✅ **Buffer缓冲区** - 完全没学 → **Medium-High**
   - 补习了Buffer概念、创建方式、转换方法
   - 理解了二进制数据处理场景

2. ✅ **__filename** - 没学过 → **High**
   - 补习了__dirname和__filename的区别
   - 理解了process.cwd()的可变性

3. ✅ **process对象** - 完全没学 → **Medium-High**
   - 掌握了process.argv获取命令行参数
   - 了解了process.env环境变量

4. ✅ **Promise状态理解** - 有偏差 → **High**
   - 纠正了"reject()不管成功失败"的错误理解
   - 明确了resolve/reject的使用场景
   - 掌握了Promise三种状态及不可逆特性

5. ✅ **async/await理解** - 部分正确 → **High**
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

**总学习天数**: 1天
**总学习时长**: 1.5小时
**完成主题数**: 5/73 (7%)
**完成项目数**: 0/4

**最近7天学习记录**:
- **2025-03-15**: 深入学习模块化、npm、内置模块
  - 掌握了CommonJS vs ES6模块化的区别
  - 学习了npm高级用法（ci, 版本管理, dependencies）
  - 掌握了fs模块（文件读写、流操作）
  - 掌握了path模块（路径处理）
  - 掌握了http模块（创建服务器、处理请求响应）
  - 新增10个知识点，进度从8%提升到22%

- **2025-03-13**: 知识漏洞补习（Buffer、全局对象、Promise、async/await）
  - 评估了P001-P073的学习成果
  - 补齐了5个重要知识点
  - 创建了详细的会话记录

---

**加油！每天进步一点点！💪**
