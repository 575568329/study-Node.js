# LangGraph.js 学习会话 - 2026-05-06

## 会话概述
- **主题**: LangGraph.js 入门 + Memory + Human-in-the-loop + Agent 工具审批 + Checkpoint 设计
- **状态**: 已完成

## 学习内容

### 1. StateGraph 图编排（01-hello-graph2.ts）
- 纯逻辑图，不依赖 LLM
- StateSchema 定义状态 → addNode 添加节点 → addEdge/addConditionalEdges 连接
- 覆盖模式（默认）vs 追加模式（ReducedValue + reducer）
- 条件分支：routeByType 函数返回目标节点名

### 2. Agent with Tools（02-agent-with-tools.ts）
- MessagesAnnotation 替代自定义 State（Agent 必须用消息状态）
- tool() 定义工具 + zod schema
- bindTools 绑定工具到模型
- ToolNode 自动执行工具调用
- toolsCondition 判断是否需要调工具
- Agent 循环：agent → tools → agent → END

### 3. Memory 多轮对话上下文（03-agent-with-memory.ts）
- `MessagesAnnotation` 负责 messages 状态追加
- `MemorySaver` 负责保存/恢复每轮图执行后的 state
- `thread_id` 是会话级 ID，不是用户 ID
- 同一 `thread_id` 能恢复上下文，不同 `thread_id` 隔离上下文
- 验证结果：同一会话能回答“你叫张三”，新会话无法知道名字

### 4. Human-in-the-loop 人工审批（04-human-in-the-loop.ts）
- `interrupt(value)` 暂停图执行，并返回 `__interrupt__`
- `Command({ resume })` 带人类审批结果恢复执行
- `checkpointer` 保存暂停现场，否则无法从中断点继续
- 纯图审批流程：prepareAction → humanReview → executeAction
- 验证了批准与拒绝两个分支

### 5. Agent 工具审批（05-agent-tool-approval.ts）
- 在危险工具内部调用 `interrupt()`，让安全边界贴近危险动作
- 验证 `deleteFile` 工具执行前返回 `__interrupt__`
- 审批通过后生成 ToolMessage 并由 Agent 总结
- 审批拒绝后工具返回“用户拒绝执行工具”，Agent 生成取消说明
- 抽象出 `toolPolicies`、`shouldRequireApproval`、`withApproval`
- 安全策略：白名单工具直接执行，未知工具默认审批（fail closed）

### 6. Checkpoint 持久化设计
- `MemorySaver` 是进程内存存储，服务重启后无法恢复中断现场
- 生产环境应使用数据库 checkpointer（Postgres/MySQL 更适合多用户线上部署）
- `messages` 表用于聊天历史展示，checkpoint 用于恢复图执行现场
- 业务表建议拆分为 `conversations`、`messages`、`approvals/interrupts`
- `thread_id` 属于 conversation 级别，不应重复放在每条 message 上

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| agent 和 LLM 有什么区别？ | LLM 只能对话，Agent 有工具/技能，能自主决定是否调工具 |
| LangGraph 和 LangChain 的管道模式有什么区别？ | LangChain 管道是直线流程，LangGraph 是节点自由流转的图 |
| State 是随便定义的吗？ | 字段名随意但类型要明确，覆盖模式 vs 追加模式（ReducedValue）有区别 |
| 分类路由岂不是要写无数个节点？ | Agent 模式下 LLM 自己决定调哪个工具，不需要手动写分类 |
| tool_calls 怎么检查？ | toolsCondition 预置函数，自动检查最后一条消息的 tool_calls |
| LangChain 和 Vercel AI SDK 的工具调用区别？ | 本质一样，都是把工具定义翻译成 LLM API 格式，是 LLM 自己决定调工具 |
| `main()` 为什么不用来执行对话？ | top-level await 可用，但 `main().catch()` 结构更清晰，利于错误处理 |
| `as { approved: boolean }` 是什么效果？ | TypeScript 类型断言，只影响编译期，不做运行时校验 |
| `interrupt` 返回的 `id` 和 `value` 分别是什么？ | id 标识暂停点，value 是展示给人类审批的内容 |
| 审批逻辑放在哪里更合理？ | Demo 中放危险工具内部最直观；真实项目可工具前统一策略 + 工具内部兜底 |
| 未配置的新工具应该直接执行还是审批？ | 默认审批，fail closed，避免未知工具被模型直接调用 |
| `thread_id` 应该放 messages 还是 conversations？ | 放 conversations；messages 通过 conversation_id 关联 |

## ❌ 错误记录（复习重点）

### 错误1：MessagesState 不存在
- **错误**: `import { MessagesState } from "@langchain/langgraph"`
- **原因**: @langchain/langgraph v1.3.0 没有 MessagesState，只有 MessagesAnnotation 和 MessagesZodState
- **正确**: `import { MessagesAnnotation } from "@langchain/langgraph"`

### 错误2：addEdge 传函数而非字符串
- **错误**: `.addEdge(START, llmNode)` 传了函数变量
- **原因**: addEdge 的参数是节点名字符串，不是函数引用
- **正确**: `.addEdge(START, "agent")`

### 错误3：ChatOpenAI 的 apiKey 参数名
- **错误**: 用 `openAIApiKey` 或 `configuration.apiKey`
- **原因**: ChatOpenAI v1.x 的参数名是 `apiKey`，不是 `openAIApiKey`
- **正确**: `{ apiKey: process.env.ANTHROPIC_AUTH_TOKEN }`

### 错误4：dotenv 加载时机
- **错误**: `import "dotenv/config"` 放在 import 末尾，模块级代码先于 env 加载执行
- **正确**: 改为 `import { config } from "dotenv"; config()` 放在文件最顶部

### 错误5：.env 文件格式
- **错误**: `KEY = value`（等号两边有空格）
- **正确**: `KEY=value`（dotenv 不解析带空格的行）

### 错误6：dotenv 变量名不一致
- **错误**: `.env` 中配置 `ZHIPU_API_KEY`，代码读取 `process.env.ANTHROPIC_AUTH_TOKEN`
- **现象**: dotenv 显示 injected env (1)，但 ChatOpenAI 仍报 Missing credentials
- **正确**: 变量名保持一致：`apiKey: process.env.ZHIPU_API_KEY`

### 错误7：config 命名冲突
- **错误**: 从 dotenv 导入 `config()` 后，又定义 `const config = {...}`
- **原因**: 函数名与运行配置对象同名，导致“此表达式不可调用”
- **正确**: LangGraph 运行配置命名为 `runConfig`

### 错误8：Human-in-the-loop 的 resume 与 state 字段混淆
- **错误理解**: 恢复结果应该写到 `resume` 字段
- **正确理解**: `resume` 是外部恢复输入，节点内通过 `interrupt()` 获得后写回 `approved` 等 State 字段

### 错误9：withApproval 泛型推断为 unknown
- **错误**: `({ expression }) => string` 不能赋给 `(input: unknown) => string`
- **原因**: 泛型未被正确推断，输入落为 unknown
- **正确**: 显式传入输入类型，如 `withApproval<CalculatorInput>("calculator", ...)`

### 错误10：messages 表与 checkpoint 混淆
- **错误理解**: 只保存 messages 即可恢复审批点
- **正确理解**: messages 只能展示聊天历史，checkpoint 才保存“图从哪里继续”的执行现场

## 掌握主题
- StateGraph 图编排（State/Node/Edge）
- 条件分支路由
- ReducedValue 追加模式
- Agent with Tools 完整循环
- MessagesAnnotation 使用
- toolsCondition + ToolNode
- MemorySaver + thread_id 多轮记忆
- interrupt + Command resume 人工审批
- Agent 危险工具审批
- toolPolicies + withApproval 工具安全策略
- Checkpoint 持久化设计与业务表拆分

## 表现评估
- **理解速度**: 快。能快速理解 Agent 循环（思考→行动→观察→再思考）的概念
- **动手能力**: 强。自己写了完整代码，踩了很多类型错误但都通过错误提示自学解决
- **深度思考**: 提出"LangGraph vs LangChain 管道"和"分类路由 vs Agent 自动路由"的好问题
- **核心理解**: 已理解 Agent 模式的本质是 LLM 自主决策 + 工具循环，不是手动 if-else
- **安全意识**: 能主动提出白名单放行、未知工具默认审批的 fail closed 策略
- **架构意识**: 能区分 userId、conversationId、thread_id，以及 messages 与 checkpoint 的职责边界
