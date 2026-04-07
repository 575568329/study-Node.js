# React + TypeScript 学习进度

**Last Updated**: 2026-04-06
**学习目标**: 掌握 React Hooks + TypeScript，为 Next.js 打基础
**前置技能**: TypeScript (100%) | Vue3+TS (90%) | Node.js (已完成)

---

## 📊 快速统计

📈 **Overall Progress**: 28/28 topics = **100%** 🎉
📚 **学习天数**: 4
🎯 **状态**: ✅ 已完成

---

## 知识领域

### R1 React 核心概念
- [x] JSX 语法与模板的区别 ✅ 2026-03-31 置信度:高
- [x] 组件：函数组件 ✅ 2026-03-31 置信度:高
- [x] Props 与 TypeScript 接口定义 ✅ 2026-03-31 置信度:高
- [x] 条件渲染与列表渲染 ✅ 2026-04-03 置信度:高

### R2 Hooks 核心
- [x] useState 状态管理 ✅ 2026-03-31 置信度:高
- [x] useEffect 副作用处理 ✅ 2026-03-31 置信度:高（执行时机已验证 2026-04-03）
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
- [x] React Router v6 + TypeScript ✅ 2026-04-04 置信度:高
- [x] 数据获取模式（useEffect + fetch / TanStack Query） ✅ 2026-04-04 置信度:高
- [x] 加载与错误状态管理 ✅ 2026-04-04 置信度:高

### R6 状态管理
- [x] Zustand（轻量状态管理） ✅ 2026-04-04 置信度:高
- [x] Zustand + TypeScript ✅ 2026-04-04 置信度:高

### R7 样式方案
- [x] CSS Modules ✅ 2026-04-04 置信度:高
- [x] Tailwind CSS 基础 ✅ 2026-04-04 置信度:高

### R8 实战
- [x] React+TS 完整项目搭建 ✅ 2026-04-04 置信度:高
- [x] API 层封装 ✅ 2026-04-04 置信度:高
- [x] 表单处理（React Hook Form / Zod） ✅ 2026-04-04 置信度:中

---

## 🔄 待巩固复习清单

> 基于盲区图谱分析，按优先级排序。复习时间基于间隔公式。

### P0 - 高优先级（次日必验证）

- [x] **useEffect 执行时机** | 验证日期: 2026-04-03 | 状态: ✅ 已验证

### P1 - 中优先级（3天内复习）

- [x] **React 状态不可变原则** | 验证日期: 2026-04-04 | 状态: ✅ 已验证（小测正确回答 B，理解引用比较）
  - 验证次数: 1

- [ ] **子传父通信模式** | 原因: 上次遗忘，本次小测回调模式正确但传数据部分缺失
  - 复习日期: 2026-04-10 | 状态: 待验证 | 验证次数: 1
  - 备注: 回调模式已掌握（onClick={onClose}），但缺少子组件传数据给父组件（onDelete(id)）

### P2 - 低优先级（1-2周内复习）

- [ ] **泛型组件** | 置信度:中 | 实战练习不足
  - 复习日期: 2026-04-11 | 状态: 未验证 | 验证次数: 0

- [ ] **forwardRef** | 置信度:中 | 使用场景少，概念理解即可
  - 复习日期: 2026-04-11 | 状态: 未验证 | 验证次数: 0

- [ ] **TanStack Query invalidateQueries** | 置信度:中 | task-manager 中用过但小测遗忘
  - 复习日期: 2026-04-11 | 状态: 未验证 | 验证次数: 0
  - 备注: 作用是让缓存失效自动重新请求数据，增删改后刷新列表

- [x] **React Hook Form + Zod** | 置信度:高 | task-manager 实战完成
  - 验证日期: 2026-04-06 | 状态: ✅ 已验证 | 验证次数: 1

### 已验证通过

- [x] **useEffect 执行时机** | 验证日期: 2026-04-03 | 验证次数: 1
- [x] **React 状态不可变原则** | 验证日期: 2026-04-04 | 验证次数: 1
- [x] **React Hook Form + Zod** | 验证日期: 2026-04-06 | 验证次数: 1

---

## 学习记录

### 2026-04-06 - React 实战项目（task-manager）🎉
- **项目**: `projects/react/task-manager` — 完整的任务管理系统
- **技术栈**: React 19 + TypeScript + Vite + TanStack Query + Zustand + React Hook Form + Zod + Tailwind CSS + Axios + json-server
- **实现功能**:
  - 登录/登出（React Hook Form + Zod 表单验证）
  - 任务 CRUD（搜索、状态/优先级筛选、新增/编辑弹窗）
  - 标签管理（新增/编辑/删除 + 颜色选择）
  - 路由守卫（RequireAuth 组件）
  - Axios 拦截器 + 泛型封装
- **修复问题**: json-server 端口冲突、Zod v4 API 变更（required_error → message）、ESLint any → unknown
- **架构模式**: types → api → hooks → components（与 Vue3 项目一致）

### 2026-04-04 - R5 ~ R8 全部完成（16/28 → 28/28）🎉
- **掌握**: React Router v6、TanStack Query、Zustand、CSS Modules、Tailwind CSS、项目搭建、API封装、React Hook Form + Zod
- **课前小测**: 状态不可变✅已验证，useMemo描述⚠️微调，Vue3 Router✅记忆清晰
- **关键对比**: React Router vs Vue Router、Zustand vs Pinia、CSS Modules vs scoped、Tailwind新思路
- **设计哲学差异**: Vue3约定大于配置 vs React自由大于约定
- **笔记**: `sessions/react/2026-04-04/session-notes.md`

### 2026-04-03 - R1剩余 ~ R4全部（8/28 → 16/28）
- **掌握**: 条件渲染+列表渲染、useMemo、useCallback、useContext、useReducer、自定义Hook、React事件类型、泛型组件、forwardRef
- **课前小测**: useEffect时机✅已验证，状态不可变⚠️仍需巩固，子传父❌遗忘
- **学生反馈**: 要求先讲语法再讲例子；不相关概念要明确告知无关联
- **笔记**: `sessions/react/2026-04-03/session-notes.md`

### 2026-03-31 - R1 ~ R2 部分（8/28 topics）
- **掌握**: JSX 语法、函数组件、Props+TS 类型定义、useState、useEffect、useRef
- **Vue3→React 映射**: ref→useState, watch→useEffect, 模板引用→useRef, v-model→value+onChange, v-for→.map()
- **实战项目**: `projects/react/react-ts-demo`（计数器+待办清单+TodoItem组件）
- **笔记**: `sessions/react/2026-03-31/session-notes.md`
