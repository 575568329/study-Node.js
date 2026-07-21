# 2026-03-31 Vue3+TS 学习会话

## 会话概述
- **时长**: ~90 分钟（含中间休息）
- **范围**: V3.1 ~ V3.9（27/30 topics, 90%）
- **方式**: 课前小测 + 概念讲解 + 实战项目

---

## 课前小测（TypeScript 复习）

| 题号 | 类型 | 结果 | 备注 |
|------|------|------|------|
| Q1 | 盲区 | ✅ | 联合类型数组括号优先级 |
| Q2 | 盲区 | ✅ | let x = null 推断为 null 类型 |
| Q3 | 盲区 | ✅ | 可选参数 undefined |
| Q4 | 盲区 | ⚠️ | protected 外部也不可访问（答错） |
| Q5 | 随机 | ⚠️ | Omit 手写实现（keyof 语法不熟练） |
| Q6 | 跨技能 | ❌ | Express Request 泛型（预习性质） |

---

## 学习内容

### V3.1 Vue3 新特性概览与项目搭建
- **核心变化**: Options API → Composition API（按功能组织 vs 按类型组织）
- **项目创建**: Vite + Vue3 + TypeScript 模板
- **学生反馈**: 迅速理解了 Composition API 解决的痛点

### V3.2 Composition API 核心
- **ref**: 包装原始值为响应式，通过 `.value` 访问，模板自动解包
- **reactive**: 包装对象为响应式，不能整体重新赋值（会丢失响应性）
- **computed**: 派生状态，自动追踪依赖
- **watch**: 监听变化执行副作用，reactive 属性需用 getter 函数
- **检查问题**: ref vs reactive 区别 ✅

### V3.3 生命周期与 setup
- **`<script setup>` 顶层代码**: 组件创建时立即执行，比 onMounted 更早
- **Vue2→Vue3 映射**: beforeCreate/created 不再需要
- **检查问题**: 定时器执行时机 ⚠️（误认为在 onMounted 之后）

### V3.4 Props、Emits 与 TypeScript
- **defineProps<{}>**: 泛型声明 vs 运行时声明的区别
- **defineEmits<{}>**: 类型安全的事件定义，传错参数编译报错
- **defineExpose**: 显式暴露子组件方法
- **InstanceType<typeof Component>**: 获取组件实例类型
- **学生提问**: defineProps 泛型语法与运行时声明的区别（主动提问，理解深入）

### V3.5 模板与类型
- **模板引用类型**: `ref<HTMLInputElement | null>(null)`
- **ref() 的泛型语法**: `<类型>` 是泛型参数，`(null)` 是初始值
- **可选链 `?.`**: 学生与三元运算符混淆，已纠正

### V3.6 组合式函数（Composables）
- **实战**: 将 HelloWorld.vue 的计数器和待办逻辑拆分为 useCounter / useTodo
- **Mixin vs Composable**: 来源明确、命名冲突可重命名、TS 完美支持
- **检查问题**: Composable vs Mixin 区别 ✅

### V3.7 Pinia 状态管理
- **Vuex → Pinia**: 去掉 mutations，actions 直接改 state
- **Setup Store**: 和 Composable 写法一致
- **storeToRefs**: 解构 state/getters 保持响应性（类似 toRefs）
- **异步 action**: 直接 await + 修改 state，不需要 commit

### V3.8 Vue Router 4 + TypeScript
- **props: true**: 路由参数通过 defineProps 接收，组件解耦
- **useRoute()**: params 类型为 `string | string[]`，需要类型收窄
- **路由守卫**: beforeEach 参数自动推导
- **懒加载**: `() => import()` 动态导入

### V3.9 实战
- **分层架构**: types → api → composable → 组件（职责单一）
- **API 封装**: Axios 实例 + 拦截器 + 泛型请求方法
- **表单验证**: computed 手动校验 + Zod 概念介绍（schema 既是校验也是类型）
- **学生理解**: 准确描述了四层架构各自的职责

---

## 实战项目
- **路径**: `projects/vue3/vue3-ts-demo/`
- **完整结构**:
  ```
  src/
  ├── api/
  │   ├── request.ts          — Axios 实例 + 泛型封装
  │   └── user.ts             — 用户 API
  ├── composables/
  │   ├── useCounter.ts       — 计数器逻辑
  │   ├── useTodo.ts          — 待办逻辑
  │   └── useUserList.ts      — 用户列表（API 调用）
  ├── stores/
  │   └── useCounterStore.ts  — Pinia Store
  ├── types/
  │   └── index.ts            — 统一类型定义
  ├── views/
  │   ├── HomeView.vue        — 首页（Pinia 计数器）
  │   ├── AboutView.vue       — 关于页
  │   ├── UserView.vue        — 用户详情（路由 props）
  │   └── UserListView.vue    — 用户管理（API + 表单验证）
  ├── router/
  │   └── index.ts            — 路由配置 + 守卫
  └── components/
      ├── HelloWorld.vue      — 主组件（Composable 拆分版）
      └── TodoItem.vue        — 子组件（defineExpose 练习）
  ```

---

## 学生表现
- **优势**: Vue2 基础扎实，概念迁移快，能主动提问（泛型语法、"为什么用 ref"）
- **薄弱点**: 可选链 vs 三元、setup 执行时机、reactive 重新赋值陷阱
- **学习风格**: 实践驱动，喜欢动手验证，对语法细节有探究欲
- **今日亮点**: 准确描述了 API 四层架构的职责分工

---

## 未深入（后续实战补）
- [ ] toRef / toRefs / toRaw
- [ ] v-for、v-if 的类型收窄
- [ ] 插槽（Slots）的 TypeScript 类型
- [ ] Zod 表单验证深入
- [ ] 性能优化与最佳实践
