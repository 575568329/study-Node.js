# Java 学习笔记导航

**创建时间**：2026-07-14
**当前阶段**：阶段一 - Java 基础（Week 1）

---

## 📚 知识点总结

### A - 基础语法
- [Day1 - Java程序结构与基础语法](./01-知识点总结/A-基础语法/Day1-Java程序结构与基础语法.md)
- [Day2 - 方法与数组](./Day2-方法与数组.md)
- [Day3 - 类与对象封装](./Day3-类与对象封装.md)
- [Day4 - 继承与多态](./Day4-继承与多态.md)
- [Day5 - 接口抽象类与集合框架](./Day5-接口抽象类与集合框架.md) ⭐ 含课前小测盲区纠正
- [Day6 - 异常处理](./Day6-异常处理.md)（try-catch / throw / 自定义异常）

### B - 核心 API（Week 2）
- [Day7 - 读公司代码与Stream API](./Day7-读公司代码与Stream-API.md) ⭐ Stream/groupingBy/Optional + 公司代码精读
- [Day8 - 日期时间API](./Day8-日期时间API.md) LocalDate/LocalDateTime/格式化/间隔计算
- [Day9 - 文件IO](./Day9-文件IO.md) Files/Path/BufferedReader/try-with-resources

### C - Maven 工程结构（Week 3）
- [Day10 - Maven基础](./Day10-Maven基础.md) 依赖管理/坐标GAV/标准目录/本地仓库
- [Day11 - Maven多模块与生命周期](./Day11-Maven多模块与生命周期.md) ⭐ 父子继承/生命周期/传递依赖/exclusions/读公司pom

### D - Spring 框架（Week 4）
- [Day12 - Spring入门 IoC/DI/MVC](./Day12-Spring入门-IoC-DI-MVC.md) ⭐ IoC控制反转/DI三种注入/@RequestMapping路由
- [Day13 - Spring AOP与Bean生命周期](./Day13-Spring-AOP与Bean生命周期.md) ⭐ AOP 5种Advice/Bean生命周期10步/BPP与代理/限流+加解密实战
- [Day14 - Spring事务 @Transactional](./Day14-Spring事务-Transactional.md) ⭐ 事务=AOP切面/回滚规则/三大失效场景/传播行为（Day14.5 重学AOP代理后已打通）
- [Day16 - MyBatis 入门](./Day16-MyBatis入门.md) ⭐ 解决JDBC痛点/Mapper接口+XML绑定/动态代理"没里子"/@Param/resultMap vs resultType/foreach批量插入/读公司Mapper
- [Day17 - MyBatis 动态 SQL 与安全](./Day17-MyBatis动态SQL与安全.md) ⭐ `<if>`/`<where>`/`<choose>`条件查询/`#{}`防注入 vs `${}`字符串拼接/SQL注入原理/白名单校验
- [Day18 - MyBatis 缓存机制](./Day18-MyBatis缓存机制.md) ⭐ 一级缓存(SqlSession级)/二级缓存(Mapper级/跨Session共享)/清空场景/适用场景判断/公司项目几乎不用
- [Day19 - MyBatis 动态 UPDATE 与关联查询](./Day19-MyBatis动态UPDATE与关联查询.md) ⭐ `<set>`标签/OGNL假值陷阱(0当false)/ResultMap嵌套查询vs嵌套结果/N+1问题/LEFT JOIN vs INNER JOIN
- [Day20 - MyBatis 与 Spring 事务协调](./Day20-MyBatis与Spring事务协调.md) ⭐ ThreadLocal绑连接/嵌套事务REQUIRED/rollback-only机制

### E - 微服务与分布式（阶段四）
- [Day21 - Dubbo RPC 微服务入门](./Day21-Dubbo-RPC微服务入门.md) ⭐ RPC本质(动态代理藏网络)/RPC vs HTTP/三角关系(ZK只启动订阅不参与调用)/公司XML配置精读/重试与幂等(retries=0)
- [Day22 - Dubbo 真实调用链分析](./Day22-Dubbo真实调用链分析.md) ⭐ Controller注入代理/14步调用链/@Resource vs @Autowired/跨服务事务无法共享(不同进程不同Connection)
- [Day23 - 分布式事务入门](./Day23-分布式事务入门.md) ⭐ 2PC(强一致阻塞)/TCC(Try冻结+Confirm+Cancel)/Saga(正向执行+补偿)/MQ本地消息表(异步首选)/选型铁律
- [Day24 - Zookeeper 注册中心原理](./Day24-Zookeeper注册中心原理.md) ⭐ 树形结构/临时节点(Session断自动删)/Watcher变更通知/ZK挂了Dubbo照常调用(本地缓存+长连接)
- [Day25 - Spring Boot 自动配置](./Day25-SpringBoot自动配置.md) ⭐ 自动配置原理(@ConditionalOnXxx条件注解)/Starter依赖/排除自动配置/传统XML vs Spring Boot对比
- [Day26 - Spring Boot Web](./Day26-SpringBootWeb.md) ⭐ @RestController(@Controller+@ResponseBody)/@GetMapping简写/内嵌Tomcat/main()直接启动
- [Day27 - Spring Cloud vs Dubbo](./Day27-SpringCloud-vs-Dubbo.md) ⭐ 两条微服务路线对比/RPC vs HTTP REST/选型判断/面试回答策略/RPC同步vs MQ异步
- [Day28 - MQ 核心概念](./Day28-MQ核心概念.md) ⭐ 三大价值(解耦/异步/削峰)/可靠性三防线(表保发送盘保存储ACK保消费)/幂等(查挡九成索引兜底)/搜题后端架构考古
- [Day29 - RocketMQ 消息模型](./Day29-RocketMQ消息模型.md) ⭐ 消费组(组间复制/组内竞争)/广播模式/Topic+Tag划分/Broker侧过滤/重复消费排查
- [Day30 - 死信队列与延迟消息](./Day30-死信队列与延迟消息.md) ⭐ DLQ(%DLQ%组名/带回收的垃圾桶/处理三方式)/延迟消息(对比扫表/4.x固定18级/先查再决定)

---

## ⚠️ 易错点

- [Java易错点汇总](./03-易错点与陷阱/Java易错点汇总.md)

---

## 📋 速查表

- [Java速查表](./05-速查表/Java速查表.md)
- [Java vs Node.js 语法对比手册](./Java-vs-Nodejs语法对比手册.md) ⭐ 前端转 Java 核心文档

---

## 学习进度

| 周 | 主题 | 状态 |
|----|------|------|
| Week 1 | Java 语法 + 面向对象 | ✅ 完成（Day1-6 + 公司代码阅读）|
| Week 2 | 核心 API + Stream | 🔄 进行中（Day7 Stream/Optional、Day8 日期时间 完成）|
| Week 4 | Spring 框架 | ✅ 完成（Day12 IoC/DI/MVC、Day13 AOP/Bean生命周期、Day14 事务、Day14.5 AOP代理重学）|
| Week 7 | 数据库 + MyBatis | ✅ 完成（Day16 入门、Day17 动态SQL+安全、Day18 缓存机制、Day19 动态UPDATE+关联查询、Day20 Spring事务协调）|
| Week 9 | 微服务 Dubbo | 🔄 进行中（Day21-30 ✅ / Spring Boot + Spring Cloud + MQ 全主线 ✅）|

> Week 2 剩余：StringBuilder、文件 I/O
> 下一步：微服务阶段收官 → 运维（Linux/Docker）或实战项目（Java 版 RAG）
