# LangGraph.js 学习会话 - 2026-05-06

## 会话概述
- **主题**: LangGraph.js 入门（StateGraph + Agent with Tools）
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

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| agent 和 LLM 有什么区别？ | LLM 只能对话，Agent 有工具/技能，能自主决定是否调工具 |
| LangGraph 和 LangChain 的管道模式有什么区别？ | LangChain 管道是直线流程，LangGraph 是节点自由流转的图 |
| State 是随便定义的吗？ | 字段名随意但类型要明确，覆盖模式 vs 追加模式（ReducedValue）有区别 |
| 分类路由岂不是要写无数个节点？ | Agent 模式下 LLM 自己决定调哪个工具，不需要手动写分类 |
| tool_calls 怎么检查？ | toolsCondition 预置函数，自动检查最后一条消息的 tool_calls |
| LangChain 和 Vercel AI SDK 的工具调用区别？ | 本质一样，都是把工具定义翻译成 LLM API 格式，是 LLM 自己决定调工具 |

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

## 掌握主题
- StateGraph 图编排（State/Node/Edge）
- 条件分支路由
- ReducedValue 追加模式
- Agent with Tools 完整循环
- MessagesAnnotation 使用
- toolsCondition + ToolNode

## 表现评估
- **理解速度**: 快。能快速理解 Agent 循环（思考→行动→观察→再思考）的概念
- **动手能力**: 强。自己写了完整代码，踩了很多类型错误但都通过错误提示自学解决
- **深度思考**: 提出"LangGraph vs LangChain 管道"和"分类路由 vs Agent 自动路由"的好问题
- **核心理解**: 已理解 Agent 模式的本质是 LLM 自主决策 + 工具循环，不是手动 if-else
