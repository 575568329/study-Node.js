//react展示任务卡片组件
interface TaskCardProps {
  task: Task
}

//获取父组件内容
function TaskCard(props) {
  const { task } = props;
  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-card-title">{task.title}</div>
        <div className="task-card-status">{task.status}</div>
      </div>
      <div className="task-card-content">{task.content}</div>
      <button>删除</button>
    </div>
  )
}

export default TaskCard;