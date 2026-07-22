---
name: update-progress
description: Record learning progress and update the FSRS review queue when a study session or topic wraps up. Triggers at a natural stopping point — a topic finished, a study day ending, or the learner switching away from a topic — even WITHOUT an explicit command. (Saying 记录进度 / 更新进度 / 记录学习成果 / 记录今日学习 still works too.) Collects what was studied plus any kp-verify ratings and pre-session re-ratings, writes knowledge/00-驾驶舱/fsrs-queue.md (D/S/next-due via FSRS-lite) and updates thin progress files (latest-session/todo/三线进度) whose paths come from vault-map.md. Do NOT use to verify a single KP (use kp-verify) or for session-start retrieval review (use pre-session-review).
---

# update-progress：进度记录 + FSRS 队列维护

## 为什么存在（方法论已蒸馏，自包含）

- **间隔重复需要持久化** 🟢：kp-verify 产的 rating、pre-session-review 的重打分，必须落盘成"下次何时复习"才有意义。本技能是 FSRS 队列的**唯一权威重排者**。
- **错题本是复习核心** 🟢：记学生真实错误（原文）+ 误解分析 + 纠正，比记"正确答案"更有复习价值。
- **进度动态算**：不硬编码总数，已掌握/总数从实际状态算。

本技能写项目数据（`fsrs-queue.md` + 进度文件，路径见 `vault-map.md`）。

## 核心流程

```
[触发：话题 / Day 收尾、要切主题、或学习告一段落——不是靠口令] → 收集本次学习成果（问用户 / 从上下文提取）：
    - 新学 / 验证了哪些 KP
    - 本次所有评分：kp-verify 的 rating + pre-session-review 的重打分（两者都要收，缺一则那批 KP 漏精修）
    - 学生的真实错误 + 误解 + 纠正（错题本）
  → 按 vault-map.md 解析路径
  → 写 fsrs-queue.md：新 KP 入队 + 已有 KP 按 FSRS-lite 精修 D/S/下次到期
  → 薄记账：latest-session.md（本次内容 / 理解程度 / 遗留问题）+ todo.md（勾选 / 新增）+ 对应三线进度
  → 汇报改了什么
```

## FSRS-lite（方向性简化，非精确 FSRS）🟠

每个 rating（A=Again / H=Hard / G=Good / E=Easy）更新该 KP 的 D / S / 下次到期。**数值是起步点，以实际复习体验校准**，别当精确公式。

**D 更新**（rating 低→变难，高→变易；轻回归中值防 ease hell）：
```
D' = clamp( D − 0.6×(rating−3), 1, 10 )
D  = clamp( 0.9×D' + 0.1×5, 1, 10 )
```

**S 更新**（recall 后；D 越大涨得越慢，方向保证对）：
```
Hard : SInc = 1.3 − 0.05×(D−5)
Good : SInc = 2.5 − 0.10×(D−5)
Easy : SInc = 4.0 − 0.15×(D−5)
S    = min(365, S × SInc)
Again（忘了）: S = max(0.3, S × 0.25)
```

**下次到期** = 今天 + round(S)

> ⚠️ FSRS 的精确证据来自卡片 / 言语回忆 🟠；技能型 KP 的真保持以"能否再做出来"为准，别迷信算出的天数。
> **新 KP 首次入队**：D 默认 5（或 kp-verify 给的难度感），S 按 rating 起步（Again 1 / Hard 2 / Good 4 / Easy 8 天）。

## 错题本（每次必记）

对本次每个答错 / 卡壳的 KP，记：
- **错误原文**：学生实际怎么答 / 怎么写的
- **误解分析**：为什么错（概念模糊 / 迁移失败 / 盲区）
- **正确理解**：纠正后的点
- **归类**：**迁移失败**（码农最高频）/ 概念模糊 / 盲区

写入 `latest-session.md` 的错题区。迁移失败优先记。

## 写哪些文件（路径从 vault-map.md 读，不硬编码）

| 文件 | 更新内容 |
|---|---|
| `fsrs-queue.md` | 新 KP 入队；已有 KP 精修 D/S/下次到期 + 追加 rating |
| `latest-session.md` | 本次内容、理解程度、遗留问题、错题 |
| `todo.md` | 勾选完成项 + 新发现的任务 |
| 对应三线进度（java线 / 复习线 / ccode线 或 前端复习进度） | 进度推进 |

**进度动态算**：已掌握数 / 总数 从实际状态统计，不硬编码。

## 注意事项

- **事件触发，不等口令**：话题收尾 / Day 结束 / 要切主题时**主动发起**记账（用户从不说"记录进度"，但一直在手记 latest-session）。拿不准是不是收尾点时，先问"这块结束了，我记一下进度？"
- **路径不硬编码**：全部从 `vault-map.md` 读；map 缺失用 Glob 按文件名兜底。
- **不碰 CLAUDE.md / 不改大结构**：只 append / 更新进度文件，避免动大配置。
- **错题记原文**：别只记"答错了"，要记学生怎么错的。
- **不阻塞**：写文件快，inline 执行，写完汇报改了哪些。
- **不自己启动项目**：只记账，不跑代码。
