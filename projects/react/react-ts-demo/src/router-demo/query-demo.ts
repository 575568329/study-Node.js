// mock "服务器":内存数组 + 300ms 延迟,模拟真实接口
// 每次请求打一条日志,方便观察"到底发没发请求"

export interface Todo {
  id: number
  title: string
}

let todos: Todo[] = [
  { id: 1, title: '学 React Router' },
  { id: 2, title: '学 TanStack Query' },
]

let requestCount = 0

// 模拟 GET /api/todos
export async function fetchTodos(): Promise<Todo[]> {
  requestCount++
  console.log(`🌐 [服务器] 第 ${requestCount} 次真正发起请求 → GET /api/todos`)
  await new Promise(r => setTimeout(r, 300))  // 模拟网络延迟
  return [...todos]
}

// 模拟 POST /api/todos
export async function createTodo(title: string): Promise<Todo> {
  requestCount++
  console.log(`🌐 [服务器] 发起请求 → POST /api/todos (${title})`)
  await new Promise(r => setTimeout(r, 300))
  const newTodo = { id: Date.now(), title }
  todos = [...todos, newTodo]
  return newTodo
}
