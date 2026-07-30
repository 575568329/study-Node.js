---
name: feedback-learning-notes-parallel
description: 每个知识点学完后派后台 agent 写 Obsidian 笔记，主线程继续教学，避免最后集中记录耗时过长
type: feedback
---

每个知识点完成后立即用后台 agent 同步 Obsidian 笔记，主线程继续教学不阻塞。最后只更新进度文件和会话记录。

**Why:** 用户反馈"记录速度太慢"，最后集中创建 8 个笔记文件 + 更新 4 个索引文件耗时过长，打断学习节奏。

**How to apply:** 学完一个知识点 → `Agent(run_in_background=true)` 写笔记 → 继续教下一个。会话结束时只做进度文件 + 会话记录的更新。
