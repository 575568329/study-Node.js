interface TodoItemProps {
  text: string
  index: number
  onRemove: (index: number) => void
}

function TodoItem({ text, index, onRemove }: TodoItemProps) {
  return (
    <li>
      {text}
      <button onClick={() => onRemove(index)}>删除</button>
    </li>
  )
}

export default TodoItem