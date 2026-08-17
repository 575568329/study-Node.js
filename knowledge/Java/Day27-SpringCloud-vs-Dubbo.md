# Day 27 · Spring Cloud vs Dubbo

> **主题**：两条微服务路线对比 / RPC vs HTTP REST / 选型判断 / 面试回答策略
> **日期**：2026-08-16 ｜ **背景**：微服务架构选型
> **前置**：Day 21 Dubbo RPC 入门、Day 23 分布式事务

---

## 一、两条微服务路线

| | Dubbo | Spring Cloud |
|---|---|---|
| 来源 | 阿巴巴（Apache） | Pivotal（Spring 官方） |
| 通信协议 | **RPC**（二进制，长连接） | **HTTP/REST**（文本，短连接） |
| 注册中心 | Zookeeper | Eureka / Nacos |
| 服务调用 | 接口级别（像调本地方法） | HTTP 请求级别（像调 API） |
| 负载均衡 | 框架内置 | 需配合 Ribbon / Spring Cloud LoadBalancer |
| 配置方式 | XML / 注解 | 注解 + Spring Boot 自动配置 |
| 社区 | 国内强，海外弱 | **全球社区**，组件丰富 |
| 跨语言 | 只能 Java 间调 | HTTP REST 天然跨语言 |
| 配套全家桶 | 只有 RPC + 注册中心 | Gateway / Config / Bus / Sleuth 一整套 |

---

## 二、公司为什么用 Dubbo

1. **老项目历史选型**（Spring 3.2.6 + XML，Dubbo 2012 年开源，国内大量采用）
2. **性能优先**：内部微服务间调用频繁，RPC 二进制长连接比 HTTP REST 快（Hessian2 序列化）
3. **调用透明**：`@Resource private UserService` 像调本地方法（动态代理藏网络细节）
4. **生态兼容**：和 Spring XML 配置体系兼容（公司直接用 XML 配 Dubbo）

---

## 三、2026 趋势：Dubbo 3 + Spring Cloud

两者不再互斥：Dubbo 3 开始兼容 Spring Cloud 注册中心（Nacos）、支持 HTTP 协议。

新项目可以混合用：
- 内部 Java 服务间 → Dubbo RPC（性能优）
- 对外/跨语言 → Spring Cloud Gateway + HTTP REST（生态全）

---

## 四、RPC 同步 vs MQ 异步选型

| 场景 | 选型 | 原因 |
|------|------|------|
| 强一致（银行转账） | **RPC 同步** | 要立即知道结果 |
| 高并发最终一致（电商下单） | **MQ 异步** | 不阻塞，可接受短暂不一致 |
| 长流程（OTA 订票） | **Saga** | RPC 链太深 |

**纠正常见误解**：RPC = 同步 = 调用方阻塞等结果。MQ = 异步 = 发消息立刻继续。

---

## 五、面试标准答案

> 公司用 Dubbo 因为是老项目历史选型，RPC 二进制长连接性能好、调用透明。Spring Cloud 用 HTTP REST 生态更完整、配置更简单、跨语言友好。
>
> 新项目我会考虑 Spring Cloud（生态全、社区大），或 Dubbo 3 + Spring Cloud 混合用（内部 RPC + 对外 HTTP）。
>
> 同步 vs 异步选型看业务：强一致用 RPC，高并发最终一致用 MQ，长流程用 Saga。

---

## 🤖 AI 时代视角

**被 AI 贬值**：背 Dubbo vs Spring Cloud 功能对比表

**AI 时代更值钱**：
- **选型判断力**：新项目怎么选（历史包袱、团队技术栈、跨语言需求）
- **混合架构**：Dubbo 3 兼容 Spring Cloud，两者不互斥
- **迁移决策**：老项目要不要迁、迁的代价和收益

---

## 关联

- [[Day21-Dubbo-RPC微服务入门]] — RPC vs HTTP 对比（Day 27 的细化）
- [[Day23-分布式事务入门]] — MQ vs RPC 选型场景（Day 27 的纠正）
- [[Day25-SpringBoot自动配置]] — Spring Cloud 基于 Spring Boot 的自动配置

## 下次

- 看公司代码 MQ 使用
- Spring Cloud 组件深入（Gateway / Nacos / Config）
