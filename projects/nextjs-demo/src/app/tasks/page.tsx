import { TaskListClient } from './TaskListClient'

async function getTasks() {
  const res = await fetch('http://localhost:3000/api/tasks', { cache: 'no-store' })
  const { data } = await res.json()
  return data
}

async function getTags() {
  const res = await fetch('http://localhost:3000/api/tags', { cache: 'no-store' })
  const { data } = await res.json()
  return data
}

export default async function TasksPage() {
  const tasks = await getTasks()
  const tags = await getTags()

  return <TaskListClient tasks={tasks} tags={tags} />
}