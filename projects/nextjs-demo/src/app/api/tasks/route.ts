
import { NextResponse } from "next/server";

//模拟数据
let tasks = [
  { id:1,title:'学习 Next.js', status:'todo' },
  { id:2,title:'写项目', status: 'in_progress' },
]

export async function GET() {
    return NextResponse.json({ data: tasks })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newTask = { id: Date.now(), ...body }
  tasks.push(newTask)
  return NextResponse.json({ data: newTask }, { status: 201 })
}