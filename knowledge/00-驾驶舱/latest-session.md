# 最近会话

**最后更新**:2026-07-27(Day 13)

## Day 13 学习记录（2026-07-27）

**主题**：Spring AOP（面向切面编程）+ Bean 生命周期

### 课前小测（pre-session-review）

7 题结果：
- Q1 AOP（预测试）：不知道 → 正常，新内容
- Q2 Bean 生命周期（预测试）：用 Vue 生命周期类比 → 方向对但不同
- Q3 Maven 依赖调解：🔴 **高信心错误重犯**（"B1.0 层级更低"→ 正确是"最近者优先"）
- Q4 @RequestMapping URL：✅ 全对
- Q5 Node 事件循环：✅ 核心对
- Q6 Maven 本地仓库：✅ Day11 纠正成功
- Q7 this 绑定优先级：✅ 全对

### 学习成果

**AOP 核心（5 术语 → Express 中间件类比）**：
- Aspect（切面类）→ Pointcut（execution/@annotation 表达式）→ Advice（5 种时机）→ JoinPoint（被切的方法）→ Weaving（运行时动态代理）
- 5 种 Advice：@Before / @AfterReturning / @AfterThrowing / @After / @Around
- @Around 独有能力：控制 proceed() 调用（短路）+ 改参数 + 改返回值
- Pointcut 两种写法：execution（按包/类/方法名匹配）vs @annotation（注解驱动，更灵活）

**Bean 生命周期（10 步）**：
- 实例化 → 属性填充 → Aware 回调 → BPP.before → @PostConstruct → BPP.after（**AOP 代理在这里生成**）→ 就绪 → @PreDestroy → 销毁
- ⚠️ BPP 有 before + after 两个钩子，课后只记得 after（不对称认知）

**公司代码实战**：
- `LimitFrequencyAspect`：@Before + Guava RateLimiter + @annotation 驱动，IP/账号/方法维度限流
- `HttpSensitiveAspect`：@Around + RSA 解密入参 + 执行原方法 + 掩码脱敏出参 + Token 机制
- 掩码原理：正则捕获组保留头尾，中间换星号（手机号 138****5678）

**技能验证**：
- 写出 `@RateLimit` 注解 + `RateLimitAspect`（先 @Around 后改写 @Before + RateLimitException + @ControllerAdvice）
- code-reviewer 发现 3 高严重度 bug：
  1. computeIfAbsent key 只有 IP（不同 rate 的方法互相覆盖）→ 已修正为 `IP:方法名`
  2. return null 触发原始类型拆箱 NPE → @Before 方案间接解决
  3. String.isBlank() 是 Java 11 API，公司 JDK 8 不兼容 → **未修**
- interviewer 5 道追问：Q1-Q3/Q5 过关，Q4 部分（JDK vs CGLIB 没解释 Spring Boot 2.0 为什么改默认）

### 错题本

**错题 1：Maven 依赖调解规则（高信心错误重犯）**🔴
- 错误原文："B1.0，因为 B1.0 层级更低"
- 误解分析：把"距离根最近"理解成"层级更低"；Day 11 已错过一次，今天又错
- 正确：**最近者优先**——A→B(v1.0) 距离 1，A→C→B(v2.0) 距离 2，选 v1.0
- 归类：概念模糊（持续 2 次，标 Again，最高优先级复习）

**错题 2：BeanPostProcessor 只记 after 漏 before**
- 错误原文："BeanPostProcessor 是后置钩子的时候执行"
- 正确：BPP 有两个方法——postProcessBeforeInitialization（@PostConstruct 前）+ postProcessAfterInitialization（@PostConstruct 后，AOP 在这里）
- 归类：概念模糊

**错题 3：@After 与 @AfterReturning 时序混淆**
- 错误原文：把 @After 和 @AfterReturning/@AfterThrowing 放在同一层级
- 正确：@After 在 @AfterReturning / @AfterThrowing **之后**执行（真 finally 位置）
- 归类：概念模糊

**错题 4：isBlank() Java 版本不兼容（未自检）**
- code-reviewer 指出后仍未修正
- 归类：API 版本意识（Java 8 vs 11），需下次验证

### 遗留问题

- `isBlank()` Java 8 兼容修正（未修）
- `RateLimitException` 自定义异常类（未写出完整代码）
- Q4 JDK vs CGLIB 深度（Spring Boot 2.0 为什么改默认、private 方法失效）
- `@After` 时序概念已理解但未固化

### 下次学习计划

- Spring AOP 深入：JDK 动态代理 vs CGLIB 源码级理解、自调用陷阱验证
- 或 Spring 事务（@Transactional 与 AOP 的关系）
- 优先复习：Maven 依赖调解（Again，最高优先级）

---


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

### Day 5(2026-07-18)
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

### Day 6(2026-07-19)
- ✅ 异常体系:Throwable → Error / Exception;Checked vs Unchecked(JS 没有的核心概念)
- ✅ try-catch-finally(对比 JS:Java 按类型多 catch,JS 一个 catch 接所有)
- ✅ throw(动作)vs throws(声明,JS 没有);处理 Checked 两方式
- ✅ 自定义异常(`UserNotFoundException extends RuntimeException`)
- ✅ 实战:`testList` 的 `findByName` 从"返回 null"改造成"抛异常",Main try-catch 接住
- 📝 笔记:`Day6-异常处理.md`

**Day 6 复习 + 理解题成果**(纠正 + 答疑):
- 🔴 **高信心错误纠正**:Checked 异常不处理 → 误以为"能编译运行时报错",实际**编译就过不了**(这是 Checked 名字的由来)
- 💡 答疑:错误类型**不用全记**(记分类逻辑 + 6 个高频);工作中**很少手写异常类**(项目建几个 BusinessException 基类复用,`@ControllerAdvice` 全局接,日常只 `throw new`)
- ✅ catch 顺序、异常 vs null 的取舍,已理解

### Day 7(2026-07-20)⭐ 本次会话 - Week 2 启动
- ✅ **读公司代码**:精读 HelpCenterController(63行样本)+ PaperServiceImpl 异常处理
  - 分层隔离:Controller 看不到 Dao(CLAUDE.md"禁止跨层调用")
  - 统一返回:JsonResultHaveObj<{code,message,result}>
  - 异常实战:throw new ELPBizException + try-catch 包装 + @ControllerAdvice 全局接
- ✅ **Stream API**(Week 2 核心):4 步 stream→filter/map→collect,对标 JS 链式
- ✅ **惰性求值**:中间操作(filter/map/peek)不执行,终端操作(collect/findFirst/forEach)才触发
- ✅ **短路终端**:findFirst 找到就停,效率等同 for 循环(踩坑:peek 不打印)
- ✅ **groupingBy 分组**:一行实现分组,公司超常用(分+计/分+取属性)
- ✅ **Optional**:优雅解决 null,对标 JS `?.`/`??`;已用过的 findFirst 返回值就是 Optional
- ✅ **toString 重写**:解决 `User@30dae81` 打印问题(Object 三大方法:equals/toString/hashCode)
- ✅ 实战:UserServiceImpl 串联 OOP/接口/异常/Stream/Optional/Map,达企业级水准
- 📝 笔记:`Day7-读公司代码与Stream-API.md`

**Day 7 学习成果**:
- 💡 自主发现惰性求值陷阱:"Stream 版 filter 是不是多查询了?" → 深入理解惰性+短路
- 💡 自主踩坑 peek 不打印 → 巩固惰性求值理解
- ✅ JS→Java 映射能力极强(filter/map/groupingBy/Optional 一学就会)
- ✅ UserServiceImpl 已是企业级水准(findByName 用 orElseThrow、findNameById 用 orElse)

## 盲区清单(待巩固)

| 优先级 | 盲区 | 状态 |
|--------|------|------|
| **P0** | 字符串比较 `==` vs `equals` | 🔴 Day5 重犯,已纠正,需固化 |
| **P0** | 接口引用 vs 实现类引用("能不能跑") | 🔴 高信心错误,已纠正 |
| **P0** | `findByName` 找不到应返回 null(非 list[0]) | 🔴 逻辑 bug,已修正 |
| **P0** | Checked 异常不处理 = 编译错误(非运行时) | 🔴 Day6 高信心错误,已纠正 |
| **P1** | `printf` 第一参数是格式字符串(`%s`/`%d`/`%n`) | 🟡 已理解 |
| ~~P1~~ | ~~泛型的意义(类型安全/免强转)~~ | ✅ 已掌握 |
| **P2** | 接口运行时能力(DI / 动态分派) | ⚪ 待 Spring 阶段验证 |

## 下一步学习

### Week 1 剩余(接近收官)
- [x] **异常处理**:try-catch / throw / throws / 自定义异常(Day 6 完成)
- [x] **读公司代码**:HelpCenterController + PaperServiceImpl 异常处理(Day 7 完成)
- [ ] 输出《Java vs Node.js 语法对比.md》
- [ ] 周末总结:能讲清 Java 面向对象与 TS 的区别

### Week 2:Java 核心 API
- [x] **Stream API**(Day 7 启动):stream/filter/map/collect 三大核心已掌握
- [ ] Stream 进阶:forEach/count/sorted/reduce + Optional(findFirst/orElseThrow)
- [ ] 日期时间(LocalDate/DateTimeFormatter)
- [ ] 字符串操作(String/StringBuilder)
- [ ] 文件 I/O(Files/Path)

## Day 7(2026-07-20)⭐ 本次会话 - Week 2 启动
- ✅ **读公司代码**:HelpCenterController(63行精简Controller)
  - 看懂 @Controller/@RequestMapping/@Resource/@ResponseBody
  - 理解 JsonResultHaveObj 统一返回结构
  - 理解分层隔离(Controller 不见 Dao)
  - 理解 if(null != x) 空指针防御
- ✅ **公司异常处理**:PaperServiceImpl 的 throw new ELPBizException
  - 校验失败抛业务异常(带上下文)
  - try-catch 包装异常(技术异常→业务异常)
  - **全局异常处理器** @ControllerAdvice 统一接(业务代码只 throw,不用到处 try-catch)
- ✅ **Stream API**:三大核心 stream/filter/map/collect
  - 对比 JS array.filter().map(),几乎一一对应
  - 方法引用简写 User::getName
  - 实战:testList Main 里 filter+map+collect 一行搞定
- ✅ **惰性求值 + 短路终端**:中间操作不执行,终端操作才触发;findFirst 找到就停
  - 踩坑:peek 不打印(中间操作),正确用 forEach
  - 自主发现:"Stream 版 filter 是不是多查询了?" → 深入理解惰性+短路
- ✅ **groupingBy 分组**:一行实现分组(基础/分组计数/分组取属性),公司超常用
- ✅ **Optional**:优雅解决 null,对标 JS `?.`/`??`
  - map 链式取值 / orElse 默认 / orElseThrow 抛异常 / ifPresent 有值才执行
  - 已用过的 findFirst 返回值就是 Optional
- ✅ **toString 重写**:解决 `User@30dae81` 打印问题(Object 三大方法)
- ✅ 实战:UserServiceImpl 串联 OOP/接口/异常/Stream/Optional/Map,达企业级水准
- 📝 笔记:`Day7-读公司代码与Stream-API.md`

**Day 7 理解题成果**:
- ✅ Q1 为什么用接口类型(解耦)— 完全答对
- ⚠️ Q2 List泛型作用 — 方向对,补充"类型安全+免强转"
- ✅ Q3 null防御(避免NPE)— 理解正确
- ✅ Stream 对比 JS filter/map — JS基础扎实,Java 对应快
- ✅ peek vs forEach(惰性) — 小测全对
- ✅ Optional 练习(findNameById) — 一次写对

## 理解质量评估(累计)

| 阶段 | 评价 |
|------|------|
| Day 1-2 基础语法 | ✅ 优秀 |
| Day 3 面向对象/封装 | ✅ 优秀 |
| Day 4 继承/多态 | ✅ 优秀 |
| Day 5 接口/抽象类/集合 | ✅ 优秀(课前小测纠正了 2 个高价值盲区) |
| Day 6 异常处理 | ✅ 优秀(纠正 Checked 编译错误的高信心误解,理解了公司异常工作流) |
| Day 7 Stream/Optional/读公司代码 | ✅ 优秀(自主发现惰性求值陷阱,UserServiceImpl 达企业级水准) |

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

- `Java/Day1~Day5-*.md`(主笔记)
- `Java/INDEX.md`(导航)
- 代码:`projects/java/HelloWorld/src/test/com/fjyu/edu/`(animal / studyInterface / testList)

## 原有学习线(暂缓)

- RAG 项目体检 / 面试资产:暂缓
- Node.js 全栈复习:已完成基础,暂停
- 组件库 / 简历优化:待 Java 阶段四后重启

---

**当前状态**:Week 3 Day 11 完成(Maven 多模块项目),已理解父子继承与模块间依赖机制

---

## Day 11 学习记录(2026-07-24)

**主题**:Maven 多模块项目 - 父子继承与模块间依赖

### 课前复习（pre-session-review）

**5 题小测结果**:
1. Maven 本地仓库作用: ⚠️ 部分正确（AC，漏选 BD）
2. Maven 路径映射: ❌ 高信心错误（选 C，正确是 A）🔴
3. 父 pom 声明模块: ✅ 方向对（需要 `<modules>` 标签）
4. 模块间依赖声明: ✅ 基本正确（GAV 格式对）
5. parent 标签作用: ✅ 理解正确（继承父配置）

### 学习成果

**父 pom 的两个角色**:
- 聚合器（Aggregator）:用 `<modules>` 声明所有子模块，`<packaging>pom</packaging>`
- 配置继承者（Parent）:用 `<dependencyManagement>` 统一管理版本号

**关键标签对比**:
- `<dependencyManagement>`:只管理版本号，子模块要再声明（但不写 version）
- `<dependencies>`:真引入，所有子模块自动继承

**子模块 pom 结构**:
- `<parent>` 声明父项目（groupId/artifactId/version）
- 继承 groupId 和 version，只写 artifactId
- 依赖其他模块:用 GAV 坐标引用

**本地模块互相引用机制（纠正 Day 10 盲区）**:
1. 在父项目运行 `mvn clean install`
2. 每个模块编译后的 jar 安装到本地仓库（~/.m2/repository/）
3. 其他模块从本地仓库引用（**不需要发布到远程**）

**关键理解**:
- 本地模块和远程依赖都存在本地仓库
- Maven 不区分来源，只认 GAV 坐标
- 先在本地仓库找，找不到才从远程下载

**实战成果**:
- ✅ 创建 hello-api 子模块（接口定义）
- ✅ 创建 hello-impl 子模块（依赖 hello-api 的实现）
- ✅ 理解本地模块编译 → 本地仓库 → 引用的完整流程

### 错题本（高信心错误）🔴

**错题 1:Maven 本地仓库存储范围**
- 学生答案:AC（只选了本地模块 hello-maven 和 crowdsourced-new）
- 正确答案:ABCD（本地模块 + 远程依赖都在本地仓库）
- 误解:认为本地仓库只放本地编译的模块，远程依赖（commons-lang3/Spring）在别处
- 正确理解:`~/.m2/repository/` 是**所有 Maven 依赖的统一缓存中心**，本地编译的和远程下载的都存这里
- 分类:概念模糊

**错题 2:Maven 坐标路径映射规则（高信心错误）**🔴
- 学生答案:`~/.m2/repository/com.alibaba/fastjson-1.2.83.jar`（信心 4/5）
- 正确答案:`~/.m2/repository/com/alibaba/fastjson/1.2.83/fastjson-1.2.83.jar`
- 误解:认为 groupId 保持点号不分层，artifactId 直接拼到文件名
- 正确理解:
  - groupId 的每个点都是一层文件夹（`com.alibaba` → `com/alibaba/`）
  - artifactId 是文件夹（`fastjson/`）
  - version 也是文件夹（`1.2.83/`）
  - jar 在最深层（`fastjson-1.2.83.jar`）
- 记忆诀窍:Maven 坐标 = 目录树路径，每个点和字段都是一层文件夹
- 分类:**高信心错误**（hypercorrection 金矿，优先复习）

### 遗留问题

- 父 pom 的完整配置（还需补充 `<modules>` 和 `<packaging>`）
- 多模块项目的完整编译验证（mvn clean install）
- Maven 生命周期详解（clean/compile/package/install 区别）

### 下次学习计划

- 完成 hello-maven 多模块项目实战（补充父 pom、编译验证）
- Maven 生命周期详解
- 读公司项目的 pom.xml（crowdsourced 系列）

**主题**:Maven 基础 - 依赖管理 + 项目结构(Week 3 开始)

### 学习成果

**Maven 核心概念**:
- Maven 是什么:Java 构建工具 + 依赖管理器(对标 npm)
- 解决问题:自动下载 jar、版本管理、标准项目结构、多模块依赖
- Maven 坐标 GAV:GroupId(组织)/ArtifactId(项目名)/Version(版本号)

**标准项目结构**:
- src/main/java/(源代码)
- src/main/resources/(配置文件)
- src/test/java/(测试代码)
- target/(编译输出)
- pom.xml(核心配置,对标 package.json)

**Maven 本地仓库**:
- 位置:`C:\Users\fjyu9\.m2\repository\`
- 所有依赖按 groupId/artifactId/version 分层存储
- IDEA 从本地仓库加载 jar 到 classpath

**实战成果**:
- ✅ 创建第一个 Maven 项目(hello-maven)
- ✅ 引入 commons-lang3 依赖
- ✅ 使用 StringUtils.isBlank()(Day 8 想用但没库,现在能用了)
- ✅ 理解依赖下载 → 本地仓库 → IDEA 识别的完整流程

### 课前小测(pre-session-review)

**第 1 题:Maven 的作用** ✅
- 答案:B(管理第三方库的下载和版本)
- 信心:4/5
- 判定:正确且高信心 — 已验证

**第 2 题:pom.xml 是什么** ✅
- 答案:写各个插件和各种引用的版本
- 信心:4/5
- 判定:正确且高信心 — Node.js 经验迁移成功

**第 3 题:多模块依赖** ⚠️
- 答案:互相引用,但要发到线上然后拉取到本地使用
- 信心:2/5
- 判定:低信心错误 — 新盲区

### 错题本(迁移失败)

**KP**:Maven 多模块依赖机制

**学生原答案**:"互相引用,但要发到线上然后拉取到本地使用"

**误解分析**:
- 迁移失败:把 npm 发布到 npmjs.com 的流程错误类比到 Maven 多模块
- 混淆了"本地模块"和"远程第三方库"两种依赖方式

**正确理解**:
- 本地模块(同一个父项目下):编译后直接从本地仓库(~/.m2/repository/)引用,不经过远程
- 远程第三方库(Spring/MyBatis):才需要从 Maven Central 或公司私服下载
- 公司的 crowdsourced-new/new-web/new-api 三个模块是本地互相引用,不需要发布

**为什么会错**:
- npm 包必须发布到 npmjs.com 才能被其他项目引用(除非 npm link)
- Maven 多模块项目在本地就能互相引用,不需要发布

### 遗留问题

- Maven 多模块项目的 parent pom 怎么写
- 模块间依赖如何声明
- Maven 生命周期(clean/compile/package/install)的区别

### 下次学习计划

- Maven 多模块项目(parent pom、模块间依赖)
- 读公司项目的 pom.xml
- Maven 生命周期详解

---

## 复习线进度（并行，本设备）

**最后更新**：2026-07-25

### 当前进度
- JS/TS：✅ 9/9
- Vue3：✅ 9/9
- CSS：✅ 10/10（07-23 收官）
- Node.js：⏳ 2/?（事件循环 ✅、模块化 ✅）
- React/Next/AI：⬜

### 最近会话（07-25 Node 模块化）
- ✅ CJS vs ESM 6 个维度全部贯通
- ⚠️ await 同步性混淆持续（第三天），"返回 Promise ≠ 代码变微任务"需继续巩固
- 下一主题：Stream（流式处理）
