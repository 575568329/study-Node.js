---
tags:
  - 概念
  - LLM-API
  - OpenAI
  - Anthropic
  - 重要
创建时间: 2026-06-16
状态: 已掌握
置信度: High
---

# OpenAI 与 Anthropic API 协议对比

> 🧠 **记忆锚点**：**OpenAI——`system` 塞 messages、`max_tokens` 可选、认证 `Authorization: Bearer`、偏「对话」;Anthropic——`system` 独立顶层、`max_tokens` 必填、认证 `x-api-key` + 版本头、偏「结构化 block」。两套并存因 OpenAI 先发成事实标准、Anthropic 走自己哲学;MCP 来补「工具层」标准。**

## 📝 定义

OpenAI / Anthropic 各自的「API 协议」= **调用大模型时怎么传参的规范**（请求 / 响应 / 流式 / 工具调用格式）。严格说不是开放标准，但业界口语称「OpenAI 格式」「Anthropic 格式」。

**为什么必懂**：OpenAI 的 Chat Completions 格式是**事实标准**——智谱 GLM、DeepSeek、Kimi、本地 vLLM / LM Studio 等几乎都兼容它。接 LLM 90% 是这两种之一。

## 🎯 一、OpenAI 完整最小请求

```http
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer sk-xxxx
Content-Type: application/json

{
  "model": "gpt-4o",                       // 必填
  "messages": [                            // 必填
    { "role": "system", "content": "你是翻译" },   ← system 塞在数组里
    { "role": "user",   "content": "你好" }
  ],
  "max_tokens": 1000,                      // 可选（有默认）
  "temperature": 0.7                       // 可选
}
```

关键细节：
1. **system 不是独立字段**，是 messages 里的一条 `{role:"system"}`。
2. **`max_tokens` 可省**（有默认）。
3. **`content` 可直接是字符串**。
4. 认证用 `Authorization: Bearer`。

## 🎯 二、Anthropic 完整最小请求

```http
POST https://api.anthropic.com/v1/messages
x-api-key: sk-ant-xxxx
anthropic-version: 2023-06-01              ← 多一个版本头（必填）
Content-Type: application/json

{
  "model": "claude-sonnet-4-6",            // 必填
  "max_tokens": 1000,                      // 必填！漏了报错
  "system": "你是翻译",                     // 顶层独立字段
  "messages": [                            // 必填
    { "role": "user", "content": "你好" }   ← 这里没有 system
  ],
  "temperature": 0.7
}
```

关键细节：
1. **`system` 是顶层独立参数**，不混进 messages。
2. **`max_tokens` 必填**。
3. 认证用 `x-api-key` + `anthropic-version` 头。

## 🆚 三、区别浓缩（核心设计哲学）

> 同样一句「你是翻译」——
> **OpenAI** 当对话第一句，塞进 messages 的 `{role:"system"}`；
> **Anthropic** 当「指令 / 配置」，拎到顶层 `system` 字段。

| 维度 | OpenAI | Anthropic |
|---|---|---|
| 端点 | `/v1/chat/completions` | `/v1/messages` |
| 认证 | `Authorization: Bearer` | `x-api-key` + `anthropic-version` |
| system | 塞进 messages 数组 | 顶层独立字段 |
| max_tokens | 可选 | **必填** |
| content | 可纯字符串 | block 数组（原生多模态） |
| 哲学 | 偏「对话」 | 偏「指令 + 结构化」 |

## 🔧 四、工具调用（function calling / tool use）

**两家本质是同一个循环：**

```
模型判断「需要调工具」→ 返回结构化 tool_call
   → 应用执行真正的函数
   → 把结果喂回模型
   → 模型拿到结果继续生成
```

**OpenAI：**

```jsonc
"tools": [{ "type": "function",
  "function": { "name": "get_weather", "parameters": { /*JSON Schema*/ } } }]
// 模型返回
"tool_calls": [{ "id": "call_abc", "function": { "name": "get_weather", "arguments": "{\"city\":\"上海\"}" } }]
// arguments 是 JSON 字符串，要 JSON.parse
// 回传结果
{ "role": "tool", "tool_call_id": "call_abc", "content": "25℃" }
```

**Anthropic：**

```jsonc
"tools": [{ "name": "get_weather", "input_schema": { /*JSON Schema*/ } }]
// 模型返回（content 是 block 数组）
"content": [{ "type": "tool_use", "id": "toolu_abc", "name": "get_weather", "input": { "city": "上海" } }]
// input 已是对象，不用 parse
// 回传结果（塞进 user 的 tool_result block）
{ "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "toolu_abc", "content": "25℃" }] }
```

**三个易混点：**
1. OpenAI `arguments` 是**字符串**（要 parse），Anthropic `input` 是**对象**。
2. OpenAI 用独立 `role:"tool"` 回结果，Anthropic 塞进 `role:"user"` 的 `tool_result` block。
3. 参数 schema 字段：OpenAI 叫 `parameters`，Anthropic 叫 `input_schema`。

## 🆕 五、OpenAI Responses API（新一代）

- `POST /v1/responses`，Chat Completions 的**继任者**，GPT-5 时代主推。
- **内置工具**（web_search、code_interpreter、文件检索），Agent 导向。
- 跨厂商兼容性暂不如 Chat Completions。
- 取舍：要广兼容 / 接国产模型 → Chat Completions；纯 OpenAI 生态 + 新能力 → Responses。

## 🤔 六、为什么会有两套

**1. 时间线：OpenAI 先发占坑**
OpenAI 2023 推 Chat Completions，格式简单、对话直观，先拿下开发者心智；后来者为零迁移成本纷纷兼容 → 成**事实标准**。

**2. Anthropic 后发，走不同设计哲学**

| Anthropic 的选择 | 背后想法 |
|---|---|
| `system` 独立顶层 | system 是「指令 / 配置」，不该和对话轮次混 |
| `content` 一律 block 数组 | 一条消息可含文本 + 图片 + 工具调用 → 原生多模态 + agent 友好 |
| 强制 `max_tokens` | 安全 / 成本可控，呼应 AI safety |

**3. 为什么没统一**
- 没有强制标准机构（不像 HTTP 有 W3C）。
- 商业竞争：两家都想绑开发者到自家生态，不愿用对手格式。
- 结果：OpenAI 格式成通用兼容层，Anthropic 坚持自己一套，并存。

**4. 这是 MCP 出现的动机**
正因 API 格式不统一、工具集成要为每家分别写（N×M），Anthropic 发起 **MCP**——不在「模型 API 格式」层统一（做不到），而在「工具 / 数据怎么暴露」层做标准。

> **MCP 是对「LLM API 不统一」的聪明折中：API 格式各家留着，工具来源统一起来。** 详见 [[../MCP/01-知识点总结/MCP核心概念与三方架构|MCP核心概念]]。

## ❓ 理解检查

1. OpenAI 和 Anthropic 的 system 分别放哪？
   - OpenAI 塞进 messages 数组（role:system）；Anthropic 是顶层独立 system 字段。

2. 哪家 max_tokens 必填？
   - Anthropic 必填，OpenAI 可选。

3. 工具调用结果怎么回传？两家区别？
   - OpenAI：`role:"tool"` + tool_call_id；Anthropic：`role:"user"` 里的 `tool_result` block。本质都是「模型发 tool_call → 应用执行 → 结果回喂」循环。

4. 为什么会有两套协议？
   - OpenAI 先发成事实标准，Anthropic 后发走自己设计哲学；无强制标准 + 商业竞争 → 不统一 → MCP 补工具层。

## 📌 面试能讲的点

1. **OpenAI 格式成事实标准的原因**：先发 + 简单 + 第三方为迁移成本纷纷兼容。
2. **工具调用本质同构**：都是「LLM 输出结构化调用 → 外部执行 → 回喂」，壳不同。
3. **MCP 定位**：跨厂商工具层，和某家 tool calling 是两个层次，不冲突。

## 🔗 关联概念

- [[../MCP/01-知识点总结/MCP核心概念与三方架构|MCP核心概念与三方架构]]
- [[../MCP/01-知识点总结/MCP鉴权与安全|MCP鉴权与安全]]
- [[../LangChain/INDEX|LangChain]]

## 📚 参考资料

- OpenAI API 文档：platform.openai.com/docs
- Anthropic API 文档：docs.anthropic.com
- OpenAI Responses API 迁移：developers.openai.com/api/docs/guides/migrate-to-responses
