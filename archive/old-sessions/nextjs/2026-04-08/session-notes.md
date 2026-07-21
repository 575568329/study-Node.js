# Next.js 学习会话 - 2026-04-08

## 会话概述
- **主题**: Next.js 实战项目 — Task Manager（用 Next.js 重做 React 项目）
- **时长**: 约2小时
- **状态**: 🟡 进行中（核心CRUD完成，剩余布局和路由守卫）
- **学习方式**: 苏格拉底式教学 + 用户主导编码

---

## 项目概述

**目标**: 用 Next.js 16 + React 19 + TypeScript 重做之前 React 版的 Task Manager
**技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS + React Hook Form + Zod
**数据层**: 内存数据库（db.ts），无真实数据库
**项目路径**: `projects/nextjs-demo/`

---

## 今日完成内容

### 1. 类型定义 (`src/types/`)
- `user.ts` — User, LoginReq, RegisterReq
- `task.ts` — Task + statusType/priorityType 联合类型
- `tag.ts` — TagType
- `api.ts` — ApiResponse<T> 泛型接口

### 2. 内存数据库 (`src/lib/db.ts`)
- users/tasks/tags 数组 + 模拟数据
- 自增ID（nextUserId=2, nextTaskId=7, nextTagId=4）
- 完整 CRUD 方法
- 关键修复：updateTask/updateTag 用 `{...item, ...data}` 而非直接赋值

### 3. API Routes
- `api/auth/login/route.ts` — POST 登录
- `api/auth/register/route.ts` — POST 注册
- `api/tasks/route.ts` — GET 全部 + POST 新增
- `api/tasks/[id]/route.ts` — DELETE + PUT（await params）
- `api/tags/route.ts` — GET 全部 + POST 新增
- `api/tags/[id]/route.ts` — DELETE + PUT（await params）

### 4. 登录/注册页面
- `login/page.tsx` — React Hook Form + Zod + localStorage 存储
- `register/page.tsx` — 多一个 nickname 字段

### 5. 任务列表页面
- `tasks/page.tsx` — Server Component，fetch 获取 tasks + tags
- `tasks/TaskListClient.tsx` — Client Component，搜索/筛选/CRUD
  - Record<statusType, {...}> 类型安全映射
  - 子传父回调模式（onDelete, onEdit）
- `tasks/TaskModal.tsx` — 表单弹窗，新增/编辑复用

### 6. 标签管理页面
- `tags/page.tsx` — Server Component
- `tags/TagManageClient.tsx` — Client Component，TagItem 组件
- `tags/TagModal.tsx` — 颜色选择器 + 表单验证

---

## ❌ 错误记录（复习重点）

### 错误1: 类型文件放在 app/types/
- **原因**: app/ 下的文件夹会被 Next.js 当作路由
- **修复**: 移到 src/types/

### 错误2: fetch 缺少 body 和 headers
- **错误**: `fetch('/api/auth/login', {method:'POST', data})`
- **正确**: 需要 headers Content-Type 和 body: JSON.stringify(data)

### 错误3: useRouter 放在组件外部
- **修复**: 移到组件函数内部

### 错误4: res.ok vs result.ok 混淆
- **ok 属性在 Response 对象上**，不在 json() 解析结果上

### 错误5: localStorage 存对象未序列化
- **修复**: JSON.stringify(user)

### 错误6: route.ts 和 page.tsx 同路径冲突
- **原因**: API 路径和页面路径不能在同一目录
- **修复**: 页面放 tasks/，API 放 api/tasks/

### 错误7: updateTask 直接赋值 item=data
- **原因**: 会丢失未传递的字段
- **修复**: `{...item, ...data}` 合并

### 错误8: 子传父 onClick={onDelete(data.id)}
- **原因**: 立即执行而非传入回调
- **正确**: `onClick={() => onDelete(data.id)}`

---

## 掌握主题（实战验证）
- ✅ Server/Client Component 分离模式
- ✅ API Routes 完整 CRUD
- ✅ React Hook Form + Zod 表单验证
- ✅ Record<UnionType, Value> 类型安全映射
- ✅ 子传父回调通信模式（实战通过）
- ✅ window.location.reload() 刷新数据

---

## 待完成
- [ ] 个人信息页（profile/page.tsx）
- [ ] 全局 Layout 导航栏
- [ ] 路由守卫（未登录跳转 /login）

---

## 表现评估
- **理解能力**: ⭐⭐⭐⭐⭐ Server/Client 分离模式掌握扎实
- **代码实践**: ⭐⭐⭐⭐ 从 React 迁移到 Next.js 适应快
- **独立性**: ⭐⭐⭐⭐ 大部分代码独立完成，只需提示
- **待改进**: fetch 参数细节、JSX 事件绑定写法
