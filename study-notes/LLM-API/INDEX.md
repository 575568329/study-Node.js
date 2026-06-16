# LLM API 协议学习笔记

> 调用大模型时的「接口标准 / 传参规范」。重点对比 OpenAI 与 Anthropic 两套事实主流格式。是 [[../MCP/INDEX|MCP]]、[[../LangChain/INDEX|LangChain]] 的底层基础。

> 🧠 **记忆锚点**:**格式区别——OpenAI:`system` 塞进 messages、`max_tokens` 可选、认证 `Authorization: Bearer`、偏「对话」;Anthropic:`system` 独立顶层、`max_tokens` 必填、认证 `x-api-key` + 版本头、偏「结构化 block」。为什么两套:OpenAI 先发成事实标准,Anthropic 后发走自己的设计哲学;商业竞争 + 无强制标准 → 不统一 → MCP 出来补「工具层」标准。**

## 进度概览

- **状态**: 🔥 学习中（两套格式对比完成）
- **关联**: [[../MCP/INDEX|MCP]]、[[../LangChain/INDEX|LangChain]]

---

## 笔记目录

### [01-知识点总结](01-知识点总结/)

| 文件 | 内容 |
|------|------|
| [OpenAI与Anthropic-API协议对比.md](01-知识点总结/OpenAI与Anthropic-API协议对比.md) | 完整请求逐字段、区别、工具调用、为什么两套、Responses API、与 MCP 关系 |

---

## 下次学习

1. 流式（SSE）两家事件格式细节
2. 各国产模型（智谱 / DeepSeek / Kimi）对 OpenAI 格式的兼容点
3. 多模态（图片 / 文件）传参、Embedding
