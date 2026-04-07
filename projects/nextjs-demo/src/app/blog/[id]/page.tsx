export default async function BlogPost({ params }: { params: Promise<{id: string}> }) {
  const {id} = await params
  return (
    <div className="p-8">
      <h1 className="texxt-2xl font-bold">博客文章 #{id}</h1>
    </div>
  )
}