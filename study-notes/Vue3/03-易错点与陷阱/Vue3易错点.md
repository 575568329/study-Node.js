# Vue3+TS 易错点

> 学习日期: 2026-03-31

---

## ⚠️ 易错点1：reactive 整体重新赋值

- **错误**: `let user = reactive({...}); user = {...}` — 响应性丢失
- **原因**: reactive 返回 Proxy，重新赋值换了引用
- **正确**: 用 ref 包装 → `user.value = {...}`

## ⚠️ 易错点2：可选链 vs 三元

- **混淆**: 把 `?.` 当成三元运算符
- **纠正**: `?.` 是可选链（null 时短路），三元是 `? :`
- **示例**: `inputRef.value?.focus()` = 如果 value 不为 null 则调用 focus

## ⚠️ 易错点3：setup 顶层代码执行时机

- **误解**: 认为和 onMounted 同时或之后执行
- **正确**: `<script setup>` 顶层代码在 setup 阶段执行，**比 onMounted 更早**

## ⚠️ 易错点4：storeToRefs

- **规则**: state/getters 用 `storeToRefs`，actions 直接解构
- **原因**: 和 reactive 解构同理，直接解构丢失响应性

---

**复习计划**: 次日验证所有易错点
