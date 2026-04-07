# Next.js 学习会话 - 2026-04-07

## 会话概述
- **主题**: Next.js 基础全阶段（N1-N7）
- **时长**: 约2.5小时
- **状态**: ✅ 基础阶段完成
- **学习方式**: 苏格拉底式教学 + 实操练习

---

## 课前小测

| 题号 | 类型 | 结果 | 备注 |
|------|------|------|------|
| Q1 | 预测试 | ✅ | 文件路由理解正确 |
| Q2 | 预测试 | ⚠️ | 方向对，不够精确 |
| Q3 | 盲区（子传父） | ⚠️ | 回调模式对，传数据部分缺失 |
| Q4 | 随机（TanStack Query） | ❌ | 已标记掌握但遗忘 |
| Q5 | 跨技能（Next.js API Routes） | ❌ | 正常，新概念预测试 |

---

## 学习内容

### N1 项目创建

- `npx create-next-app@latest` 创建项目
- 对比 Vite React 项目结构差异
- `src/app/` 目录结构：layout.tsx（根布局）、page.tsx（首页）

### N2 文件路由系统

- **规则**: 文件路径 = 路由路径
  - `app/page.tsx` → `/`
  - `app/about/page.tsx` → `/about`
  - `app/blog/[id]/page.tsx` → `/blog/123`
- **export default 必须性**: Next.js 靠文件路径找组件，不靠组件名
- **动态路由 params**: Next.js 15 起 params 是 Promise，必须 await
- **Layout 嵌套**: 按文件夹层级嵌套，子目录 layout 只影响子路由

**练习**: 创建 `/about`、`/blog/[id]`、嵌套 blog layout

### N3 Server vs Client Components

- **Server Component**（默认）: 跑在服务器，可直接 async/await、查数据库
- **Client Component**（`'use client'`）: 跑在浏览器，用于交互（useState、onClick）
- **数据流**: Server → Client（通过 props）✅ / Client → Server ❌
- **判断规则**: 要交互 → 'use client'，只展示 → 不加

**练习**: 创建 `/time`（Server）、`/counter`（Server + Client 混合）

### N4 数据获取

- Server Component 直接 async/await fetch，无需 TanStack Query
- 对比 React SPA: 少了整个 API 层
- Client Component 需要数据时仍需 API Routes

### N5 API Routes

- `app/api/tasks/route.ts` → `GET /api/tasks`
- 导出 GET/POST/PUT/DELETE 函数
- 用 `NextResponse.json()` 返回数据
- 类似 Express 但写法不同

**练习**: 创建 API + Server Component fetch 渲染列表

### N6 页面状态处理

- `loading.tsx`: 自动显示加载状态
- `error.tsx`: 必须加 `'use client'`（有 reset 按钮交互）
- `not-found.tsx`: 404 页面
- `<Link>` 组件: Server Component 可用，不需要 'use client'

---

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| `export default` 为什么必须？ | Next.js 靠文件路径找组件，不靠组件名，default 保证一致导出 |
| params 报错 Unexpected token '?' | Next.js 15 Breaking Change，params 变为 Promise |
| Layout 嵌套会影响其他路由吗？ | 不会，layout 只管自己目录下的页面 |
| async/await 是同步的吗？ | 不是，本质还是异步，只是写起来像同步 |
| `error.tsx` 的 `digest` 是什么？ | Next.js 自动生成的错误哈希值，用于日志排查 |
| error.tsx 为什么必须 'use client'？ | 有 reset 按钮交互（onClick） |
| Client 能传 props 给 Server 吗？ | 不能，渲染顺序决定了数据流单向 |

---

## ❌ 错误记录（复习重点）

### 错误1: h1 嵌套 div 结构错误
- **错误内容**: `<Counter>` 组件放在 `<h1>` 标签内，Counter 渲染 `<div>`
- **错误原因**: JSX 结构规划不清晰
- **纠正**: 将 Counter 移到 h1 外面

### 错误2: fetch 地址错误
- **错误内容**: `fetch('http://localhost:3000/api/data')`
- **正确**: `fetch('http://localhost:3000/api/tasks')`
- **错误原因**: API 路径与文件路径未对应（`app/api/tasks/route.ts` → `/api/tasks`）

### 错误3: params 未 await（Next.js 15 Breaking Change）
- **错误内容**: 直接用 `params.id`
- **正确**: `const { id } = await params`
- **错误原因**: Next.js 15 新变更，不知道 params 变成了 Promise

### 错误4: .map() 缺少 key
- **错误内容**: 列表渲染 div 未加 key 属性
- **错误原因**: 忘记 React 列表渲染必须加 key

### 错误5: .map() 大括号未 return
- **错误内容**: `data.map((item) => { <div>...</div> })`
- **正确**: `data.map((item) => ( <div>...</div> ))`
- **错误原因**: 箭头函数 `{}` 大括号需要显式 return，`()` 小括号自动返回

### 错误6: 同路径 route.ts 和 page.tsx 冲突
- **错误内容**: `app/api/tasks/page.tsx` 和 `app/api/tasks/route.ts` 同时存在
- **正确**: 页面放 `app/tasks/page.tsx`，API 放 `app/api/tasks/route.ts`
- **错误原因**: 不理解 API 路径和页面路径必须分开

---

## 掌握主题
- ✅ 文件路由（page.tsx、动态路由 [id]）
- ✅ Layout 嵌套机制
- ✅ Server Component（async/await、直接查数据库）
- ✅ Client Component（'use client'、useState）
- ✅ Server → Client props 传递
- ✅ API Routes（GET/POST）
- ✅ 数据获取（Server Component 直接 fetch）
- ✅ loading / error / not-found 处理
- ✅ Link 组件

---

## 表现评估
- **理解能力**: ⭐⭐⭐⭐ 快速理解 Server/Client 概念，能举一反三
- **学习速度**: ⭐⭐⭐⭐⭐ 一次会话掌握 Next.js 全部基础概念
- **代码实践**: ⭐⭐⭐ 能够独立写代码，但有细节错误（地址、结构）
- **深度思考**: ⭐⭐⭐⭐ 主动提问"为什么 error.tsx 需要 use client"
- **待改进**: 注意代码细节（fetch 地址、JSX 结构、key 属性）

---

**下一步**: 用 Next.js 重做 Task Manager 实战项目
