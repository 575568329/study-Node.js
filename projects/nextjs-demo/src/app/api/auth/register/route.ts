
import { NextResponse } from "next/server";
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const user = db.findUserByUsername(body.username)
  if(user){
    return NextResponse.json({ message: '用户名已存在' },{ status: 400 })
  }else{
    const data = db.createUser(body)
    return NextResponse.json({ message: '创建成功',data:data },{ status: 201 })
  }
  
}
