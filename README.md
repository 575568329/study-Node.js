# study-workspace

> 个人学习与求职准备工作区。**三条学习线并行**：Java 全栈 · 前端复习（费曼法）· CCode（自建 AI Agent）。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 目录结构（Repository Structure）

| 目录 | 用途 |
|------|------|
| [`knowledge/`](./knowledge) | **Obsidian 知识库（唯一 vault）**。三条线的笔记、讲稿、纲领都在这 |
| [`knowledge/00-驾驶舱/`](./knowledge/00-驾驶舱) | 三线总入口：`java线.md` / `复习线.md` / `ccode线.md` 三个 MOC + 进度文件 |
| [`career/`](./career) | 求职资产：`resume-web/`（网页简历）· `resumes/` · `interview/` · `work-projects/` · `projects/` |
| [`projects/`](./projects) | 代码 demo（含 `java/` 语法练习、Node.js/React 学习 demo）|
| [`code-examples/`](./code-examples) | 代码片段练习（nodejs/react/typescript/vue3）|
| [`tools/gemini/`](./tools/gemini) | Gemini 协作工具链（Claude 主教练 + Gemini 审查员双 AI 流程）|
| [`docs/`](./docs) | 工具/配置说明（Git-SSH、工作入口）|
| [`journal/`](./journal) | 学习日志、思考记录 |
| [`archive/`](./archive) | Node.js 路线时代遗留（归档，不再维护）|

> 单 Obsidian vault 原则：所有笔记放在 `knowledge/` 下，保证 `[[]]` 双向链接、反向链接、关系图谱正常工作。

---

## 三条学习线

### ☕ Java 全栈线
**目标**：Java 全栈工程师（Spring Boot / Dubbo / MySQL），以公司代码为教材（Spring 3.2.6 + Dubbo + MyBatis，Java 8）。
**入口**：[`knowledge/00-驾驶舱/java线.md`](./knowledge/00-驾驶舱/java线.md)

### 🔄 前端复习线（费曼学习法）
**目标**：把 6 年前端已学内容变成"3 分钟能讲清 + 扛得住追问"的**面试讲稿**（合上资料自己讲）。
**入口**：[`knowledge/00-驾驶舱/复习线.md`](./knowledge/00-驾驶舱/复习线.md)

### 🤖 CCode 线
**目标**：自建类 Claude Code 的 AI Agent 工具。技术基础沉淀在 `knowledge/ai-agents/`，源码在外部仓库 `D:\Study\CCode`。
**入口**：[`knowledge/00-驾驶舱/ccode线.md`](./knowledge/00-驾驶舱/ccode线.md)

---

## 环境与运行（Environment）

本仓库含多个可独立运行的子项目：

### 网页简历 — `career/resume-web/`
Vite + React 19 + TypeScript + Tailwind v4，数据驱动的多版本简历（general / frontend / nodeFullstack）。
```bash
cd career/resume-web
npm install
npm run dev      # 开发服务器
npm run build    # 构建验证（改完简历必须跑）
```

### Gemini 协作工具链 — `tools/gemini/`
Express + WebSocket 服务（端口 3456），三种实现：`gemini-chat.mjs`（DOM 自动化）/ `gemini-api.mjs`（直连 StreamGenerate）/ `gemini-cli.mjs`（智谱 glm-4-flash 降级）。
```bash
npm run gemini        # 启动 Web Chat 服务
npm run gemini:init   # 缓存 Cookie（首次/过期后）
npm run gemini:chat   # 启动调试 Chrome（CDP 19222）登录
```

### Java 示例 — `projects/java/`
需 **JDK 8** + Maven（对齐公司技术栈）。

### Obsidian 知识库 — `knowledge/`
用 Obsidian 打开 `knowledge/` 文件夹作为 vault，从 `00-驾驶舱/` 的三个 MOC 进入各线。

---

## 相关文档

- [工作入口](./docs/00-工作入口.md) — Java 转型声明与学习路径
- [Git-SSH 配置说明](./docs/Git-SSH配置说明.md)
- AI 导师配置：[CLAUDE.md](./CLAUDE.md)（Claude Code）/ [AGENTS.md](./AGENTS.md)（Codex）

---

## 许可证

[MIT](./LICENSE)
