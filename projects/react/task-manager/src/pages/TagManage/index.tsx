import { useState } from 'react'
import { useTags, useDeleteTag } from '../../hooks/useTags'
import type { TagType } from '../../types/tag'
import TagModal from './TagModal'

// TODO: 你来写 TagItem 组件
// 接收 props: tag: TagType, onDelete: (id: number) => void, onEdit: (tag: TagType) => void
function TagItem({ tag, onDelete, onEdit }: {
  tag: TagType
  onDelete: (id: number) => void
  onEdit: (tag: TagType) => void
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 flex justify-between items-center">
      {/* TODO: 展示 tag 的 name 和 color（颜色可以用小色块展示） */}
      <div className="flex items-center gap-2">
        <span
          className="w-4 h-4 rounded-full inline-block"
          style={{ backgroundColor: tag.color }}
        />
        <span className="font-medium">{tag.name}</span>
      </div>
      {/* TODO: 编辑和删除按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(tag)}
          className="text-blue-500 hover:text-blue-700"
        >
          编辑
        </button>
        <button
          onClick={() => onDelete(tag.id!)}
          className="text-red-500 hover:text-red-700"
        >
          删除
        </button>
      </div>
    </div>
  )
}

function TagManage() {
  // 1. 获取数据
  const { data, isLoading, error } = useTags()
  const deleteTag = useDeleteTag()

  // TODO: 你来写弹窗控制逻辑
  // 提示: 用 useState 控制弹窗开关和编辑数据
  // const [modalOpen, setModalOpen] = useState(false)
  // const [editingTag, setEditingTag] = useState<TagType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagType | null>(null)

  const tags = data ?? []

  if (isLoading) return <p className="text-center py-10">加载中...</p>
  if (error) return <p className="text-center py-10 text-red-500">加载失败</p>

  const handleDelete = (id: number) => {
    deleteTag.mutate(id)
  }

  // TODO: 你来写 handleEdit（打开弹窗并设置编辑数据）
  const handleEdit = (tag: TagType) => {
    setEditingTag(tag)
    setModalOpen(true)
  }

  // TODO: 你来写 handleAdd（打开弹窗，不设置编辑数据）
  const handleAdd = () => {
    setEditingTag(null)
    setModalOpen(true)
  }

  // TODO: 你来写 handleClose（关闭弹窗）
  const handleClose = () => {
    setModalOpen(false)
    setEditingTag(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新增标签
        </button>
      </div>

      {tags.length === 0 ? (
        <p className="text-center text-gray-400 py-10">暂无标签</p>
      ) : (
        tags.map(tag => (
          <TagItem
            key={tag.id}
            tag={tag}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      )}

      {/* 弹窗 */}
      {modalOpen && (
        <TagModal tag={editingTag} onClose={handleClose} />
      )}
    </div>
  )
}

export default TagManage
