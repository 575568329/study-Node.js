import Counter from './Counter'

//这是Server Component - 模拟从数据库拿数据
async function getInitialCount() {
  // 模拟数据库查询延迟
  await new Promise(resolve=>setTimeout(resolve,500))

  return 42
}

export default async function CounterPage() {
  const initialCount = await getInitialCount()

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>计数器</h1>
      {/*把服务端拿到的数据通过props传递给客户端组件*/}
      <Counter initialCount={initialCount}/>
    </div>
  )
}