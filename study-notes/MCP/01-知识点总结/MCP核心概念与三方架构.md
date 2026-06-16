---
tags:
  - 概念
  - MCP
  - 重要
创建时间: 2026-06-16
状态: 已掌握
置信度: High
---

# MCP 核心概念与三方架构

## 📝 定义

**MCP（Model Context Protocol，模型上下文协议）** 是 Anthropic 于 2024 年 11 月开源的协议，标准化「大语言模型」与「外部工具 / 数据源」的连接方式。

一句话：**MCP 是协议，不是接口。** 真正「暴露能力」的是 MCP Server（一个独立程序），AI 应用通过这个协议去调用。

> 类比：**MCP 是「AI 界的 USB-C」**。USB-C 本身不是任何设备的接口，而是让接口**统一**的标准；各种设备实现这个标准，电脑（Host）就能即插即用。MCP 同理——把 N×M 的点对点集成降为 N+M。

## 🎯 三方架构

MCP 是 Client-Server 架构，基于 **JSON-RPC 2.0**：

| 角色              | 职责                                        | 举例                            |
| --------------- | ----------------------------------------- | ----------------------------- |
| **Host（宿主）**    | AI 应用，**消费方**，通过 MCP 用别人的能力               | Claude Code、Cursor            |
| **Client（客户端）** | Host 内部为每个 server 建 1 个 client，**1:1** 连接 | Host 自动管理                     |
| **Server**      | **暴露方**，按 MCP 协议把能力封装出来                   | 自己写的 server、github-mcp-server |

关键：**Server 是一个「桥接程序」，站在 AI 应用 和 后端数据 / 服务 之间**。它内部可封装任何东西：外部 API、数据库、文件系统、甚至纯内存数据。它**不是任何应用的接口本身**。

### 例子：GitHub

```
GitHub REST API             ← GitHub 自己暴露的接口（点对点、非 MCP）
     ↑
github-mcp-server（独立程序） ← 内部调 REST API，按 MCP 暴露成 tools
     ↑  (MCP 协议 / JSON-RPC)
Claude Code（Host）          ← AI 应用，模型就能「创建 issue」
```

## 🧩 三大原语（Primitives）

Server 能暴露三类能力，**触发方不同**是核心区别：

| 原语 | 谁触发 | 性质 | 例子 |
|------|--------|------|------|
| **Tools** | **模型**主动调 | 可有副作用 | 创建 issue、查数据库、发请求 |
| **Resources** | **应用**控制 | 只读数据 | 文件内容、配置、日志 |
| **Prompts** | **用户**触发 | 模板 | `/summarize` 这类预设指令 |

> 记忆：Tools = 模型的手（能动）、Resources = 应用的眼（只看）、Prompts = 用户的快捷键。

## 🚇 传输（Transport）

协议需要一条通道传 JSON-RPC 消息，MCP 支持两种：

| 传输 | 场景 | 特点 |
|------|------|------|
| **stdio** | 本地 | Host 启动 server 子进程，用 stdin/stdout 通信 |
| **Streamable HTTP** | 远程 | HTTP POST，适合多用户 / 集中部署 |

> ⚠️ SSE（Server-Sent Events）传输**已废弃**，被 Streamable HTTP 取代。

### `StdioServerTransport` 的作用（关注点分离）

- 它是**传输层适配器**：读 stdin 收 JSON-RPC 请求 → 分发给 tool handler → 把结果写回 stdout。
- **日志必须写 `stderr`**——stdout 被 JSON-RPC 占用，`console.log` 会污染协议流导致通信崩溃。
- **可插拔**：换传输 = 只换 transport 对象，server 业务逻辑一行不改：

```ts
const transport = new StdioServerTransport();   // 换成 StreamableHTTPServerTransport() 即变远程
await server.connect(transport);
```

- `McpServer` 只管「有哪些 tool、怎么处理」（不管通道）
- `transport` 只管「怎么收发字节」（不管内容）

## 📦 分发方式

MCP server 本质是程序（npm 包 / 二进制 / 容器）。**目前没有权威中央仓库**，主流三种：

| 方式 | 用法 | 适用 |
|------|------|------|
| **发 npm**（最主流） | `claude mcp add xx -- npx your-pkg` | 通用 |
| **第三方聚合目录** | mcp.so / Smithery（smithery.ai）/ PulseMCP | 发现 + 安装入口（底层还是 npm / 容器） |
| **本地手动** | `claude mcp add xx -- node dist/index.js` | 个人 / 内部 |

## 🔗 关联概念

- [[MCP-Server开发与Skill语法]]
- [[MCP鉴权与安全]]
- [[../03-易错点与陷阱/MCP易错点汇总|MCP易错点汇总]]

## ❓ 理解检查

1. MCP 是接口还是协议？暴露能力的是谁？
   - 协议；暴露方是 MCP Server（独立程序），消费方是 AI 应用（Host）。

2. stdio 模式下，为什么日志只能写 stderr？
   - stdout 被 JSON-RPC 协议占用，写 stdout 会破坏通信。

3. 三大原语的区别核心是什么？
   - 触发方：Tools=模型、Resources=应用、Prompts=用户。

## 📚 参考资料

- MCP 官方规范：modelcontextprotocol.io
- 实战项目：[[../../../projects/mcp/tech-terms-mcp-server/README|tech-terms-mcp-server]]
