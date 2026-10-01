import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/logs — list recent message logs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') || '50'), 200)

    const logs = await db.messageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('GET /api/logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

// DELETE /api/logs — clear all logs
export async function DELETE() {
  try {
    await db.messageLog.deleteMany({})
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/logs error:', error)
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 }
    )
  }
}
