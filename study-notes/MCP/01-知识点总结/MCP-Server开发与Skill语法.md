---
tags:
  - 语法
  - MCP
  - Skill
创建时间: 2026-06-16
状态: 已掌握
置信度: High
---

# MCP-Server 开发语法 & Skill 语法

> 本篇建议对照实战项目学习（可按本篇自行实现一个 tech-terms MCP server）。

## 一、Skill（Agent 技能）

> Skill 已独立成篇：[[../../Skill/01-知识点总结/Skill语法与渐进式披露|Skill语法与渐进式披露]]。
> 一句话：Skill 是**声明式**方法论（Markdown + YAML frontmatter），定义「AI 该怎么想 / 做」；与 MCP「能调什么」互补——对比见下方「三」。

## 二、MCP-Server 开发语法（TS SDK）

### 核心 API：`McpServer` + `registerTool`

> ⚠️ 用现代的 `registerTool`，**不是**已弃用的 `server.tool()`。

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.registerTool(
  "tool_name",                    // ① 工具名
  {                               // ② 配置对象
    title: "人类可读标题",
    description: "何时用、做什么（模型据此决定是否调用）",
    inputSchema: {                // Zod schema（扁平对象，不是整个 z.object！）
      name: z.string().min(1).describe("参数说明"),
    },
    outputSchema: { ... },        // 可选，声明结构化输出
    annotations: {                // 可选，提示客户端工具行为
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async ({ name }) => {           // ③ handler，参数已按 inputSchema 校验
    // 业务逻辑
    return {
      content: [{ type: "text", text: "结果文本" }],
      structuredContent: { ... }, // 可选，结构化数据
    };
  },
);
```

### Zod：运行时校验 + 自动转 JSON Schema

- `inputSchema` 用 **Zod**，SDK 自动转成 JSON Schema 暴露给模型，并在运行时校验入参。
- 常用：`.describe()` / `.default()` / `.optional()` / `.enum()` / `.min()` / `.max()` / `.int()`。
- **注意**：`inputSchema` 传的是**扁平的 key-value**（每个字段一个 zod schema），**不是**包一层 `z.object({...})`。

### annotations（行为提示，非安全保证）

| 字段 | 含义 |
|------|------|
| `readOnlyHint` | 只读，不改外部状态 |
| `destructiveHint` | 有破坏性 |
| `idempotentHint` | 同输入同输出（幂等） |
| `openWorldHint` | 访问外部世界（网络 / 真实环境） |

### 返回结构

```ts
{
  content: [{ type: "text", text: "..." }],   // 必需，给模型 / 人读
  structuredContent?: object,                   // 可选，给客户端程序化处理
  isError?: boolean,                            // 可选，标记是否为错误结果
}
```

> 兜底原则：tool 内部异常要 **catch 后转成文本返回**，不要抛出去中断协议。

## 三、Skill vs MCP 对比

| 维度 | Skill | MCP |
|------|-------|-----|
| 本质 | **声明式**方法论（怎么想） | **命令式**连接（能调什么） |
| 形态 | Markdown + YAML | 独立程序（Server） |
| 触发 | description 匹配 → 加载主体 | 模型 / 应用 / 用户主动调 |
| 关注 | 流程、思路、规范 | 工具、数据、能力 |
| 载体 | 文件 | 进程（经协议通信） |

> 二者互补：Skill 管「怎么做」，MCP 管「能做什么」。

## ⚠️ 开发注意

1. **import 用 `.js` 扩展名**：Node16 模块解析要求相对导入写 `./terms.js` 不是 `./terms`。
2. **stdio 模式日志只写 stderr**（见 [[MCP核心概念与三方架构]]）。
3. **handler 参数已校验**：inputSchema 会自动校验，handler 里直接用。

## 🔗 关联概念

- [[MCP核心概念与三方架构]]
- [[MCP鉴权与安全]]
- [[../03-易错点与陷阱/MCP易错点汇总|MCP易错点汇总]]

## 📚 参考资料

- 实战：tech-terms-mcp-server（计划中，待创建）
- SDK：`@modelcontextprotocol/sdk`
