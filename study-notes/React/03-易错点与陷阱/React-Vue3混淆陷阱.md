# React vs Vue3 易混淆点

> 学习日期: 2026-03-31

---

## ❌ 错误1：useEffect 执行时机（P0 高优先级）

- **错误内容**: "React 在组件渲染前就执行了 useEffect"
- **错误原因**: 和 Vue3 的 `watch` 混淆（watch 在 DOM 更新前执行）
- **正确理解**:
  ```
  React 执行顺序：函数体 → DOM 更新 → useEffect
  Vue3 执行顺序：状态变化 → watch 回调 → DOM 更新
  ```
- **如何避免**: 记住 "Effect" = "效果/后果"，是渲染之后的副作用
- **连带影响**: 后续学 useLayoutEffect（渲染前）时需注意区分

## ❌ 错误2：直接修改状态（P1 核心概念）

- **错误内容**: 虽然课上理解了，但实战中容易下意识写 `todos.push()`
- **错误原因**: Vue3 中 `reactive` 数组可以直接 push
- **正确理解**: React 状态不可变，必须 `setTodos([...todos, newItem])`
- **如何避免**: 每次写 React 状态更新时，问自己"我创建了新值吗？"

## ⚠️ 易错点：Vue3 → React 概念迁移

| 概念 | Vue3 习惯 | React 正确写法 |
|------|----------|--------------|
| 双向绑定 | `v-model` | `value` + `onChange` |
| 事件命名 | `@click` (短横线) | `onClick` (驼峰) |
| CSS 类名 | `class` | `className` |
| 状态更新 | `count.value++` | `setCount(c => c+1)` |
| 条件渲染 | `v-if` | `{condition && <JSX>}` |

---

**复习计划**: 次日验证（P0），3天内复查（P1）
