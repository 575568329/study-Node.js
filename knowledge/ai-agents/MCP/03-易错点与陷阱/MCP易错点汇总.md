---
tags:
  - 易错点
  - 重要
  - MCP
创建时间: 2026-06-16
类型: 理解偏差
---

# MCP 易错点汇总

## 误解一：MCP 是「应用自己暴露的接口」

### ❌ 错误理解
「MCP 就是某个应用把自己已有的 API / 接口暴露出来。」

### ✅ 正确理解
- **MCP 是协议（通信标准），不是接口**。
- 接口 = tool / resource / prompt（具体能力）。
- **暴露方是 MCP Server（一个独立程序）**，它内部可封装任何后端（外部 API、数据库、文件、纯内存数据）。
- **消费方是 AI 应用（Host）**，如 Claude Code。

### 🔍 为什么会错
把「被封装的后端服务」和「暴露接口的 server」混为一谈。GitHub 的 REST API 是 GitHub 暴露的接口（非 MCP）；github-mcp-server 是另写的桥接程序，按 MCP 暴露。

### 💡 记忆技巧
**接口是 tool，协议是 MCP，程序是 Server——三者别混。**

---

## 误解二：「通过 mcpserver 来进行鉴权」

### ❌ 错误理解
「server 负责鉴权用户能不能用、也能鉴权后端。」

### ✅ 正确理解
鉴权分两层：
- **① Host→Server（谁能连）**：stdio **无**协议级鉴权（机器信任）；HTTP 才有 **OAuth 2.1**。
- **② Server→后端（凭证保管）**：server 持有 API key 替模型调后端（环境变量注入）。
- 用户说的「server 鉴权」准确指 ②（凭证保管），但 ① 在 stdio 下根本不存在。

### 🔍 为什么会错
把「持有后端凭证」和「鉴权谁能连」混为一谈。

### 💡 记忆技巧
**stdio server 不「鉴权用户」，它只「替自己保管后端钥匙」。** 要鉴权用户 → 远程 HTTP + OAuth。

---

## 误解三：stdio 模式日志用 console.log

### ❌ 错误代码
```ts
console.log("[server] 启动成功");  // ❌ 写到 stdout
```

### ✅ 正确代码
```ts
console.error("[server] 启动成功");  // ✅ 写到 stderr
```

### 🔍 为什么会错
不清楚 stdio 传输下 stdout 的用途。

### 💡 记忆技巧
**stdout 归 JSON-RPC，stderr 归日志。** stdout 被协议占用，`console.log` 会塞垃圾字节 → 通信崩溃。

---

## 误解四：Skill 的 description 写「是什么」

### ❌ 错误写法
```yaml
description: 这是一个 Git 提交技能
```

### ✅ 正确写法
```yaml
description: 当用户要规范提交代码、生成 Conventional Commits 时使用
```

### 🔍 为什么会错
忽略渐进式披露：默认**只有 description 在上下文**，主体按触发才加载。description 写不准 → 触发不到 → 技能形同虚设。

### 💡 记忆技巧
**description 写「何时触发」，不写「是什么」。**

## 📝 相关知识点

- [[../01-知识点总结/MCP核心概念与三方架构|MCP核心概念与三方架构]]
- [[../01-知识点总结/MCP鉴权与安全|MCP鉴权与安全]]
- [[../01-知识点总结/MCP-Server开发与Skill语法|MCP-Server开发与Skill语法]]

## 🔄 复习次数

- [x] 第1次复习: 2026-06-16
- [ ] 第2次复习:
- [ ] 第3次复习:
