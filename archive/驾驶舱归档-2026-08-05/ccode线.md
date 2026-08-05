# 🤖 CCode 学习线（自建 AI Agent 工具）

> **定位**：自建类 Claude Code 的 AI Agent 工具（CCode）
> **本 vault 角色**：CCode 的技术基础沉淀（Agent / LLM / MCP / Skill 等知识库）
> **源码在外部仓库**，不并入本仓库

---

## 💾 源码（外部仓库，绝对路径）

- **路径**：`D:\Study\CCode`
- **结构**：`cCli/` · `cases/` · `docs/` · `README.md` · `CHANGELOG.md` · `HISTORY_README.md` · `LICENSE`

---

## 📚 技术栈笔记（ai-agents/）

| 领域 | 笔记入口 | 说明 |
|------|---------|------|
| LangChain | [[ai-agents/LangChain/INDEX\|LangChain]] | Chain / Prompt / Retriever 核心抽象 |
| LangGraph | [[ai-agents/LangGraph/INDEX\|LangGraph]] | 图式编排，解决 Chain 的局限 |
| MCP 协议 | [[ai-agents/MCP/INDEX\|MCP]] | Claude Code 生态协议 |
| Skill 技能 | [[ai-agents/Skill/INDEX\|Skill]] | Claude Code 生态技能机制 |
| LLM API | [[ai-agents/LLM-API/INDEX\|LLM-API]] | OpenAI / Anthropic API 协议 |
| AgentScope | [[ai-agents/AgentScope/INDEX\|AgentScope]] | 多 agent 框架（P0-2 完成）|
| Vercel AI SDK | [[ai-agents/Vercel AI SDK/INDEX\|Vercel AI SDK]] | TS AI SDK |
| Python | [[ai-agents/Python/INDEX\|Python]] | 速通 + 面试突击 |

---

## 🎯 学习目标

- 读懂 Claude Code 的设计思想（Skill / MCP / Agent loop / 工具调用）
- 用这些原理自建 CCode：cCli（命令行）、cases（用例）、docs（文档）
- 输出可演示的 AI Agent 工具，作为简历差异化亮点

---

## 🔗 相关参考

- 本仓库 Gemini 协作工具链 `tools/gemini/`（双 AI 流程的实现参考）
- `tools/gemini/system-prompt.md`（Gemini Gem 系统指令）
- [[ai-agents/codex_with_cc子代理工作流|codex_with_cc 子代理工作流]]（子代理工作流设计）
