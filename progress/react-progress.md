# React + TypeScript 学习进度

**Last Updated**: 2026-04-03
**学习目标**: 掌握 React Hooks + TypeScript，为 Next.js 打基础
**前置技能**: TypeScript (100%) | Vue3+TS (90%) | Node.js (已完成)

---

## 📊 快速统计

📈 **Overall Progress**: 16/28 topics = **57%**
📚 **学习天数**: 2
🎯 **状态**: 🔵 学习中

---

## 知识领域

### R1 React 核心概念
- [x] JSX 语法与模板的区别 ✅ 2026-03-31 置信度:高
- [x] 组件：函数组件 ✅ 2026-03-31 置信度:高
- [x] Props 与 TypeScript 接口定义 ✅ 2026-03-31 置信度:高
- [x] 条件渲染与列表渲染 ✅ 2026-04-03 置信度:高

### R2 Hooks 核心
- [x] useState 状态管理 ✅ 2026-03-31 置信度:高
- [x] useEffect 副作用处理 ✅ 2026-03-31 置信度:中（执行时机已验证 2026-04-03）
- [x] useRef 引用管理 ✅ 2026-03-31 置信度:高
- [x] useMemo 与 useCallback 性能优化 ✅ 2026-04-03 置信度:高

### R3 Hooks 进阶
- [x] useContext 跨组件通信 ✅ 2026-04-03 置信度:高
- [x] useReducer 复杂状态管理 ✅ 2026-04-03 置信度:高
- [x] 自定义 Hook 设计模式 ✅ 2026-04-03 置信度:高

### R4 TypeScript 深度集成
- [x] 组件 Props 类型定义 ✅ 2026-03-31 置信度:高
- [x] 泛型组件 ✅ 2026-04-03 置信度:中
- [x] React 事件类型处理 ✅ 2026-04-03 置信度:高
- [x] forwardRef 与类型标注 ✅ 2026-04-03 置信度:中

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

- [x] **useEffect 执行时机** | 验证日期: 2026-04-03 | 状态: ✅ 已验证（小测正确回答 B→A）
  - 验证次数: 1

### P1 - 中优先级（3天内复习）

- [ ] **React 状态不可变原则** | 错误: 说不清为什么 push 后 setTodos(todos) 不触发渲染
  - 连带影响: useMemo/useCallback 依赖于此理解
  - 复习日期: 2026-04-06 | 状态: 待验证 | 验证次数: 0

- [ ] **子传父通信模式遗忘** | 原因: 已掌握内容出现回退
  - 复习日期: 2026-04-06 | 状态: 待验证 | 验证次数: 0

### P2 - 低优先级（1-2周内复习）

- [ ] **泛型组件** | 置信度:中 | 实战练习不足
  - 复习日期: 2026-04-10 | 状态: 未验证 | 验证次数: 0

- [ ] **forwardRef** | 置信度:中 | 使用场景少，概念理解即可
  - 复习日期: 2026-04-10 | 状态: 未验证 | 验证次数: 0

### 已验证通过

- [x] **useEffect 执行时机** | 验证日期: 2026-04-03 | 验证次数: 1

---

## 学习记录

### 2026-04-03 - R1剩余 ~ R4全部（8/28 → 16/28）
- **掌握**: 条件渲染+列表渲染、useMemo、useCallback、useContext、useReducer、自定义Hook、React事件类型、泛型组件、forwardRef
- **课前小测**: useEffect时机✅已验证，状态不可变⚠️仍需巩固，子传父❌遗忘
- **学生反馈**: 要求先讲语法再讲例子；不相关概念要明确告知无关联
- **Vue3→React 映射**: computed→useMemo, provide/inject→useContext, Composable→自定义Hook
- **笔记**: `sessions/react/2026-04-03/session-notes.md`

### 2026-03-31 - R1 ~ R2 部分（8/28 topics）
- **掌握**: JSX 语法、函数组件、Props+TS 类型定义、useState、useEffect、useRef
- **Vue3→React 映射**: ref→useState, watch→useEffect, 模板引用→useRef, v-model→value+onChange, v-for→.map()
- **实战项目**: `projects/react/react-ts-demo`（计数器+待办清单+TodoItem组件）
- **待巩固**: useEffect 执行时机、状态不可变原则、useRef .current
- **笔记**: `sessions/react/2026-03-31/session-notes.md`
