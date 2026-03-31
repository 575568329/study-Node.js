import { reactive, computed } from 'vue'

export function useTodo() {
  const todo = reactive({
    text: '',
    items: [] as string[]
  })

  const todoCount = computed(() => todo.items.length)

  const addTodo = () => {
    if (todo.text.trim()) {
      todo.items.push(todo.text.trim())
      todo.text = ''
    }
  }

  const removeTodo = (index: number) => {
    todo.items.splice(index, 1)
  }

  return { todo, todoCount, addTodo, removeTodo }
}