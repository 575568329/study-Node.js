# Composition API 核心

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

Vue3 最大的变化：从 Options API（按类型组织）到 Composition API（按功能组织代码）。

## ref vs reactive

```typescript
// ref — 基本类型首选
const count = ref(0)
count.value++  // 脚本中用 .value

// reactive — 对象，直接访问属性
const user = reactive({ name: 'Alice', age: 30 })
user.name = 'Bob'  // 不需要 .value

// ⚠️ reactive 不能整体重新赋值（丢失响应性）
// ❌ user = { name: 'Bob' }  // 响应性断了
// ✅ 用 ref 包装对象：user.value = { name: 'Bob' }
```

## computed 与 watch

```typescript
const doubleCount = computed(() => count.value * 2)  // 派生状态

// watch — 明确监听，执行副作用
watch(count, (newVal, oldVal) => { ... })

// watch reactive 属性需用 getter
watch(() => todo.items.length, (newLen) => { ... })
```

## 选择规则
- **基本类型** → `ref`
- **对象且不会整体替换** → `reactive`
- **对象但可能整体替换** → `ref`

---

**标签**: #Vue3 #CompositionAPI #高置信度
