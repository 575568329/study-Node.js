export default async function TimePage() {
  const now = new Date().toLocaleString('zh-CN')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">服务器时间</h1>
      <p className="mt-4 text-lg">{now}</p>
    </div>
  )
}