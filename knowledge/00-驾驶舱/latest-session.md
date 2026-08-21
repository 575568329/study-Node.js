# 最近一次学习记录

**最后更新**:2026-08-21（前端复习线 ⑫ Redux Toolkit + 遗忘带翻盘）

## 2026-08-21 学习记录（前端复习线，同日 Java 线 Day 28 见下方存档）

### 课前小测（5 题）：1 H + 4 A，遗忘带暴露

Tailwind 轴向（items-center 又说"底部居中"，连续 2 次）/ RHF（setValue 答成 register）/ Router 守卫（答成 axios 拦截器）/ OGNL（"0 是 false" 连续 2 次）全 A。**诊断**：⑧-⑪ 站 08-15~08-19 四天密集学，学得快忘得也快。

**当场费曼翻盘**：合上复述 4 条 → 3 全过 + 1 半过（OGNL 差"空串转 0"半句）。5 条 KP 排 08-22 密集复查。

### 学习成果

**⑫ Redux Toolkit（对比 Zustand，复述 3/3 全过）**

- RTK = Redux 官方减负工具包，7 文件收成 1 个 slice
- 数据流灵魂：dispatch(action) → reducer 纯函数 → 新 state → 通知订阅；中间层换可预测性 + 时间旅行调试
- reducer 里 `state.count++` 不违规：Immer 翻译成不可变
- useSelector ≈ Zustand 选择器（精准订阅同原理）；RTK 要 Provider，Zustand 零配置
- 2026 分工：服务端状态 TanStack Query，客户端 Zustand(新项目)/RTK(存量维护)

### 今日面试题沉淀（2 道）

1. Redux Toolkit 和 Zustand 怎么选？→ 新项目 Zustand 轻量零配置；存量/大团队要可预测性和时间旅行调试用 RTK。action→reducer 中间层是样板也是审计记录
2. RTK reducer 里直接改 state 为什么没问题？→ 内置 Immer 把"直接改"语法翻译成造新对象，本质仍不可变

### 遗留问题 / 下次计划

- **08-22 密集复查 5 条 A/H**（Tailwind 轴向 / RHF setValue / Router 守卫 / OGNL / Zod）——第一优先级
- ⑭ 性能优化成体系（🟡补学，2026 高级面试重灾区）
- 今日追加：⑬ Antd ✅（14/?，国内岗方向；Element 映射 + Form 三路线选型 + Modal 受控环）
- 教学节奏调整：新站放慢，每站学完当场费曼复述一次再走

---

## 2026-08-21 学习记录（Java 线）

### 课前小测（7 题）

### 课前小测（7 题）

4 到期 + 1 跨线 + 2 预测。

- ✅ **Q1 worker_threads（🔴 第 3 次说反后必查）**：**终于说对！** cluster=复制多份完整进程（多并发）、worker_threads=单进程内开线程共享内存（CPU 密集），三个维度全对
- ✅ Q2 React Router Outlet（🔴 上次 H）：H→G 翻盘
- ✅ Q3 axios 剥壳（到期）：过关（拿到的是后端纯业务数据）
- ❌ Q4 RHF+Zod 分工（到期）：**又说反第 2 次**（说成 RHF 定规则 Zod 管类型）→ 正确：Zod 定义规则、RHF 执行、zodResolver 桥接。锚点：**Zod 是规则书，RHF 是执行者**
- ❌ Q5 Spring Boot 自动配置（跨线）：忘光 → 课首 3 分钟重学（starter引类+yml给参数→@ConditionalOnXxx两条件→满足自动建Bean）
- ⚠️ Q6 Tailwind（预测）：方向对（行内 class 写 CSS）
- ❌ Q7 Redux Toolkit（预测）：不知道，正常

**3/5 实际题过关。worker_threads 终于翻盘（S 延至 6 天）**

### 公司代码考古 🏺（搜题后端 xkzy-ressearch-service）

真实架构发现——**Spring Boot 壳 + XML/properties 魂**：
- 项目骨架：Spring Boot（starter-parent + 内嵌容器）
- Dubbo 配置：XML（application-context.xml，老 Dubbo code.alibabatech.com）
- 参数：properties（大量 ${epas.server.app.key} 占位符），无 yml
- 注册中心：**两个**——EPAS（讯飞自研）+ Zookeeper（智学 zxRegistry）
- **RocketMQ 出现在 pom 的 exclusions 里**：公司生态其他服务用 RocketMQ，搜题服务本身不用（传递依赖被排除）

印证 Day 25：Spring Boot 允许混搭（@ImportResource 引 XML），真实公司项目"半迁移"状态很常见。

### 学习成果

**MQ 核心概念（Day 28）**

**1. MQ 三大价值**：
- **解耦**：下游挂了不影响上游（订单→MQ→库存，库存挂了消息排队，订单无感）。类比留言板
- **异步**：发完就走不等结果（Day 23 已学）
- **削峰**：秒杀 10 万请求进 MQ 排队，消费端按 DB 承受力（5000/秒）慢慢消费。**代价**：用户体验从"秒回"变"排队中→成功"两段式

**2. 消息可靠性三道防线**（消息一生三个丢失点）：
| 丢失环节 | 防线 |
|---|---|
| ① 发送时丢（网络传输失败） | 本地消息表（Day 23 学的闭环） |
| ② 存储时丢（MQ 断电） | 持久化 + 刷盘（生产必开） |
| ③ 消费时丢（处理一半崩了） | ACK 机制（处理成功才确认，没 ACK 重新投递） |

**3. ACK → 重复消费 → 幂等**：
- ACK 网络包丢失 → MQ 重新投递 → 同一消息处理两次
- 幂等三方案：唯一索引（DB 层兜底最硬）/ 先查后做（业务层）/ Redis setnx
- 🔴 **并发漏洞**：先查后做有"查和插之间的时间差缝隙"，两个消费者同时查都查不到→都执行。**唯一索引才是兜底**（DB 唯一约束原子，没有缝隙）

**记忆锚点**：
> 三防线：**表保发送、盘保存储、ACK 保消费**
> 幂等：**查挡九成，索引兜底**

### 收尾验证（3 问）

- Q1 削峰代价 ✅（用户等待后才知道结果）
- Q2 三防线 ⚠️（丢失环节说对，防线名对不上号——已补对应表）
- Q3 幂等并发漏洞 ⚠️（根因说成"网络波动补偿"，实际是**并发时间差**；"先查后改消除风险"说反——先查后做本身有风险，唯一索引才兜底）

### 今日面试题沉淀（3 道）

1. MQ 的三大价值？→ 解耦（下游挂不影响上游）/ 异步（发完就走）/ 削峰（洪峰排队按承受力消费，代价是结果延迟）
2. 怎么保证消息不丢？→ 三道防线：发送端本地消息表、存储端持久化刷盘、消费端 ACK 确认
3. 消息重复消费怎么办？→ 幂等。先查后做挡大部分，唯一索引兜底（先查后做有并发缝隙：两消费者同时查都查不到会都执行，DB 唯一约束原子无缝隙）

### 遗留问题 / 下次计划

- RocketMQ 消息模型（Topic/Tag/消费组/广播vs集群模式）
- 复习线：⑪ Tailwind → ⑫ Redux Toolkit
- 🔴 RHF/Zod 分工（说反第 2 次，08-23 复查）
- 🔴 Spring Boot 自动配置（重学后 08-23 快速确认）

---

## 上次会话（存档）

**2026-08-17（前端复习线 ⑩ axios + RHF + Zod）**
