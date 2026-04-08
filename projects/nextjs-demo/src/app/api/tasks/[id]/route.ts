import { NextResponse } from "next/server";
import { db } from '@/lib/db'

export async function DELETE(request: Request, {params}:{params: Promise<{ id: string }>}) {
  const {id} = await params
  db.deleteTask(Number(id))
  return NextResponse.json({ message: '删除成功' })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  db.updateTask(Number(id), body)
  return NextResponse.json({ message: '更新成功' })
}