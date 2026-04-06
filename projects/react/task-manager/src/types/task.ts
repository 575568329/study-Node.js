
export type statusType =  'todo' | 'in_progress' | 'done'
export type priorityType = 'high' | 'medium' | 'low'
export interface Task{
  id?: number,
  title: string,
  content: string,
  status: statusType,
  priority: priorityType,
  tag_id: number,
  deadline?: string,
  completed_at?: string,
  user_id: number,
  created_at: string,
  updated_at: string,
}