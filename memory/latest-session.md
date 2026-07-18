# 最近会话

**最后更新**:2026-07-18(Day 5)

## 当前上下文

- 项目:`study-Node.js`(学习/求职准备工作区)
- **主线**:Java 全栈学习(2026-07-14 从 Node.js 转向 Java)
- 原因:公司后端技术栈是 Java(传统 SSM + Dubbo 微服务)
- 目标:能读懂、维护、参与公司后端代码,最终具备真全栈能力
- 时间窗口:约 1 个月后面临裁员风险
- 学习策略:**稳扎稳打、理解原理、能讲清楚为什么**(不速成)

## 公司技术栈分析

### 后端架构
- **框架**:Spring 3.2.6(传统 SSM,非 Spring Boot),XML 配置为主
- **RPC 框架**:Dubbo + Zookeeper
- **ORM**:MyBatis(推测)
- **数据库**:MySQL + MongoDB
- **缓存**:Redis(Redisson)
- **JDK**:Java 8
- **构建工具**:Maven 多模块

### 项目结构
```
crowdsourced-new/          # 服务层(service / impl)
crowdsourced-new-web/      # Web 层(Controller)
crowdsourced-new-api/      # API 定义
```
典型分布式微服务,模块按 API/Service/Impl 分层,Dubbo 做服务调用。

## 学习进度(Week 1)

### Day 1(2026-07-14)
- ✅ 环境搭建:JDK 8 Corretto 1.8.0_492 + IDEA
- ✅ Hello World + 编译执行理解
- ✅ 基本类型、流程控制、类型转换
- ⚠️ 已纠正:"if 必须是 boolean 类型"、`byte` 是二进制数据、`Double` 是包装类

### Day 2(2026-07-15)
- ✅ 方法定义与重载(方法签名)
- ✅ 数组与 ArrayList(固定 vs 动态)
- ✅ 基本类型与包装类(Integer/Character 命名)、自动装箱/拆箱
- 📝 笔记:`Day2-方法与数组.md`

### Day 3(2026-07-16)
- ✅ 类与对象、构造方法 vs 普通方法
- ✅ 封装:private + getter/setter + 校验
- ✅ main 入口、包与 import
- 📝 笔记:`Day3-类与对象封装.md`

### Day 4(2026-07-17)
- ✅ 继承(extends)、super 两个作用
- ✅ 方法重写(@Override)、重写 vs 重载、两同两小一大
- ✅ 多态(向上转型、编译看左运行看右)、feedAll 实战
- 📝 笔记:`Day4-继承与多态.md`

### Day 5(2026-07-18)⭐ 本次会话
- ✅ 接口(interface)+ 抽象类(abstract class)
- ✅ 抽象类 vs 接口对照(is-a vs can-do)
- ✅ 面向接口编程(Service/Impl 分层 = 公司风格)
- ✅ 集合框架:泛型、List、Map、Set(全部对标 JS Array/Object/Set)
- ✅ 实战:`testList` 包(UserService 接口 + UserServiceImpl 实现,Map 存储)
- 📝 笔记:`Day5-接口抽象类与集合框架.md`

**Day 5 课前小测成果**(5 题,关键纠正):
- 🔴 **高信心错误纠正**:`AnimalServiceImpl s = new AnimalServiceImpl()` 误以为"不能跑"→ 实际能跑,区别在面向接口 vs 面向实现
- 🔴 **Day1 易错点重犯**:字符串 `==` vs `equals`(Map 版 UserService 已修正)
- ✅ 多态/抽象类不能 new(Q5 全对)
- ✅ 抽象类 vs 接口选择(Q4 全对,口诀:is-a 抽象类 / can-do 接口)

## 盲区清单(待巩固)

| 优先级 | 盲区 | 状态 |
|--------|------|------|
| **P0** | 字符串比较 `==` vs `equals` | 🔴 Day5 重犯,已纠正,需固化 |
| **P0** | 接口引用 vs 实现类引用("能不能跑") | 🔴 高信心错误,已纠正 |
| **P0** | `findByName` 找不到应返回 null(非 list[0]) | 🔴 逻辑 bug,已修正 |
| **P1** | `printf` 第一参数是格式字符串(`%s`/`%d`/`%n`) | 🟡 已理解 |
| ~~P1~~ | ~~泛型的意义(类型安全/免强转)~~ | ✅ 已掌握 |
| **P2** | 接口运行时能力(DI / 动态分派) | ⚪ 待 Spring 阶段验证 |

## 下一步学习

### Week 1 剩余
- [ ] **异常处理**:try-catch-finally、NullPointerException(已撞见)、自定义异常
- [ ] 读公司代码:找 3 个 Controller 接口 + 3 处 `List<>`/`Map<>` 用法
- [ ] 输出《Java vs Node.js 语法对比.md》
- [ ] 周末总结:能讲清 Java 面向对象与 TS 的区别

### Week 2:Java 核心 API
- Stream API(map/filter/collect)、日期时间、字符串、文件 I/O

## 理解质量评估(累计)

| 阶段 | 评价 |
|------|------|
| Day 1-2 基础语法 | ✅ 优秀 |
| Day 3 面向对象/封装 | ✅ 优秀 |
| Day 4 继承/多态 | ✅ 优秀 |
| Day 5 接口/抽象类/集合 | ✅ 优秀(课前小测纠正了 2 个高价值盲区) |

**学习态度**:主动思考、深入提问、善于对比 JS、能自我总结、纠正后立刻应用(testList 从 List 改 Map 版,equals/判空一次到位)。

## 运维技能优先级

- **P0**(70% 时间):Java + Spring + MyBatis + MySQL + RESTful + Git
- **P1**(20% 时间):Linux(30 命令)、Docker、CI/CD 概念
- **P2**(10% 时间):K8s(可选,入职后再学)

## 验收标准(每阶段自测)

- 第 3 周:能读懂公司 Controller、解释集合框架设计、对比 Java vs Node.js 类型系统
- 第 7 周:读懂 Spring 配置、解释 IoC/DI/AOP、画接口调用链
- 第 10 周:读懂 MyBatis Mapper、写动态 SQL、解释事务传播
- 第 14 周:读懂 Dubbo 配置、解释 RPC、画微服务架构图
- 第 17 周:Linux 部署 Java 应用、Docker 容器化、排查线上问题
- 第 21 周:完整 Java 项目(简历)、讲清技术选型、答 20+ 面试追问

## 学习节奏

- 工作日 4-5h:上午学新概念 → 下午读公司代码 → 晚上写代码+笔记
- 周六集中做 demo,周日上午复习+输出总结

## 笔记位置

- `study-notes/Java/Day1~Day5-*.md`(主笔记)
- `study-notes/Java/INDEX.md`(导航)
- 代码:`projects/java/HelloWorld/src/test/com/fjyu/edu/`(animal / studyInterface / testList)

## 原有学习线(暂缓)

- RAG 项目体检 / 面试资产:暂缓
- Node.js 全栈复习:已完成基础,暂停
- 组件库 / 简历优化:待 Java 阶段四后重启

---

**当前状态**:Week 1 Day 5 完成,接口/抽象类 + 集合框架掌握,下一步异常处理
