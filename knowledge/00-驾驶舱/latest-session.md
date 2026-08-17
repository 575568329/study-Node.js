# 最近一次学习记录

**最后更新**:2026-08-17（前端复习线 ⑩ axios + RHF + Zod）

## 2026-08-17 学习记录（前端复习线）

### 课前小测（5 题）

到期 2 条 + Java 抽查 2 条 + 预测 1 条。

- ✅ Q1 1px 边框（到期）：G（DPR + 伪元素 scale 方案全对）
- ⚠️ Q2 worker_threads（昨天到期）：H（应用层对，"cluster分配线程/worker_threads分配CPU核心"说反了第 3 次）
- ✅ Q3 Dubbo 三角关系（Java 过期）：G（注册/订阅/调用不走 ZK 全对）
- ✅ Q4 Maven 本地仓库（Java 过期）：G
- Q5 预测 axios 拦截器：方向对，只说请求方向一半

### 学习成果

**⑩ axios 封装 + React Hook Form + Zod**

- axios 封装四层价值：配置收口 / token 自动塞 / 错误统一出口 / 剥壳（组件拿纯业务数据）
- 拦截器两方向：请求拦截塞 token / 响应拦截剥壳 + 统一错误处理
- RHF 非受控表单：register 底层 ref 避免多次重渲染，handleSubmit 自动校验
- RHF 全 API 演示：register / handleSubmit / errors / reset / setValue / watch / defaultValues
- Zod 负责定义校验规则，RHF 负责执行（zodResolver 桥接）
- z.infer 自动推断 TS 类型，一份 schema 三个用途（RHF 校验 / TS 类型 / 前后端同构）

### 关键盲区

- ⚠️ 响应拦截器剥壳后拿到的不是 axios response 对象，是后端纯业务数据
- ⚠️ Zod/RHF 职责说反：Zod 定义规则，RHF 执行校验
- ⚠️ worker_threads 机制说反（第 3 次）：cluster=进程级复制多份，worker_threads=单进程内开线程共享内存

### 今日面试题沉淀（2 道）

1. axios 为什么要封装？→ 配置收口(baseURL/timeout) + token 自动塞 + 错误统一出口 + 剥壳(组件拿业务数据)
2. RHF 为什么用非受控？→ N 个 useState 每次按键 N 次重渲染，register 底层 ref 只提交时读一次值

### 代码资产

- `projects/react/react-ts-demo/src/form-demo/`（axios 封装 + 登录 + 新增/编辑用户，RHF 全 API 演示）
- main.tsx 已切到 form-demo

### 遗留问题 / 下次计划

- ⑪ Tailwind（唤醒级）
- ⑫ Redux Toolkit（🟡补学档开篇，对比 Zustand）
- worker_threads 08-21 复查（机制说反）

---

## 上次会话（存档）

**2026-08-16（Java 线 Day 27 Spring Cloud vs Dubbo）**

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
