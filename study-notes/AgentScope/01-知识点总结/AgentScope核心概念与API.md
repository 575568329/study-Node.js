---
tags: [概念, AgentScope, 重要]
创建时间: 2026-07-11
状态: 已掌握
置信度: High
---

# AgentScope 核心概念与 API

## 📝 定义

AgentScope 是阿里达摩院的 **Python 多 agent 框架**,基于 **Actor 模型**(agent 间消息通信、不共享内存),深度集成通义千问/DashScope。金海指定替换 langchain/langgraph,因匹配阿里云生态。

## 🎯 心智模型:建「Agent」

一句话:**给 agent 大脑+工具+人设,它自己 ReAct 循环干活,事件流告诉你它在干嘛。**

| 框架 | 哲学 | 你干什么 |
|---|---|---|
| LangChain | 拼「链」Chain | prompt→model→parser 一段段接,命令式 |
| LangGraph | 画「图」Graph | 节点+边+状态,画控制流(状态机) |
| **AgentScope** | **建「Agent」** | 给大脑+工具,它自己循环,你订阅事件 |

> 关键差异:LangChain/LangGraph 是**你编排控制流**;AgentScope 是 **Agent 自己跑循环、你只订阅事件流**。

## 🧩 五大核心抽象

1. **Agent**:核心,内置 ReAct 循环(推理→行动)
2. **Model**:LLM 封装(DashScopeChatModel 等,配 Credential)
3. **Message**:Msg + 内容块(TextBlock/ThinkingBlock/ToolCallBlock/ToolResultBlock)
4. **Toolkit**:工具箱,注册 tools/MCP/skill(FunctionTool 包普通函数)
5. **Event**:事件流(reply_stream yield 事件,可观测全流程)

## ⚙️ Agent 构造(10 参数,源码 `__init__` 确认)

| 参数 | 必填 | 作用 |
|---|---|---|
| `name` | ✅ | 身份(多 agent 消息路由) |
| `system_prompt` | ✅ | 人设/指令 |
| `model` | ✅ | 大脑(LLM) |
| `toolkit` | ❌ | 工具箱(tools/MCP/skill 都挂这) |
| `middlewares` | ❌ | 中间件(不改源码改行为) |
| `state` | ❌ | 状态(权限/上下文/迭代) |
| `offloader` | ❌ | 上下文卸载 |
| `model_config` | ❌ | 模型重试/兜底 |
| `context_config` | ❌ | 上下文压缩 |
| `react_config` | ❌ | ReAct 循环 |

> ⚠️ **没有 `permission_context`** —— 权限在 `state` 里,见 [[#三层嵌套配置]]。

## 📦 AgentState(状态对象,9 字段)

`session_id` / `summary` / `context` / `reply_id` / `cur_iter` / **`permission_context`** / `tool_context` / `tasks_context` / `middle_context`

权限配在 `permission_context` 字段(不在 Agent 构造)。

### 三层嵌套配置(AgentState → PermissionContext → PermissionMode)

```python
state = AgentState(                              # ① 状态对象
    permission_context=PermissionContext(        # ② 权限上下文字段
        mode=PermissionMode.BYPASS               # ③ 模式枚举值
    ),
)
agent = Agent(..., state=state)
```

设计哲学:**组合优于继承** —— 每个关注点一个类(状态/权限/模式各管一摊),可替换、可组合。

## 🔧 三个 config 字段

- **ReActConfig**:`max_iters`(默认20)/ `stop_on_reject` / `interruption_message` / `interruption_raise_cancelled_error`
- **ContextConfig**:`trigger_ratio` / `reserve_ratio` / `compression_prompt` / `summary_template` / `summary_schema` / `tool_result_limit`
- **ModelConfig**:`max_retries` / `fallback_model`

## 📡 调用:reply_stream + 事件流

```python
async for evt in agent.reply_stream(UserMsg("Tony", "...")):
    if evt.type == EventType.TEXT_BLOCK_DELTA:
        print(evt.delta, end="", flush=True)
```

- `reply_stream(...)`:启动 agent,返回**事件流**(async generator)
- `UserMsg(名字, 内容)`:快捷构造用户消息

### 事件类型(源码 `_event.py` 确认)

| 事件 | 含义 |
|---|---|
| `REPLY_START`/`END` | 一次回复开始/结束 |
| `MODEL_CALL_START`/`END` | 调一次模型(一轮思考) |
| `TEXT_BLOCK_DELTA` | 正式回答的文本流 |
| `THINKING_BLOCK_DELTA` | 思考过程(思考模式) |
| `TOOL_CALL_START`/`DELTA`/`END` | 生成工具调用请求 |
| `TOOL_RESULT_*` | 工具执行结果 |
| `REQUIRE_USER_CONFIRM` | 权限确认(要回复才继续) |
| `EXCEED_MAX_ITERS` | 超迭代上限 |

## 🔁 ReAct 循环

agent 重复「推理(`MODEL_CALL`)→ 行动(`TOOL_CALL`)」直到模型不再调工具、给最终答案。`cur_iter` 每轮递增,`max_iters` 默认 20 防死循环。

## 🆚 对比 LangChain / LangGraph

| 维度 | LangChain | LangGraph | AgentScope |
|---|---|---|---|
| 核心抽象 | Chain 链 | Graph(节点+边+状态) | Agent(内置ReAct) |
| 控制流 | 你拼链(命令式) | 你画图(状态机) | 框架内置循环,你订阅事件 |
| 状态 | Memory 外挂 | State 核心流转 | AgentState 统一管理 |
| 可观测 | callbacks | LangSmith 可视化 | 事件流 reply_stream |
| 工具权限 | 无 | 无 | 内置权限引擎 |
| 多 agent | 弱 | 强(图多节点) | 强(Actor 消息传递) |
| 生态 | LLM 最广 | 同上 | 通义千问/阿里云深度集成 |

## 🎯 金海为什么选 AgentScope

不是更强,是**生态匹配**:金海公司阿里云/通义生态,AgentScope 深度集成通义千问。
决策:快速拼 LLM → LangChain;复杂显式工作流 → LangGraph;阿里生态/多 agent+权限 → AgentScope。

## 🔗 关联概念

- [[多agent与权限系统]]
- [[../03-易错点与陷阱/AgentScope易错点|易错点]]
- [[../05-速查表/AgentScope速查表|速查表]]
- [[../../MCP/01-知识点总结/MCP核心概念与三方架构|MCP]](AgentScope 内置 mcp 模块)
