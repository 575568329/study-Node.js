# React + TypeScript 学习进度

**Last Updated**: 2026-03-31
**学习目标**: 掌握 React Hooks + TypeScript，为 Next.js 打基础
**前置技能**: TypeScript (100%) | Vue3+TS (90%) | Node.js (已完成)

---

## 📊 快速统计

📈 **Overall Progress**: 8/28 topics = **29%**
📚 **学习天数**: 1
🎯 **状态**: 🔵 学习中

---

## 知识领域

### R1 React 核心概念
- [x] JSX 语法与模板的区别 ✅ 2026-03-31 置信度:高
- [x] 组件：函数组件 ✅ 2026-03-31 置信度:高
- [x] Props 与 TypeScript 接口定义 ✅ 2026-03-31 置信度:高
- [ ] 条件渲染与列表渲染

### R2 Hooks 核心
- [x] useState 状态管理 ✅ 2026-03-31 置信度:高
- [x] useEffect 副作用处理 ✅ 2026-03-31 置信度:中（执行时机需巩固：渲染后执行）
- [x] useRef 引用管理 ✅ 2026-03-31 置信度:高
- [ ] useMemo 与 useCallback 性能优化

### R3 Hooks 进阶
- [ ] useContext 跨组件通信
- [ ] useReducer 复杂状态管理
- [ ] 自定义 Hook 设计模式

### R4 TypeScript 深度集成
- [x] 组件 Props 类型定义 ✅ 2026-03-31 置信度:高
- [ ] 泛型组件
- [ ] React 事件类型处理
- [ ] forwardRef 与类型标注

### R5 路由与数据获取
- [ ] React Router v6 + TypeScript
- [ ] 数据获取模式（useEffect + fetch / TanStack Query）
- [ ] 加载与错误状态管理

### R6 状态管理
- [ ] Zustand（轻量状态管理）
- [ ] Zustand + TypeScript

### R7 样式方案
- [ ] CSS Modules
- [ ] Tailwind CSS 基础

### R8 实战
- [ ] React+TS 完整项目搭建
- [ ] API 层封装
- [ ] 表单处理（React Hook Form / Zod）

---

## 🔄 待巩固复习清单

> 基于盲区图谱分析，按优先级排序。复习时间基于间隔公式。

### P0 - 高优先级（次日必验证）

- [ ] **useEffect 执行时机** | 错误: "React在渲染前执行" | 根源: 与Vue3 watch(DOM更新前)混淆
  - 连带影响: useLayoutEffect(渲染前执行) → 需区分
  - 复习日期: 2026-04-01 | 状态: 未验证 | 验证次数: 0

### P1 - 中优先级（3天内复习）

- [ ] **React 状态不可变原则** | 易忘: 下意识直接修改数组/对象
  - 连带影响: useMemo/useCallback 依赖于此理解
  - 复习日期: 2026-04-03 | 状态: 未验证 | 验证次数: 0

### P2 - 低优先级（1-2周内复习）

- [ ] **useRef .current 可变容器** | 概念已理解，需实战巩固
  - 复习日期: 2026-04-07 | 状态: 未验证 | 验证次数: 0

### 跨技能待验证

- [ ] TypeScript: protected 外部不可访问（TS 盲区，影响 React 类组件理解）
- [ ] TypeScript: Omit 手写实现 `Pick<T, Exclude<keyof T, K>>`

---

## 学习记录

### 2026-03-31 - R1 ~ R2 部分（8/28 topics）
- **掌握**: JSX 语法、函数组件、Props+TS 类型定义、useState、useEffect、useRef
- **Vue3→React 映射**: ref→useState, watch→useEffect, 模板引用→useRef, v-model→value+onChange, v-for→.map()
- **实战项目**: `projects/react/react-ts-demo`（计数器+待办清单+TodoItem组件）
- **待巩固**: useEffect 执行时机、状态不可变原则、useRef .current
- **笔记**: `sessions/react/2026-03-31/session-notes.md`
