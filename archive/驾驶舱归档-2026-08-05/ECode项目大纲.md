# 🛠️ ECode 项目大纲（AI Agent 学习线）

> **本文件只是索引**：记录 ECode 的开发进度 + 学习进度，方便在驾驶舱一眼看全貌。
> **详细内容全在项目里**：`D:\Study\ECode`（设计文档、代码、实现细节都在那）。
> **性质**：个人从零手写的学习型 AI coding agent，简历核心项目。与知识库的「CCode 线」（参考 CodeYang 的开源项目）是两回事。

---

## 📍 关键位置

- **项目根**：`D:\Study\ECode`
- **总纲文档**：`D:\Study\ECode\docs\00-学习型开发规划.md`（8 个产品决策、认知盲区清单、分层架构、里程碑全在这）
- **README**：`D:\Study\ECode\README.md`

---

## 🎯 一句话定位

用 TypeScript + Node.js **手写**一个生产可用的 AI coding agent（对标 Claude Code / opencode），拒绝框架黑盒，理解每一个环节。**学习优先，能讲清楚原理才算过。**

---

## 🧭 里程碑进度

| 里程碑 | 核心学习目标 | 状态 |
|--------|-------------|------|
| **M1** 理解 Agent 的心脏 | 工具调用协议（tool_use/tool_result）、while 循环、id 配对约束 | 🔜 进行中 |
| **M2** 理解多模型适配 | 各家协议差异、Provider 抽象层、模型能力探测 | ⬜ 未开始 |
| **M3** 理解"记不住"问题 | 上下文压缩、token 计数（无通用方案）、结果截断 | ⬜ 未开始 |
| **M4** 理解"信任问题" | 分级权限、编辑正确性（匹配失败回喂）、错误恢复 | ⬜ 未开始 |
| **M5+** 进阶 | 可观测性 / DI+VCR 测试 / Repo Map / Subagent / MCP | ⬜ 未开始 |

---

## ✅ 已完成的阶段性工作

- [x] 需求 brainstorming（8 个产品决策全部拍板）
- [x] 技术调研 1：Node.js agent 框架生态（确认手写 loop 路线，纠正"只有 LangGraph"的误解）
- [x] 技术调研 2：多模型 Token 计数通用方案（结论：ai-tokenizer + Claude 官方 API 校准）
- [x] 技术调研 3：生产级 agent 架构（发现 P0-P2 认知盲区清单）
- [x] 落地总纲文档 `docs/00-学习型开发规划.md`
- [x] 初始化 README + .gitignore
- [ ] **M1 启动**：先讲透 Agent loop 协议原理 → TDD 实现最小 loop

---

## 📝 进度更新约定

- ECode 每推进一个里程碑或关键节点，**回来更新本文件的进度表**
- 详细的学习笔记、原理沉淀 → 写进 `D:\Study\ECode\docs\` 或本 vault 的 `knowledge/ai-agents/`
- 本文件保持精简，只做"进度仪表盘"，不放实现细节

---

**创建日期**：2026-07-21
**当前状态**：规划完成，M1（最小可运行 loop）启动中
**下一步**：讲解「Agent loop 完整协议原理」→ 开始写代码
