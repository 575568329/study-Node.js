# Node.js 学习记忆存储

**最后更新**: 2026-03-23

---

## 🎯 学生概况

**学习目标**: Node.js全栈开发就业
**当前课程**: 黑马程序员 Node.js 全套教程 (BV1gM411W7ex)
**学习方式**: 视频学习 + AI导师苏格拉底式教学 + 代码练习
**开始日期**: 2026-03-13
**基本信息**: 熟练掌握前端JS、Vue.js开发，29岁，6年前端开发经验

---

## 📊 当前进度 (2026-03-23)

**整体进度**: 43/73 topics (59%)
**已学习天数**: 9天
**总学习时长**: 约25.5小时
**当前视频**: P001-P090+ (自学+实战)
**学习阶段**: 第3周 - 认证安全 + 综合项目实战

---

## ✅ 已掌握知识点

### **A. Node.js核心基础** (7/10)
- [x] **A.3** CommonJS vs ES6模块化 (2026-03-15) - *High*
  - 编译时加载 vs 运行时加载
  - 值引用 vs 值拷贝
  - Tree-shaking支持
  - .mjs和"type": "module"启用方式

- [x] **A.4** npm包管理器使用 (2026-03-15) - *High*
- [x] **A.5** package.json详解 (2026-03-15) - *High*
- [x] **A.6** Buffer缓冲区 (2026-03-13) - *Medium-High*
- [x] **A.7** 全局对象 (2026-03-13) - *High*
- [x] **A.8** 模块加载机制 (2026-03-15) - *High*

### **B. 异步编程** (3/8)
- [x] **B.3** Promise基础 (2026-03-13) - *High*
- [x] **B.5** async/await (2026-03-13) - *High*
- [x] **B.6** Event Loop事件循环 (2026-03-20) - *High*

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
- [x] **D.8** 错误处理中间件 (2026-03-17) - *High*
- [x] **D.9** 模块化路由 (2026-03-17) - *High*
- [x] **Multer文件上传** (2026-03-18) - *High*
- [x] **express-validator参数验证** (2026-03-18) - *High*

### **E. 数据库** (5/10)
- [x] **E.1** MySQL安装与配置 (2026-03-18) - *High*
- [x] **E.2** SQL基础语法 (2026-03-18) - *High*
- [x] **E.3** 数据库设计基础 (2026-03-18) - *High*
- [x] **E.4** Node.js连接mysql2 (2026-03-20) - *High*
  - 创建连接池配置
  - 参数化查询（防SQL注入）
  - async/await执行查询
- [x] **E.5** CRUD操作实现 (2026-03-20) - *High*
  - INSERT/SELECT/UPDATE/DELETE
  - WHERE子句的重要性
  - insertId获取新记录ID

### **F. 认证与安全** (8/8) ✅ **100%完成**
- [x] **F.6** 数据验证express-validator (2026-03-18) - *High*
- [x] **F.7** 密码加密bcrypt (2026-03-22) - *High*
  - Salt Rounds：加密强度（2^10=1024次）
  - 每次加密结果不同（随机盐）
  - bcrypt.compare()验证密码
- [x] **F.8** XSS与CSRF防护 (2026-03-22) - *High*
  - XSS：注入恶意JavaScript代码（攻击浏览器）
  - XSS防护：输出转义、输入验证、CSP
  - CSRF：伪造HTTP请求（攻击服务器）
  - CSRF防护：CSRF Token、SameSite Cookie
  - 防护优先级：XSS > CSRF
- [x] **F.9** 安全最佳实践 (2026-03-23) - *High*
  - 速率限制（rate-limiting）防止暴力破解
  - Helmet安全头（7个HTTP响应头）
  - 数据脱敏（SQL查询排除、代码删除、日志脱敏）
  - 日志安全（5大风险：文件窃取、第三方平台、控制台打印、内部泄露、法律合规）
  - 环境变量管理（.env配置、JWT_SECRET、DB_PASSWORD）

- [x] **F.1** Cookie/Session (2026-03-22) - *High*
- [x] **F.2** JWT原理 (2026-03-21) - *High*
- [x] **F.3** JWT实现 (2026-03-21) - *High*
- [x] **F.4** Token刷新机制 (2026-03-21) - *High*
- [x] **F.5** CORS跨域 (2026-03-22) - *High*

### **G. 项目实战** (1/5)
- [x] **G.3** 个人博客后端API (2026-03-23) - *High* ✅ **核心功能100%**
  - **用户认证系统**：
    - 用户注册：bcrypt密码加密、参数验证、重复检查
    - 用户登录：bcrypt验证、JWT token生成
    - JWT认证中间件：验证token、挂载用户信息到req.user
    - 速率限制：登录接口5次/分钟
  - **文章管理系统**：
    - 获取文章列表：分页查询、联表查询作者信息
    - 获取文章详情：联表查询、浏览次数自动+1
    - 发表文章：JWT认证、参数验证、状态管理
    - 编辑文章：权限验证、动态SQL构建
    - 删除文章：权限验证
  - **评论系统**：
    - 发表评论：检查文章存在性、JWT认证
    - 删除评论：权限验证、边界检查
    - 获取评论列表：联表查询评论者信息
  - **用户中心**：
    - 获取个人信息：排除password字段
    - 更新个人信息：动态SQL、email重复检查、边界检查

---

## 🔑 关键学习里程碑

### **2026-03-13: 知识漏洞补习**
- 补习了5个重要知识点（Buffer、全局对象、Promise、async/await）
- 纠正了对Promise状态的错误理解

### **2026-03-15: 深入学习模块化、npm、内置模块** ⭐
- **新增10个知识点，进度从8%提升到22%**

### **2026-03-16: events模块 + Express框架入门**
- **新增4个知识点，进度从22%提升到27%**

### **2026-03-17: Express深入（静态资源、模块化路由、错误处理）** ⭐
- **新增4个知识点，进度从27%提升到33%**

### **2026-03-18: Multer文件上传 + MySQL入门** ⭐⭐⭐
- **深入理解Multer文件上传完整流程**
- **创建了第一个数据库**
- **新增4个知识点，进度从33%提升到38%**

### **2026-03-20: Event Loop + MySQL CRUD** ⭐⭐
- **复习Event Loop，纠正Promise分类错误**
- **掌握mysql2连接池和CRUD操作**
- **新增2个知识点，进度从38%提升到40%**

### **2026-03-21: JWT认证系统 + Token刷新机制** ⭐⭐⭐
- **实现完整的JWT认证系统**
- **实现Token刷新机制（用户无感知）**
- **新增3个知识点，进度从40%提升到47%**

### **2026-03-22: Cookie/Session + CORS + bcrypt + XSS/CSRF** ⭐⭐⭐
- **理解Cookie自动发送机制**
- **掌握Session流程和JWT区别**
- **学习CORS跨域问题**
- **掌握bcrypt密码加密**
- **学习XSS和CSRF攻击防护**
- **新增4个知识点，进度从47%提升到55%**

### **2026-03-23: 安全最佳实践 + 个人博客API** ⭐⭐⭐⭐⭐ **最大里程碑**
- **F领域达到100%（8/8全部完成）** ✅
- **完成个人博客API核心功能**（用户认证+文章+评论+用户中心）
- **代码质量达到生产级别**
- **解决7个关键Bug**
- **新增1个知识点 + 1个项目，进度从55%提升到59%**

---

## 📚 重要概念理解

### **JWT认证系统** (2026-03-21)
- **JWT结构**: Header（算法类型）+ Payload（用户信息）+ Signature（防伪签名）
- **Base64编码 vs 加密**: Header和Payload可解码，Signature加密无法伪造
- **防伪造原理**: HMACSHA256(header + payload + secret)，修改payload会导致signature不匹配
- **Payload不存敏感信息**: Base64可解码，不要存password、信用卡号
- **jwt.sign()生成token**: `jwt.sign({ user_id }, secret, { expiresIn: '7d' })`
- **jwt.verify()验证token**: `jwt.verify(token, secret)`，返回decoded payload
- **认证中间件**: 从`Authorization: Bearer <token>`提取token，验证后挂载到`req.user`
- **密钥管理**: 使用环境变量`process.env.JWT_SECRET`，生产环境至少32位随机字符串

### **MySQL联表查询** (2026-03-23)
- **LEFT JOIN语法**:
  ```sql
  SELECT p.*, u.username, u.nickname
  FROM posts p
  LEFT JOIN users u ON p.author_id = u.id
  WHERE p.status = 'published'
  ```
- **联表查询目的**: 一次查询获取文章和作者信息，避免N+1查询问题
- **查询别名**: `p.*` 取posts表所有字段，`u.username` 取users表的username字段
- **ON子句**: 定义两个表的关联关系（通常是外键）

### **动态SQL构建** (2026-03-23)
- **应用场景**: 只更新用户提供的字段
- **正确写法**:
  ```javascript
  const updateFields = [];
  const updateValues = [];

  if (title !== undefined) {  // ✅ 明确检查是否undefined
    updateFields.push('title = ?');
    updateValues.push(title);
  }
  if (content !== undefined) {
    updateFields.push('content = ?');
    updateValues.push(content);
  }

  updateFields.push('updated_at = NOW()');
  updateValues.push(id);

  const sql = `UPDATE posts SET ${updateFields.join(', ')} WHERE id = ?`;
  ```
- **错误写法**（forEach陷阱）:
  ```javascript
  const list = ['title', 'content'];
  list.forEach(el => {
    if (el) {  // ❌ el是字符串'title'，永远为true
      updateFields.push(`${el} = ?`);
      updateValues.push(el);  // ❌ push字符串'title'，不是实际值
    }
  });
  ```

### **权限验证模式** (2026-03-23)
- **模式**：
  1. 查询资源：`SELECT * FROM posts WHERE id = ?`
  2. 检查存在性：`if (posts.length === 0) return 404`
  3. 验证权限：`if (posts[0].author_id !== authorId) return 403`
  4. 执行操作：DELETE/UPDATE
- **应用场景**: 编辑文章、删除文章、删除评论
- **关键**: 先检查资源是否存在，再验证操作权限

### **速率限制** (2026-03-23)
- **目的**: 防止暴力破解攻击
- **实现**: `express-rate-limit`中间件
- **配置**:
  ```javascript
  rateLimit({
    windowMs: 60 * 1000,  // 时间窗口（毫秒）
    max: 5,  // 最大请求数
    message: '请求过于频繁'
  })
  ```
- **应用**: 登录接口5次/分钟，防止密码暴力破解
- **返回**: 429状态码（Too Many Requests）

### **数据脱敏** (2026-03-23)
- **方法1 - SQL查询时排除**（推荐）:
  ```sql
  SELECT id, username, email FROM users WHERE id = ?
  ```
  - 性能更好（不查询不需要的数据）
  - 数据传输更快

- **方法2 - 代码中删除**:
  ```javascript
  delete user.password;
  ```
  - 用于ORM或第三方API返回

- **方法3 - 日志脱敏**（最重要）:
  - 禁止记录token、password、信用卡号
  - 使用morgan自定义token过滤敏感字段
  - 避免日志文件被窃取、第三方平台、控制台打印、内部泄露

### **Multer文件上传**
- **multipart/form-data**: 为什么文件上传需要特殊格式
- **storage配置**: diskStorage vs memoryStorage
- **文件名格式**: `字段名-时间戳-随机数.扩展名`（防止并发冲突）
- **fileFilter**: MIME类型检查
- **limits**: fileSize限制
- **错误处理**: 数据库保存失败时用fs.unlink()删除已上传文件

### **express-validator参数验证**
- **前端vs后端验证**: 前端可被绕过，后端必须验证
- **验证链**: body()、param()、query()
- **执行顺序**: 参数验证 → 文件上传 → 业务逻辑
- **validationResult()**: 检查验证结果

### **bcrypt密码加密**
- **Salt Rounds**: 加密强度（2^10=1024次加密循环）
- **每次结果不同**: 因为使用随机盐
- **推荐值**: 10-12（平衡安全性和性能）

### **XSS vs CSRF**
- **XSS**（跨站脚本攻击）: 注入恶意JavaScript代码
- **CSRF**（跨站请求伪造）: 伪造HTTP请求
- **防护优先级**: XSS > CSRF（XSS可绕过CSRF防护）

---

## 🚫 需要避免的常见错误

### **SQL相关**
1. **忘记WHERE子句**: UPDATE/DELETE会修改所有数据
2. **SQL注入**: 永远不要拼接SQL字符串，用参数化查询
3. **忘记提交**: 某些数据库需要手动commit

### **异步相关**
4. **没有try-catch**: async/await需要错误处理

### **代码逻辑**
5. **forEach陷阱**: 遍历数组时，el是元素值（字符串），不是变量名
   ```javascript
   // ❌ 错误
   list.forEach(el => {
     if (el) {  // el永远是字符串'title'
       updateValues.push(el);  // push字符串，不是实际值
     }
   });

   // ✅ 正确
   if (title !== undefined) {
     updateFields.push('title = ?');
     updateValues.push(title);
   }
   ```

6. **数组判断错误**:
   ```javascript
   const [user] = await pool.query(...);
   if (!user) {  // ❌ user是数组，空数组[]也是truthy
   if (user.length === 0) {  // ✅ 正确
   ```

7. **数据检查逻辑**:
   ```javascript
   if (nickname) {  // ❌ 空字符串""是falsy
   if (nickname !== undefined) {  // ✅ 明确检查
   ```

8. **morgan日志GET请求**:
   ```javascript
   // ❌ 错误
   morgan.token('body', (req) => {
     const { password, ...safeBody } = req.body;  // GET请求req.body是undefined
     return JSON.stringify(safeBody);
   });

   // ✅ 正确
   morgan.token('body', (req) => {
     if (!req.body || Object.keys(req.body).length === 0) {
       return '{}';
     }
     const { password, ...safeBody } = req.body;
     return JSON.stringify(safeBody);
   });
   ```

### **变量命名**
9. **变量命名不一致**: existingUsers vs existingEmails（容易混淆）

10. **返回值错误**:
    ```javascript
    id: authorId,  // ❌ 返回的是用户ID
    id: result.insertId,  // ✅ 返回新记录ID
    ```

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
- ✅ **代码质量高**（达到生产级别）✨

**避免**:
- ❌ 直接倾倒大量信息
- ❌ 不检查理解就继续
- ❌ 让学生因不知道而感到糟糕

---

## 📝 会话记录位置

- **详细会话**: `/sessions/YYYY-MM-DD/session-notes.md`
- **进度追踪**: `/progress/nodejs-study-tracker.md`（唯一真相源）
- **项目索引**: `/projects/INDEX.md`
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
  /11-personal-blog/   # 个人博客API ✅ 新增
  /10-security-best-practice/  # 安全最佳实践 ✅ 新增
memory/MEMORY.md        # 本文件
```

---

## 🚀 下一步学习计划

### **推荐方向** ⭐⭐⭐
根据就业权重（D=20%, E=17%, C=18%）:

### **优先级 CRITICAL** (最重要)
1. **D.5** 静态资源服务（进阶）
2. **D.6** RESTful API设计规范
3. **D.7** Express路由参数处理（进阶）
4. **D.10** Express最佳实践

### **优先级 HIGH** (就业核心)
5. **E.6** SQL注入防护
6. **E.7** 事务处理
7. **B.1** 同步vs异步
8. **B.2** 回调函数与回调地狱
9. **B.4** Promise链式调用
10. **B.7** 宏任务vs微任务（深入Node.js特有阶段）

### **优先级 MEDIUM**
11. **G.1** 文件管理工具
12. **G.2** 静态资源服务
13. **C.4** fs文件信息
14. **C.10** crypto加密模块

### **可选功能**
15. **11-personal-blog** 文件上传功能（头像、文章配图）

---

**最后复习**: 2026-03-23 会话内容（安全最佳实践+个人博客API）
**下次更新**: 每次学习会话结束后

---

**加油！每天进步一点点！💪**
