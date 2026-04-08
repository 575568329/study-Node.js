
import { NextResponse } from "next/server";
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const user = db.findUserByUsername(body.username)
  if(user){
    return NextResponse.json({ data: { token: 'mock-token-' + user.id, user } },{ status: 200 })
  }else{
    return NextResponse.json({ message: '用户名或密码错误'  },{ status: 401 })
  }
  
}
