---
name: kp-verify
description: Verify whether the learner truly mastered a knowledge point — requires objective evidence via role agents, never self-assessment. Use right after the learner finishes studying or explaining a concept, when they say things like 学完了X / 验证X / X掌握了吗 / 我会了吗 / 检验X, or when the conversation naturally reaches the end of studying a topic (verify even if they don't explicitly ask). Spawns interviewer / code-reviewer / beginner / adversary agents depending on knowledge-point type. Do NOT use at the start of learning, for progress logging, or casual chat.
---

# kp-verify：知识点掌握度验证

## 为什么存在（方法论已蒸馏，自包含）

两条结论驱动本技能，**不需要查任何文档**：

1. **迁移是最难、最易被高估的能力** 🟢：学了 ≠ 会用，连近迁移都难。所以**技能型 KP 必须验证"能否在陌生场景用对、能否改"**，光讲清原理不算过关。
2. **自我评估不可靠** 🟢（Dunning-Kruger）：越"确信"的点越可能高估。所以**绝不接受"我觉得会了"**，必须过角色 agent 的客观验证。

验证质量来自**对的视角**：不同 KP 类型用不同角色 agent，需要多视角就并行调多个。角色定义在 `.claude/agents/`（自包含、只读、各持一个视角），本技能负责编排它们。

## 核心流程（Check → Evaluate → Practice）

```
触发 → 识别 KP + 判类型(原理 / 技能 / 语法API)
     → Dunning-Kruger 防护(声明：不接受自评)
     → Check：收集证据 [零提示]
        原理型 → 合上资料默写核心
        技能型 → 写 / 改一段代码（陌生场景，非照抄）
        讲解   → 口述或讲稿
     → Evaluate：按类型调角色 agent
        原理型 → interviewer（冲深度加 adversary）
        技能型 → code-reviewer（冲深度加 adversary）
        讲解   → beginner
        高 stakes → 多角色并行 panel
     → Practice（迁移，技能型必做）：陌生场景用对 + 能改等价写法
     → 综合 → SOLO 判级 + 迁移判定 + FSRS rating
     → 输出结论 + 处置
```

## 角色 agent 路由

| 场景 / KP 类型 | 调用（subagent_type） | 验证什么 |
|---|---|---|
| 原理型（概念 / 机制） | `interviewer` | 真懂 vs 背的，扛追问 |
| 技能型（写 / 改代码） | `code-reviewer` | 用对 + 能改（迁移硬指标） |
| 讲解 / 讲稿清晰度 | `beginner` | 讲不清 = 自己没懂 |
| 深度 / 边界（冲掌握级） | `adversary` | 找破绽、反例、边界 |
| 高 stakes（重要面试点） | 多角色 panel | 多视角交叉验证 |

**调用方式**：`Agent` 工具，`subagent_type` 填角色名，prompt 传"知识点 + Check 阶段的材料"。多角色并行调，最后综合。

## SOLO 过关线（脚手架，非金标准）

| 级 | 表现 | 过关线 |
|---|---|---|
| 前结构 / 单点 / 多点 | 说不清 / 只记一点 / 多点不连贯 | **未过关** |
| **关联** | 能对比、能举例 | **= 可用**（原理型到此即可） |
| **抽象拓展** | 能迁移、扛追问 | **= 掌握**（技能型必须到此） |

> 过关线（关联 = 可用 / 抽象拓展 = 掌握）是**经验推演** ⚪，非 SOLO 原文定义。当脚手架用，最终以角色 agent 判定 + 实际能否做出来为准。

## 执行步骤

### Step 1 — 识别 KP 与类型

| 类型 | 判据 | 处置 |
|---|---|---|
| 原理型 | 理解概念 / 机制 / 心智模型，面试要讲清 | 走 interviewer |
| 技能型 | 要能写出来 / 改别人代码 | 走 code-reviewer（必过迁移） |
| 语法 / API | 具体签名 / 配置项，查即得 | **直接判"外部化，靠查"，结束**，不做深度验证 |

### Step 2 — Dunning-Kruger 防护（每次必做）
告知：⚠️ 掌握度判定**不接受"我觉得会了"**。自我评估不可靠，越"很确信"越可能高估，必须过下面的客观验证才算。

### Step 3 — Check（收集证据，零提示）
让用户产出可被角色 agent 审的东西（没材料就没法验证）：
- 原理型 → **合上资料默写**核心（本身就是提取练习）
- 技能型 → **写 / 改一段代码**，最好是陌生场景（非照抄学过的例子）
- 讲解 → 口述或讲稿

出题 / 追问时遵守**零提示**：题干不泄露答案、不放诱导性措辞、干扰项要 plausible。

### Step 4 — Evaluate（调角色 agent）
用 `Agent` 工具调对应角色，传"知识点 + Step 3 材料"：
- 追问型（interviewer）可两 pass：先出追问 → 用户答 → 再调判分
- 高 stakes → 并行多角色，各自判定后综合

### Step 5 — Practice（迁移判定，技能型必做）
技能型的迁移验证是**一条连续证据链**，不是 Check 之外的第二步：
- Step 3 你已要求用户在**陌生场景**写/改代码（这本身就是迁移测试，非照抄）→ 测"能否用对"；
- 此处让 `code-reviewer` 在审查基础上**追加"改写成等价写法"** → 测"是否真懂到能换写法"；
- **改不出 = 迁移未通过，哪怕讲得清**。
原理型此项记"不适用"。

### Step 6 — 综合判定与输出

```
📋 KP 验证：<知识点>

- 类型：原理型 / 技能型 / 语法API(外部化)
- 验证角色：[实际调用了哪些 agent]
- 判定（按实际调用的角色填，不要瞎填）：
  - 调了 interviewer / code-reviewer → SOLO 级别：<级> ｜ 过关线：关联=可用 / 抽象拓展=掌握
  - 调了 code-reviewer（技能型）→ 迁移判定：✅通过 / ❌未通过
  - 调了 beginner → 讲解清晰度：清晰 / 基本清晰 / 讲不清（不套 SOLO）
- 结论：掌握 / 可用 / 待巩固 / 仅外部化
- FSRS rating（仅原理型 · 技能型核心）：Again / Hard / Good / Easy（映射见 references/fsrs-rating.md）
  - 语法 / API 与纯讲解型**不评分、不进队列**
- 处置：
  - 原理型 · 技能型核心 → 进间隔队列定期重验
  - 语法 / API → 外部化，不进队列，靠查
- 若未过 → 错题归类：[迁移失败 / 概念模糊 / 盲区]
```

## 特殊场景

- **用户坚持"我真的会了"** → 重申 Dunning-Kruger；至少调 1 个角色 agent，**绝不裸判**。
- **无法访问公司代码（Java 线迁移受阻）** → 让用户口述"在 X 场景怎么用这个 KP"，调 `code-reviewer` 审口述方案，标注"口述级，强度低于实操"。
- **一次验证多个 KP** → 逐个走流程，最后汇总一张表，不批量裸判。
- **三线感知**：从 KP 名 / 上下文判断属 Java / 复习 / CCode 哪条线，迁移任务按线给不同场景（Java→公司代码、复习→换框架、CCode→自己工具链）。不必单独问哪条线。

## 注意事项

- **绝不裸判**：没调角色 agent 就不下"掌握"结论。
- **迁移权重最高**：技能型迁移未通过 = 未掌握，即使讲得清。
- **不要迎合**：答得不好就如实标"待巩固"，不为鼓励而放宽（客观反馈才能进步）。
- **区分内外化**：别把语法 / API 拉去深度验证，浪费精力。
- **不自己启动项目**：迁移任务只给代码 / 命令，用户自己跑。
- **FSRS rating 是输出不是计算**：本技能只判 Again / Hard / Good / Easy，具体间隔算法是 Phase 3 复习队列（update-learning-progress）的活。
