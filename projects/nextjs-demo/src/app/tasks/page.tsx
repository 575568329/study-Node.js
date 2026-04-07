
  interface tasksType {
    id:number,
    title:string,
    status:string,
  }
export default async function TasksPage() {
  const res = await fetch('http://localhost:3000/api/tasks')
  const {data} = await res.json()

  return (
    <div>
      {
        data?
        data.map((item:tasksType)=>(
          <div key={item.id}>
            <span>{item.id}</span>
            <span>{item.title}</span>
            <span>{item.status}</span>
          </div>
        ))
        :''
      }
    </div>
  )
}