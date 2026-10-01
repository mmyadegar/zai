import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/rules/[id] — update rule (toggle active, edit response)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { isActive, response, keyword } = body

    const data: any = {}
    if (typeof isActive === 'boolean') data.isActive = isActive
    if (typeof response === 'string' && response.trim()) data.response = response.trim()
    if (typeof keyword === 'string' && keyword.trim()) data.keyword = keyword.trim().toLowerCase()

    const rule = await db.rule.update({
      where: { id },
      data,
    })

    return NextResponse.json({ rule })
  } catch (error) {
    console.error('PATCH /api/rules/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update rule' },
      { status: 500 }
    )
  }
}

// DELETE /api/rules/[id] — delete a rule
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.rule.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/rules/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete rule' },
      { status: 500 }
    )
  }
}
