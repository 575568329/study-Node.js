# Vue3 + TypeScript 学习进度

**Last Updated**: 2026-03-31
**学习目标**: 掌握 Vue3 Composition API + TypeScript，为 React/Next.js 打基础
**前置技能**: TypeScript (100%) | Node.js (已完成)

---

## 📊 快速统计

📈 **Overall Progress**: 27/30 topics = **90%**
📚 **学习天数**: 1
🎯 **状态**: ✅ 核心完成（3 个子主题待实战深入）

---

## 知识领域

### V3.1 Vue3 新特性概览与项目搭建
- [x] Vue3 vs Vue2 核心变化总结 ✅ 2026-03-31 置信度:高
- [x] Vite 创建 Vue3+TS 项目 ✅ 2026-03-31 置信度:高
- [x] 项目结构解析与 tsconfig 配置 ✅ 2026-03-31 置信度:高

### V3.2 Composition API 核心
- [x] ref 与 reactive 响应式基础 ✅ 2026-03-31 置信度:高
- [x] computed 计算属性 ✅ 2026-03-31 置信度:高
- [x] watch 与 watchEffect ✅ 2026-03-31 置信度:高
- [ ] toRef / toRefs / toRaw（实战中遇到时深入）

### V3.3 生命周期与 setup
- [x] setup() 函数与 `<script setup>` 语法 ✅ 2026-03-31 置信度:高
- [x] 生命周期钩子（onMounted, onUpdated, onUnmounted 等） ✅ 2026-03-31 置信度:高
- [x] 与 Vue2 生命周期的对应关系 ✅ 2026-03-31 置信度:高

### V3.4 Props、Emits 与 TypeScript
- [x] defineProps 泛型声明与 withDefaults ✅ 2026-03-31 置信度:高
- [x] defineEmits 类型安全的事件定义 ✅ 2026-03-31 置信度:高
- [x] defineExpose 暴露组件方法 ✅ 2026-03-31 置信度:高
- [x] 组件类型：InstanceType 获取组件实例类型 ✅ 2026-03-31 置信度:高

### V3.5 模板与类型
- [x] 模板引用 ref 的类型标注 ✅ 2026-03-31 置信度:高
- [ ] v-for、v-if 的类型收窄（实战中遇到时深入）
- [ ] 插槽（Slots）的 TypeScript 类型（实战中遇到时深入）

### V3.6 组合式函数（Composables）
- [x] Composable 设计模式与命名规范 ✅ 2026-03-31 置信度:高
- [x] 常用 Composable 封装 ✅ 2026-03-31 置信度:高（useCounter, useTodo, useUserList）
- [x] Composable 组合与依赖注入 ✅ 2026-03-31 置信度:高

### V3.7 Pinia 状态管理
- [x] Pinia Store 定义（Setup Store） ✅ 2026-03-31 置信度:高
- [x] State / Getters / Actions 的 TypeScript 类型 ✅ 2026-03-31 置信度:高
- [x] storeToRefs 解构保持响应性 ✅ 2026-03-31 置信度:高

### V3.8 Vue Router 4 + TypeScript
- [x] 路由类型安全（props: true + defineProps） ✅ 2026-03-31 置信度:高
- [x] 路由守卫的类型标注 ✅ 2026-03-31 置信度:高
- [x] 动态路由与懒加载 ✅ 2026-03-31 置信度:高

### V3.9 实战
- [x] Vue3+TS 项目分层架构 ✅ 2026-03-31 置信度:高
- [x] API 层封装（Axios + TypeScript 泛型） ✅ 2026-03-31 置信度:高
- [x] 表单验证（computed 手动校验 + Zod 概念介绍） ✅ 2026-03-31 置信度:中

---

## 🔄 待巩固复习清单

> 每次学习结束记录薄弱点，定期回顾验证。掌握后标记 ✅ 并注明日期。

- [ ] `?.` 是可选链，不是三元运算符（概念已纠正，需注意区分）
- [ ] `<script setup>` 顶层代码比 onMounted 更早执行（组件创建时立即执行）
- [ ] reactive 整体重新赋值会丢失响应性
- [ ] storeToRefs 解构 state/getters，actions 直接解构

---

## 学习记录

### 2026-03-31 - Vue3+TS 全部章节（V3.1 ~ V3.9）
- **掌握**: Composition API 全套（ref/reactive/computed/watch）、生命周期钩子映射、defineProps/defineEmits/defineExpose 泛型声明、模板引用类型、Composable 设计与实战拆分、Pinia Setup Store、Vue Router 4 + TS、API 层分层架构、表单验证
- **实战项目**: `projects/vue3/vue3-ts-demo`（计数器+待办清单+用户管理）
- **项目结构**:
  - `composables/` — useCounter, useTodo, useUserList
  - `stores/` — useCounterStore (Pinia)
  - `api/` — request.ts (Axios封装) + user.ts (业务API)
  - `types/` — 统一类型定义
  - `views/` — HomeView, AboutView, UserView, UserListView
  - `router/` — 路由配置 + 守卫
- **待巩固**: 可选链 vs 三元、setup 执行时机、reactive 重新赋值、storeToRefs
- **未深入（实战时补）**: toRef/toRefs/toRaw、v-for/v-if 类型收窄、插槽 TS 类型、Zod 深入
- **笔记**: `sessions/vue3/2026-03-31/session-notes.md`
