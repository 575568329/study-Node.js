# Day 22 · Dubbo 真实调用链分析

> **主题**：Controller 调用 Dubbo 服务 / @Resource 注入代理对象 / 跨服务事务无法共享
> **日期**：2026-08-07 ｜ **JDK**：Java 8 ｜ **框架**：老 Dubbo + Spring 3.2.6
> **前置**：Day 21 Dubbo RPC 入门、Day 20 事务绑 Connection
> **公司代码**：`D:\xunfei\zyjg\crowdsourced-new-web\...\MachiningController.java`

---

## 一、真实调用链拆解

### 公司代码实例

```java
@Controller
@RequestMapping("/core/machining")
public class MachiningController {
    
    @Resource
    private UserService rppUserService;  // ← Dubbo 服务（动态代理对象）
    
    @RequestMapping(value = "/getCurUserPhases", method = RequestMethod.GET)
    @ResponseBody
    public JsonResultHaveObj<...> getCurUserPhases(HttpServletRequest request) {
        User currentUser = CurrentUserUtil.getCurrentRppUser(request);
        User user = this.rppUserService.getBasic(currentUser.getId());  // ← RPC 调用
        List<Phase> phaseSubject = userBizService.getPhaseSubject(user.getUserActions());
        return result;
    }
}
```

### 完整调用链（14 步）

```
1. 前端请求：GET /core/machining/getCurUserPhases
2. Tomcat 接收 → DispatcherServlet → Spring MVC 路由
3. MachiningController.getCurUserPhases() 执行
4. this.rppUserService.getBasic(id)  ← 关键：这是什么？

【关键】rppUserService 是 Dubbo 动态代理对象

5. 动态代理拦截 getBasic(id) 调用
6. 序列化：{service: "UserService", method: "getBasic", params: [123]}
7. 从本地缓存取地址（启动时从 ZK 订阅缓存的）→ 192.168.1.100:20880
8. 通过 Netty TCP 长连接发送请求

9. 【提供方：rpp-user-service】接收请求
10. 反序列化 → 调用真实实现 UserServiceImpl.getBasic(123)
11. 查数据库，得到 User 对象
12. 序列化 User 对象 → 返回

13. 【消费方：crowdsourced-new-web】反序列化 User
14. 动态代理返回 User → Controller 继续业务逻辑 → 返回 JSON
```

**透明性**：Controller 代码完全看不出是 RPC 调用，像本地方法一样。

---

## 二、rppUserService 怎么注入的？

### XML 配置（回顾 Day 21）

```xml
<!-- applicationContext_dubboConsumer.xml -->
<dubbo:reference id="rppUserService"
                 interface="com.iflytek.edu.rpp.user.service.UserService"
                 timeout="6000"/>
```

**Spring 容器启动时**：
1. 解析 `<dubbo:reference id="rppUserService">`
2. Dubbo 生成 `UserService` 接口的**动态代理对象**
3. 注册到 Spring 容器，Bean 名 = `rppUserService`
4. Controller `@Resource private UserService rppUserService` → 注入代理

**和 MyBatis Mapper 完全一样**：接口没有实现类 → 动态代理生成 → Spring 管理。

---

## 三、本地服务 vs Dubbo 服务

| 维度 | 本地服务 | Dubbo 服务 |
|------|---------|-----------|
| 注入对象 | 真实 `@Service` 实例 | 动态代理对象 |
| 调用方式 | Java 方法调用（栈帧） | 网络通信（序列化+TCP） |
| 内存 | 同一 JVM | 不同 JVM（可能不同机器） |
| 失败模式 | 抛 Java 异常 | 超时/网络异常/远程异常 |

**代码看起来一样，底层完全不同。**

---

## 四、@Resource vs @Autowired

| 注解 | 来源 | 匹配方式 | 公司用哪个 |
|------|------|---------|-----------|
| `@Resource` | Java 标准（JSR-250） | **byName**（按名称） | ✅ 公司用这个 |
| `@Autowired` | Spring | **byType**（按类型） | — |

**为什么公司用 @Resource？**

```java
@Resource
private UserService rppUserService;  // 按名称 "rppUserService" 找 Bean
```

可能有**多个 UserService 类型的 Bean**（本地 mock + Dubbo 远程），`@Resource` 按名称精确匹配。

`@Autowired` 按类型找，多个同类型 Bean 会报错（需加 `@Qualifier`）。

---

## 五、跨服务事务无法共享（🔴 核心盲区）

### 场景

```java
@Transactional
@RequestMapping("/createOrder")
public JsonResult createOrder() {
    User user = rppUserService.getBasic(userId);        // RPC 1
    Order order = orderService.createOrder(user);       // RPC 2
    inventoryService.deductStock(order.getProductId()); // RPC 3
    return JsonResult.success();
}
```

**问题**：Controller 的 `@Transactional` 能让 3 个 RPC 在一个事务里吗？

**答案：不能。**

---

### 为什么不能？（连接 Day 20）

**Day 20 铁律：事务绑 Connection**

```
【Web 进程 JVM1】
  @Transactional
  → Spring 拿 connA（Web 的数据库连接）
  → 绑定到 ThreadLocal
  
  RPC 1 → rppUserService.getBasic()
    ↓ 网络调用
    
【UserService 进程 JVM2】
  → 拿 connB（UserService 的连接池）
  → connB 执行：SELECT * FROM user WHERE id=?
  
  RPC 2 → orderService.createOrder()
    ↓ 网络调用
    
【OrderService 进程 JVM3】
  → 拿 connC（OrderService 的连接池）
  → connC 执行：INSERT INTO orders ...
```

**关键**：
- connA、connB、connC 是**不同进程的不同 Connection**
- Day 20 的 ThreadLocal 只在同一 JVM 内有效
- **无法共享同一个事务**

---

### 物理隔离图

```
JVM1 (Web)          JVM2 (UserService)    JVM3 (OrderService)
ThreadLocal<connA>  ThreadLocal<connB>    ThreadLocal<connC>
     ↓                   ↓                      ↓
   Web DB 连接池      UserService DB        OrderService DB
   
← 不同进程，内存隔离，Connection 无法共享 →
```

**@Transactional 只能管理同一个 Connection 的事务。**

---

### 那怎么办？（分布式事务）

跨服务的事务一致性 = **分布式事务问题**，需要特殊方案：

| 方案 | 原理 | 性能 | 一致性 |
|------|------|------|--------|
| **2PC**（两阶段提交） | 协调者统一 prepare/commit | 差（阻塞） | 强一致 |
| **TCC**（Try-Confirm-Cancel） | 业务层补偿 | 好 | 最终一致 |
| **Saga**（长事务） | 本地事务+补偿事务 | 好 | 最终一致 |
| **MQ 最终一致性** | 消息队列异步 | 好 | 最终一致 |

**公司实际**：
- **读操作**（本例）：不需要事务（都是 SELECT）
- **写操作**（创建订单+扣库存）：通常用 **MQ 最终一致性** 或 **TCC**

---

## 六、RPC 调用次数 = 网络通信次数

```java
User user = rppUserService.getBasic(id);           // RPC 1 → 1 次网络通信
List<Task> tasks = taskService.searchLockedTask(); // RPC 2 → 1 次网络通信
List<Log> logs = taskService.searchTaskLog();      // RPC 3 → 1 次网络通信

// 总共 3 次网络通信（每个 RPC 都是独立的 TCP 请求）
```

**优化方向**：
- 减少 RPC 调用次数（合并接口）
- 批量查询接口设计
- 缓存热点数据

---

## 七、RPC 调用失败处理

```java
try {
    User user = this.rppUserService.getBasic(id);
} catch (com.alibaba.dubbo.remoting.TimeoutException e) {
    // Dubbo 超时（默认 3 秒）
    log.error("调用用户服务超时", e);
    return JsonResult.error("获取用户信息失败");
} catch (RpcException e) {
    // RPC 框架异常（连接失败/提供方挂了）
    log.error("RPC 调用失败", e);
    return JsonResult.error("服务暂时不可用");
}
```

**通常公司有全局异常处理**（`@ControllerAdvice`），统一返回友好错误。

---

## 八、面试标准答案

> Dubbo 服务通过 @Resource 注入动态代理对象，Controller 调用看起来像本地方法，实际是序列化+网络通信。每个 RPC 调用都是独立的 TCP 请求。
>
> @Transactional 无法管理跨服务事务，因为事务绑 Connection，不同服务在不同进程有不同连接，无法共享。跨服务写操作需要分布式事务方案（2PC/TCC/Saga/MQ）。
>
> @Resource 按名称注入（byName），@Autowired 按类型注入（byType）。多个同类型 Bean 时 @Resource 更精确。

---

## 🤖 AI 时代视角

**被 AI 贬值**：`@Resource` 注入写法、Dubbo 配置

**AI 时代更值钱**：
- **跨服务事务判断**：能不能用 @Transactional（AI 不懂物理隔离）
- **分布式事务选型**：2PC vs TCC vs Saga（业务场景权衡）
- **RPC 优化**：减少调用次数、批量接口设计
- **故障排查**："订单创建了但库存没扣"（分布式一致性）

---

## 关联

- [[Day21-Dubbo-RPC微服务入门]] — XML 配置、三角关系、重试与幂等
- [[Day20-MyBatis与Spring事务协调]] — 事务绑 Connection，今天延伸到跨服务无法共享
- [[Day16-MyBatis入门]] — 动态代理"没里子"，Dubbo 同套路

## 下次

- 分布式事务入门（2PC/TCC/Saga/MQ 最终一致性）
- Zookeeper 注册中心原理深入
- Spring Boot 自动配置（简化 XML 配置）
