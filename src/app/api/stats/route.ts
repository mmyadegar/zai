import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats — dashboard overview stats
export async function GET() {
  try {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const [totalRules, activeRules, totalMessages, messagesLast24h, defaultReplySetting] =
      await Promise.all([
        db.rule.count(),
        db.rule.count({ where: { isActive: true } }),
        db.messageLog.count(),
        db.messageLog.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
        db.setting.findUnique({ where: { key: 'defaultReply' } }),
      ])

    return NextResponse.json({
      totalRules,
      activeRules,
      inactiveRules: totalRules - activeRules,
      totalMessages,
      messagesLast24h,
      defaultReply: defaultReplySetting?.value || 'سلام! ممنون از پیامتون. به‌زودی پاسخ می‌دیم. 🌸',
    })
  } catch (error) {
    console.error('GET /api/stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
