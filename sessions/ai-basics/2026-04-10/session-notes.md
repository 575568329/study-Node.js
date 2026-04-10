# AI 应用开发基础 - 学习会话 2026-04-10

## 会话概述
- **主题**: 大模型基础 + API 调用 + Prompt Engineering + 流式输出
- **时长**: 约2小时
- **状态**: ✅ 完成
- **学习方式**: 理论讲解 + 动手实践

---

## 课前小测

| 题号 | 类型 | 结果 | 备注 |
|------|------|------|------|
| Q1 | 预测试（LLM概念） | ⚠️ | 方向对，"不能操作工具"不准确（Function Calling 可以） |
| Q2 | 预测试（Prompt Engineering） | ⚠️ | 基本理解，表述偏浅 |
| Q3 | 盲区（params await） | ❌ | 未作答，第3次遗漏 |
| Q4 | 随机（Server/Client） | ❌ | 未作答 |
| Q5 | 跨技能（子传父回调） | ❌ | onClick={fn(arg)}立即执行 + 类型不匹配，第3次同类错误 |

---

## 学习内容

### 1. LLM 基础概念

**Token**：模型处理文本的最小有意义单位，兼顾效率和语义
- `"Hello World"` → `["Hello", " World"]` (2 tokens)
- 比按字符处理效率高，比按词处理灵活

**Next-token prediction**：模型本质是预测下一个 token
- 对前面所有 token 打分（概率），选最高的
- temperature 控制随机性：低温度=确定，高温度=创意

**多轮对话原理**：AI 无状态，每次请求需传完整对话历史
- messages 数组：system → user → assistant → user → ...
- 对话越长 token 消耗越大

### 2. OpenAI 兼容 API 调用

**智谱 GLM API**（OpenAI 兼容格式）：
- URL: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 请求结构：headers(Content-Type + Authorization) + body(model + messages + temperature)
- 返回结构：`data.choices[0].message.content` + `data.usage` (token 统计)

**环境配置**：
- `.env` 文件管理 API Key（值不加引号和空格）
- `require('dotenv').config()` 加载环境变量

### 3. Prompt Engineering

**System Prompt 三要素**：
1. **角色**：设定 AI 身份（"你是一个资深前端面试官"）
2. **规则**：约束输出格式和行为
3. **示例**：给出期望的输入输出样例

**实战效果**：修改一行 system prompt，AI 从通用助手变为面试考官

### 4. 流式输出（Streaming）

**原理**：SSE（Server-Sent Events），逐块返回数据
- 请求加 `stream: true`
- 返回格式：`data: {"choices":[{"delta":{"content":"字"}}]}\n\n`
- 结束标记：`data: [DONE]`

**代码实现**：
```javascript
const reader = res.body.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value, { stream: true })
  // 按 \n 切割 → 过滤 data: 开头 → 去前缀 → JSON.parse → delta.content
  process.stdout.write(content)  // 不换行打印
}
```

**踩坑**：
- JSON 数据包可能被切成两块 → try-catch 跳过残片
- 流式输出内容需要拼接（fullContent += content）才能存入 messageList
- content 定义在 try 块内，外部访问不到 → 变量提升到函数作用域

### 5. 多轮对话聊天工具

**项目**: `projects/ai-basics/chat.js`
**功能**：终端多轮流式聊天 + 前端面试官模式
**技术**：readline + fetch + SSE streaming + dotenv

---

## ❌ 错误记录

### 错误1: API Key 用错
- 写了 CONTEXT7 的 key，不是 GLM 的 key
- 修复：从环境变量读取 `process.env.ANTHROPIC_AUTH_TOKEN`

### 错误2: .env 格式错误
- 值加了引号和空格：`KEY = 'value'`
- 正确：`KEY=value`

### 错误3: choices 少写 s
- `data.choice` → `data.choices[0]`

### 错误4: 流式 JSON 解析报错
- chunk 被切割导致 JSON 不完整
- 修复：try-catch 包裹 JSON.parse

### 错误5: content 变量作用域
- 定义在 try 块内，外部 push 到 messageList 时报 undefined
- 修复：提取 fullContent 变量到函数作用域

### 错误6: system role 写成 assistant
- 修复：role 应为 'system'

---

## 掌握主题
- ✅ Token 概念与 LLM 工作原理
- ✅ OpenAI 兼容 API 调用
- ✅ 多轮对话 messages 管理
- ✅ System Prompt Engineering
- ✅ 流式输出（SSE）读取与拼接
- ✅ .env 环境变量管理
- ✅ readline 终端交互

---

## 表现评估
- **理解能力**: ⭐⭐⭐⭐ 快速理解 token 和流式输出概念
- **代码实践**: ⭐⭐⭐⭐ 能独立完成大部分代码，流式部分需要指导
- **学习速度**: ⭐⭐⭐⭐⭐ 一天完成计划2天的内容
- **待改进**: 变量作用域意识、子传父回调（反复出错）

---

## 下次学习内容

根据加速计划第3周：
- Anthropic API 调用 + 两者对比
- Prompt Engineering 进阶（结构化/Few-shot/Chain of Thought）
- 流式输出前端配合（SSE → 前端 EventSource）
