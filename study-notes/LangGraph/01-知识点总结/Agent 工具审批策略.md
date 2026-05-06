# Agent 工具审批策略

> 学习日期: 2026-05-06 | 置信度: ⭐⭐⭐⭐

---

## 核心概念

危险工具执行前必须人工审批。学习 Demo 中把 `interrupt()` 放在危险工具内部，让安全边界贴近危险动作。进一步抽象为 `toolPolicies + withApproval`，安全工具白名单放行，未知工具默认审批。

## 代码示例

```ts
function shouldRequireApproval(toolName: string): boolean {
  const policy = toolPolicies[toolName];
  return policy ? policy.approvalRequired : true;
}

function withApproval<TInput>(
  toolName: string,
  handler: (input: TInput) => string
): (input: TInput) => string {
  return (input) => {
    if (!shouldRequireApproval(toolName)) {
      return handler(input);
    }

    const approval = interrupt({
      question: `是否允许执行工具 ${toolName}？`,
      toolName,
      input,
    }) as { approved: boolean };

    if (!approval.approved) {
      return `人工审批未通过，已取消执行工具：${toolName}`;
    }

    return handler(input);
  };
}
```

## 关键要点

1. `calculator` 等安全工具不触发审批。
2. `deleteFile` 等危险工具触发审批。
3. 未知工具默认审批，属于 fail closed 策略。
4. 工具返回值要写给模型看，避免最终回复误判。

## ❌ 常见错误与纠正

### 错误：用黑名单管理危险工具
- **正确理解**: 白名单更安全，漏配时最多多审批，不会误放行。

### 错误：忽略 LLM 生成的工具参数风险
- **正确理解**: 模型可能脑补路径，真实项目要做参数展示、路径白名单和权限校验。
