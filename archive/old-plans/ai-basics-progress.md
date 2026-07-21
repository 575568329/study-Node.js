# AI 应用开发基础 - 学习进度

**Last Updated**: 2026-04-13
**状态**: 🟡 进行中（核心完成，准备进入LangChain.js）
**前置技能**: React+TS (100%) | Next.js (100%) | Node.js (90%) | TypeScript (100%)

---

## 📊 快速统计

📈 **Overall Progress**: 10/14 topics = **71%**
📚 **学习天数**: 4

---

## 知识领域

### A1 大模型基础
- [x] Token 概念与原理 ✅ 2026-04-10 置信度:高
- [x] Next-token prediction ✅ 2026-04-10 置信度:高
- [x] Temperature 参数 ✅ 2026-04-10 置信度:高
- [x] 多轮对话原理（messages 数组管理） ✅ 2026-04-10 置信度:高
- [ ] Transformer / Embedding 概念（待学习）

### A2 API 调用
- [x] OpenAI 兼容 API 调用（智谱 GLM） ✅ 2026-04-10 置信度:高
- [x] 环境变量管理（.env + dotenv） ✅ 2026-04-10 置信度:高
- [x] 响应结构解析（choices/usage） ✅ 2026-04-10 置信度:高
- [ ] Anthropic API 调用（待学习）

### A3 Prompt Engineering
- [x] System Prompt 设计（角色/规则/示例） ✅ 2026-04-10 置信度:高
- [x] Few-shot 提示（少样本示例引导） ✅ 2026-04-11 置信度:高
- [x] Chain of Thought（思维链逐步推理） ✅ 2026-04-11 置信度:高
- [x] 结构化输出（JSON mode + response_format） ✅ 2026-04-13 置信度:高

### A4 流式输出
- [x] SSE 原理与格式 ✅ 2026-04-10 置信度:中
- [x] Node.js 流式读取（reader + decoder） ✅ 2026-04-10 置信度:中
- [x] 前端流式输出（fetch + ReadableStream） ✅ 2026-04-12 置信度:高
- [x] API Route 中转保护密钥 ✅ 2026-04-12 置信度:高

---

## 🔄 待巩固复习清单

### P0 - 高优先级
- [x] ~~**子传父回调模式**~~ ✅ 已验证 2026-04-11（第4次验证通过）

### P1 - 中优先级
- [x] ~~**Next.js 动态路由 params await**~~ ✅ 已验证 2026-04-13（第4次验证通过）

---

## 学习记录

### 2026-04-12 - 前端流式聊天应用
- **项目**: `projects/ai-chat/`（Next.js + 流式聊天）
- **完成**:
  - API Route 中转（保护 API Key）
  - 前端流式输出（fetch + ReadableStream）
  - 多轮对话支持（messages 数组管理）
  - 结构化输出（response_format）概念学习
- **关键收获**:
  - API Key 必须在服务端，前端调 `/api/chat` 中转
  - `new Response(res.body, { headers })` 实现服务端流式转发
  - React 状态异步问题：提前构建 newMessages 再发请求
  - 流式递归：单一 process 函数，done 时存历史
- **笔记**: 未单独记录

### 2026-04-11 - Prompt Engineering 进阶
- **项目**: `projects/ai-basics/`（代码审查助手）
- **完成**:
  - Few-shot 提示（少样本示例引导输出格式）
  - Chain of Thought（思维链，逐步推理提高准确率）
  - Prompt 三段式写法实战（角色+规则+示例）
  - 子传父回调盲区突破（第4次验证通过）
- **关键收获**:
  - Few-shot 示例必须是完整输入输出对，不是简单列规则
  - CoT "请一步一步思考" 能减少 AI 幻觉
  - Prompt 迭代：从幻觉到准确，关键是示例质量和格式分离
- **笔记**: `sessions/ai-basics/2026-04-11/session-notes.md`

### 2026-04-10 - 大模型基础 + API + Prompt + 流式输出 🎉
- **项目**: `projects/ai-basics/`（AI 基础练习项目）
- **技术栈**: Node.js + fetch + dotenv + readline
- **完成**:
  - LLM 基础概念（token、temperature、next-token）
  - 智谱 GLM API 调用（OpenAI 兼容格式）
  - 多轮对话聊天工具（终端 readline）
  - System Prompt Engineering（面试官模式）
  - 流式输出（SSE + reader + decoder）
- **产出**: `chat.js` — 多轮流式聊天工具（面试官模式）
- **笔记**: `sessions/ai-basics/2026-04-10/session-notes.md`

---

### 2026-04-13 - 结构化输出实战 + LangChain.js 入门
- **项目**: `projects/ai-chat/`（情感分析API）+ LangChain.js 概念学习
- **完成**:
  - 情感分析 API（response_format + JSON mode）
  - 非流式 API Route 完整写法
  - LangChain.js 核心概念（Model/Prompt/Chain/OutputParser）
  - OpenAI 兼容接口原理（baseURL 切换）
- **关键收获**:
  - `response_format: { type: 'json_object' }` 强制 JSON 输出
  - 轻量模型（glm-4-flash）有局限性，不是所有任务都适合
  - LangChain.js = AI 的"Express框架"，封装重复工作
  - OpenAI API 格式已成行业标准
- **盲区突破**: params await 第4次验证通过
- **笔记**: `sessions/ai-basics/2026-04-13/session-notes.md`

## 下一步学习计划

1. Anthropic API 调用 + 两者对比
2. Prompt Engineering 进阶（Few-shot / Chain of Thought / 结构化输出）
3. 前端流式输出（SSE → 前端 EventSource）
