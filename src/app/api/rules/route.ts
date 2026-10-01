import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/rules — list all rules
export async function GET() {
  try {
    const rules = await db.rule.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ rules })
  } catch (error) {
    console.error('GET /api/rules error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    )
  }
}

// POST /api/rules — create a new rule
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { keyword, response } = body

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }
    if (!response || typeof response !== 'string' || !response.trim()) {
      return NextResponse.json(
        { error: 'Response is required' },
        { status: 400 }
      )
    }

    const rule = await db.rule.create({
      data: {
        keyword: keyword.trim().toLowerCase(),
        response: response.trim(),
      },
    })

    return NextResponse.json({ rule }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/rules error:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'این کلمه کلیدی قبلاً وجود دارد' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    )
  }
}
