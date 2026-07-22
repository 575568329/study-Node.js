#!/usr/bin/env node
// pre-session-trigger.js — UserPromptSubmit hook（确定性触发 pre-session-review）
// 为什么存在：基于 description 的语义触发是概率性的，会漏掉自然开场（如"我们开始学习今天的内容"）。
// 这个 hook 在用户命中学习开场短语时注入指令，让主循环必然调用 pre-session-review skill。
// 放在项目级 .claude/settings.json（与用户级 ~/.claude/settings.json 的模型配置隔离 → 切模型不会丢）。
const fs = require("fs");

let raw = "";
try { raw = fs.readFileSync(0, "utf8"); } catch (e) { process.exit(0); }

let prompt = "";
try { prompt = JSON.parse(raw).prompt || ""; } catch (e) { prompt = raw; }

// 命中任一短语即触发（.some 只判布尔包含、不替换，故顺序无关）。
const triggers = ["开始今日学习", "开始今天的学习", "开始学习", "开始练习"];
const hit = triggers.some((t) => prompt.includes(t));
if (!hit) process.exit(0); // 不命中 → 不注入，安静退出

const directive =
  "[hook 注入 · pre-session-trigger] 用户命中学习开场短语。请立即调用 pre-session-review skill：" +
  "读 knowledge/00-驾驶舱/fsrs-queue.md（路径见 vault-map.md）→ 选到期/薄弱 KP → 出 5-8 题零提示小测 → " +
  "复用 interviewer/code-reviewer 判题 → 重打分写回队列 → 给今日学习建议，再进新内容。" +
  "例外：若这句其实是元问题（带问号、在讨论 skill/配置本身、并非真要开始会话），先确认一句再决定。";

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: directive,
    },
  })
);
