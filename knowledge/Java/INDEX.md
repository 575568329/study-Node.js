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
| Week 7 | 数据库 + MyBatis | 🔄 进行中（Day16 入门 ✅、Day17 动态SQL+安全 ✅、Day18 缓存机制 ✅）|

> Week 2 剩余：StringBuilder、文件 I/O
> MyBatis 下一步：一级/二级缓存、`<set>` 标签（动态 UPDATE）、Spring 事务协调
