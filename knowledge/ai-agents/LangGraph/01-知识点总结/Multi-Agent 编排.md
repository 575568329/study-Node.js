# Multi-Agent 编排

> 学习日期: 2026-05-06 | 置信度: ⭐⭐⭐⭐

## 核心概念

Multi-Agent 是把不同角色的 Agent 组织成协作流程。每个 Agent 负责明确职责，主图负责状态传递、路由和最终整合。

```text
Researcher → Writer → Reviewer → Final
```

## 关键要点

1. 简单任务不需要 Multi-Agent，单 Agent + 工具即可。
2. Multi-Agent 适合多阶段、多标准、需要审核的任务。
3. 有循环就必须有退出条件。
4. `revisionCount` 控制成本、延迟和不确定性。
5. `force_final` 用于达到最大修改次数后的强制收敛。
