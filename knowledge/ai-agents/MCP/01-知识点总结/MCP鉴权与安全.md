---
tags:
  - 概念
  - 安全
  - MCP
  - 重要
创建时间: 2026-06-16
状态: 已掌握
置信度: High
---

# MCP 鉴权与安全

## 🎯 核心结论

MCP 场景下有**两层鉴权**，容易混淆：

```
① Host → MCP Server     （谁有权连这个 server？）
② MCP Server → 线上应用  （server 拿什么凭证调后端 API？）
```

## ① Host → Server（谁能连）

| 传输 | 有无协议级鉴权 | 说明 |
|------|----------------|------|
| **stdio 本地** | ❌ 没有 | 能在本机启动即默认信任（机器级信任） |
| **Streamable HTTP 远程** | ✅ 有 | **OAuth 2.1 授权流程**（2025-03-26 规范引入） |

> 远程 server：Client 连接时出示 OAuth token，server 验证后才放行——**这才是真正意义上的「MCP 鉴权」**。

## ② Server → 线上应用（凭证保管 credential custody）

「通过 mcpserver 鉴权」这句话，准确指的是**这一层**：

- server **持有**线上应用的 API key / token，**替模型**去调线上接口。
- 模型只看到 `registerTool` 暴露的 tool，**永远接触不到 API key** → 这是**好实践**（隔离敏感凭证）。
- 凭证通过**环境变量注入**：

```bash
claude mcp add xx -e API_KEY=xxx -- node dist/index.js
```

server 内 `process.env.API_KEY` 读取。

> ⚠️ 严格讲：stdio 模式下 server **不负责「鉴权谁能连」**（没这层），它只负责**替已连上的自己持有后端凭证**。要做用户级鉴权，得上远程 HTTP server + OAuth。

## 🔴 安全三要点（MCP 官方反复强调，面试能讲）

1. **Prompt Injection 风险**
   - server 从线上应用拿回的数据**不可信**，可能藏着诱导模型的恶意指令。
   - **tool 返回 ≠ 安全**。涉及敏感操作要 human-in-the-loop 确认。

2. **最小权限（Least Privilege）**
   - server 持有的线上 API key **只给只读或最小写权限**。
   - 别图省事给全权限 key。

3. **敏感信息别进 `content`**
   - 返回给模型的内容会进上下文 → 可能进日志 / 历史。
   - 密钥、PII 数据要在 server 里**先过滤**，别透传。

## 💡 本地 vs 远程 Server 取舍

「应用在线上，要不要另写 server？」——看场景：

| 场景 | 选择 | 凭证 |
|------|------|------|
| 个人 / 小范围用 | 本地 stdio server 内部 `fetch` 线上 API | 留本地（环境变量） |
| 多用户 / 集中部署 | 远程 HTTP server，和线上应用同机房 | 内网共享 |

## ❓ 理解检查

1. stdio 本地 server 能做「用户级鉴权」吗？
   - 不能。stdio 无协议级鉴权（机器信任）；要 OAuth 得用远程 HTTP server。

2. 为什么说 server 持有后端凭证是「好实践」？
   - 把敏感凭证隔离在 server 进程内，模型只看到 tool，接触不到 key。

3. tool 返回的数据可信吗？
   - 不可信，有 prompt injection 风险；敏感操作需人工确认。

## 🔗 关联概念

- [[MCP核心概念与三方架构]]
- [[../03-易错点与陷阱/MCP易错点汇总|MCP易错点汇总]]
