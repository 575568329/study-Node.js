
import { NextResponse } from "next/server";
import { db } from '@/lib/db'

export async function GET() {
  const tags = db.getAllTags()
  return NextResponse.json({data: tags})
}
export async function POST(request: Request) {
  const body = await request.json()
  const tag = db.createTag(body)
  return NextResponse.json({ data: tag }, { status: 201 })
}