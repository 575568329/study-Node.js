# Next.js 面试题（实战项目积累）

> 持续更新，每次学习会话后补充

---

## SSR 与水合（2026-04-09）

### Q1: Next.js 中 'use client' 组件能直接访问 localStorage 吗？为什么？

**A:** 不能在组件顶层直接访问。'use client' 组件仍然会在服务端预渲染（SSR），而 localStorage 是浏览器 API，服务端不存在 window 对象。解决方案：
- 使用 `useEffect`（只在客户端执行）
- 使用 `useState` 懒初始化 + `typeof window === 'undefined'` 检查

### Q2: 什么是 Next.js 的水合（Hydration）？useState 懒初始化在水合时有什么问题？

**A:** 水合是指服务端渲染的 HTML 在客户端"激活"为可交互的 React 应用的过程。关键点：**useState 的初始值在水合时不会重新计算**——React 直接使用服务端渲染时的状态。所以 `useState(() => checkLocalStorage())` 在 SSR 时返回默认值，水合后仍然是那个值，不会重新执行初始化函数。

---

## 路由与导航（2026-04-09）

### Q3: Next.js 和 React Router 的路由方案有什么区别？

**A:**
| | React Router | Next.js App Router |
|---|---|---|
| 路由定义 | JSX 中 `<Route>` 组件 | 文件系统（文件夹结构） |
| 导航链接 | `<NavLink>` 自动高亮 | `<Link>` + `usePathname()` 手动高亮 |
| 编程式跳转 | `useNavigate()` | `useRouter().push()` |
| 路由守卫 | `<Navigate>` 组件 | middleware.ts（服务端）或 AuthGuard 组件（客户端） |

---

## React Hooks 规则（2026-04-09）

### Q4: React Hook 有哪些使用规则？

**A:**
1. 只能在组件顶层调用，不能在循环/条件/嵌套函数中
2. 只能在函数组件或自定义 Hook 中调用
3. useEffect 依赖数组必须完整声明
4. React 19 新增：不建议在 useEffect 中直接 setState（避免级联渲染）

### Q5: Layout 组件在 Next.js 中有什么特殊行为？

**A:** Layout 在子路由切换时**不会重新渲染**（持久化），只有 `children` 部分会更新。这是 Next.js Layout 的重要性能优化，区别于 React Router 中每次路由切换都重新渲染整个 Layout。

---

**标签**: #面试题 #Next.js #SSR #水合 #路由 #Hooks
