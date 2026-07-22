# FSRS Rating 映射（kp-verify 输出 → Phase 3 复习队列）

> 本文件是 kp-verify 的**自带参考**（bundled reference）。仅在**需要把验证结果转成 FSRS 评分**、或想了解评分 / 间隔依据时加载——核心编排逻辑在 SKILL.md，不读本文件也能完成验证。

## 职责边界

kp-verify 的职责止于**判定一个 Again / Hard / Good / Easy 评分**；具体"下次几天后复习"由 Phase 3 复习队列（update-learning-progress，尚未建）按 FSRS 模型算。**本技能不算间隔。**

## 评分映射（SOLO + 迁移 → FSRS rating）

| SOLO 级 | 迁移判定 | FSRS rating | 含义 |
|---|---|---|---|
| 前结构 / 单点 | — | **Again (1)** | 基本不会，近期重验 |
| 多点 | — | **Hard (2)** | 讲不清 / 不连贯，记不久 |
| 关联 | 不适用(原理型) 或 通过 | **Good (3)** | 可用，正常间隔 |
| 抽象拓展 | 通过(技能型) | **Easy (4)** | 掌握，长间隔 |
| 关联及以下 | ❌未通过(技能型) | **Hard (2)** 或 **Again (1)** | 技能型没过迁移 = 没掌握 |

**判定原则**：
- **技能型一票否决**：迁移未通过时，无论 SOLO 多高，rating 上限 Hard（接近完全不会则 Again）。
- **原理型不看迁移**：关联 = Good、抽象拓展 = Easy。
- **语法 / API 不进队列**：外部化，不评分。

## FSRS 模型速查（给 Phase 3 队列用；本技能不计算）

- **每 KP 三状态量**：D（Difficulty，1-10，对你多难）/ S（Stability，天，保持 90% 回忆的间隔）/ R（Retrievability，此刻回忆概率）。
- **留存公式**（FSRS v4 形式）：`R(t,S) = (1 + t/(9·S))⁻¹`，t = S 时 R = 0.9（4.5 / 6 版本把衰减参数泛化为可训练，量级不变）。
- **每次评分更新 D、S**：1=Again（忘了）/ 2=Hard / 3=Good / 4=Easy。规律：D 大进步慢、S 大难再加固、近遗忘时复习（R 小）收益最大。
- **下次间隔**：由 D、S、本次 rating 更新 S 后算出（Phase 3 实现，不必上全部可优化参数）。

> ⚠️ **外推警示** 🟠：FSRS 的证据全部来自卡片 / 言语回忆。对概念 / 讲稿型 KP 基本成立；技能型 KP 的真保持以"能否再做出来"为准，别迷信算出的间隔天数。
> 算法细节见 [awesome-fsrs Wiki — The Algorithm](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm)。
