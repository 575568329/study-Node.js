# 2026-03-31 React+TS 学习会话

## 会话概述
- **时长**: ~30 分钟
- **范围**: R1 ~ R2 部分（8/28 topics, 29%）
- **方式**: Vue3 对比教学 + 实战项目

---

## 学习内容

### R1 React 核心概念
- **JSX vs 模板**: JSX 就是 JS，用 `if/for` 而非 `v-if/v-for`
- **组件思维**: 一个函数返回 UI，逻辑和界面在同一个函数中
- **Props + TS**: interface 定义 props 类型，事件就是普通函数 props（无 emit 概念）
- **Vue3→React 映射表**: v-model→value+onChange, v-for→.map(), @click→onClick, {{ }}→{ }

### R2 Hooks 核心
- **useState**: 相当于 ref，但必须用 setter 更新（不可变原则）
- **useEffect**: 相当于 watch + onMounted 的合体，**渲染后执行**
  - 空依赖数组 = onMounted
  - return 函数 = onUnmounted
- **useRef**: 相当于模板引用，`.current` 是可变容器，修改不触发渲染
- **学生提问**: useRef 为什么用 .current（包在对象里才能修改引用）

---

## Vue3 vs React 核心差异理解

| 概念 | Vue3 | React |
|------|------|-------|
| 状态声明 | `ref(0)` | `useState(0)` |
| 更新机制 | 改值自动追踪 | 必须 setter → 函数重新执行 |
| 副作用 | `watch` / `onMounted` | `useEffect`（合体） |
| 条件渲染 | `v-if` | 三元 / `&&` |
| 列表渲染 | `v-for` | `.map()` |
| 双向绑定 | `v-model` | `value` + `onChange` |

---

## 实战项目
- **路径**: `projects/react/react-ts-demo/`
- **内容**: 计数器 + 待办清单 + TodoItem 组件
- **文件结构**:
  - `src/App.tsx` — 主组件（useState/useEffect/useRef）
  - `src/components/TodoItem.tsx` — Props 类型定义 + 事件回调

---

## 学生表现
- **优势**: Vue3 基础让 React 概念迁移非常快，能抓住核心差异
- **薄弱点**: useEffect 执行时机（误认为渲染前）
- **主动提问**: useRef 的 .current 设计原因（探究语法细节）

---

## 下次学习计划
- [ ] R2 剩余：useMemo / useCallback
- [ ] R3 Hooks 进阶：useContext / useReducer / 自定义 Hook
- [ ] R4 TypeScript 深度集成
- [ ] R5 路由与数据获取
