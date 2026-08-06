# Day 21 · Dubbo RPC 微服务入门

> **主题**：RPC 本质 / RPC vs HTTP / Dubbo 三角关系 / 公司 XML 配置精读 / 重试与幂等
> **日期**：2026-08-06 ｜ **JDK**：Java 8 ｜ **框架**：老 Dubbo（`code.alibabatech.com`）
> **前置**：Day 16 MyBatis 动态代理"没里子"、Day 20 Spring 事务协调
> **公司代码**：`D:\xunfei\zyjg\crowdsourced-new-web`（消费方）+ `crowdsourced-new/service`（提供方）

---

## 一、为什么内部服务不用 HTTP？

### HTTP 的代价
1. **文本协议**：Header 动辄几百字节，内容只有几十字节
2. **短连接**：HTTP/1.1 有复用但仍有开销
3. **面向资源**：URL 设计 `/api/users/1` 不自然

### RPC 目标：像调本地方法一样调远程服务

```java
// 本地调用（同一 JVM）
User user = userService.getUserById(1L);

// RPC 远程调用（另一台机器）—— 代码完全一样！
User user = userService.getUserById(1L);
```

网络细节、序列化、连接管理全藏起来。

---

## 二、RPC 底层：动态代理 + 网络

**和 MyBatis 动态代理"没里子"同一个套路**：接口没有实现类 → 动态代理自动生成 → 代理内部做网络调用。

```java
@Reference  // 或 XML <dubbo:reference>
private UserService userService;  // 接口，没有实现类

User user = userService.getUserById(1L);
// 动态代理内部：
// 1. 方法名+参数序列化（Hessian2/Protobuf）
// 2. 通过 Netty TCP 长连接发送
// 3. 提供方反序列化 → 调真实 UserServiceImpl
// 4. 结果序列化 → 返回 → 消费方反序列化
```

---

## 三、RPC vs HTTP 核心对比

| 维度 | HTTP API | RPC（Dubbo） |
|------|----------|-------------|
| 协议 | 文本（Header+Body） | 二进制（紧凑） |
| 连接 | 短连接 | **长连接**（复用 TCP） |
| 调用方式 | URL+Method | 接口方法 |
| 序列化 | JSON（冗余） | Hessian2/Protobuf（紧凑） |
| 服务发现 | 手动配置 IP+Port | **注册中心**（Zookeeper 自动） |
| 负载均衡 | Nginx/网关 | **框架内置** |
| 适用场景 | 对外（前端/第三方） | **对内**（微服务间） |

---

## 四、Dubbo 三角关系

```
          【Zookeeper 注册中心】
          ↑ 注册        ↓ 订阅
【Provider 提供方】  【Consumer 消费方】
 启动注册IP+Port     启动查地址→缓存→建长连接
```

**三个角色**：
1. **Provider**：实现服务，注册到 Zookeeper
2. **Consumer**：调用服务，从 Zookeeper 获取地址
3. **Registry**：Zookeeper，维护地址列表

### ⚠️ 关键：Zookeeper 什么时候参与？

| 阶段 | Zookeeper 参与？ |
|------|-----------------|
| **启动订阅** | ✅ 消费方查地址列表，缓存到本地 |
| **业务调用** | ❌ 用本地缓存地址+长连接，**不查 ZK** |
| **地址变化** | ✅ ZK 主动推送新列表给消费方 |

**每次调用不查 ZK**，否则 ZK 成性能瓶颈。

---

## 五、公司代码精读（XML 配置，非注解）

> ⚠️ 公司 Spring 3.2.6 + 老 Dubbo 用 **XML 配置**，不是 `@Reference`/`@Service` 注解。概念一样，写法不同。

### 5.1 四个标签分层

```
<dubbo:application>  应用身份证（我是谁）      全局 1 个
<dubbo:registry>     注册中心地址（去哪找）    全局可多个
<dubbo:consumer>     消费者默认配置（怎么调）  全局默认 1 个
<dubbo:reference>    引用具体服务（调谁）      每服务 1 个
```

| 消费方 | 提供方 | 作用 |
|--------|--------|------|
| `<dubbo:consumer>` | `<dubbo:provider>` | 全局默认 |
| `<dubbo:reference>` | `<dubbo:service>` | 具体某个服务 |
| （查地址） | `<dubbo:protocol>` | 提供方定协议+端口 |

**记忆锚点**：consumer/reference = 消费方；provider/service = 提供方；application/registry = 两边都要。

### 5.2 消费方（crowdsourced-new-web，纯消费者）

```xml
<dubbo:application name="ZX-crowdsourcednew-web"/>
<dubbo:consumer timeout="3000" retries="0" check="false"/>
<dubbo:registry protocol="zookeeper" address="${service.zookeeper.address}"/>

<!-- 引用远程服务 = @Reference -->
<dubbo:reference id="loginService"
                 interface="com.iflytek.edu.zx.user.service.LoginService"
                 timeout="6000" group="login"/>
```

- `id` → 生成的 Bean 名（`@Resource(name="loginService")` 注入用）
- `interface` → 远程接口全限定名（消费方只知接口，不知机器）
- `timeout="6000"` → 覆盖全局 3000（reference 覆盖 consumer，类似 CSS 优先级）
- `group="login"` → 服务分组（同接口多实现用 group 区分）

**多注册中心**：公司有主 ZK + 英语引擎 ZK + 语文引擎 ZK，AI 引擎服务用 `registry="englishNewCardIp"` 指定去哪个 ZK 找。AI 引擎 `timeout="30000"`（算法计算慢）。

### 5.3 提供方（crowdsourced-new/service）

```xml
<dubbo:application name="zx-crowdsourced-new-service" logger="slf4j"/>
<dubbo:registry protocol="zookeeper" address="${service.zookeeper.address}"
                file="zx-crowdsourced-new-service-registry.cache"/>
<dubbo:protocol name="dubbo" port="${service.port.crowdsourced.new}"
                dispatcher="message" payload="20971520"/>
<dubbo:provider timeout="60000" retries="0"/>

<!-- 发布服务 = Dubbo @Service -->
<dubbo:service interface="com.iflytek.edu.crowdsourced.user.service.UserService"
               ref="userService"/>
```

- `<dubbo:protocol port=...>` → 服务监听的端口
- `payload="20971520"` → 传输包上限 20MB（默认 8MB）
- `file="...registry.cache"` → **本地缓存文件**！ZK 挂了也能用缓存地址继续调用
- `<dubbo:service interface ref>` → interface 对外暴露，ref 指向本地 Spring Bean（真正实现）

**职责分离**：Spring 管对象生命周期（ref 指向的 Bean），Dubbo 管远程发布（`<dubbo:service>`）。

---

## 六、重试与幂等（🔴 重点）

### 公司全局 `retries="0"`（关重试），为什么？

昨天讲 Failover 默认重试 2 次，但公司关掉了。**核心原因：重试导致重复执行，非幂等接口会出事。**

### 幂等 = 同一操作执行 1 次和 N 次结果一样

```
消费方调 createOrder()
  → 请求到达提供方，订单创建成功
  → 返回响应时网络抖动，消费方没收到
  → Dubbo 以为失败 → Failover 重试
  → 又调一次 createOrder() → 创建了 2 个订单 ❌
```

| 接口类型 | 幂等？ | 能重试？ |
|---------|-------|---------|
| 查询（getUserById） | ✅ 幂等 | ✅ 安全 |
| 写（createOrder/扣款/发短信） | ❌ 非幂等 | ❌ 重复执行 |

公司有大量写操作（SendMessageService 发短信、SupplementalFeeService 补费用），全局 `retries="0"` 是保守安全策略——宁可失败让上层处理，不要重复扣钱/重复发短信。

**连接 Day 8 Node 事务**：和"rollback+throw 铁律"同思想——写操作出错要让上层明确知道，不偷偷重试掩盖问题。

---

## 七、负载均衡 + 集群容错

### 调用打到哪台？负载均衡决定（框架内置）

| 策略 | 规则 |
|------|------|
| **Random**（默认） | 随机（可加权重） |
| RoundRobin | 轮询 |
| LeastActive | 最少活跃（谁闲挑谁） |
| ConsistentHash | 一致性哈希（同参数打同一台） |

### 一台挂了怎么办？两层保护

1. **ZK 感知下线**（秒级）：机器和 ZK 心跳超时 → ZK 删节点 → 推送新列表给消费方 → 本地缓存剔除
2. **集群容错**（应对推送延迟窗口期）：Failover（默认）调用失败自动重试其他机器

> 注意：公司关了 retries，所以主要靠 ZK 推送 + 业务层处理，不靠 Failover 自动重试。

---

## 八、面试标准答案

> RPC 让远程调用像调本地方法，靠动态代理藏起序列化+网络细节。vs HTTP：二进制+长连接+注册中心，对内用 RPC 对外用 HTTP。
>
> Dubbo 三角：Provider 注册、Consumer 订阅、Zookeeper 注册中心。ZK 只在启动订阅+地址变化推送时参与，业务调用走本地缓存地址+长连接不查 ZK。
>
> 重试要看幂等：查询可重试，写接口（扣款/发消息）非幂等，重试会重复执行。公司全局 retries=0 就是这个原因。

---

## 🤖 AI 时代视角

**被 AI 贬值**：`<dubbo:reference>` XML 配置、注解写法

**AI 时代更值钱**：
- **幂等性判断**：接口能不能重试（AI 不懂业务是查询还是扣款）
- **超时值设定**：30 秒还是 3 秒（要懂接口实际耗时）
- **RPC vs HTTP 选型**：什么场景用哪个
- **故障排查**："为什么用户被扣两次钱"（重试+非幂等）、"为什么调用超时"

---

## 关联

- [[Day16-MyBatis入门]] — 动态代理"没里子"，Dubbo 同套路
- [[Day20-MyBatis与Spring事务协调]] — 事务绑连接，RPC 跨服务无法共享事务（分布式事务是后话）
- [[Day14-Spring事务-Transactional]] — 重试与幂等连接 rollback+throw 铁律

## 下次

- 找 Controller 看怎么用注入的 Dubbo 服务
- Zookeeper 注册中心原理深入
- 分布式事务（跨服务事务一致性）
