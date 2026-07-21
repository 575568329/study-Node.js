# 2026-04-04 React+TS 学习会话

## 会话概述
- **时长**: ~60 分钟
- **范围**: R5 ~ R8 全部（16/28 → 28/28, 100%）🎉
- **方式**: Vue3 对比教学 + 语法优先 + 关联声明

---

## 课前小测结果

| 题号 | 类型 | 结果 | 置信度 | 备注 |
|------|------|------|--------|------|
| Q1 | 预测试（React Router） | ⚠️ | 中 | 知道是页面跳转，Vue对比待学 |
| Q2 | 预测试（数据获取） | ❌ | 低 | 零基础（正常） |
| Q3 | 盲区（状态不可变） | ✅ | 高 | 选对 B，追问"引用"解释到位 |
| Q4 | 随机（useMemo/useCallback） | ⚠️ | 中 | 核心关系对，描述需微调 |
| Q5 | 跨技能（Vue3 Router） | ✅ | 高 | 路由配置/动态参数/守卫记忆清晰 |

---

## 学习内容

### R5 React Router v6
- 路由配置：`<BrowserRouter><Routes><Route>` JSX 写法
- 页面跳转：`<Link to>` 声明式 + `useNavigate()` 编程式
- 参数获取：`useParams()` 动态参数 / `useSearchParams()` 查询参数
- 导航守卫：无内置，用组件包裹 + `<Outlet />`（= router-view）
- `<>{children}</>` = Vue3 的 `<slot />`

### R5 数据获取
- useEffect + fetch：基础写法，手动管理 loading/error
- TanStack Query：自动缓存 + 自动管理状态
- queryKey：缓存标识，全部相同用缓存，任一不同重新请求
- fetch 两个 .then：取响应(res) → 解析 JSON(res.json())

### R5 加载与错误状态
- TanStack Query 自动提供 isLoading / isError / error / refetch
- 对比手动管理：useState 三个变量 → useQuery 一个对象

### R6 Zustand
- `create` 定义 store，`set` 改值（自动合并，不用 ...state）
- 按需订阅：`useStore((state) => state.xxx)` 防无意义渲染
- 零配置：不需要 Provider，不需要 main.ts 注册
- 文件拆分：按功能拆 stores/，和 Pinia 一样

### R7 CSS Modules + Tailwind CSS
- CSS Modules：.module.css 文件 + import styles → 编译成唯一 hash
- Tailwind：工具类写在 className 里，命名有规律（功能-方向-大小）
- 两者可同时使用
- Tailwind 非常适合 AI 生成代码

### R8 项目搭建 + API 封装
- 目录结构和 Vue3 项目对比：composables→hooks, views→pages, .vue→.tsx
- API 封装和 Vue3 项目一模一样：types → api → hook → 组件

### R8 React Hook Form + Zod
- React Hook Form 管理表单，Zod 定义校验规则
- register 注册 input，handleSubmit 包裹提交，errors.xx?.message 安全访问错误
- z.infer 从 schema 自动推导 TS 类型
- ?. 可选链：防止 undefined 取属性报错

### React vs Vue3 设计哲学
- 显式 vs 隐式（依赖追踪、组件注册）
- 可变 vs 不可变（ref.value++ vs setter）
- 模板 vs JSX
- 约定大于配置 vs 自由大于约定

---

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| 组件包裹的路由守卫是什么逻辑？ | 门卫组件检查条件，通过渲染children，不通过Navigate跳转 |
| <>{children}</>是插槽吗？ | 对，= Vue3 的 <slot /> |
| 每个路由都要单独包吗？ | 可以用 <Outlet /> 包一组路由 |
| fetch 为什么两个 .then？ | 第一个取响应对象，第二个解析 JSON |
| 在哪给接口传数据？ | fetch 第二个参数：method/headers/body |
| queryKey 缓存满足一个不满足另一个？ | 全部相同才用缓存，任一不同重新请求 |
| Vue3 有类似 TanStack Query 吗？ | 有 @tanstack/vue-query，但 Vue 生态主流还是 Pinia 手动管理 |
| React 有全局导入概念吗？ | 没有，所有依赖显式 import |
| Tailwind 需要学语法吗？ | 记命名规律就行，具体类名查文档/AI |
| errors.name?.message 为什么要 ?.？ | 防止 errors.name 是 undefined 时取属性报错 |

---

## ❌ 错误记录

### 错误1：useMemo 描述不准确
- **错误内容**: "useMemo 避免重复刷新 DOM"
- **纠正**: useMemo 缓存计算结果（值），和 DOM 没直接关系

---

## 下次学习计划
- React 基础已全部完成（28/28, 100%）
- 下一步：进入 Next.js 学习阶段
- 待巩固：子传父通信、泛型组件、forwardRef、React Hook Form + Zod
