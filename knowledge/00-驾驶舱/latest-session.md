# 最近一次学习记录

**最后更新**:2026-08-15（Java 线 Day 26 Spring Boot Web）

## 2026-08-15 学习记录（Java 线）

### 课前小测（7 题，🎉 最佳表现）

2 预测试 + 1 红标必查（S=1） + 2 到期复查 + 2 随机抽查。

- ✅ **Q1 OGNL 假值陷阱（🔴 S=1 必查）**：**终于过关！！！** 逐个判断全对（`status != null` → true，`status != ''` → false）。顽固盲区攻克（H,G,A,A... 今天终于拆掉）
- ✅ **Q2 React 受控/非受控（🔴 到期）**：确认巩固（有 value 受控，去掉非受控）
- ✅ **Q3 useReducer（🔴 到期）**：确认巩固（超过 2 个 state 联动就用）
- ✅ **Q4 重试 Failover（📦 上次 H）**：**翻盘 H→G**（"挂了找负载均衡另外的机器"= Failover 换机器重试，不再混淆缓存）
- ✅ **Q5 宏微任务边界（📦 上次 A）**：**翻盘 A→G**（宏任务，微任务只有 nextTick/then/catch/finally，口诀钉死）
- ❌ Q6 Spring Boot Web（预测）：不知道，正常（今日新内容）
- ❌ Q7 Spring Cloud vs Dubbo（预测）：不知道，正常（下次新内容）

**5/5 实际题全过，2 预测正常。课前小测最佳表现 🎉**

### 学习成果

**Spring Boot Web（Day 26）**

两个核心简化：

**1. 接口写法简化**
- `@RestController` = `@Controller` + `@ResponseBody`（类级别搞定，不用每个方法加）
- `@GetMapping` / `@PostMapping` = `@RequestMapping(method = ...)` 简写

**2. 启动方式简化（内嵌 Tomcat）**
- 传统：打包 war → 手动部署到外部 Tomcat → 启动
- Spring Boot：`main()` → 启动 Spring 容器 + 启动内嵌 Tomcat → 直接能访问
- `spring-boot-starter-web` 依赖引入 Tomcat jar 包，`main()` 时自动创建 Tomcat 实例
- 端口配置：`server.port: 3000` yml 一行

**类比 Node.js**：`java -jar app.jar` = `node app.js`，不需要外部服务器

### 今日面试题沉淀（4 道）

1. `@RestController` 和 `@Controller` 区别？→ `@RestController` = `@Controller` + `@ResponseBody`，所有方法默认返回 JSON
2. Spring Boot 为什么不需要外部 Tomcat？→ 内嵌 Tomcat（starter-web 引入），`main()` 启动时自动创建监听端口
3. OGNL 假值陷阱？→ Integer 0 在 OGNL 里 `!= ''` 为 false（`''` 当 `0` 比较），数值类型只判 `!= null`，删掉 `!= ''`
4. Dubbo 重试 Failover？→ Provider 挂了自动换其他机器重试（Failover 策略），不是拿缓存

### 遗留问题 / 下次计划

- Spring Cloud vs Dubbo 选型（面试高频"为什么用 Dubbo 不用 Spring Cloud"）
- 看公司代码里有没有 MQ 使用
- Spring Boot 内嵌容器原理深入（可选）

---

## 上次会话（存档）

**2026-08-14（Java 线 Day 25 Spring Boot 自动配置）**
