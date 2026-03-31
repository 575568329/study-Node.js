# JSX 语法

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

JSX 是 JavaScript 的语法扩展，允许在 JS 中直接写类 HTML 代码。与 Vue3 模板不同，JSX **就是 JavaScript**，没有自定义指令。

## 关键映射（Vue3 → React）

| Vue3 | React | 说明 |
|------|-------|------|
| `{{ expr }}` | `{expr}` | 插值（单花括号） |
| `v-if` | `{condition && <Comp/>}` 或三元 | 条件渲染 |
| `v-for` | `{arr.map(item => ...)}` | 列表渲染 |
| `@click` | `onClick` | 事件绑定（驼峰） |
| `v-model` | `value` + `onChange` | 双向绑定拆成两个属性 |
| `class="xx"` | `className="xx"` | CSS 类名 |

## 代码示例

```tsx
// 条件渲染
{isLoggedIn ? <Dashboard /> : <Login />}

// 列表渲染
{todos.map((item, index) => (
  <li key={index}>{item}</li>
))}
```

## 关键要点
1. JSX 中用 `{}` 嵌入任意 JS 表达式
2. `class` → `className`，`for` → `htmlFor`（避免与 JS 关键字冲突）
3. JSX 会自动转义，防止 XSS

---

**标签**: #React #JSX #高置信度
