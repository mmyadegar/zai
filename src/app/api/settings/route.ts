import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/settings — get all settings as a key-value object
export async function GET() {
  try {
    const settings = await db.setting.findMany()
    const obj: Record<string, string> = {}
    for (const s of settings) obj[s.key] = s.value

    // Provide defaults for known keys
    if (!obj.defaultReply) {
      obj.defaultReply = 'سلام! ممنون از پیامتون. به‌زودی پاسخ می‌دیم. 🌸'
    }

    return NextResponse.json({ settings: obj })
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings — upsert a setting (body: { key, value })
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, value } = body

    if (!key || typeof key !== 'string' || !key.trim()) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }
    if (typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value must be a string' },
        { status: 400 }
      )
    }

    const setting = await db.setting.upsert({
      where: { key: key.trim() },
      update: { value: value },
      create: { key: key.trim(), value: value },
    })

    return NextResponse.json({ setting })
  } catch (error) {
    console.error('POST /api/settings error:', error)
    return NextResponse.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}
