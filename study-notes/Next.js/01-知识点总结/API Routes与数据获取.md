# API Routes 与数据获取

> 学习日期: 2026-04-07 | 置信度: 高

---

## API Routes

在 `app/api/` 下创建 `route.ts`，导出 HTTP 方法函数：

```ts
// app/api/tasks/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: tasks })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ data: newTask }, { status: 201 })
}
```

**对比 Express**:

| Express | Next.js |
|---------|---------|
| `app.get('/api/tasks', handler)` | `export async function GET()` |
| `res.json(data)` | `NextResponse.json(data)` |
| `req.body` | `await request.json()` |
| 路由手动配置 | 文件路径自动映射 |

## 数据获取

### Server Component（推荐）

```tsx
async function TaskPage() {
  const res = await fetch('http://localhost:3000/api/tasks')
  const { data } = await res.json()
  return <TaskList tasks={data} />
}
```

甚至可以直接查数据库，跳过 API 层。

### 对比 React SPA

```
React SPA:  前端 fetch → Express 路由 → 数据库 → 返回 → 渲染
Next.js:    Server Component 直接查数据库 → 渲染 HTML
```

少了整个 API 层。

---

**标签**: #Next.js #API-Routes #数据获取 #掌握
