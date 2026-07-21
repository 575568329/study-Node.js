# 知识库（Obsidian Vault）

> 三条学习线的**唯一** Obsidian 知识库。所有笔记、讲稿、纲领都在本目录下，保证 `[[]]` 双向链接、反向链接、关系图谱正常工作。

---

## 三线总入口（驾驶舱）

每次学习从 [`00-驾驶舱/`](./00-驾驶舱) 进入：

| MOC | 学习线 | 说明 |
|-----|--------|------|
| [[00-驾驶舱/java线\|☕ java线]] | Java 全栈 | Spring Boot / Dubbo / MySQL，公司代码为教材（主线）|
| [[00-驾驶舱/复习线\|🔄 复习线]] | 前端复习 | 费曼学习法，产出面试讲稿 |
| [[00-驾驶舱/ccode线\|🤖 ccode线]] | CCode | 自建 AI Agent，技术基础在 ai-agents/ |

驾驶舱还存放：进度文件（`latest-session.md`、`todo.md`、`前端复习进度.md`）与各线纲领文档（`Java学习路径-稳扎稳打版.md`、`技能优先级-运维技能版.md`、`前端复习精深计划.md`、`复习计划.md`）。

---

## 目录结构

```
knowledge/
├── 00-驾驶舱/          # 三线 MOC + 进度 + 纲领（总入口）
├── java/               # Java 笔记
├── 前端复习/           # 费曼讲稿（01-JS-TS、02-Vue3…）
├── TypeScript/         # 复习线技能笔记
├── Vue3/
├── React/
├── Next.js/
├── Node.js/
├── ai-agents/          # CCode 技术栈
│   ├── LangChain/ LangGraph/ MCP/ Skill/
│   ├── LLM-API/ AgentScope/ Vercel AI SDK/
│   └── Python/ codex_with_cc子代理工作流.md
├── node-复习材料/      # Node 后端追问清单系列（Stream/异步/HTTP/MQ/SSE…）
├── Excalidraw/         # 思维导图
├── 共享/               # 跨线通用内容
├── templates/          # 笔记模板
└── 项目实战/           # 实战笔记
```

---

## Obsidian 使用

- 启动 Obsidian → 打开 `knowledge/` 文件夹作为 vault
- 从 `00-驾驶舱/` 的三个 MOC 进入各线
- 每个技能目录的 `INDEX.md` 是该技能入口
- 用 `[[]]` 双向链接在知识点之间跳转

---

**最后更新**: 2026-07-21
