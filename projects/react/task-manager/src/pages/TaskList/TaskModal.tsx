import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Task } from '../../types/task'
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks'

// TODO: 你来写 Zod schema
// 字段: title(必填), content(必填), status(必填), priority(必填), tag_id(必填数字), deadline(可选字符串)
const schema = z.object({
  title: z.string().min(1, '任务标题不能为空'),
  content: z.string().min(1, '任务内容不能为空'),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['high', 'medium', 'low']),
  tag_id: z.number({ message: '请选择标签' }),
  deadline: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface TaskModalProps {
  task: Task | null
  onClose: () => void
}

// 状态和优先级的中文映射
const STATUS_MAP: Record<string, string> = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
}
const PRIORITY_MAP: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

function TaskModal({ task, onClose }: TaskModalProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  // TODO: 你来写 useForm，参考 TagModal
  // 提示: 编辑模式用 task 的数据作为 defaultValues
  // 注意: tag_id 需要转成数字，deadline 用 task.deadline
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: task
      ? {
          title: task.title,
          content: task.content,
          status: task.status,
          priority: task.priority,
          tag_id: task.tag_id,
          deadline: task.deadline,
        }
      : {
          status: 'todo',
          priority: 'medium',
        },
  })

  // TODO: 你来写 onSubmit
  // 提示: 编辑模式调用 updateTask.mutate，新增模式调用 createTask.mutate
  // 需要补充 user_id: 1, created_at/updated_at 用 new Date().toISOString().split('T')[0]
  const onSubmit = (data: FormData) => {
    // TODO: 你来写提交逻辑
    if (task) {
      updateTask.mutate({
        id: task.id,
        title: data.title,
        content: data.content,
        status: data.status,
        priority: data.priority,
        tag_id: data.tag_id,
        deadline: data.deadline,
        user_id: 1,
        created_at: task.created_at,
        updated_at: new Date().toISOString().split('T')[0],
      })
    }else{
      createTask.mutate({
        title: data.title,
        content: data.content,
        status: data.status,
        priority: data.priority,
        tag_id: data.tag_id,
        deadline: data.deadline,
        user_id: 1,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      })
    }
    console.log('提交:', data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[480px]">
        <h2 className="text-xl font-bold mb-4">
          {task ? '编辑任务' : '新增任务'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 任务标题 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">任务标题</label>
            <input
              {...register('title')}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="输入任务标题"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* 任务内容 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">任务内容</label>
            <textarea
              {...register('content')}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              placeholder="输入任务描述"
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          {/* 状态 + 优先级 一行 */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">状态</label>
              <select {...register('status')} className="w-full p-2 border border-gray-300 rounded">
                {Object.entries(STATUS_MAP).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">优先级</label>
              <select {...register('priority')} className="w-full p-2 border border-gray-300 rounded">
                {Object.entries(PRIORITY_MAP).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 标签 + 截止日期 一行 */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">标签ID</label>
              {/* TODO: 后续可改成从 tags 接口拉取下拉选项 */}
              <input
                {...register('tag_id', { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="1=React 2=工具 3=项目 4=AI"
              />
              {errors.tag_id && <p className="text-red-500 text-sm">{errors.tag_id.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">截止日期</label>
              <input
                {...register('deadline')}
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">
              取消
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {task ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
