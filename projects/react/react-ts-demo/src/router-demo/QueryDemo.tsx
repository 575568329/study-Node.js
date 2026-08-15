import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTodos, createTodo, type Todo } from './query-demo'

// ============================================================
// 组件 A:显示列表 + 请求次数
// ============================================================
function TodoList() {
  const { data, isPending, error } = useQuery({
    queryKey: ['todos'],      // 缓存身份证:两个组件用同一个 key
    queryFn: fetchTodos,
  })

  if (isPending) return <p>⏳ TodoList: 加载中...(第一次会看到,第二次吃缓存看不到)</p>
  if (error) return <p>❌ 出错了: {error.message}</p>

  return (
    <div>
      <h3>组件 A:TodoList(useQuery)</h3>
      <ul>
        {data!.map((t: Todo) => (
          <li key={t.id}>#{t.id} {t.title}</li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================
// 组件 B:统计数量 —— 同样 useQuery(['todos'])
// 重点:它和组件 A 共享同一份缓存,不会发第二次请求!
// ============================================================
function TodoCount() {
  const { data } = useQuery({
    queryKey: ['todos'],      // ← 和组件 A 一模一样的 key
    queryFn: fetchTodos,
  })

  return (
    <div>
      <h3>组件 B:TodoCount(同一个 key,吃缓存)</h3>
      <p>共 {data?.length ?? '...'} 条</p>
    </div>
  )
}

// ============================================================
// 组件 C:新增 —— useMutation + invalidateQueries
// 重点:新增成功 → 作废 ['todos'] 缓存 → A/B 自动刷新
// ============================================================
function AddTodo() {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (t: string) => createTodo(t),
    onSuccess: () => {
      // ★ 灵魂:宣布 ['todos'] 缓存作废 → 自动重新请求 → 所有消费组件刷新
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setTitle('')
    },
  })

  return (
    <div>
      <h3>组件 C:AddTodo(useMutation)</h3>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="输入新待办..."
      />
      <button onClick={() => title.trim() && mutation.mutate(title.trim())}
              disabled={mutation.isPending}>
        {mutation.isPending ? '提交中...' : '添加'}
      </button>
      {mutation.isError && <p style={{ color: 'red' }}>出错了: {mutation.error.message}</p>}
    </div>
  )
}

// ============================================================
// 页面:三个组件拼一起
// ============================================================
function QueryDemo() {
  return (
    <div>
      <h2>TanStack Query 演示</h2>
      <p style={{ color: '#888', fontSize: 13 }}>
        打开 F12 控制台,观察每次操作触发几次「真正发起请求」。
      </p>
      <AddTodo />
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '16px 0' }} />
      <TodoList />
      <TodoCount />
    </div>
  )
}

export default QueryDemo
