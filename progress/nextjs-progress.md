# Next.js 学习进度

**Last Updated**: 2026-04-09
**状态**: ✅ 实战项目完成
**前置技能**: React+TS (100%) | Node.js (90%) | TypeScript (100%)

---

## 📊 快速统计

📈 **Overall Progress**: 7/7 基础 + 实战项目 100% = **✅ 已完成**
📚 **学习天数**: 3

---

## 知识领域

### N1 项目结构与配置
- [x] Next.js 项目创建（create-next-app + Vite 对比） ✅ 2026-04-07 置信度:高

### N2 文件路由系统（App Router）
- [x] page.tsx 与路由映射规则 ✅ 2026-04-07 置信度:高
- [x] 动态路由 [id] + params Promise 解包 ✅ 2026-04-07 置信度:中
- [x] Layout 嵌套机制 ✅ 2026-04-07 置信度:高

### N3 Server vs Client Components
- [x] Server Component（async/await、直接查数据库） ✅ 2026-04-07 置信度:高
- [x] Client Component（'use client'、交互） ✅ 2026-04-07 置信度:高
- [x] Server → Client props 传递与组合规则 ✅ 2026-04-07 置信度:高

### N4 数据获取
- [x] Server Component 直接 async/await（无需 API 层） ✅ 2026-04-07 置信度:高

### N5 API Routes
- [x] route.ts 导出 GET/POST/PUT/DELETE ✅ 2026-04-07 置信度:高

### N6 页面状态处理
- [x] loading.tsx / error.tsx / not-found.tsx ✅ 2026-04-07 置信度:高

### N7 导航
- [x] Link 组件（Server Component 可用） ✅ 2026-04-07 置信度:高

---

## 🛠 实战项目 — Task Manager（Next.js 版）

### 2026-04-08 - 实战项目核心 CRUD
- **项目**: `projects/nextjs-demo/`
- **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS + React Hook Form + Zod
- **完成**:
  - 类型定义（User/Task/Tag/ApiResponse）
  - 内存数据库（db.ts）完整 CRUD
  - API Routes（auth/tasks/tags 全部接口）
  - 登录/注册页面（表单验证 + localStorage）
  - 任务列表页（搜索/筛选/CRUD/弹窗）
  - 标签管理页（CRUD/颜色选择器）
- **关键收获**:
  - Server Component 负责数据获取，Client Component 负责交互
  - 子传父回调模式实战通过：`onClick={() => onDelete(task.id!)}`
  - Record<UnionType, Value> 做类型安全映射
  - update 操作必须用 `{...item, ...data}` 而非直接赋值
- **错误亮点**:
  - 类型文件放 app/types/ 会变成路由 → 放 src/types/
  - fetch POST 需要 headers + body: JSON.stringify()
  - route.ts 和 page.tsx 不能在同一目录
- **待完成**: ~~profile 页面、全局 Layout 导航栏、路由守卫~~ ✅ 全部完成

---

## 🔄 待巩固复习清单

### P1 - 中优先级（3天内复习）

- [ ] **动态路由 params 是 Promise** | Next.js 15 变更，需 await 解包
  - 复习日期: 2026-04-12 | 状态: ⚠️ 课前小测仍遗漏 | 验证次数: 2

### P2 - 低优先级（实战中巩固）

- [ ] **Server Actions** | 尚未学习，实战中补充
- [ ] **缓存策略（fetch cache）** | 尚未学习
- [ ] **Metadata / SEO** | 尚未学习

---

## 学习记录

### 2026-04-09 - Next.js 实战项目收尾 🎉
- **完成**: Profile 页面、Navbar 导航栏、AuthGuard 路由守卫
- **新增组件**:
  - `src/components/Navbar.tsx` — next/link + usePathname 高亮 + 退出登录
  - `src/components/AuthGuard.tsx` — 路由守卫 + 登录/注册白名单
  - `src/app/profile/page.tsx` — 个人中心（useState 懒初始化读 localStorage）
- **踩坑记录**:
  - react-router-dom 不能用在 Next.js → 用 next/link + next/navigation
  - localStorage SSR 问题 → useState 懒初始化失效（水合不重新执行），必须用 useEffect
  - React 19 lint 规则 → 不建议 useEffect 中 setState（AuthGuard 是必要场景）
  - Hook 只能在组件顶层调用，不能放在普通函数里
  - Navbar 登录页隐藏 → 路径白名单判断
- **课前小测**: Layout 持久化⚠️、localStorage SSR⚠️、params Promise⚠️仍遗漏、use client场景⚠️、RequireAuth思路✅
- **笔记**: `sessions/nextjs/2026-04-09/session-notes.md`

### 2026-04-07 - Next.js 基础全阶段（N1-N7）🎉
- **项目**: `projects/nextjs-demo`（学习练习项目）
- **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **掌握**:
  - 文件路由：创建 `/about`、`/blog/[id]`、`/counter`、`/tasks`、`/time`
  - Server Component：直接 async/await，params 需要 await 解包（Next.js 15 变更）
  - Client Component：'use client' + useState，需要交互时使用
  - Server → Client 数据传递：props 传递，反向不可行
  - API Routes：route.ts 导出 GET/POST，类似 Express
  - Layout 嵌套：按文件夹层级嵌套
  - loading / error / not-found：自动处理页面状态
  - Link 组件：Server Component 可用，不需要 'use client'
- **课前小测**:
  - 文件路由理解 ✅
  - Server/Client 概念 ⚠️ 方向对不够精确
  - 子传父回调模式 ⚠️ 模式对，传数据部分缺失
  - TanStack Query invalidateQueries ❌ 遗忘（新增关注）
- **错误记录**:
  - h1 嵌套 div 结构错误 → Counter 组件放在 h1 标签内
  - fetch 地址错误 → /api/data 应为 /api/tasks
  - params 未 await → Next.js 15 Breaking Change
  - .map() 缺少 key 警告
  - .map() 使用 {} 大括号未 return → 应使用 () 小括号
- **盲区更新**:
  - 子传父：回调模式已掌握，传数据部分待实战验证
  - TanStack Query invalidateQueries：新增 P2 关注
