# MCP（Model Context Protocol）学习笔记

> AI 应用与外部工具/数据源的标准化连接协议。与 [[../Skill/INDEX|Skill]] 平级，同属 Claude Code 生态。

> 🧠 **记忆锚点**：**MCP = 统一接入协议（JSON-RPC 2.0）；Server 是独立程序——调你的应用接口、用 registerTool 声明 tool；本地 stdio 收发、线上 Streamable HTTP（+OAuth）。**

## 进度概览

- **状态**: 🔥 学习中（概念梳理 + 实战 demo 已完成）
- **实战项目**: [tech-terms-mcp-server](../../projects/mcp/tech-terms-mcp-server/)（stdio 本地 server，3 个 tool）
- **关联**: Skill（Agent 技能）一并记录于此

---

## 笔记目录

### [01-知识点总结](01-知识点总结/)

| 文件 | 内容 |
|------|------|
| [MCP核心概念与三方架构.md](01-知识点总结/MCP核心概念与三方架构.md) | 协议定义、USB-C 类比、Host/Client/Server、三大原语、传输、分发、stdio 作用 |
| [MCP-Server开发与Skill语法.md](01-知识点总结/MCP-Server开发与Skill语法.md) | Skill frontmatter、registerTool 签名、Zod、返回结构、Skill vs MCP |
| [MCP鉴权与安全.md](01-知识点总结/MCP鉴权与安全.md) | 两层鉴权模型、安全三要点、本地 vs 远程 server |

### [03-易错点与陷阱](03-易错点与陷阱/)

| 文件 | 内容 |
|------|------|
| [MCP易错点汇总.md](03-易错点与陷阱/MCP易错点汇总.md) | 4 大常见误解（MCP≠应用接口、鉴权归属、stdout 污染、Skill description 写法） |

### [04-面试题](04-面试题/)

| 文件 | 内容 |
|------|------|
| [MCP面试题.md](04-面试题/MCP面试题.md) | 协议、架构、鉴权、与 REST API 对比、TS SDK 开发的面试问答 |

### [05-速查表](05-速查表/)

| 文件 | 内容 |
|------|------|
| [MCP速查表.md](05-速查表/MCP速查表.md) | registerTool / Zod / Skill frontmatter / 传输 / annotations 速查 |

---

## 下次学习

1. 给 tech-terms 加一个「调线上 API + 环境变量凭证」的 tool（练凭证保管）
2. Streamable HTTP 传输模式（远程 server + OAuth 2.1）
3. Resources / Prompts 两大原语实战
