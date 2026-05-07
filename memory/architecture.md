# 项目架构

**最后更新**：2026-05-07

## 仓库目标

`Node.js-Study` 已从 AI 辅助学习仓库切换为：

**全栈转型项目证明、简历和面试准备仓库。**

历史学习资料继续保留，但后续工作优先围绕 RAG 主项目和面试资产展开。

## 当前定位

```text
全栈工程师｜Node.js / React / Next.js｜AI 应用方向
```

不是放弃前端，而是以前端复杂业务经验为基础转向全栈交付。

## 仓库结构

```text
Node.js-Study/
├── docs/                      # 后续工作入口、项目证明方案、面试资产
├── 简历相关/                  # 简历素材、评价、resume-web
├── memory/                    # Codex 恢复上下文记忆
├── projects/                  # 学习 demo 与辅助项目
├── progress/                  # 历史学习进度
├── sessions/                  # 历史学习会话
├── study-notes/               # Obsidian 风格知识笔记
├── code-examples/             # 小代码示例
├── AGENTS.md                  # Codex 导师规则
├── CLAUDE.md                  # Claude 导师规则
└── README.md                  # 仓库总览
```

## 入口文件

后续每次开始工作先读：

```text
docs/00-工作入口.md
docs/01-全栈转型项目证明方案.md
docs/02-RAG项目体检清单.md
docs/03-面试资产目录.md
projects/INDEX.md
memory/latest-session.md
memory/todo.md
```

## 主项目

RAG 主项目是外部仓库：

```text
C:\Users\about\OneDrive\桌面\study\rag-docs-assistant
GitHub: https://github.com/575568329/rag-docs-assistant
```

它负责支撑：

- 全栈能力证明。
- AI 应用能力证明。
- 简历主项目。
- 面试 3 分钟讲解。
- 技术追问回答。

## 当前仓库内项目分层

详见：

```text
projects/INDEX.md
```

简要分层：

- S：外部 `rag-docs-assistant`。
- A：React 任务管理、Node.js 个人博客 API。
- B：LangGraph demo、LangChain demo、AI SDK demo。
- C：历史学习练习。

## 关键工作流

### RAG 项目体检

```text
读取 rag-docs-assistant 代码
  -> 按 docs/02-RAG项目体检清单.md 检查
  -> 输出 docs/RAG项目体检报告.md
  -> 决定补强顺序
```

### 面试资产沉淀

```text
项目体检
  -> README
  -> 架构图
  -> 演示文档 / 演示问题
  -> 3 分钟讲稿
  -> 高频追问答案
  -> 简历 bullet
```

### 简历落地

```text
docs 面试资产
  -> 简历相关/resume-web/src/resumeVersions.ts
  -> 浏览器预览
  -> PDF 导出
  -> 分页检查
```

## 暂缓内容

- MCP / OpenClaw 深入研究。
- 新开 Agent 项目。
- 大规模整理历史学习目录。
- 把 LangGraph / Multi-Agent 写成简历主卖点。

LangGraph 已完成核心学习，后续只有接入主项目并可演示后，才作为简历加分项。
