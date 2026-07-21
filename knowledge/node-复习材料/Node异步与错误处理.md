# Node 异步与错误处理

更新时间：2026-05-11

## 学习目标

把 `Promise`、`async/await`、异步错误捕获、并发控制和 API Route 错误收口讲清楚，并能关联到 RAG 项目的文件上传、图谱抽取和后台增强任务。

## await 的本质

`await` 后面的代码一定会异步执行。即使 `await` 的不是 Promise，JavaScript 也会把它包装成 resolved Promise。

```js
async function test() {
  console.log('A')

  await 1

  console.log('B')
}

console.log('C')
test()
console.log('D')
```

输出：

```text
C
A
D
B
```

原因：

- `C`、`A`、`D` 是同步执行。
- `await 1` 会让 `B` 进入 Promise 微任务。
- 当前同步栈结束后，才执行 `B`。

## return promise 和 return await promise

如果 async 函数内部需要 `try...catch` 捕获 Promise 的 rejection，必须 `await` 它。

```js
async function a() {
  try {
    return Promise.reject(new Error('fail'))
  } catch (err) {
    console.log('a caught')
  }
}

async function b() {
  try {
    return await Promise.reject(new Error('fail'))
  } catch (err) {
    console.log('b caught')
  }
}

a().catch(() => console.log('outer a caught'))
b().catch(() => console.log('outer b caught'))
```

输出：

```text
b caught
outer a caught
```

核心区别：

- `return promise`：把 Promise 返回给调用方，当前函数内部的 `catch` 捕不到后续 reject。
- `return await promise`：在当前 async 函数内部等待，reject 会变成当前函数内部抛错，可以被当前 `catch` 捕获。

## API Route 里的错误收口

如果 Service 返回 Promise，API Handler 里必须 `await`，否则当前 `try...catch` 捕不到异步失败。

错误写法：

```ts
export async function GET() {
  try {
    return getUserList()
  } catch (err) {
    return Response.json({ message: 'failed' }, { status: 500 })
  }
}
```

更合理的写法：

```ts
export async function GET() {
  try {
    const users = await getUserList()

    return Response.json({ data: users })
  } catch (err) {
    return Response.json(
      { message: 'get user list failed' },
      { status: 500 }
    )
  }
}
```

原则：

```text
如果异步逻辑决定接口是否成功：必须 await。
如果异步逻辑是后台增强任务：可以不 await，但必须 catch。
```

## 后台任务必须 catch

图谱抽取这类增强链路可以不阻塞上传接口，但不能裸调用。

```ts
startGraphExtraction(documentId).catch((err) => {
  logger.error('graph extraction failed', {
    documentId,
    error: err,
  })

  updateDocumentJobStatus(documentId, {
    status: 'graph_failed',
    failedStep: 'graph',
    errorMessage: err instanceof Error ? err.message : 'unknown error',
  })
})
```

这样可以避免：

- 上传接口已经返回成功，但后台失败无人感知。
- 出现 `unhandledRejection`。
- 任务状态没有更新成 `graph_failed`。
- 日志缺少失败上下文。

## Promise.all 和 Promise.allSettled

如果多个异步任务没有依赖关系，并且缺一不可，可以用 `Promise.all` 并行。

```ts
const [user, orders, messages] = await Promise.all([
  getUser(),
  getOrders(),
  getMessages(),
])
```

特点：

- 并行执行。
- 只要一个 reject，整体 reject。
- 适合缺一不可的主链路。

如果允许部分失败并降级展示，使用 `Promise.allSettled`。

```ts
const user = await getUser()

const [articlesResult, messagesResult] = await Promise.allSettled([
  getRecommendArticles(),
  getUnreadMessages(),
])

return {
  user,
  articles: articlesResult.status === 'fulfilled' ? articlesResult.value : [],
  unreadCount: messagesResult.status === 'fulfilled' ? messagesResult.value.count : 0,
}
```

这里用户信息是主链路，必须成功；推荐文章和消息提醒是增强链路，可以降级。

## map(async) 的陷阱

`map(async fn)` 返回的是 Promise 数组，不是真实结果数组。

```ts
async function loadData(ids: string[]) {
  const result = ids.map(async (id) => {
    return await getDetail(id)
  })

  return result
}
```

`result` 是：

```ts
Promise<Detail>[]
```

正确写法：

```ts
async function loadData(ids: string[]) {
  return await Promise.all(
    ids.map((id) => getDetail(id))
  )
}
```

## 并发控制

不能对大数组无脑使用 `Promise.all`。

```ts
await Promise.all(ids.map((id) => getDetail(id)))
```

如果 `ids` 有 10000 个，这会一次性创建大量任务，可能打满数据库连接、下游接口或第三方服务限流。

简单分批：

```ts
async function loadData(ids: string[]) {
  const batchSize = 10
  const results = []

  for (let start = 0; start < ids.length; start += batchSize) {
    const batch = ids.slice(start, start + batchSize)

    const batchResults = await Promise.all(
      batch.map((id) => getDetail(id))
    )

    results.push(...batchResults)
  }

  return results
}
```

含义：

```text
当前批内：并发执行
批与批之间：串行执行
```

生产项目可以使用 `p-limit`：

```ts
import pLimit from 'p-limit'

const limit = pLimit(10)

const results = await Promise.all(
  ids.map((id) => limit(() => getDetail(id)))
)
```

## 面试回答

Node.js 里处理异步错误时，我会先区分这段异步逻辑是否影响当前接口结果。

如果它决定接口是否成功，比如保存数据、查询主数据、创建订单这类逻辑，就必须 `await`，然后用外层 `try...catch` 统一收口，转换成明确的 HTTP 响应。

如果它是后台增强任务，比如日志补充、图谱抽取、异步通知，可以不阻塞主接口，但不能裸调用，必须在后面加 `.catch()`，记录日志并更新任务状态，避免 `unhandledRejection`。

对多个没有依赖关系的异步任务，如果是缺一不可的场景，我会用 `Promise.all` 并行；如果允许部分失败，比如推荐内容、辅助统计，就用 `Promise.allSettled` 做降级。

如果任务数量很多，不能直接对大数组 `Promise.all`，要做并发控制，比如分批处理或用 `p-limit` 限制同时执行的数量，避免打满数据库连接、下游接口或第三方服务限流。

## 易错点

- `await` 普通值，后续代码也会进入微任务。
- `return promise` 不会被当前函数内部 `catch` 捕获。
- `return await promise` 可以被当前函数内部 `catch` 捕获。
- 异步函数如果影响接口成功与否，必须 `await`。
- 后台 fire-and-forget 任务必须 `.catch()`。
- `Promise.all` 是 fail-fast，不适合允许部分失败的降级场景。
- `map(async fn)` 返回 `Promise[]`，需要配合 `Promise.all`。
- 大量并发任务要做并发控制。

