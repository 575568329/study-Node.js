# 待办事项

**最后更新**：2026-07-14

## 当前主线

**方向调整**：从 Node.js 全栈转向 Java 全栈（公司技术栈是 Java）

**学习理念**：稳扎稳打、理解原理、能讲清楚为什么（不速成）

---

## P0：Java 学习（当前主线）

### 第 1 周：Java 基础语法（立即开始）

- [ ] 安装 Java 开发环境（JDK 8 + Maven + IntelliJ IDEA）
- [ ] 学习 Java 基础语法（变量、类型、流程控制）
- [ ] 学习面向对象（类、对象、继承、接口、多态）
- [ ] 学习集合框架（List、Set、Map、泛型）
- [ ] 学习异常处理（try-catch、自定义异常）
- [ ] 读公司代码：找 3 个 Controller 接口，理解业务逻辑
- [ ] 输出《Java vs Node.js 语法对比.md》
- [ ] 周末总结：能解释 Java 面向对象与 TS 的区别

### 第 2 周：Java 核心 API

- [ ] Stream API（map、filter、collect）
- [ ] 日期时间（LocalDate、DateTimeFormatter）
- [ ] 字符串操作（String、StringBuilder、正则）
- [ ] 文件 I/O（Files、Path、BufferedReader）
- [ ] 读公司代码：找 3 处日期/字符串处理
- [ ] 输出《Java 常用 API 速查.md》

### 第 3 周：Maven 与工程结构

- [ ] Maven 基础（pom.xml、依赖管理、生命周期）
- [ ] 多模块项目（parent pom、模块依赖）
- [ ] 包管理（package、import、访问控制）
- [ ] 日志框架（Logback、slf4j）
- [ ] 读懂公司项目的 pom.xml
- [ ] 画出公司项目的模块依赖图
- [ ] 输出《公司 Java 项目结构分析.md》
- [ ] 阶段验收：能向新人讲解公司模块划分逻辑

### 第 4-7 周：Spring 框架核心

- [ ] IoC 容器与依赖注入
- [ ] Bean 生命周期
- [ ] XML 配置 vs 注解配置
- [ ] SpringMVC（Controller、Service、Repository）
- [ ] 请求映射与参数绑定
- [ ] 事务管理与 AOP
- [ ] 全局异常处理
- [ ] 读懂公司 Spring 配置文件
- [ ] 画出一个接口的完整调用链
- [ ] 输出《Spring 核心原理总结.md》
- [ ] 阶段验收：能独立搭建传统 Spring 项目

### 第 7-10 周：数据库与 MyBatis

- [ ] SQL 基础（CRUD、Join、子查询、索引）
- [ ] MyBatis 核心（Mapper 接口、XML 映射）
- [ ] 动态 SQL（if、foreach、choose）
- [ ] Spring + MyBatis 事务协调
- [ ] 读懂公司 MyBatis Mapper
- [ ] 写公司业务的 5 个查询
- [ ] 输出《MyBatis 原理与实践.md》

### 第 9-14 周：微服务（Dubbo + Spring Boot）

- [ ] RPC 原理（Dubbo vs HTTP）
- [ ] Dubbo 核心（服务注册、服务发现）
- [ ] Zookeeper 注册中心
- [ ] 负载均衡与容错
- [ ] Spring Boot 入门（自动配置、Starter）
- [ ] Spring Boot Web（@RestController、快速开发）
- [ ] Spring Cloud 对比（Eureka、OpenFeign、Gateway）
- [ ] 理解公司 Dubbo 配置
- [ ] 画出公司微服务架构图
- [ ] 对比 Dubbo vs Spring Cloud
- [ ] 输出《Dubbo 微服务架构笔记.md》
- [ ] 输出《传统 Spring vs Spring Boot 对比.md》

### 第 13-17 周：运维基础

- [ ] Linux 常用命令（30 个必会命令）
- [ ] Linux 进程管理（ps、kill、top）
- [ ] Linux 网络工具（curl、telnet、netstat）
- [ ] 在服务器上部署 Java 应用
- [ ] Docker 基础（镜像、容器、仓库）
- [ ] Dockerfile 编写（构建 Spring Boot 镜像）
- [ ] Docker Compose（多服务编排）
- [ ] CI/CD 概念（理解流程）
- [ ] Jenkins Pipeline（看懂配置）
- [ ] K8s 概念了解（可选）
- [ ] 容器化自己的项目
- [ ] 输出《Linux 运维速查表.md》
- [ ] 输出《Docker 实战指南.md》
- [ ] 输出《DevOps 工具链笔记.md》

### 第 17-21 周：实战项目（Java 版 RAG）

- [ ] 项目搭建（Spring Boot + MyBatis-Plus）
- [ ] 文档上传与解析（PDF/DOCX/TXT）
- [ ] 文本切片与向量化
- [ ] 向量存储与检索（Chroma）
- [ ] RAG Pipeline（检索 + LLM 生成）
- [ ] SSE 流式输出
- [ ] 对话历史管理
- [ ] 知识库管理
- [ ] Docker 容器化部署
- [ ] 输出完整 README
- [ ] 输出架构设计文档
- [ ] 录制项目演示视频
- [ ] 准备面试讲稿（3 分钟 + 20+ 追问）

---

## P1：原有 Node.js 线（暂缓）

### RAG 主项目体检（暂缓）

- [ ] 补 `rag-docs-assistant` README
- [ ] 补 RAG 项目架构图
- [ ] 准备演示文档和问题
- [ ] 写 3 分钟讲稿
- [ ] 写 15-30 个追问答案

### 组件库开发（暂缓）

- [ ] 补 StreamingText、ErrorStatePanel 等组件
- [ ] 补组件 API 文档
- [ ] 准备组件库讲稿

### 全栈追问补强（已完成部分，暂停）

- [x] Node.js 事件循环复习
- [x] Node.js Stream 与背压复习
- [x] Node.js 异步与错误处理复习
- [x] Node.js HTTP 与认证跨域复习
- [ ] Next.js Route Handler 落地
- [ ] 文件上传接口链路
- [ ] SSE 流式响应

### 简历落地（待 Java 学习到阶段四后重启）

- [ ] 检查并完善 `简历相关/resume-web` 简历内容
- [ ] 从 `docs/` 面试资产中提炼简历 bullet
- [ ] 导出 PDF 并检查分页
- [ ] 准备 Java 全栈版自我介绍

---

## P2：工作项目材料（暂缓）

- [ ] 准备讯飞澳门项目讲稿和追问清单
- [ ] 准备地灾 GIS 项目讲稿和追问清单
- [ ] 补齐工作项目量化信息

---

## 已完成

- [x] Node.js、TypeScript、Vue3、React、Next.js、AI 基础、LangChain.js 学习主线
- [x] LangGraph.js 核心主题 12/12
- [x] 简历相关文件夹移动
- [x] 项目主线切换为项目证明与面试准备
- [x] 新增后续工作入口文档
- [x] RAG 主项目构建修复
- [x] RAG 数据一致性修复
- [x] RAG 对话历史闭环
- [x] 文档按项目归档
- [x] 组件库脚手架（独立仓库）
- [x] 制定 Java 学习路径（稳扎稳打版）
- [x] 输出技能优先级判断（运维技能版）

---

## 技术债 / 清理项

- [ ] 确保 `.env` 不提交
- [ ] 检查 `AGENTS.md`、`CLAUDE.md` 描述同步
- [ ] 清理不再需要的历史草稿

---

## 学习原则（重要）

1. **不速成**：理解原理 > 赶进度
2. **不焦虑**：按需学习，够用就行
3. **对比学习**：利用 Node.js 基础，对比理解 Java
4. **三遍学习法**：跑通 → 理解 → 应用
5. **边学边问**：主动理解"为什么这么设计"
6. **实战驱动**：围绕公司代码和简历项目
7. **每周总结**：输出文档，检验理解深度

---

**最后更新**：2026-07-14
**当前状态**：准备开始 Java 第 1 周学习
