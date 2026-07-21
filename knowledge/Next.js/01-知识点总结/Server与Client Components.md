# Server Components vs Client Components

> 学习日期: 2026-04-07 | 置信度: 高

---

## 核心概念

Next.js 中组件默认跑在**服务器**（Server Component），只有加 `'use client'` 才跑在浏览器（Client Component）。

## 对比

| | Server Component | Client Component |
|---|---|---|
| 执行位置 | 服务器 | 浏览器 |
| 标记 | 默认（不写） | `'use client'` |
| async/await | ✅ 可以直接用 | ❌ |
| 直接查数据库 | ✅ | ❌ |
| useState/useEffect | ❌ | ✅ |
| onClick/onChange | ❌ | ✅ |
| 发送 JS 到浏览器 | ❌ 不发送 | ✅ 发送 |

## 组合规则

```
Server Component
├── 渲染 Server Component    ✅
├── 渲染 Client Component    ✅ （通过 props 传数据）
│
Client Component
├── 渲染 Client Component    ✅ （父子回调正常）
├── 渲染 Server Component    ❌ （不能反过来）
```

## 数据流方向

```
Server → Client（props）✅
Client → Server          ❌
```

客户端需要触发服务端操作的方式：
- **Server Actions**: 表单提交、数据修改
- **API Routes**: fetch 调用
- **路由跳转**: 导航到新页面

## 实际项目模式

```
page.tsx (Server) — 查数据库拿数据
  └── TaskList.tsx (Client) — 筛选、搜索交互
        ├── TaskCard.tsx (Client) — 展示 + 交互
        └── TaskModal.tsx (Client) — 表单弹窗
```

## 判断规则

**要交互 → `'use client'`，只展示 → 不加。**

需要 `'use client'` 的标志：useState、useEffect、onClick、onChange、useRef
不需要的：展示数据、查数据库、async/await、`<Link>` 导航

---

**标签**: #Next.js #Server-Component #Client-Component #核心概念 #掌握
