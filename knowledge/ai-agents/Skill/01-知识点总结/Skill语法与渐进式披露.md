---
tags:
  - 概念
  - Skill
  - Claude-Code
创建时间: 2026-06-16
状态: 已掌握
置信度: High
---

# Skill 语法与渐进式披露

## 📝 定义

**Skill（Agent 技能）** 是 Claude Code 等 AI agent 的**声明式能力单元**：用 YAML frontmatter + Markdown 写成，定义「遇到某类任务时，AI 该怎么思考 / 怎么做」。

一句话：**Skill 管「怎么做」（方法论），MCP 管「能做什么」（能力）。** 二者平级，共同构成 Claude Code 生态。

## 📁 目录结构

一个技能 = 一个目录，`SKILL.md` 是入口；可附带脚本 / 资源文件。

```
.claude/skills/my-skill/
├── SKILL.md          # 入口：frontmatter + 方法论正文
├── reference.md      # 可选：补充资料
└── helper.sh         # 可选：可执行脚本（正文里调用）
```

## ✏️ frontmatter 字段

```yaml
---
name: my-skill                    # 技能名（kebab-case，即目录名）
description: 触发条件描述           # 最关键！决定何时被加载
allowed-tools: [Read, Write, Bash] # 可选，限定本技能可用工具
metadata:                         # 可选，自定义元数据
  layer: something
---
```

正文是 Markdown 方法论，可引用同目录下的脚本 / 资源。

## 🎯 两个核心设计

### 1. description 写「触发条件」，不是「是什么」

渐进式披露下，description 是唯一的「门面」，写不准就触发不到。

- ❌ `description: 这是一个提交技能`
- ✅ `description: 当用户要规范提交代码、生成 Conventional Commits 时使用`

### 2. 渐进式披露（Progressive Disclosure）

- 默认**只有 `description` 在模型上下文里**（省 token）。
- 主体内容**只在 description 命中、被触发时才加载**。
- 价值：避免几十个技能的全文撑爆上下文，按需加载。

## 🆚 Skill vs MCP vs CLAUDE.md

| 维度 | Skill | MCP | CLAUDE.md |
|------|-------|-----|-----------|
| 本质 | 声明式方法论 | 命令式能力连接 | 全局项目指令 |
| 形态 | Markdown + YAML | 独立 Server 进程 | Markdown |
| 加载 | description 命中才加载主体 | 主动调用 tool | 始终加载 |
| 关注 | 怎么做（流程） | 能做什么（工具） | 规则 / 约定 |

> Skill 与 CLAUDE.md 都是基于文件的「指令」，区别在**加载时机**：CLAUDE.md 始终在上下文，Skill 按需触发。

## 💻 使用场景

- 规范化流程：Git 提交规范、代码审查清单
- 领域方法论：本项目特定的排查步骤、面试出题流程
- 复用步骤：把反复执行的多步操作封装成「一句话触发」

## 🔗 关联概念

- [[../../MCP/01-知识点总结/MCP-Server开发与Skill语法|MCP-Server开发与Skill语法]]
- [[../../MCP/01-知识点总结/MCP核心概念与三方架构|MCP核心概念与三方架构]]
- [[../../MCP/03-易错点与陷阱/MCP易错点汇总|MCP易错点汇总]]（含 Skill description 写法）

## ❓ 理解检查

1. Skill 和 MCP 的本质区别？
   - Skill 是声明式方法论（怎么做）；MCP 是命令式连接（能做什么）。互补、平级。

2. 为什么 description 要写「触发条件」？
   - 渐进式披露：只有 description 默认在上下文，写不准就触发不到。

3. 渐进式披露解决什么问题？
   - 避免所有技能全文常驻上下文，按需加载，省 token。

## 📚 参考资料

- Claude Code 官方文档：Skills
