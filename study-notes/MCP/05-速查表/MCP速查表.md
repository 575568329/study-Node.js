---
tags:
  - 速查表
  - MCP
创建时间: 2026-06-16
---

# MCP 速查表

> 🧠 **记忆锚点**：**MCP = 统一接入协议（JSON-RPC 2.0）；Server 是独立程序——调你的应用接口、用 registerTool 声明 tool；本地 stdio 收发、线上 Streamable HTTP（+OAuth）。**

## 最小 Server 骨架（stdio）

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.registerTool("tool_name", {
  description: "...",
  inputSchema: { name: z.string().min(1) },
  annotations: { readOnlyHint: true, idempotentHint: true },
}, async ({ name }) => {
  return { content: [{ type: "text", text: "..." }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[my-server] started");  // 只写 stderr！
```

## registerTool 签名

```ts
server.registerTool(
  name: string,
  config: { title?, description, inputSchema: ZodRawShape, outputSchema?, annotations? },
  handler: (args) => Promise<{ content, structuredContent?, isError? }>
)
```

## Zod 常用

| 用法 | 示例 |
|------|------|
| 字符串非空 | `z.string().min(1)` |
| 带说明 | `z.string().describe("术语名")` |
| 可选 | `z.string().optional()` |
| 枚举 | `z.enum(["a","b"])` |
| 整数范围 | `z.number().int().min(1).max(50).default(10)` |
| 数组 | `z.array(z.string())` |

## annotations

| 字段 | 含义 |
|------|------|
| `readOnlyHint` | 只读 |
| `destructiveHint` | 破坏性 |
| `idempotentHint` | 幂等 |
| `openWorldHint` | 访问外部世界 |

## 三大原语

| 原语 | 触发 | 性质 |
|------|------|------|
| Tools | 模型 | 可有副作用 |
| Resources | 应用 | 只读 |
| Prompts | 用户 | 模板 |

## 传输

| 传输 | 场景 | 鉴权 |
|------|------|------|
| stdio | 本地 | 无（机器信任） |
| Streamable HTTP | 远程 | OAuth 2.1 |
| ~~SSE~~ | 已废弃 | — |

## 返回结构

```ts
{
  content: [{ type: "text", text }],   // 必需
  structuredContent?: object,           // 程序化处理
  isError?: boolean,
}
```

## CLI 命令

```bash
claude mcp add <name> -- node dist/index.js        # 注册（本地）
claude mcp add <name> -e KEY=val -- node ...        # 带环境变量
claude mcp list                                      # 列出
claude mcp get <name>                                # 详情
claude mcp remove <name>                             # 移除
npx @modelcontextprotocol/inspector node dist/index.js  # Inspector 调试
```

## Skill frontmatter

```yaml
---
name: my-skill
description: 当...（写触发条件，非「是什么」）
allowed-tools: [Read, Write]
---
```

## 关键口诀

- 接口=tool，协议=MCP，程序=Server
- stdio：stdout 归 JSON-RPC，stderr 归日志
- description 写「何时触发」
- 鉴权两层：① 谁能连（stdio 无 / HTTP OAuth）② 凭证保管（server 持 key）
- 用 `registerTool`，别用弃用的 `server.tool()`
- import 用 `.js` 扩展名（Node16 模块解析）

## 📚 关联

- [[../01-知识点总结/MCP核心概念与三方架构|核心概念]]
- [[../01-知识点总结/MCP-Server开发与Skill语法|开发语法]]
