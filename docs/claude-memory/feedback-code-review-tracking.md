---
name: feedback-code-review-tracking
description: 每次代码提交后必须做编码质量反馈，更新问题追踪文档和复习笔记
type: feedback
originSessionId: 8814f7bc-2a74-450d-9b24-f6d26b611ea5
---
每次用户提交代码后，必须执行以下流程：

1. **编码质量反馈**：回顾本次提交中的代码问题，按类别（TS类型/数组操作/错误处理/层级边界/其他）给出具体反馈
2. **更新 `docs/coding-review.md`**：新增问题记录、更新薄弱领域雷达的出错次数、检查是否有重复犯的错误
3. **更新 `docs/review-notes.md`**：如果发现新的薄弱知识点，补充复习内容
4. **已解决检测**：某类问题连续 2 次提交未再犯，移入"已解决"区

**Why:** 用户希望通过持续追踪发现自己的编码薄弱环节，形成可见的进步曲线
**How to apply:** 在 rag-docs-assistant 项目中，每次 git commit 前执行此流程
