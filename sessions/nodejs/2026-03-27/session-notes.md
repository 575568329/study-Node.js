# 会话记录 - 2026-03-27

## 会话概述

- **日期**: 2026-03-27
- **时长**: 约2.5小时
- **学习方式**: 项目实战 + 苏格拉底式教学 + AI辅助
- **主要主题**: G.4 电影管理系统、G.5 项目部署

## 学习目标

- [x] G.4 电影管理系统（完整CRUD + 多对多关系）
- [x] G.5 项目部署（PM2、环境变量、Nginx）

---

## 学习过程

### Part 1: G.4 电影管理系统 - 数据库设计

#### 初始理解检查
**问题**: 电影管理系统需要哪些功能？

**学生的回答**: 注册、登录、用户信息、电影信息、评论

#### 深入讨论：数据库表设计
- 引导学生思考电影特有字段：类型、评分、时长、封面
- 学生提出：作者、演员表
- 引导发现多对多关系：一部电影多个演员，一个演员多部电影
- 学生初始方案：用逗号分隔存ID → 引导发现查询问题（LIKE '%5%' 匹配15、25）
- 讲解中间表方案：拆成两组一对多

#### 最终表设计（5张表）
1. users: id, account, password, name, gender, bio
2. movies: id, name, releaseDate, company, description, genre, rating, duration, cover
3. persons: id, name, gender, age, nationality
4. movie_person: id, movieId, personId, role(director/actor)
5. comments: id, userId, movieId, content, score

#### ❌ 学生设计过程中的错误
**错误1**: allowNull/ENUM/DECIMAL 概念不清楚
- 学生问：allowNull是什么意思？ENUM是什么？
- 讲解后理解正确

**错误2**: MoviePersion 拼写错误（persion vs person）
- 反复出现3次，贯穿整个项目开发过程
- 最终在文件名、require路径、define名称中统一修正为 MoviePerson

**错误3**: Comment模型define名称写成了'User'
- 复制博客代码忘记改，导致导出名称冲突
- 纠正后改为'Comment'

**错误4**: score字段用INTEGER存小数
- 学生问：INTEGER能存小数吗？
- 讲解后改用DECIMAL(2,1)

### Part 2: G.4 电影管理系统 - 模型编写

学生亲自编写了5个Sequelize模型和关联关系：

**学生写对的部分**：
- 模型基本结构（define、字段、表名、时间戳）
- field选项做驼峰→蛇形映射（releaseDate → release_date）
- 一对多关联（hasMany/belongsTo）
- 多对多关联（两组一对多方式）

**需要纠正的部分**：
- User模型：squelize拼写错误、password长度STRING(50)太短、name的unique不合理、gender的allowNull
- Movie模型：缺少releaseDate字段、非必填字段设了allowNull:false
- Person模型：缺少gender字段、timestamps:false但保留了createdAt/updatedAt
- MoviePerson模型：拼写错误、缺少role字段、缺少主键id
- Comment模型：define名称写成'User'、score类型错误、content类型用STRING

### Part 3: G.4 电影管理系统 - Controller开发

学生主动提出："你把无意义的内容写好吧，我主要来写核心逻辑"
- AI编写了4个Controller（authController、movieController、personController、commentController）
- AI编写了基础设施（middleware、routes、app.js、server.js）
- 学生专注于模型层的设计和理解

### Part 4: G.5 项目部署

#### PM2学习
- 学生实际操作：pm2 start、pm2 list、pm2 logs
- 理解核心价值：自动重启 + 后台运行

#### 环境变量安全
- 学生理解：.env不提交到Git会暴露敏感信息

#### Nginx反向代理
- 学生理解：Nginx做端口转发（80 → 3001）

#### 部署流程
学生描述的完整流程：连接服务器 → 上传代码 → 安装依赖 → 配置环境变量 → 启动服务 → 配置Nginx → 测试

---

## 学习成果总结

### 新增主题
- G.4 电影管理系统（完整CRUD + 多对多中间表）
- G.5 项目部署（PM2、环境变量、Nginx、部署流程）

### 完成领域
- ✅ **G领域100%完成**（5/5全部完成）🎉

### 关键见解
- 多对多关系的标准实现方式（中间表）
- belongsToMany vs 两组一对多的选择
- PM2进程管理的必要性
- 生产环境的安全配置

---

## 表现评估

### 优势
- [x] 数据库设计能力强（能独立设计5张表和关联关系）
- [x] 主动提出改进学习方法（让AI写基础设施，自己写核心逻辑）
- [x] 诚实面对不足（不懂就问：allowNull、ENUM、INTEGER存小数）
- [x] 学习方法意识强（主动讨论"AI时代的学习方法"）

### 改进建议
- [ ] 注意拼写一致性（Person不是Persion）
- [ ] 复制代码后记得修改所有相关部分

---

**学习状态**: Node.js基础全部完成（90%），准备进入下一阶段！🚀
