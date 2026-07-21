# Agent 工具调用

> 学习日期: 2026-04-19 | 置信度: ⭐⭐⭐

---

## 核心概念

Agent = LLM + 工具 + 自主决策。LLM 自己决定调什么工具、调几次、什么顺序，而不是代码写死流程。

与 Chain 的区别：
- Chain：固定管道，代码控制流程（prompt.pipe(model)）
- Agent：LLM 自主决策，动态调工具

Claude Code 就是 Agent 模式的典型例子——LLM 自主决定调用 Read、Edit、Bash 等工具。

## 代码示例

### 定义工具

```javascript
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

// tool(执行函数, 配置对象)
const calculator = tool(
  ({ expression }) => String(eval(expression)),
  {
    name: 'calculator',
    description: '计算数学表达式的结果',
    schema: z.object({
      expression: z.string().describe('数学表达式，如 "2+3"')
    })
  }
)

const getCurrentTime = tool(
  () => new Date().toLocaleString('zh-CN'),
  {
    name: 'get_current_time',
    description: '获取当前日期和时间',
    schema: z.object({})
  }
)
```

### 创建和运行 Agent

```javascript
import { AgentExecutor, createToolCallingAgent } from '@langchain/classic/agents'

const tools = [calculator, getCurrentTime]

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个有用的助手，可以使用工具帮助用户。'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],  // 必须！记录 Agent 思考过程
])

// 第1步：创建 Agent（组装 LLM + 工具 + prompt）
const agent = await createToolCallingAgent({ llm: model, tools, prompt })

// 第2步：创建执行器（自动循环：思考→调工具→再思考→...→最终回答）
const agentExecutor = new AgentExecutor({ agent, tools })

// 第3步：运行
const result = await agentExecutor.invoke({ input: '现在几点了？123*456是多少？' })
console.log(result.output)
```

## 执行流程

```
用户提问: "现在几点了？123*456是多少？"
  ↓
AgentExecutor 循环:
  第1轮: Agent 思考 "需要查时间" → 调 get_current_time() → "2026-04-19 14:25:57"
  第2轮: Agent 思考 "需要计算" → 调 calculator({expression:"123*456"}) → "56088"
  第3轮: Agent 思考 "信息够了" → 生成最终回答
  ↓
输出: "当前时间：2026年4月19日 14:25:57，123×456=56088"
```

## 关键要点

1. `tool()` 把普通函数包装成 LLM 能理解和调用的工具（函数 + 元信息）
2. `description` 是关键——LLM 靠描述决定用不用这个工具
3. `schema` 用 Zod 定义参数格式，LLM 按这个传参
4. `{agent_scratchpad}` 占位符不能省略，记录 Agent 的思考过程
5. `createToolCallingAgent` = 组装 Agent，`AgentExecutor` = 自动执行循环
6. Agent 本质和 Claude Code 是同一个模式

## ❌ 常见错误

### 错误1：忘记导入 dotenv/config
- 缺少 `import 'dotenv/config'` 导致 process.env 读取不到

### 错误2：tools 变量未定义
- 需要 `const tools = [calculator, getCurrentTime]` 显式定义数组

### 错误3：重复导入 / 错误导入
- `AgentExecutor` 重复导入
- `tools` 不是从 `@langchain/openai` 导出的

## 🔗 相关知识
- [[LangChain四大组件]] — Chain 是 Agent 的前置知识
- [[RAG完整流程]] — RAG 可以作为 Agent 的一个工具

**标签**: #LangChain #Agent #工具调用
