# Vue3+TS API 速查表

> 学习日期: 2026-03-31

---

## 响应式
```typescript
ref(0)                    // 基本类型 → .value 访问
reactive({...})           // 对象 → 直接访问属性
computed(() => a + b)     // 派生状态
toRefs(reactiveObj)       // 解构保持响应性
```

## 组件通信
```typescript
defineProps<{...}>()                    // 泛型声明
withDefaults(defineProps<{...}>(), {})  // 带默认值
defineEmits<{ e: [arg: T] }>()         // 事件定义
defineExpose({ method })                // 暴露给父组件
```

## 生命周期
```typescript
onMounted(() => ...)
onUnmounted(() => ...)
// beforeCreate/created = <script setup> 顶层代码
```

## Pinia
```typescript
const store = useXxxStore()
const { state } = storeToRefs(store)   // 数据
const { action } = store                // 方法
```

## 模板引用
```typescript
const el = ref<HTMLInputElement | null>(null)
// <input ref="el" />
```
