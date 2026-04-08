import TagManageClient from './TagManageClient'

async function getTags() {
  const res = await fetch('http://localhost:3000/api/tags', { cache: 'no-store' })
  const { data } = await res.json()
  return data
}

export default async function TasksPage() {
  const tags = await getTags()

  return <TagManageClient tags={tags} />
}