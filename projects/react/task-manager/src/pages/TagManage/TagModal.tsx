import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TagType } from '../../types/tag'
import { useCreateTag, useUpdateTag } from '../../hooks/useTags'

// TODO: 你来写 Zod schema
// 字段: name (必填), color (必填)
const schema = z.object({
  name: z.string().min(1, '标签名不能为空'),
  color: z.string().min(1, '请选择颜色'),
})
type FormData = z.infer<typeof schema>

// TODO: 你来写 Props 类型
// tag: 编辑时传入，新增时为 null
// onClose: 关闭弹窗的回调
interface TagModalProps {
  tag: TagType | null
  onClose: () => void
}

function TagModal({ tag, onClose }: TagModalProps) {
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: tag ? { name: tag.name, color: tag.color } : undefined,
  })

  const onSubmit = (data: FormData) => {
    if (tag) {
      // 编辑模式
      updateTag.mutate({ ...tag, ...data } as TagType, {
        onSuccess: onClose,
      })
    } else {
      // 新增模式 — user_id 从 store 获取，这里先用 1
      createTag.mutate({ ...data, user_id: 1 } as TagType, {
        onSuccess: onClose,
      })
    }
  }

  return (
    // TODO: 你来写弹窗 UI
    // 提示: 半透明遮罩 + 居中白色卡片
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">
          {tag ? '编辑标签' : '新增标签'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">标签名称</label>
            <input
              {...register('name')}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="输入标签名"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">颜色</label>
            {/* TODO: 你来写颜色选择，可以用 input type="color" */}
            <input
              {...register('color')}
              type="color"
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
            {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">
              取消
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {tag ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TagModal
