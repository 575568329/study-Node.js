# 最近一次学习记录

**最后更新**:2026-08-14（Java 线 Day 25 Spring Boot 自动配置）

## 2026-08-14 学习记录（Java 线）

### 课前小测（7 题，跨线复查）

2 预测试 + 2 红标盲区 + 1 跨线 + 2 随机抽查。

- ❌ Q1 Spring Boot 自动配置（预测）：答成注册中心/服务发现，正常（新内容起点）
- ✅ Q2 MQ 场景（预测）：直觉对（订单 + 库存管理）
- ⚠️ Q3 Dubbo Failover（🔴 上次 Hard）：方向对但混淆了 Failover（换机器重试）和缓存（拿到缓存数据）
- ❌ Q4 OGNL 假值陷阱（🔴 上次 Again）：**又错**（Integer 0 在 OGNL 里 `!= ''` 为 false，第 N 次仍未巩固）
- ✅ Q5 React 心智模型（🔴 连续 Again）：**终于过关！** 说"setCount 重新执行了函数"，没有说"监听"
- ⚠️ Q6 Spring 事务 + AOP（随机）：方向对（AOP 代理包起来），粗糙但过关
- ✅ Q7 `<set>` 标签（随机，上次 H）：**翻盘 H→G**，核心作用 + 对比 `<where>` 说清

**最终：3/7 过关，1 预测正常，3 需关注**

**关键突破**：React 心智模型连续 Again 后终于过关（"重新执行函数"没有说"监听"）
**顽固盲区**：OGNL 假值陷阱（Integer 0 != '' → false）仍未巩固，S 砍到 1 天

### 学习成果

**Spring Boot 自动配置（Day 25）**

**解决的问题**：传统 Spring 每个项目几十上百行 XML `<bean>` 定义，套路化配置重复写
**核心理念**：只留配置参数，把套路化的 Bean 定义干掉

**核心机制三步**：
1. **Starter 依赖**引入相关类到 classpath
2. **`@ConditionalOnXxx` 条件注解**判断（classpath 有类 + 配置有参数 → 满足）
3. 满足 → 自动创建 Bean；不满足 → 跳过

**类比锚点**：条件 1 = 有食材（classpath 有类），条件 2 = 有菜谱（配置参数）→ 自动开火做
**对比 Node.js**：Vue `app.use(plugin)` 同模式——调一个 use，插件内部自动注册所有组件/指令
**不需要背**：具体 AutoConfiguration 类名和条件——查文档，面试只考机制

**排除自动配置**：
```java
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
```

### 今日面试题沉淀（2 道）

1. Spring Boot 自动配置原理？→ starter 引入类 + `@ConditionalOnXxx` 条件判断（classpath 有类 + 配有参数）→ 满足自动创建 Bean，不满足跳过。不需要手写 XML `<bean>`
2. 自动配置能关掉吗？→ `@SpringBootApplication(exclude = ...)` 显式排除不需要的自动配置类

### 遗留问题 / 下次计划

- Spring Boot Web（@RestController / 内嵌 Tomcat / 不需要部署 war）
- Spring Boot vs Spring Cloud（Dubbo vs Spring Cloud 选型）
- 看公司代码里有没有 MQ 使用
- 🔴 OGNL 假值陷阱（S=1 天，08-15 必复查）
- 🔴 Dubbo Failover 机制（换机器重试，08-17 复查）

---

## 上次会话（存档）

**2026-08-13（Java 线 Day 24 Zookeeper 注册中心原理）**
