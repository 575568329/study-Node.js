# LangChain.js 四大核心组件

## 1. Model（模型）

LangChain 用统一的接口调用不同 LLM：

```javascript
import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
  model: 'glm-4-flash',
  temperature: 0.7,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',  // GLM 兼容配置
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

const result = await model.invoke([new HumanMessage('你好')])
```

**关键**：`configuration.baseURL` 让 ChatOpenAI 适配非 OpenAI 的 API（GLM、DeepSeek 等）。

## 2. Prompt Template（提示词模板）

把变量从硬编码中抽离：

```javascript
import { ChatPromptTemplate } from '@langchain/core/prompts'

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个{role}'],
  ['human', '{input}']
])

// 格式化：填入变量
const formatted = await prompt.invoke({ role: '前端工程师', input: '什么是 Promise?' })
```

## 3. Chain（链式调用）

用 `.pipe()` 把组件串成管道：

```javascript
const chain = prompt.pipe(model).pipe(parser)

// 一步到位
const result = await chain.invoke({ role: '前端工程师', input: '什么是 Promise?' })
```

**核心思想**：数据像流水线一样流过每个组件。

## 4. Output Parser（输出解析器）

让 AI 返回结构化数据（JSON），用 Zod 定义格式：

```javascript
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1)
  })
)

// Zod 做了两件事：
// 1. parser.getFormatInstructions() → 自动生成 prompt 指令告诉 AI 返回什么格式
// 2. 解析后自动验证 → 格式不对会报错
```

## 数据流总览

```
用户输入 → Prompt Template（填变量）→ Model（调 AI）→ Output Parser（解析 JSON）
           ↑ .pipe()                  ↑ .pipe()          ↑ .pipe()
```
