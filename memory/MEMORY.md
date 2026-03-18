# Node.js 学习记忆存储

**最后更新**: 2026-03-18

---

## 🎯 学生概况

**学习目标**: Node.js全栈开发就业
**当前课程**: 黑马程序员 Node.js 全套教程 (BV1gM411W7ex)
**学习方式**: 视频学习 + AI导师苏格拉底式教学 + 代码练习
**开始日期**: 2026-03-13
**基本信息**: 熟练掌握前端JS、Vue.js开发，29岁，6年前端开发经验

---

## 📊 当前进度 (2026-03-18)

**整体进度**: 28/73 topics (38%)
**已学习天数**: 5天
**总学习时长**: 约12小时
**当前视频**: P001-P090+ (自学+实战)
**学习阶段**: 第2周 - Express框架 + 数据库入门

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

### **C. 内置模块** (7/12)
- [x] **C.1** fs文件写入 (2026-03-15) - *High*
- [x] **C.2** fs文件读取 (2026-03-15) - *High*
- [x] **C.3** fs流式操作 (2026-03-15) - *High*
- [x] **C.5** path路径处理 (2026-03-15) - *High*
- [x] **C.6** http创建服务器 (2026-03-15) - *High*
- [x] **C.9** events事件发射器 (2026-03-16) - *High*
- [x] **C.11** url模块 (2026-03-16) - *High*

### **D. Web框架** (7/10) ⭐ **最重要**
- [x] **D.1** Express简介与安装 (2026-03-16) - *High*
- [x] **D.2** Express路由 (2026-03-16) - *High*
- [x] **D.3** Express中间件机制 (2026-03-16) - *High*
- [x] **D.4** 常用中间件 (2026-03-17) - *High*
  - express.static、helmet、morgan、cors
- [x] **D.8** 错误处理中间件 (2026-03-17) - *High*
- [x] **D.9** 模块化路由 (2026-03-17) - *High*
- [x] **Multer文件上传** (2026-03-18) - *High*
  - multipart/form-data格式
  - storage配置（diskStorage）
  - 文件命名唯一性（时间戳+随机数）
  - fileFilter文件过滤
  - limits大小限制
  - upload.single/array/fields方法

- [x] **express-validator参数验证** (2026-03-18) - *High*
  - 前端vs后端验证
  - 验证链（body、param、query）
  - validationResult检查
  - 执行顺序：参数验证 → 文件上传 → 业务逻辑

### **E. 数据库** (3/10)
- [x] **E.1** MySQL安装与配置 (2026-03-18) - *High*
  - MySQL 8.0.45 Full安装
  - 环境变量配置
  - Root密码：root123456
  - Use Legacy Authentication

- [x] **E.2** SQL基础语法 (2026-03-18) - *High*
  - CREATE DATABASE/TABLE
  - INSERT插入数据
  - SELECT查询数据
  - UPDATE更新数据
  - DELETE删除数据
  - WHERE子句的重要性

- [x] **E.3** 数据库设计基础 (2026-03-18) - *High*
  - 字段类型：INT、VARCHAR、TIMESTAMP
  - 约束：PRIMARY KEY、NOT NULL、UNIQUE、DEFAULT
  - AUTO_INCREMENT自增
  - 关系型数据库核心概念

### **F. 认证与安全** (1/8)
- [x] **F.6** 数据验证express-validator (2026-03-18) - *High*
  - 前端验证可被绕过
  - 后端验证必须执行
  - 验证规则和错误处理

---

## 🔑 关键学习里程碑

### **2026-03-13: 知识漏洞补习**
- 补习了5个重要知识点（Buffer、全局对象、Promise、async/await）
- 纠正了对Promise状态的错误理解
- 掌握了async/await不阻塞主线程的核心概念

### **2026-03-15: 深入学习模块化、npm、内置模块** ⭐
- 掌握了CommonJS vs ES6模块化的区别
- 学习了npm高级用法
- 掌握了fs、path、http模块
- **新增10个知识点，进度从8%提升到22%**

### **2026-03-16: events模块 + Express框架入门**
- 掌握了events事件发射器（on、once、emit）
- 理解了事件驱动的解耦优势
- 学习了Express框架基础
- 掌握了RESTful API设计
- **新增4个知识点，进度从22%提升到27%**

### **2026-03-17: Express深入（静态资源、模块化路由、错误处理）** ⭐
- 掌握了express.static静态资源服务
- 理解了模块化路由（express.Router）
- 深入理解了错误处理中间件
- 学习了常用第三方中间件（helmet、morgan、cors）
- **新增4个知识点，进度从27%提升到33%**

### **2026-03-18: Multer文件上传 + MySQL入门** ⭐⭐⭐
- **深入理解Multer文件上传完整流程**
  - storage配置（diskStorage）
  - 文件名唯一性设计（时间戳+随机数）
  - fileFilter文件类型过滤
  - limits文件大小限制
  - 错误处理和资源清理

- **实践express-validator参数验证**
  - 前端验证vs后端验证
  - 验证链执行顺序
  - 综合应用（参数验证+文件上传）

- **MySQL 8.0.45安装与配置**
  - Full完全安装
  - 环境变量配置成功
  - 服务正常运行（MySQL80）

- **SQL基础语法掌握**
  - CREATE DATABASE/TABLE
  - INSERT/SELECT/UPDATE/DELETE
  - 理解主键、自增、约束
  - **创建了第一个数据库（blog_database）和第一个表（users）**

- **数据建模直觉优秀**
  - 理解表关联（主键外键）
  - 理解关系型数据库设计

- **新增4个知识点，进度从33%提升到38%**

---

## 📚 重要概念理解

### **Multer文件上传**
- **multipart/form-data**: 为什么文件上传需要特殊格式（多部分数据）
- **storage配置**: diskStorage（磁盘）vs memoryStorage（内存）
- **文件名格式**: `字段名-时间戳-随机数.扩展名`
  - 目的：防止并发冲突和文件覆盖
  - 例如：`avatar-1773840996590-520256138.jpg`
- **fileFilter**: MIME类型检查，只允许图片（image/jpeg、image/png等）
- **limits**: fileSize限制（5MB）
- **上传方法**:
  - `upload.single('field')` - 单文件
  - `upload.array('field', 10)` - 多文件同字段
  - `upload.fields([...])` - 多字段
- **错误处理**: MulterError vs 普通错误
- **资源清理**: 数据库保存失败时用fs.unlink()删除已上传文件

### **express-validator参数验证**
- **前端验证vs后端验证**:
  - 前端：可以被绕过（禁用JS、修改HTML）
  - 后端：必须验证（安全性、可靠性）
- **验证链**: body()、param()、query()
- **常用验证**: trim()、notEmpty()、isLength()、isEmail()、matches()
- **自定义错误**: withMessage()设置错误消息
- **结果检查**: validationResult(req)
- **执行顺序**: 参数验证 → 文件上传 → 业务逻辑
  - 参数失败不上传文件（节省带宽）
  - 文件失败不执行业务逻辑

### **MySQL数据库**
- **数据库vs文件系统**:
  - 查询速度：有索引，快
  - 并发控制：支持多人同时读写
  - 事务支持：失败自动回滚
  - 易扩展：可存储TB级数据

- **关系型数据库核心**:
  - 表（Table）：类似Excel
  - 行（Row）：一条记录
  - 列（Column）：一个字段
  - 主键（PRIMARY KEY）：唯一标识
  - 外键（FOREIGN KEY）：关联其他表

- **字段类型**:
  - `INT` - 整数
  - `VARCHAR(n)` - 变长字符串，最大n字符
  - `TIMESTAMP` - 时间戳

- **约束**:
  - `PRIMARY KEY` - 主键，唯一标识
  - `AUTO_INCREMENT` - 自增，自动加1
  - `NOT NULL` - 不能为空
  - `UNIQUE` - 不能重复
  - `DEFAULT` - 默认值

- **SQL基础**:
  - `CREATE DATABASE db_name;` - 创建数据库
  - `USE db_name;` - 切换数据库
  - `CREATE TABLE ...;` - 创建表
  - `INSERT INTO ... VALUES ...;` - 插入数据
  - `SELECT * FROM ...;` - 查询数据
  - `UPDATE ... SET ... WHERE ...;` - 更新数据
  - `DELETE FROM ... WHERE ...;` - 删除数据
  - **⚠️ WHERE子句的重要性**: 忘记WHERE会更新/删除所有数据！

### **CommonJS vs ES6模块化**
- **加载时机**: CommonJS运行时加载（同步），ES6模块编译时加载（异步）
- **值的本质**: CommonJS是值拷贝，ES6模块是值引用
- **Tree-shaking**: ES6模块支持静态分析，CommonJS不支持
- **启用方式**: .mjs扩展名或package.json设置"type": "module"

### **npm包管理**
- **npm install vs npm ci**: ci用于生产环境，严格按lock文件
- **版本号**: ^1.2.3兼容次版本，~1.2.3兼容补丁
- **dependencies**: 生产依赖，devDependencies：开发依赖
- **npm vs npx**: npm管理包，npx执行包

### **fs文件系统**
- **异步API**: fs.readFile() - 推荐使用
- **同步API**: fs.readFileSync() - 阻塞主线程
- **Stream**: 一点一点传输数据，节省内存
- **管道pipe()**: 自动连接读取流和写入流

### **Express中间件**
- **中间件函数**: `(req, res, next) => {}`
- **next()**: 将控制权传递给下一个中间件
- **执行顺序**: 洋葱模型
- **错误处理**: 4个参数（err, req, res, next）
- **常用中间件**: express.static、helmet、morgan、cors

### **异步编程**
- **Promise状态**: pending → fulfilled/rejected（不可逆）
- **async/await**: 只暂停当前函数，不阻塞主线程
- **并行执行**: Promise.all()

---

## 🎯 下一步学习计划

### **推荐方向** ⭐⭐⭐
**Node.js连接mysql2** - 完整CRUD实战

**学习内容**:
1. 安装mysql2包
2. 创建连接池配置
3. 执行SQL查询（SELECT、INSERT、UPDATE、DELETE）
4. 封装数据库操作模块
5. 实现完整的用户注册API
   - express-validator参数验证
   - Multer文件上传
   - mysql2数据库存储
   - 错误处理和事务

**预计时间**: 1.5-2小时

---

### **优先级 CRITICAL** (最重要，20%权重)
1. **E.4-E.5** Node.js连接mysql2 + CRUD操作 ⭐⭐⭐
2. **D.6** RESTful API设计规范
3. **D.10** Express最佳实践

### **优先级 HIGH** (就业核心)
4. **B.6** Event Loop事件循环 ⭐⭐⭐
5. **B.7** 宏任务vs微任务
6. **F.2-F.3** JWT认证

### **优先级 MEDIUM**
7. **C.10** crypto加密模块
8. **F.7** 密码加密（bcrypt）

---

## 🚫 需要避免的常见错误

### **SQL相关**
1. **忘记WHERE子句**: UPDATE/DELETE会修改所有数据
2. **SQL注入**: 永远不要拼接SQL字符串，用参数化查询
3. **忘记提交**: 某些数据库需要手动commit

### **文件上传相关**
4. **忘记清理文件**: 数据库保存失败时删除已上传文件
5. **文件名冲突**: 用时间戳+随机数保证唯一性
6. **忘记fileFilter**: 允许上传任何文件类型很危险

### **异步相关**
7. **文件上传异步性**: 必须等文件上传完成才能保存到数据库
8. **没有try-catch**: async/await需要错误处理

### **之前的错误**（复习）
9. **Promise**: reject()不是"不管成功失败"
10. **async/await**: 不是"避免异步"，而是更好的异步处理
11. **模块路径**: require()时 `./` 不能省略

---

## 💡 教学偏好

**学习风格**:
- ✅ 苏格拉底式教学（先问理解，再针对性讲解）
- ✅ 先探索学生现有知识基础
- ✅ 提供简洁解释（约200字）+ 代码示例
- ✅ 立即验证理解（问1-2个检查问题）
- ✅ 鼓励学生思考和探索
- ✅ 基于6年前端经验，用前端知识类比后端概念

**学生优势**:
- ✅ 理解能力强（能解释设计原理）
- ✅ 实践习惯好（主动测试验证）
- ✅ 学习态度积极（深度理解）
- ✅ 数据建模直觉优秀（理解表关联）

**避免**:
- ❌ 直接倾倒大量信息
- ❌ 不检查理解就继续
- ❌ 让学生因不知道而感到糟糕

---

## 📝 会话记录位置

- **详细会话**: `/sessions/YYYY-MM-DD/session-notes.md`
- **进度追踪**: `/progress/nodejs-study-tracker.md`（唯一真相源）
- **代码示例**: `/code-examples/`
- **实战项目**: `/projects/`

---

## 🔍 快速评估检查点

每次新会话开始时，快速确认：
1. ✅ 上次学习内容（查看最近的session-notes.md）
2. ✅ 知识漏洞是否需要复习
3. ✅ 今日学习目标
4. ✅ 学生对上次内容的理解程度

---

## 🎯 环境配置备忘

### **MySQL**
- 服务名：MySQL80
- 端口：3306
- Root密码：root123456
- 环境变量：C:\Program Files\MySQL\MySQL Server 8.0\bin
- 安装版本：8.0.45 Full
- 认证方式：Use Legacy Authentication

### **项目结构**
```
/sessions/              # 每日学习记录
/progress/              # 进度追踪器
/projects/              # 实战项目
  /06-validator-upload  # 参数验证+文件上传
  /05-express-middleware  # 中间件示例
/code-examples/         # 代码练习片段
memory/MEMORY.md        # 本文件
```

---

**最后复习**: 2026-03-18 会话内容（Multer、MySQL、SQL）
**下次更新**: 每次学习会话结束后

---

**加油！每天进步一点点！💪**
