import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../api/request'
import type { Task } from '../types/task'

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => http.get('/tasks'),
  })
}

// 删除任务
export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => http.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// 创建任务
export function useCreateTask() {
  const queryClient = useQueryClient() // 缓存
  return useMutation({
    mutationFn: (task: Task) => http.post('/tasks', task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks']  })
    }
  })
}

//更新任务
export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (task: Task) => http.put(`/tasks/${task.id}`,task),
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}