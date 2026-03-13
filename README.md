# Node.js-Study

🚀 **使用AI辅助学习Node.js全栈开发的学习仓库**

这是一个帮助你系统学习Node.js后端开发，配合你已有的前端技能成为全栈工程师的学习环境。使用Claude Code作为AI导师，采用苏格拉底式教学法，让你真正理解而不是死记硬背。

---

## 📚 学习内容

**课程**: 黑马程序员 Node.js 全套教程
**视频**: [BV1gM411W7ex](https://www.bilibili.com/video/BV1gM411W7ex)
**目标**: 2-3个月掌握Node.js后端开发，胜任全栈工程师岗位

### 7大知识领域

| 领域 | 权重 | 主题数 | 状态 |
|------|------|--------|------|
| **A. Node.js核心基础** | 15% | 10 | ⚪ 未开始 |
| **B. 异步编程** | 15% | 8 | ⚪ 未开始 |
| **C. 内置模块** | 18% | 12 | ⚪ 未开始 |
| **D. Web框架** | 20% ⭐ | 10 | ⚪ 未开始 |
| **E. 数据库** | 17% | 10 | ⚪ 未开始 |
| **F. 认证与安全** | 10% | 8 | ⚪ 未开始 |
| **G. 项目实战** | 5% | 5 | ⚪ 未开始 |

**总主题数**: 73个

---

## 📂 项目结构

```
Node.js-Study/
├── sessions/                    # 每日学习会话
│   ├── 2025-03-13/             # 按日期组织
│   │   ├── session-notes.md    # 学习笔记
│   │   └── problems-solved.md  # 问题记录
│   └── SESSION-TEMPLATE.md     # 会话模板
├── progress/                    # 进度追踪
│   └── nodejs-study-tracker.md # 综合进度追踪
├── projects/                    # 实战项目
│   ├── 01-文件管理工具/
│   ├── 02-静态资源服务/
│   ├── 03-个人博客API/
│   └── 04-电影管理系统/
├── code-examples/               # 代码练习片段
├── CLAUDE.md                    # AI导师配置
└── README.md                    # 本文件
```

---

## 🎯 如何使用

### 开始学习

1. **打开Claude Code**
   ```bash
   cd D:\study\Node.js-Study
   claude-code
   ```

2. **开始提问**
   - 直接问任何Node.js相关的问题
   - 比如："什么是Buffer？"、"fs模块怎么用？"

3. **AI导师会：**
   - 先问你已知什么（苏格拉底式）
   - 提供简洁解释（约200字）
   - 检查你是否理解
   - 根据你的回答调整教学

4. **自动记录**
   - 每次会话自动保存到 `sessions/YYYY-MM-DD/`
   - 进度自动更新到 `progress/nodejs-study-tracker.md`
   - 问题记录到 `problems-solved.md`

### 学习会话示例

```
你: "什么是Event Loop？"

AI: "在你之前的JavaScript学习中，有没有接触过异步操作的概念？
     比如setTimeout或者Promise？"

你: "用过Promise，但不太理解底层原理"

AI: "很好！那让我解释Event Loop... [200字解释]
     那么你能解释一下，宏任务和微任务的区别吗？"

你: "[你的回答]"

AI: "完全正确！你已经理解了核心概念 ✓"
```

### 查看进度

随时查看你的学习进度：
```bash
# 查看综合进度
cat progress/nodejs-study-tracker.md

# 查看今天的笔记
cat sessions/2025-03-13/session-notes.md

# 查看遇到的问题
cat sessions/2025-03-13/problems-solved.md
```

---

## 💡 核心特性

### 1. 苏格拉底式AI教学
- 先问你的理解，再讲解
- 不直接给答案，引导你思考
- 随时调整教学方法

### 2. 自动进度追踪
- 每个知识点掌握情况
- 知识漏洞自动识别
- 学习时间线管理

### 3. 问题驱动学习
- 记录每个遇到的bug
- 分析原因和解决方案
- 积累调试经验

### 4. 项目实战
- 4个完整项目
- 从简单到复杂
- 涵盖CRUD、API、数据库

---

## 📖 学习路线

### 第1周：Node.js基础 (A + B)
- ES6语法复习
- CommonJS模块化
- npm包管理
- Buffer缓冲区
- **异步编程核心**（Promise、async/await、Event Loop）

### 第2周：内置模块 (C)
- fs文件系统（写入、读取、流）
- path路径处理
- http创建服务器
- events事件发射器

### 第3-4周：Express框架 (D) ⭐
- Express路由
- 中间件机制
- RESTful API设计
- 静态资源服务
- 错误处理

### 第5周：MySQL数据库 (E)
- SQL基础语法
- Node.js连接mysql2
- CRUD操作
- Sequelize ORM

### 第6周：认证与安全 (F)
- JWT认证
- CORS跨域
- 数据验证
- 密码加密

### 第7-8周：项目实战 (G)
- 文件管理工具
- 静态资源服务
- 个人博客API
- 电影管理系统
- 项目部署

---

## 🔧 技术栈

**后端**:
- Node.js (LTS版本)
- Express.js
- MySQL
- JWT

**前端** (你已掌握):
- React/Vue
- HTML/CSS/JavaScript
- Fetch API/Axios

**开发工具**:
- VS Code
- Postman (API测试)
- MySQL Workbench
- Claude Code (AI导师)

---

## ⚠️ 重要规则

### 对AI导师的要求

1. **绝不猜测答案** - 所有代码和API必须验证
2. **提供可运行代码** - 每个示例都经过测试
3. **引用官方文档** - Node.js、Express、MySQL官方文档
4. **现代语法优先** - async/await > 回调
5. **包含错误处理** - 所有代码都有try-catch

### 对学习者的要求

1. **主动提问** - 不理解就问
2. **诚实回答** - 告诉AI你的真实理解
3. **做练习** - 每个概念都要写代码
4. **记录问题** - 遇到的bug都记下来
5. **定期复习** - 每周回顾之前的笔记

---

## 📊 学习统计

**开始日期**: 2025-03-13
**预计完成**: 2025年6月中旬
**每天投入**: 2-3小时
**总学习时长**: 约150-200小时

---

## 🔗 相关资源

**官方文档**:
- [Node.js官方文档](https://nodejs.org/docs/latest/api/)
- [Express官方文档](https://expressjs.com/)
- [MySQL官方文档](https://dev.mysql.com/doc/)
- [MDN JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

**学习资源**:
- [JavaScript.info](https://zh.javascript.info/)
- [caniuse.com](https://caniuse.com/) - API兼容性检查

**视频教程**:
- [黑马程序员 Node.js 教程](https://www.bilibili.com/video/BV1gM411W7ex)

---

## 🤝 贡献

这是个人学习仓库，但欢迎：
- 提出建议
- 分享学习经验
- 报告错误
- 优化学习路径

---

## 📝 许可

本项目仅供个人学习使用。

---

**最后更新**: 2025-03-13
**当前进度**: 0/73 (0%)
**GitHub**: https://github.com/575568329/study-Node.js.git

---

**开始你的Node.js学习之旅吧！🚀**

有问题就直接问Claude Code导师，它会耐心地引导你理解每一个概念。
