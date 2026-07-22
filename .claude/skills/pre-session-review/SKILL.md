---
name: pre-session-review
description: Run a pre-session retrieval quiz at the start of a NEW study topic or study day. Triggers on the conversation signal that fresh study content is beginning — the learner kicks off a new topic / new Day / a new concept area, or returns to study after a gap — even WITHOUT an explicit command. (Saying 开始今日学习 / 开始学习 / 开始练习 still works too.) Reads the FSRS queue, tests due + recently-weak KPs with zero-hint questions judged by role agents (interviewer/code-reviewer), re-rates them, updates the queue, and says what to focus on before the new content. Mirrors the proven Day5/Day6 pre-class quiz routine. Do NOT fire on a casual mid-flow question, to verify a single just-learned KP (use kp-verify), or to log session progress (use update-progress).
---

# pre-session-review：课前复习与预测试

## 为什么存在（方法论已蒸馏，自包含）

- **提取练习 / 预测试** 🟢：session 开始先检索旧知识，比重学更能促进保持；预测试即使全错也激活知识结构。
- **savings 再激活** 🟢：旧知识"忘了"也是加速重学——先诊断 fade 点、只定向再激活，不从头重学。
- **过度校正（hypercorrection）** 🟢：**高信心错误**（很确信却答错）是复习金矿，优先揪出。
- **交错（interleaving）** 🟠：跨 KP / 跨线抽查比集中练更暴露真实掌握。

本技能读项目数据（`fsrs-queue.md` / `vault-map.md`），判题复用通用角色 agent。

## 核心流程

```
[触发：新主题 / 新 Day 开始，或隔段时间回来——不是靠口令] → 读 fsrs-queue.md（路径见 vault-map.md）
  → 选今天该测的 KP：
     - 下次到期 ≤ 今天（到期 / 逾期）
     - 最近 ratings 里有 Hard / Again 的（薄弱）
     - （首次学习 / 队列空 → 只出预测试）
  → 出课前小测（5-8 题，5-10 分钟）[零提示]
  → 判答：复用角色 agent（原理→interviewer / 技能→code-reviewer）
  → 每个 KP 重打分（A/H/G/E）+ 快速重排下次到期
  → 写回 fsrs-queue.md（ratings + 上次 + 下次到期）
  → 输出"今天该补什么"建议 → 自然过渡到新内容
```

## 课前小测题型（5-8 题）

| 题型 | 数量 | 来源 | 目的 |
|---|---|---|---|
| 预测试 | 2-3 | 今天要学的新主题 | 激活结构，答错正常也有价值 |
| 盲区题 | 1-2 | 队列里 Hard / Again 的 KP | 验证薄弱点是否解决 |
| 随机抽查 | 1 | 队列里 Good / Easy 的 KP（随机） | 发现隐性遗忘 |
| 跨线抽查 | 1 | 另一条线的关联 KP | 交错巩固 |

**零提示**：题干不泄答案、不放诱导措辞、干扰项 plausible（和 kp-verify 一致）。
**不打击信心**：预测试答错是正常的，明确说"这些题本来就是让你试"。

## 判答与重打分（复用角色 agent）

逐题判，记录四类：
- **高信心正确** → 已验证
- **低信心正确** → 待验证
- **高信心错误** 🔴 → **最高优先级盲区**（hypercorrection 金矿），明确告知"你很确信但理解有偏差"
- **低信心错误** → 新盲区

**判题用角色 agent**：原理题调 `interviewer`（模式 B 评估）、技能题调 `code-reviewer`。批量小测可一次传多题给 agent。

## 重打分 + 快速重排

每个测过的 KP 产一个评分（A=Again / H=Hard / G=Good / E=Easy），追加到 ratings 列、更新"上次 = 今天"、按当前 S 快速重排下次到期：
- Again → 今天 + 1
- Hard → 今天 + ⌈S/2⌉
- Good → 今天 + S
- Easy → 今天 + 2S

> 这是**临时快速重排**（用现有 S，不动 D）；`update-progress`（记录进度时）会用 FSRS-lite 精修 D/S，是权威重排者。

## 输出学习建议

```
📊 课前小测总结

✅ 已巩固：[高信心答对的盲区]
⚠️ 仍需关注：[仍答错的盲区，高信心错误标红]
🔍 新发现：[随机 / 跨线题暴露的问题]

💡 今日学习建议：
- [基于预测试：哪些新概念要重点关注]
- [基于盲区：学新内容时注意与哪些旧知识关联]
```

然后自然过渡到新内容（苏格拉底式）——预测试里的错误可直接当新内容讲解的起点。

## 特殊场景

- **首次学习（队列空）** → 只出预测试 2-3 题，不更新队列。
- **无到期 / 无盲区** → 增加随机抽查 + 跨线题，提示"旧内容状态良好，今天专注新内容"。
- **队列文件缺失** → 按 vault-map.md 的 Glob 兜底找；找不到就当首次学习。
- **三线感知**：跨线抽查从另两条线选关联 KP（学 Java→抽查 Vue/TS 概念；学 Vue→抽查 JS/TS 基础）。KP 属哪条线看 KP 名 / 上下文（见 vault-map.md）。

## 注意事项

- **事件触发，不等口令**：新主题 / 新 Day 开始、或隔段时间回来时**主动发起**（用户极少说"开始今日学习"）。只在**明确的新主题起点**触发——用户在深度提问 / 连续追问中途**绝不打断**。
- **拿不准就先问一句**：边界模糊（不确定算不算新主题）时，先问"要不要先做个 5 分钟小测再开始？"，别硬插。
- **判题不自己造判官**：复用 interviewer / code-reviewer，和 kp-verify 同一套标准。
- **不拖太久**：5-10 分钟，别让复习挤占新内容。
- **不写进度文件**：进度记账是 update-progress 的活；本技能只动 fsrs-queue 的 ratings / 上次 / 下次到期。
- **不自己启动项目**：技能型抽查只给代码 / 命令，用户自己跑。
