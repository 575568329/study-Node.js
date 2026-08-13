# 最近一次学习记录

**最后更新**:2026-08-13（Java 线 Day 24 Zookeeper 注册中心原理）

## 2026-08-13 学习记录（Java 线）

### 课前小测（7 题，跨线复查）

复习线和 Java 线交错，红标盲区优先。

- ❌ Q1 React 心智模型（🔴 上次 Again）：**未作答**，盲区仍在
- ⚠️ Q2 自定义 Hook（🔴 上次 Again）：结论对（B 不变），但 state 存在 Fiber 节点上没说清
- ⚠️ Q3 Promise then（🔴 上次 Again）：第一问（返回新 Promise）半对，第二问（值穿透/Promise Resolution Procedure）完全没答
- ✅ Q4 Flex: 1（到期）：三个属性值对（grow:1 shrink:1 basis:0），补充了 basis:0 是等分根因
- ✅ Q5 DB 事务绑连接（到期）：核心正确（两个连接事务失效）
- ⚠️ Q6 分布式事务选型（Java Day 23）：方向对（MQ + 异步补偿），但机制太笼统——没说怎么保证可靠
- ✅ Q7 Dubbo 三角关系（🔴 上次 H）：正确纠正（ZK 注册阶段参与，调用不参与）

**补答**：
- Q1：补到"函数重新执行 + hooks 有记忆"（差 batch/schedule 细节，但现阶段可接受）
- Q3：通过代码实验理解了 Promise 值穿透（拆盒子直到非 Promise），过关 ✅

**最终：5/7 过关**

### 补漏：MQ 本地消息表机制

课前小测 Q6 暴露了 MQ 方案"怎么保证可靠"说不清。Day 23 笔记有本地消息表方案，补到能扛面试追问：

- **核心矛盾**：MQ 是外部系统，数据库事务管不了它
- **解法**：订单表 + 消息表在同一个数据库同一个 Connection → `@Transactional` 能管住
- **三道追问防线**：
  1. 定时任务发 MQ 失败 → 消息表状态"未发送"，下一轮重试
  2. 库存服务处理失败 → MQ 自动重试，超限进死信队列
  3. 消息重复 → 消费端幂等（按 orderId 去重）

### 学习成果

**Zookeeper 注册中心原理（Day 24）**

三个核心概念：
1. **树形结构**：像文件系统目录树，叶子节点存 URL（不是数据库表）
2. **临时节点（Ephemeral）**：Provider 地址节点，Session 断了自动删除（心跳保活的底层机制）
3. **Watcher（监听器）**：Consumer 注册监听，providers 节点变化时 Zookeeper 主动推送通知

**关键认知**：
- Provider 启动 → 创建临时节点写 URL → ZK 存树形结构里
- Consumer 启动 → 拉取子节点列表缓存本地 + 注册 Watcher → 之后 RPC 走本地缓存 + 长连接
- Provider 上线/下线 → 临时节点变化 → 触发 Watcher → Consumer 更新本地缓存
- **ZK 挂了 Dubbo 照常调用**（本地缓存 + 长连接），只失去地址变更通知能力
- 公司代码 `file="...registry.cache"` 是双重保险：ZK 挂了重启时从文件读地址

**类比锚点**：ZK = 通讯录，Provider = 联系人，Consumer = 你。通讯录挂了已存号码还能打，只是新换号不知道。

### 今日面试题沉淀（4 道）

1. 本地消息表怎么保证"创建订单 + 发消息"原子性？→ 订单表和消息表在同一个数据库同一个 Connection，`@Transactional` 能管住。定时任务扫描消息表发 MQ，失败重试；消费端幂等防重复
2. Zookeeper 数据结构？→ 树形目录结构（不像数据库表），Provider 地址是临时节点，Session 断了自动删除
3. Zookeeper 挂了 Dubbo 还能调用吗？→ 能。Consumer 本地缓存地址列表 + 已建 TCP 长连接，业务调用不经过 ZK。只失去地址变更通知
4. Consumer 挂了会怎样？→ Consumer 节点也是临时节点，Session 断了自动删。但 Provider 不关心，Consumer 节点主要供运维监控

### 遗留问题 / 下次计划

- Day 23 笔记末尾：看公司代码里有没有 MQ 使用（RabbitMQ/Kafka）
- Spring Boot 自动配置（简化 XML 配置）
- 🔴 React 心智模型复查（"监听"vs"重跑"连续 3 次混淆）
- 🔴 Promise 值穿透复查（刚过关，08-14 确认）

---

## 上次会话（存档）

**2026-08-12（React 复习线 ⑥ 受控/非受控 + 虚拟DOM + Fiber）**
