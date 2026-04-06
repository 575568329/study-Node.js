import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../api/request'
import type { TagType } from '../types/tag'

// 获取标签列表
export function useTags() {
  return useQuery<TagType[]>({
    queryKey: ['tags'],
    queryFn: () => http.get('/tags'),
  })
}

// TODO: 你来写 useDeleteTag
// 提示: 和 useDeleteTask 一样，mutationFn 用 http.delete，onSuccess invalidate ['tags']
export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => http.delete(`/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

// TODO: 你来写 useCreateTag
// 提示: mutationFn 接收 TagType，用 http.post
export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tag: TagType) => http.post('/tags', tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

// 更新标签
export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tag: TagType) => http.put(`/tags/${tag.id}`, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
