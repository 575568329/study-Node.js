# React 事件类型

> 学习日期: 2026-04-03 | 置信度: 高

---

## 核心概念

React 事件绑定通过 JSX 属性（`onClick`、`onChange` 等），TypeScript 类型标注通过 `React.事件名<Element>` 格式。

### 绑定与类型是两件事

```tsx
// onChange={handleXxx}      → 绑定事件（功能，浏览器执行）
// (e: React.XxxEvent<...>)  → 类型标注（TS 编译检查）
<input onChange={(e) => setValue(e.target.value)} />
```

### 常用事件类型

| 事件属性 | TS 类型 | 场景 |
|---------|---------|------|
| onChange | `ChangeEvent<HTMLInputElement>` | 输入框 |
| onClick | `MouseEvent<HTMLButtonElement>` | 按钮 |
| onSubmit | `FormEvent<HTMLFormElement>` | 表单 |
| onKeyDown | `KeyboardEvent<HTMLInputElement>` | 键盘 |

### 示例

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()  // 阻止页面刷新
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') { /* 回车 */ }
}
```

## 关键要点

1. **类型要和绑定的事件匹配**（onChange 配 ChangeEvent，不配会报错）
2. 实际开发大部分时候让 TS 自动推导，不用手写类型
3. 单独定义函数时才需要手写类型
4. 多个事件写多个属性，互不影响

## Vue3 对比

```
Vue3:  @click="handleClick"    @input="handleInput"
React: onClick={handleClick}   onChange={handleChange}
```

---

**标签**: #React #事件类型 #TypeScript #已掌握
