---
tags: [多agent, 权限, AgentScope]
创建时间: 2026-07-11
状态: 已掌握
---

# 多 agent 与权限系统

## 🧠 多 agent:为什么要

单 agent 干所有事,prompt 臃肿、工具多、顾此失彼。多 agent = 拆给多个专职 agent(各有人设/工具)协作。

## 🔀 三种协作模式

1. **主管-工人**(orchestrator-worker):主管拆任务→分工人→汇总
2. **辩论/讨论**:多角色讨论→总结
3. **流水线**:A 输出→B 输入→C(翻译→校对→发布)

## ⚠️ 多 agent 两层(重要,源码+文档确认)

| 层 | 能力 | 依赖 |
|---|---|---|
| **脚本层**(`Agent` + `reply_stream`) | 手动编排多实例 | 无,轻量 |
| **服务层**(`create_app` + FastAPI) | 原生团队(Leader 生成 Worker) | Redis + workspace |

> 官方概述表:Agent 团队(Leader/Worker)**只在服务层**。轻量脚本做不了原生团队。`dashscope_multiagent.py` 是**单 model 扮多角色**(formatter 格式化历史),不是真多 agent 实例。

## 📝 脚本层多 agent demo(流水线:翻译→校对)

```python
async def run_agent(agent, prompt):
    result = ""
    async for evt in agent.reply_stream(UserMsg("user", prompt)):
        if evt.type == EventType.TEXT_BLOCK_DELTA:
            result += evt.delta
    return result

# 流水线:A 翻译 → B 校对(吃 A 的输出)
translated = await run_agent(translator, source)
final = await run_agent(proofreader, f"请校对这段英文译文:{translated}")
```

核心:**把 A 的输出当 B 的输入**,手动衔接。两个专职 agent 各干各的,轻量能跑。

## 🔍 为什么服务层需要 Redis

一句话:**多 agent 团队要跨进程协作,Redis 是「跨进程的共享大脑」(通信 + 状态 + 并发锁);脚本层单进程用内存就行。**

### 服务层三个基础设施(`create_app` 必需)

| 组件 | 作用 | 后端 |
|---|---|---|
| `storage` | 持久化(agent 记录 / 会话状态 / 凭证 / 知识库) | **Redis** |
| `message_bus` | 消息/协调(通信 / 事件推送 / 并发锁) | 内存 或 **Redis** |
| `workspace_manager` | 工作区沙箱(跑工具) | 本地/Docker/E2B |

### 为什么多 agent 团队特别需要 Redis

Leader 生成 Worker,Worker 常跑在**别的工作进程**(如知识库索引的独立后台 worker)。Leader/Worker 跨进程要解决三件事:

| 需求 | 解决 |
|---|---|
| 跨进程通信(Worker → Leader 汇报) | MessageBus(Redis Pub/Sub 或 Streams) |
| 状态共享(Leader 看 Worker 进度 / HITL 投射) | Storage(Redis 键值) |
| 并发控制(同会话不并发跑) | Redis 分布式锁 |

> 关键:**跨进程 = 进程内存共享不了**,必须找「两个进程都够得着的地方」放消息和状态 = Redis。

### Node.js 类比(已学,直接对应)

| 场景 | Node.js | AgentScope |
|---|---|---|
| 单实例 | session 存内存(`new Map()`) | 单 agent 脚本:`AgentState` 在内存 |
| 多实例集群 | session 共享 / Socket.IO 多节点广播 → **Redis adapter** | 多 agent 服务 → **Redis** |

同一回事:Node 集群用 Redis 共享 session/广播,AgentScope 多 agent 服务用 Redis 共享状态/通信。

### Redis 可替换(设计解耦)

AgentScope 把 `storage` 和 `message_bus` **解耦**,后端可换:
- `MessageBus`:开发用 `InMemoryMessageBus`(纯 Python,**只能单进程**);生产用 Redis(跨进程)
- `Storage`:可换别的键值/关系型后端

> Redis 是「生产级多进程」的选择,**不是「多 agent 概念」的必需**。脚本层手动编排不用 Redis。

### 🧠 记忆锚点

> Redis = 多 agent 服务的「跨进程共享大脑」(通信 + 状态 + 锁)。脚本层单进程用内存;服务层多进程协作必须 Redis —— 和 Node 集群用 Redis 共享 session 同理。

---

## 🔐 权限系统(内置,生产级特色)

AgentScope 工具调用前过权限引擎 —— 像 Claude Code 执行命令前问「允许吗」。

### PermissionMode 五模式(源码 `_types.py` 确认)

| 模式 | 行为 | 场景 |
|---|---|---|
| `DEFAULT` | 每操作问确认(**默认**,会卡) | 最安全,有人盯 |
| `ACCEPT_EDITS` | 自动允许工作目录读写 | 快速开发 |
| `EXPLORE` | 只读(禁修改) | 探索代码库 |
| **`BYPASS`** | **跳过所有确认,自动执行** | 沙箱/无人值守,demo 用 |
| `DONT_ASK` | 所有 ASK 转 DENY(会拒工具) | 无人值守求安全 |

### PermissionBehavior 四值
`ALLOW` / `DENY` / `ASK` / `PASSTHROUGH`

### REQUIRE_USER_CONFIRM 机制

DEFAULT 模式下,工具执行前发 `REQUIRE_USER_CONFIRM` 事件**打断循环**,Agent 进入等待。下次携带 `UserConfirmResultEvent` 调 `reply()` 从暂停处恢复。demo 用 BYPASS 跳过这个确认。

## 🔗 关联概念

- [[AgentScope核心概念与API]]
- [[../03-易错点与陷阱/AgentScope易错点|易错点]]
