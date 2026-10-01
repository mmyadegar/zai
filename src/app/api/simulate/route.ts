import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/simulate — simulate an incoming DM and return the auto-reply
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sender, content } = body

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    const senderName = (sender && typeof sender === 'string' && sender.trim())
      ? sender.trim()
      : 'anonymous_user'

    const normalizedContent = content.trim().toLowerCase()

    // Find the first active rule whose keyword appears in the message
    const activeRules = await db.rule.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })

    let matchedRule: { id: string; keyword: string; response: string } | null = null
    for (const rule of activeRules) {
      if (normalizedContent.includes(rule.keyword.toLowerCase())) {
        matchedRule = rule
        break
      }
    }

    // Determine the response: matched rule's, or default reply from settings
    let responseText = ''
    let matchedRuleId: string | null = null

    if (matchedRule) {
      responseText = matchedRule.response
      matchedRuleId = matchedRule.id
    } else {
      const defaultSetting = await db.setting.findUnique({
        where: { key: 'defaultReply' },
      })
      responseText = defaultSetting?.value || 'سلام! ممنون از پیامتون. به‌زودی پاسخ می‌دیم. 🌸'
    }

    // Log the message + auto-reply
    const log = await db.messageLog.create({
      data: {
        sender: senderName,
        content: content.trim(),
        response: responseText,
        matchedRule: matchedRuleId,
        source: 'simulate',
      },
    })

    return NextResponse.json({
      logId: log.id,
      sender: senderName,
      receivedContent: content.trim(),
      autoReply: responseText,
      matchedRule: matchedRule
        ? { id: matchedRule.id, keyword: matchedRule.keyword }
        : null,
      usedDefault: matchedRule === null,
      timestamp: log.createdAt,
    })
  } catch (error) {
    console.error('POST /api/simulate error:', error)
    return NextResponse.json(
      { error: 'Failed to process simulation' },
      { status: 500 }
    )
  }
}
