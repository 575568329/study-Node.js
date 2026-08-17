# 最近一次学习记录

**最后更新**:2026-08-16（Java 线 Day 27 Spring Cloud vs Dubbo）

## 2026-08-16 学习记录（Java 线）

### 课前小测（7 题）

2 预测 + 1 S=1 必查 + 2 到期 + 2 抽查。

- ✅ Q1 宏微任务边界（🔴 S=1）：全对（setTimeout/回调都是宏任务）
- ✅ Q2 React Hooks 依赖数组（🔴 Hard）：`[]` mount 一次，不写每次渲染都执行
- ✅ Q3 worker_threads（到期）：cluster 多进程并发，worker_threads CPU 密集
- ⚠️ Q4 异步错误（到期）：结论对（不加 await catch 不到），表述模糊
- ✅ Q5 事务绑连接（抽查）：两个连接回滚管不到另一个
- ❌ Q6 Dubbo vs Spring Cloud（预测）：不知道，正常
- ⚠️ Q7 MQ vs RPC 选型（预测）：方向对但"RPC 同步不阻塞"说反了

**4/5 实际题过关，队列状态良好**

### 学习成果

**Spring Cloud vs Dubbo（Day 27）**

**Dubbo 特点**：RPC 二进制长连接（性能好）、接口级调用（像本地方法）、国内老项目主流
**Spring Cloud 特点**：HTTP REST（生态全/跨语言）、注解+自动配置（配置简单）、全球社区

**公司用 Dubbo 的原因**：老项目历史选型 + 内部调用频繁 RPC 性能优 + 和 Spring XML 兼容

**2026 面试回答策略**：说现状 → 说原因 → 说如果重来怎么选（体现判断力）

**RPC 同步 vs MQ 异步选型**（纠正 Q7 矛盾）：
| 场景 | 选型 | 原因 |
|------|------|------|
| 强一致（银行转账） | RPC 同步 | 要立即知道结果 |
| 高并发最终一致（电商下单） | MQ 异步 | 不阻塞，可接受短暂不一致 |
| 长流程（OTA 订票） | Saga | RPC 链太深 |

### 今日面试题沉淀（2 道）

1. Dubbo vs Spring Cloud？→ Dubbo RPC 性能好但生态窄，Spring Cloud HTTP REST 生态全但性能略低。公司用 Dubbo 是历史选型+性能需求。新项目我会考虑 Spring Cloud 或 Dubbo 3 混合
2. 同步 RPC vs 异步 MQ 怎么选？→ 强一致用 RPC，高并发最终一致用 MQ，长流程用 Saga

### 遗留问题 / 下次计划

- 看公司代码里有没有 MQ 使用（RabbitMQ/Kafka）
- Dubbo 3 + Spring Cloud 混合架构（可选）
- Spring Cloud 组件深入（Gateway/Config/Nacos）

---

## 上次会话（存档）

**2026-08-15（Java 线 Day 26 Spring Boot Web）**
