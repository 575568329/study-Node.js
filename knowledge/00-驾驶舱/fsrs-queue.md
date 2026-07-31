# FSRS 复习队列

> 三线共享的间隔复习调度表。**只管"下次何时复习谁"，不管掌握度判定**——掌握度由 kp-verify 的 SOLO 判。
> 读写者：`pre-session-review`（读→出题→重打分→临时重排）、`update-progress`（写→FSRS-lite 精修 D/S/下次到期，唯一权威重排者）。
> 算法：FSRS-lite（方向性简化，非精确 FSRS）🟠；数值是起步点，以实际复习体验校准。

## 列说明

| 列 | 含义 |
|---|---|
| KP | 知识点名 |
| 线 | Java / 复习 / CCode |
| 类型 | 原理 / 技能（决定复习活动：原理→默写，技能→再写代码） |
| D | 难度 1-10（越大越难） |
| S(天) | 稳定性：下次到期 ≈ 上次 + S |
| 上次 | 上次复习日期 |
| 下次到期 | 下次该复习的日期 |
| ratings | 最近几次评分（A=Again / H=Hard / G=Good / E=Easy），**左新右旧** |

## 队列

| KP | 线 | 类型 | D | S(天) | 上次 | 下次到期 | ratings |
|---|---|---|---|---|---|---|---|
| BFC（块格式化上下文） | 复习 | 原理 | 5.0 | 8 | 07-25 | 08-02 | G,G |
| Promise 手写 | 复习 | 技能 | 6.2 | 4 | 07-31 | 08-04 | G,A,G |
| Flex 布局（flex:1 三属性） | 复习 | 原理 | 5.0 | 8 | 07-24 | 08-01 | G,G,H,G |
| this 绑定优先级 | 复习 | 原理 | 4.0 | 10 | 07-30 | 08-19 | E,G,G,G |
| position 定位（5取值 + absolute锚点） | 复习 | 原理 | 5.5 | 8 | 07-25 | 08-02 | G,G,G |
| z-index 层叠上下文 | 复习 | 原理 | 5.5 | 4 | 07-28 | 08-01 | G,G,G |
| 重排重绘（reflow/repaint + 布局抖动） | 复习 | 原理 | 5.5 | 8 | 07-30 | 08-07 | G,G |
| CSS 单位（em/rem/vw/vh/%） | 复习 | 原理 | 5.0 | 8 | 07-30 | 08-07 | G,G |
| 1px 边框（DPR/物理像素） | 复习 | 原理 | 4.4 | 5 | 07-30 | 08-04 | G,G |
| Node 事件循环（阶段/nextTick/setImmediate vs setTimeout） | 复习 | 原理 | 4.8 | 6 | 07-30 | 08-05 | G,G,G,G,H,H |
| Node 模块化（CJS vs ESM/exports陷阱/循环引用/动态import） | 复习 | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |
| JWT 认证（签名机制/双token/主动失效难题） | 复习 | 原理 | 4.5 | 4 | 07-29 | 08-02 | G |
| CORS 跨域（简单请求 vs 预检请求/OPTIONS） | 复习 | 原理 | 4.5 | 4 | 07-29 | 08-02 | G |
| 异步错误处理（try-catch局限/await拉回/两大兜底钩子） | 复习 | 原理 | 5.0 | 3 | 07-30 | 08-02 | G |
| DB 连接池（池化/借还/池满策略/雪崩） | 复习 | 原理 | 5.0 | 3 | 07-30 | 08-02 | G |
| DB 事务（原子性/事务绑连接/rollback+throw铁律） | 复习 | 原理 | 5.5 | 3 | 07-30 | 08-02 | G |
| Maven 坐标 GAV | Java | 原理 | 4.4 | 4 | 07-23 | 07-27 | G |
| pom.xml 结构 | Java | 原理 | 4.4 | 4 | 07-23 | 07-27 | G |
| Maven 本地仓库机制 | Java | 原理 | 5.8 | 10 | 07-30 | 08-09 | G,G,G,H,H |
| Maven 标准目录结构 | Java | 技能 | 4.4 | 4 | 07-23 | 07-27 | G |
| Maven 路径映射规则 | Java | 原理 | 7.2 | 1 | 07-31 | 08-01 | H,G,A,G,A |
| 父 pom 的 modules 声明 | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| dependencyManagement 作用 | Java | 原理 | 4.4 | 4 | 07-28 | 08-01 | G,G |
| 模块间依赖 GAV 引用 | Java | 技能 | 4.4 | 4 | 07-24 | 07-28 | G |
| parent 继承机制 | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| Maven 生命周期三套 | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| Maven 阶段自动联动 | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| install vs deploy | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| jar vs war vs pom | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| 传递依赖 | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| exclusions 排除依赖 | Java | 原理 | 4.4 | 4 | 07-24 | 07-28 | G |
| 依赖调解规则（最近者优先）| Java | 原理 | 5.5 | 5 | 07-29 | 08-03 | G,G,A,H |
| mvn dependency:tree | Java | 技能 | 4.4 | 4 | 07-24 | 07-28 | G |
| Maven 命令行配置 | Java | 技能 | 4.4 | 4 | 07-24 | 07-28 | G |

### Spring 框架（Day 12 启动）

| Spring IoC（控制反转） | Java | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |
| Spring DI 依赖注入（字段/构造器/Setter） | Java | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |
| @Resource vs @Autowired | Java | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |
| Spring 容器机制（工厂+仓库/扫描注入流程） | Java | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |
| @RequestMapping URL 映射（类前缀+方法路径） | Java | 原理 | 5.5 | 5 | 07-29 | 08-03 | G,G,H |
| @GetMapping 家族（RESTful 语义） | Java | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |
| @ResponseBody 返回 JSON | Java | 原理 | 4.4 | 10 | 07-29 | 08-08 | G,G |

### AOP + Bean 生命周期（Day 13）

| AOP 5种Advice（时序/@Around控制权/选型决策） | Java | 原理 | 5.5 | 4 | 07-27 | 07-31 | G |
| Bean 生命周期 + BPP与AOP关系 | Java | 原理 | 5.5 | 3 | 07-28 | 07-31 | G,H |
| @Around vs @Before 控制流差异（proceed/短路/改返回值） | Java | 原理 | 5.0 | 4 | 07-27 | 07-31 | G |
| AOP 代理机制（JDK动态代理/CGLIB/自调用陷阱） | Java | 原理 | 5.5 | 4 | 07-28 | 08-01 | G,A,H |
| @Around 切面实战（限流/加解密/注解驱动） | Java | 技能 | 6.5 | 2 | 07-28 | 07-31 | G,H |

### Spring 事务（Day 14）

| @Transactional 本质（AOP事务切面begin/commit/rollback） | Java | 原理 | 5.5 | 5 | 07-29 | 08-03 | G,H |
| 事务回滚规则（RuntimeException回滚/Checked不回滚/rollbackFor） | Java | 原理 | 5.5 | 5 | 07-29 | 08-03 | G,H |
| 事务自调用失效（this绕过代理，同AOP自调用根因） | Java | 原理 | 5.5 | 4 | 07-28 | 08-01 | G,A |
| 事务传播行为（REQUIRED共用 vs REQUIRES_NEW独立） | Java | 原理 | 5.5 | 4 | 07-28 | 08-01 | G,A |
| 异常被catch吞掉导致不回滚（必须rethrow） | Java | 原理 | 5.5 | 5 | 07-30 | 08-04 | G,H |
| @Service vs @Autowired（存Bean vs 取Bean） | Java | 原理 | 4.5 | 4 | 07-28 | 08-01 | G |

### MyBatis 入门（Day 16）

| MyBatis 本质（解决JDBC样板/SQL外置/自动映射/动态代理） | Java | 原理 | 4.5 | 4 | 07-30 | 08-03 | G |
| Mapper 接口+XML 绑定（namespace=接口全限定名/id=方法名=唯一StatementID） | Java | 原理 | 5.0 | 4 | 07-30 | 08-03 | G |
| MyBatis 动态代理（接口无实现/代理"没里子"自己执行SQL，区别于AOP"有里子"） | Java | 原理 | 5.5 | 4 | 07-30 | 08-03 | G |

### MyBatis 动态 SQL + 安全（Day 17）

| 动态 SQL <if> 标签（条件拼接/test 判空） | Java | 原理 | 4.5 | 4 | 07-31 | 08-04 | G |
| 动态 SQL <where> 智能 WHERE（去第一个AND/空不加WHERE） | Java | 原理 | 4.8 | 4 | 07-31 | 08-04 | H,G |
| 动态 SQL <choose>/<when>/<otherwise>（if-else分支） | Java | 原理 | 4.5 | 4 | 07-31 | 08-04 | G |
| #{} vs ${}（预编译防注入 vs 字符串拼接/SQL注入原理） | Java | 原理 | 6.0 | 4 | 07-31 | 08-04 | G |
| ${} 白名单校验（表名列名必须白名单防注入） | Java | 原理 | 5.5 | 4 | 07-31 | 08-04 | G |
| @Param 参数命名（编译丢参数名→手动贴标签，多参数必写） | Java | 原理 | 4.5 | 4 | 07-30 | 08-03 | G |
| resultMap vs resultType（自定义映射/列名≠属性名/嵌套 vs 简单类型自动映射） | Java | 原理 | 4.5 | 4 | 07-30 | 08-03 | G |
| 动态SQL foreach 批量插入（一条SQL多行，非多次插入/性能铁律） | Java | 原理 | 5.0 | 4 | 07-30 | 08-03 | G |

### Java 线历史补齐（Day 1-7 基础 + Day 10 Maven）

| Java 基础语法（变量、类型、流程控制） | Java | 原理 | 4.5 | 4 | 07-17 | 07-21 | G |
| Java 方法与重载（方法签名） | Java | 原理 | 4.5 | 4 | 07-17 | 07-21 | G |
| Java 数组与 ArrayList（固定 vs 动态） | Java | 原理 | 5.0 | 4 | 07-17 | 07-21 | G |
| Java 基本类型与包装类（自动装箱/拆箱） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 类与对象、封装（private/getter/setter） | Java | 原理 | 5.0 | 4 | 07-17 | 07-21 | G |
| Java 继承、super、方法重写（@Override） | Java | 原理 | 5.0 | 4 | 07-17 | 07-21 | G |
| Java 多态（向上转型、编译看左运行看右） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 接口、抽象类（is-a vs can-do） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 集合框架（List/Map/Set/泛型） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 异常处理（try-catch/throw/throws/Checked vs Unchecked） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java Stream API（map/filter/collect/惰性求值） | Java | 原理 | 5.5 | 4 | 07-20 | 07-24 | G |
| Java Optional（orElse/orElseThrow/?.对比） | Java | 原理 | 5.0 | 4 | 07-20 | 07-24 | G |
| Java 面向接口编程（依赖倒置原则 DIP） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |

### 复习线历史补齐（JS/TS 9/9 + Vue3 9/9 + CSS 10/10）

| JS/TS 闭包 | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS Vue3 ref 原理（类+get/set） | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS React useState 闭包陷阱 | 复习 | 原理 | 5.0 | 4 | 07-15 | 07-27 | G |
| JS/TS 原型与原型链 | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS new 的 4 步 | 复习 | 原理 | 4.5 | 4 | 07-15 | 07-27 | G |
| JS/TS 事件循环（宏任务/微任务） | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS TS interface vs type、泛型 | 复习 | 原理 | 5.0 | 4 | 07-15 | 07-27 | G |
| Vue3 ref vs reactive + 为什么 .value | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |
| Vue3 为什么用 Proxy 替代 defineProperty | 复习 | 原理 | 5.0 | 4 | 07-20 | 07-27 | G |
| Vue3 依赖收集（track/trigger） | 复习 | 原理 | 6.0 | 4 | 07-20 | 07-27 | G |
| Vue3 Composition API vs Options API | 复习 | 原理 | 5.0 | 4 | 07-20 | 07-27 | G |
| Vue3 Composable + computed/watch/watchEffect | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |
| Vue3 生命周期钩子 | 复习 | 原理 | 4.5 | 4 | 07-20 | 07-27 | G |
| Vue3 组件通信（父子 + 跨层级） | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |
| Vue3 v-model 原理 | 复习 | 原理 | 5.0 | 4 | 07-20 | 07-27 | G |
| Vue3 v-if/v-show + key + nextTick | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |

> 真实 KP 由 `update-progress` 在"记录进度"时写入；`pre-session-review` 在"开始今日学习"时读取并重打分。
> 2026-07-22：pre-session-review 首填 4 行（队列原为空）+ update-progress 精修 + 新增 position/z-index 2 行。
> Flex 因课前小测 Hard（值记得、三属性名淡忘）→ S 缩短至 2 天，07-24 快速复查。
> 2026-07-23：补齐 JS/TS 7 题 + Vue3 8 题 + Java 13 题（历史学习，初始 Good，S=4）+ CSS 收官 3 题 + Maven 4 题。总计 50 KP。注意：this 绑定、Promise 手写、position、z-index 已在今日课前小测复查，以上次为准。
> 2026-07-24（Day 11）：新增 9 个 Maven KP（生命周期/exclusions/依赖调解等）。**依赖调解规则**曾误认为"最高版本"→纠正为"最近者优先"，标 Hard 重点复习。
> 2026-07-24（Node 线启动）：新增 Node 事件循环 KP。课前 Flex 再次过关（H→G，S 延至 8 天）。Node 事件循环机制吃透，确定性判断全对；await 同步性、综合时序题初错已纠正。
> 2026-07-25（Node 模块化）：新增 Node 模块化 KP。await 同步性混淆再度出现（"返回 Promise ≠ 代码变微任务"），事件循环 KP 追加 H。模块化 6 个子概念贯通（exports 陷阱/JSON导入/循环引用/动态import/后缀优先级/createRequire）。
> 2026-07-27（Day 13 Spring AOP）：新增 5 个 AOP/Bean 生命周期 KP。@Around 切面实战标 Hard（3 高严重度 bug：key 设计自相矛盾/原始类型 NPE/isBlank Java 11→8 不兼容）。Bean 生命周期 BPP before/after 只记一半标 Hard。AOP 代理机制 Q4 部分答对标 Hard。@RequestMapping URL 映射课前 Hard→G（已巩固）。依赖调解高信心错误重犯→A（最优先复习）。
> 2026-07-28（Day 14 Spring 事务）：课前小测昨天 2 盲区翻盘（依赖调解 A→G、BPP H→G）。新增 6 个事务 KP。**验证结果差（SOLO 单点2/5，多个 Again）**：事务自调用/传播行为 Q3/Q4 都滑到 @After Advice，暴露 AOP 代理机制（Day13）没打通 → **AOP 代理机制 KP 降级 A/H、S 砍到 1**，成最高优先级重学。诊断：Day13 AOP 过载学虚拖累 Day14。教学法已调整（feedback-cognitive-load-chunking）。下次开半天专讲"代理对象 vs this"主线，收口 AOP自调用=事务自调用。
> 2026-07-28（Day 14.5 AOP 代理机制重学）：用纯 Java JDK 动态代理示例（Proxy.newProxyInstance / InvocationHandler / method.invoke）讲透"代理对象 vs 原始对象"。核心打通：① 代理=$Proxy0运行时生成的新类 ② @Autowired取容器=代理对象 ③ this=原始对象 ④ this.method()绕过代理→失效 ⑤ 注入的代理.method()走代理→生效。验证 Q1/Q2 全对（判断3场景事务生效+修复自调用失效）。AOP代理机制 A→G、事务自调用 A→G、传播行为 A→G（3个昨天 Again 今天翻盘）。
> 2026-07-29（Node.js 复习：JWT + CORS）：课前小测 9 个到期 KP，3 个翻盘（Node事件循环 H→G、事务@Transactional H→G、Maven依赖调解 A→G 高信心错误终于彻底纠正）。新学 JWT 认证（手写 sign/verify 实现、HMAC签名机制、双token机制、主动失效难题4种解法）+ CORS 跨域（简单请求 vs 预检请求、OPTIONS 方法、实战观察预检流程、修复 OPTIONS 路径匹配 bug）。Node.js 复习线 6/? 完成。
> 2026-07-30（Day 16 MyBatis 入门）：课前小测 8 题。**Q1 Spring事务catch吞异常翻盘 H→G**（Day14 盲区攻克）；**Q2 Maven 路径映射第 3 次高信心错误**（漏 artifactId 层 + 文件名格式错）→ 降 A、S 砍到 1、07-31 紧急复查；Q3 CSS单位/Q4 重排重绘/Q5 this绑定全对（this 升 E）；Q6 跨线 @Around vs Koa洋葱 核心答对（新测 G）。新学 MyBatis 6 个 KP（本质/Mapper绑定/动态代理"没里子"/@Param/resultMap vs resultType/foreach批量插入）。读公司代码 TopicRecordMapper（接口+XML 对照），发现 `delete *` 语法 bug（标记未改）。理解检查两轮全过。核心打通：MyBatis 动态代理与 Spring AOP 同底层技术、区别在"有无真实对象"。
> 2026-07-31（Day 17 MyBatis 动态 SQL + 安全）：课前小测 3 题（精准打击高优先级盲区）。**Q1 Maven 路径映射第 4 次错但接近**（框架全对：groupId每个点一层+artifactId层+version层+文件名格式，但 artifactId 截断 `mysql-connector-java` 写成 `mysql-connector`）→ H，08-01 必测；Q2 Promise 手写思路全对 A→G；Q3 MyBatis vs AOP 代理答偏到用途（漏"有里子/没里子"核心）→ A。新学 MyBatis 动态 SQL 5 个 KP：`<if>` 条件拼接（`test` 判空 `!= null and != ''`）、`<where>` 智能 WHERE（去第一个 AND、空不加 WHERE）、`<choose>`/`<when>`/`<otherwise>`（if-else 分支）、`#{}` vs `${}`（预编译防注入 vs 字符串拼接/SQL 注入原理）、`${}` 白名单校验（表名/列名必须白名单）。理解检查两轮：动态 SQL 为何需要通过（用户可选条件拼接场景）、`#{}` 防注入原理全对（SQL 结构固定，参数只能是值）。公司代码：发现 `ORDER BY ${column}` 历史遗留注入风险。核心打通：预编译让参数和 SQL 分离，`${}` 只用于表名/列名且必须白名单。
