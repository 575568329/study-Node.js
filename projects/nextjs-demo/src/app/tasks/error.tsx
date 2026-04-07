'use client'
export default function Error({
  error,
  reset,
}:{
  error: Error & {digest?: string}
  reset: () => void
}){
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-red-500">出错了: {error.message}</h2>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => reset()}>
        重试
      </button>
    </div>
  )
}