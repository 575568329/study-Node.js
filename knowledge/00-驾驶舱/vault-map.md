# Vault 结构地图（结构韧性 manifest）

> 两个项目 skill（`pre-session-review` / `update-progress`）**读这张表**解析路径，**不硬编码**。vault 重构 → 改这里一处 → skill 不破。
> map 缺失时 skill 用 Glob 按文件名兜底。

## canonical 路径

| 用途 | 路径 |
|---|---|
| FSRS 复习队列 | `knowledge/00-驾驶舱/fsrs-queue.md` |
| 最近会话记录 | `knowledge/00-驾驶舱/latest-session.md` |
| 待办 | `knowledge/00-驾驶舱/todo.md` |
| 学习线 MOC | `knowledge/00-驾驶舱/java线.md` / `复习线.md`（CCode 线已归档至 `archive/驾驶舱归档-2026-08-05/`，暂缓） |
| 前端复习进度 | `knowledge/00-驾驶舱/前端复习进度.md` |
| Java 学习路径 | `knowledge/00-驾驶舱/Java学习路径-稳扎稳打版.md` |
| Java 笔记根 | `knowledge/java/` |
| 前端复习讲稿根 | `knowledge/前端复习/`（+ `TypeScript/` `Vue3/` `React/` `Next.js/` `Node.js/`） |
| CCode 技术栈根 | `knowledge/ai-agents/` |
| 代码示例 | `code-examples/` |
| 公司代码（外部，不在本仓库） | `D:\xunfei\zyjg` |

## 三线感知（判断 KP 属哪条线）

看 KP 名 / 上下文：
- **Java**：Spring / Dubbo / MySQL / JVM / 并发 / MyBatis …
- **复习**：JS / TS / Vue / React / Next / CSS / Node …
- **CCode**：LangChain / LangGraph / MCP / Agent / LLM-API …

**迁移场景按线不同**：Java→公司代码、复习→换框架、CCode→自己工具链。
