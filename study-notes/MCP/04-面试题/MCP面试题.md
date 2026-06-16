---
tags:
  - 面试题
  - MCP
创建时间: 2026-06-16
---

# MCP 面试题

## Q1：一句话解释 MCP，它解决了什么问题？

MCP（Model Context Protocol）是 Anthropic 开源的标准协议，用 JSON-RPC 2.0 标准化「AI 模型」与「外部工具 / 数据源」的连接。它解决了**集成成本 N×M**（每个 AI 应用为每个工具单独写集成）的问题，降到 **N+M**（所有 server 遵循同一协议，任何 Host 都能接）。类比「AI 界的 USB-C」。

## Q2：MCP 的三方架构是什么？谁是消费方、谁是提供方？

- **Host（宿主）**：AI 应用，**消费方**（Claude Code、Cursor）。
- **Client**：Host 内部为每个 server 建 1 个 client。
- **Server**：**提供方**，按协议暴露能力。
基于 JSON-RPC 2.0。Server 是独立程序，站在 AI 应用和后端之间做桥接。

## Q3：MCP 的三大原语是什么？区别在哪？

| 原语 | 触发方 | 性质 |
|------|--------|------|
| Tools | 模型 | 可有副作用 |
| Resources | 应用 | 只读 |
| Prompts | 用户 | 模板 |

核心区别是**谁触发**：Tools=模型的手、Resources=应用的眼、Prompts=用户的快捷键。

## Q4：MCP 和普通 REST API 的本质区别？

- REST API：点对点，每个应用各自定义格式；面向**程序**调用。
- MCP：**统一协议**（JSON-RPC 2.0），所有 server 一套标准；面向 **AI 模型**调用，自带 schema 让模型理解能调什么、怎么调。
- MCP Server 通常内部去调 REST API，做一层**适配**，把任意后端统一成 MCP 协议。

## Q5：stdio 和 Streamable HTTP 传输的区别？各自适用场景？

- **stdio**：本地，Host 启 server 子进程，用 stdin/stdout 通信。适合个人工具、凭证留本地。
- **Streamable HTTP**：远程，HTTP POST，适合多用户 / 集中部署，且**支持 OAuth 鉴权**。
- SSE 传输已废弃。

## Q6：为什么 stdio 模式日志必须写 stderr？

stdout 被 JSON-RPC 协议占用做消息通道。写 stdout（`console.log`）会往协议流塞非协议字节，破坏通信。stderr 不参与协议，留给日志。

## Q7：如果线上应用需要鉴权，MCP 怎么处理？

分两层：
- **凭证保管**：server 持有后端 API key（环境变量注入），替模型调后端，模型接触不到 key——隔离敏感凭证。
- **谁能连**：stdio 无协议级鉴权（机器信任）；远程 HTTP server 用 **OAuth 2.1**。
安全要点：prompt injection（返回数据不可信）、最小权限、敏感信息不进 content。

## Q8：如何用 TS SDK 写一个 MCP tool？

`McpServer` + `registerTool`（非弃用的 `server.tool()`）：
- 入参：`inputSchema` 用 **Zod**（扁平对象），SDK 自动转 JSON Schema 并运行时校验。
- 返回：`{ content: [{type,text}], structuredContent?, isError? }`。
- 异常要 catch 转文本，不抛出中断协议。
- 可加 `annotations`（readOnlyHint / idempotentHint 等）提示行为。

## Q9：Skill 和 MCP 的区别？

- Skill：声明式方法论（Markdown+YAML），定义「怎么想 / 做」，靠 description 渐进式披露触发。
- MCP：命令式连接（独立 Server 进程），定义「能调什么」。
二者互补：Skill 管流程，MCP 管能力。

## 📚 关联笔记

- [[../01-知识点总结/MCP核心概念与三方架构|MCP核心概念]]
- [[../01-知识点总结/MCP鉴权与安全|鉴权与安全]]
- [[../03-易错点与陷阱/MCP易错点汇总|易错点]]
