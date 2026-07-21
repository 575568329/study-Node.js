# tools — 工具链

## gemini/ — Gemini 协作工具链

"Claude 主教练 + Gemini 审查员"双 AI 协作。三种实现 + 一个 Web Chat 服务：

| 文件 | 实现 |
|------|------|
| `gemini-chat.mjs` | 浏览器 DOM 自动化（Playwright + CDP 19222）|
| `gemini-api.mjs` | 直连 Gemini 内部 StreamGenerate 接口（快）|
| `gemini-cli.mjs` | 直连智谱 `glm-4-flash`（降级，无浏览器）|
| `gemini-server.mjs` | Web Chat 服务（Express + WS，端口 3456）|

**详细架构、命令、数据流见 [CLAUDE.md](../CLAUDE.md) 的"代码架构"章节。**

- 系统提示词：[system-prompt.md](./gemini/system-prompt.md)
- 根目录 `package.json` 的 `npm run gemini*` 脚本指向本目录

---
**最后更新**: 2026-07-21
