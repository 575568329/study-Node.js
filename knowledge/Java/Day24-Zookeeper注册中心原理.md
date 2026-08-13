# Day 24 · Zookeeper 注册中心原理

> **主题**：Zookeeper 数据结构 / 临时节点 / Watcher / ZK 挂了对 Dubbo 的影响
> **日期**：2026-08-13 ｜ **背景**：微服务架构（Dubbo）
> **前置**：Day 21 Dubbo 三角关系、Day 22 真实调用链

---

## 一、Zookeeper 是什么？

**分布式协调服务**，Dubbo 用它做注册中心。

核心能力：**存储服务地址 + 感知服务上下线**。

---

## 二、数据结构：树形目录（不是数据库表）

```
/dubbo
  /com.iflytek.edu.rpp.user.service.UserService      ← 服务接口名
    /providers
      dubbo://192.168.1.100:20880/com.iflytek...?version=2.6.0   ← Provider URL
      dubbo://192.168.1.101:20880/com.iflytek...?version=2.6.0   ← 另一个 Provider
    /consumers
      dubbo://192.168.1.200:...?application=crowdsourced-new-web  ← Consumer 信息
    /routers
      ...
```

- 像文件系统目录树，每个节点叫 **znode**
- 叶子节点存一段数据（Dubbo 里就是 URL 字符串）
- 没有行列结构，没有 SQL

---

## 三、两种节点类型

| 类型 | 特点 | Dubbo 用在哪 |
|------|------|-------------|
| **持久节点（Persistent）** | 创建后一直存在，手动删才消失 | `/dubbo/com.iflytek...` 父节点 |
| **临时节点（Ephemeral）** | 创建者断开连接后**自动删除** | `/providers/dubbo://192.168.1.100:...` |

**临时节点是 Dubbo 服务发现的核心。**

- Provider 启动 → 创建临时节点写自己的 URL
- Provider 挂了 → 心跳超时 → Session 断开 → **临时节点自动删除**
- Consumer 的 Watcher 被触发 → 知道 Provider 下线了

> 对比 Redis：临时节点 ≈ `SETEX`（过期自动删），但触发条件是 TCP Session 断开，不是 TTL

---

## 四、Watcher（监听器）：变更通知

Zookeeper 支持在节点上注册监听器，节点变化时自动通知。

### Consumer 启动时做了两件事

```
1. 读取 /providers 下的所有子节点 → 拿到 Provider 地址列表，缓存到本地内存
2. 在 /providers 上注册 Watcher → "有变化告诉我"
```

### 变更通知流程

```
新 Provider 上线 → 创建临时节点 → 触发 Watcher → ZK 通知 Consumer → Consumer 重新拉取列表

Provider 挂了 → 心跳超时 → 临时节点删除 → 触发 Watcher → ZK 通知 Consumer → Consumer 更新本地缓存
```

> 对比 Node.js：Watcher ≈ `fs.watch()`（文件变化触发回调），但跨网络推送

---

## 五、三个概念串起来的完整闭环

```
Provider 启动
  → 连接 ZK，创建临时节点 /providers/dubbo://IP:PORT/...
  → 节点里写自己的服务 URL

Consumer 启动
  → 连接 ZK，读取 /providers 下所有子节点
  → 拿到 Provider 地址列表，缓存到本地内存
  → 建立 TCP 长连接到各个 Provider
  → 在 /providers 注册 Watcher

业务调用
  → Consumer 直接走本地缓存的地址 + 已建好的长连接
  → ZK 不参与 ❌

Provider 上线/下线
  → 临时节点变化（创建/删除）
  → 触发 Consumer 的 Watcher
  → Consumer 收到通知 → 重新拉取列表 → 更新本地缓存
```

**印证 Day 21 的结论**：ZK 只在启动订阅 + 地址变化推送时参与，业务调用不查 ZK。

---

## 六、ZK 挂了 Dubbo 还能调用吗？

**能。**

```
Consumer 本地缓存了地址列表
Consumer 与 Provider 之间有已建好的 TCP 长连接

每次 RPC → 直接走本地缓存 + 长连接 → 不经过 ZK
```

### ZK 挂了的影响

| 场景 | 影响 |
|------|------|
| 正常调用 | ❌ **无影响**，走本地缓存 |
| Provider 新上线 | ⚠️ Consumer 不知道，没人推送变更 |
| Provider 挂了 | ⚠️ Consumer 不知道，本地缓存有死地址，调用超时，Dubbo Failover 尝试其他机器 |

### 双重保险

公司代码里 `file="...registry.cache"` 本地缓存文件：
- Consumer 启动时从 ZK 拉地址列表后写入本地文件
- ZK 挂了 → 下次启动从文件读 → 不至于服务都启动不了

### Consumer 挂了呢？

Consumer 节点也是临时节点，Session 断了自动删。但 **Provider 不关心**（谁调我都行）。Consumer 节点存在 ZK 上主要供**运维监控**（看当前有多少消费者订阅此服务）。

---

## 七、类比总结

| Zookeeper | 类比 |
|-----------|------|
| 树形结构 | JSON 嵌套对象 |
| 临时节点 | Redis `SETEX`（断连自动删） |
| Watcher | Node.js `fs.watch()`（变化触发回调） |
| ZK 本身 | **通讯录** |

**ZK = 通讯录**，Provider = 联系人，Consumer = 你。通讯录挂了已存号码还能打，只是新换号不知道了。

---

## 八、知识闭环

```
Day 21：Dubbo 三角关系
  → Provider 注册、Consumer 订阅、Registry（ZK）
  → "ZK 只在启动时参与"
      ↓
Day 24：Zookeeper 原理（今天）
  → 树形结构（存 URL）
  → 临时节点（Provider 挂了自己消失）
  → Watcher（Consumer 自动感知变更）
  → ZK 挂了不影响调用（本地缓存 + 长连接）
  → 解释了 Day 21 所有结论的底层原因
```

---

## 九、面试标准答案

> Zookeeper 数据结构是树形目录（不是数据库表），Provider 注册的是临时节点，Session 断了自动删除。Consumer 启动时拉取地址列表缓存本地，并注册 Watcher 监听变更。Provider 上下线 → 临时节点变化 → 触发 Watcher → Consumer 更新本地缓存。
>
> 业务调用不走 ZK，走本地缓存 + TCP 长连接。ZK 挂了 Dubbo 照常调用，只是失去地址变更通知能力。
>
> 本地消息表方案解决 MQ 分布式事务的"发不出"问题：订单表和消息表在同一个数据库同一个 Connection，`@Transactional` 能管住原子性。定时任务扫描消息表发 MQ，消费端幂等防重复。

---

## 🤖 AI 时代视角

**被 AI 贬值**：ZK 节点路径写法、Dubbo XML 配置注册中心

**AI 时代更值钱**：
- **判断"ZK 挂了影响多大"**（理解临时节点 vs 持久节点、本地缓存 vs 实时查询）
- **故障排查**："新上的机器为什么调不到"（ZK 注册失败 / Watcher 没触发 / 防火墙）
- **架构选型**：ZK vs Nacos vs Eureka（2026 Spring Cloud 生态趋势）

---

## 关联

- [[Day21-Dubbo-RPC微服务入门]] — 三角关系、ZK 只在启动订阅参与
- [[Day22-Dubbo真实调用链分析]] — 跨服务事务无法共享，引出分布式事务
- [[Day23-分布式事务入门]] — MQ 本地消息表方案（今日补漏：怎么保证可靠）

## 下次

- 看公司代码里有没有 MQ 使用（RabbitMQ/Kafka）
- Spring Boot 自动配置（简化 XML 配置）
