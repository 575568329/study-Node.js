'use client'

import { Task,statusType, priorityType } from "@/types/task"
import { TagType } from "@/types/tag"
import { useState } from "react"
import TaskModal from "./TaskModal"
// 状态和优先级的中文映射 + 颜色
const STATUS_MAP: Record<statusType, { label: string; color: string }> = {
  todo: { label: '待办', color: 'bg-gray-200 text-gray-700' },
  in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-700' },
  done: { label: '已完成', color: 'bg-green-100 text-green-700' },
}
const PRIORITY_MAP: Record<priorityType, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-red-100 text-red-700' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: '低', color: 'bg-gray-100 text-gray-600' },
}

function TaskCard({ task, onDelete, onEdit }: {
  task: Task
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
}) {
  const statusInfo = STATUS_MAP[task.status]
  const priorityInfo = PRIORITY_MAP[task.priority]

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{task.title}</h3>
          <p className="text-gray-500 text-sm mb-2">{task.content}</p>
          <div className="flex gap-2 items-center">
            <span className={`text-xs px-2 py-0.5 rounded ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${priorityInfo.color}`}>
              {priorityInfo.label}优先级
            </span>
            {task.deadline && (
              <span className="text-xs text-gray-400">截止: {task.deadline}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(task.id!)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}

interface getProps {
  tasks:Task[]
  tags:TagType[]
}

export function TaskListClient({tasks,tags}:getProps){
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<statusType | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<priorityType | ''>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter(task => {
    if (keyword && !task.title.includes(keyword)) return false
    if (statusFilter && task.status !== statusFilter) return false
    if (priorityFilter && task.priority !== priorityFilter) return false
    return true
  })

  const handleClose = () => {
    setModalOpen(false)
    setEditingTask(null)
  }
  const handleAdd = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const getTagName = (tagId: number) => tags.find(t => t.id === tagId)?.name ?? ''
  const getTagColor = (tagId: number) => tags.find(t => t.id === tagId)?.color ?? '#gray'

  const handleDelete = async (id: number) => {
    await fetch(`/api/tasks/${id}`,{ method: 'DELETE' })
    window.location.reload()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  return(
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">任务列表</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新增任务
        </button>
      </div>
    <div className="mb-4 space-y-2">
      <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="搜索任务标题..."
        />
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as statusType | '')}
            className="p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="todo">待办</option>
            <option value="in_progress">进行中</option>
            <option value="done">已完成</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as priorityType | '')}
            className="p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
    </div>
    {/* 任务列表 */}
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-400 py-10">暂无任务</p>
      ) : (
        filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      )}

      {modalOpen && (
        <TaskModal
        task={editingTask}
        tags={tags}
        onClose={handleClose}
        onSuccess={() => window.location.reload()}
      />
      )}
    </div>
  ) 
}