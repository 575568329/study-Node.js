/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 16:49:56
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 18:39:42
 * @FilePath: \Node.js-Study\projects\react\react-ts-demo\src\App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useEffect, useRef } from 'react'
import TodoItem from './component/TodoItem'



//替换原来的<li>渲染

function App() {
  
  // useState — 相当于 Vue3 的 ref
  const [count, setCount] = useState(0)

  // 对象状态 — 相当于 Vue3 的 reactive（但没有自动追踪）
  const [todos, setTodos] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue.trim()])  // 必须创建新数组，不能 push
      setInputValue('')
    }
  }

  //添加删除方法
  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index))
  }
  // 在 App 函数里加上：
    useEffect(() => {
      console.log('计数器变化:', count)
    }, [count])  // 依赖数组：只有 count 变了才执行

    // 空依赖数组 = onMounted（只执行一次）
    useEffect(() => {
      console.log('组件挂载')
      return () => console.log('组件卸载')  // return 函数 = onUnmounted
    }, [])

    useEffect(() => {
      console.log('input 聚焦')
      inputRef.current?.focus()  // 自动聚焦
    }, [])

  return (
    <div>
      <h2>计数器</h2>
      <p>当前值: {count}</p>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(count + 1)}>+1</button>

      <h2>待办清单</h2>
      <input
        value={inputValue}
        ref={inputRef}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        placeholder="输入待办..."
      />
      <button onClick={addTodo}>添加</button>
      {todos.map((item, index) => (
        <TodoItem key={index} text={item} index={index} onRemove={removeTodo} />
      ))}
    </div>
  )
}

export default App
