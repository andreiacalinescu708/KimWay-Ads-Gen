import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const VIDEO_REGENERATION_COST = 5
const EDIT_SCRIPT_REGENERATE_COST = 8

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, script } = await req.json()
    const adId = params.id

    // Check if ad belongs to user
    const ad = await db.ad.findFirst({
      where: { id: adId, userId: session.user.id },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    // Determine cost based on type
    const cost = type === 'edit_script' ? EDIT_SCRIPT_REGENERATE_COST : VIDEO_REGENERATION_COST

    // Check user tokens
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { tokens: true },
    })

    if (!user || user.tokens < cost) {
      return NextResponse.json({ error: 'Insufficient tokens' }, { status: 403 })
    }

    // Update script if provided
    let finalScript = ad.script
    if (script) {
      await db.ad.update({
        where: { id: adId },
        data: { script },
      })
      finalScript = script
    }

    // Start video generation
    await db.ad.update({
      where: { id: adId },
      data: { status: 'generating' },
    })

    // Deduct tokens
    await db.user.update({
      where: { id: session.user.id },
      data: { tokens: { decrement: cost } },
    })

    // Log token usage
    await db.tokenUsage.create({
      data: {
        userId: session.user.id,
        adId: adId,
        action: type === 'edit_script' ? 'edit_script_regenerate' : 'regenerate_video',
        tokensUsed: cost,
      },
    })

    // Call Runway API (simplified - in production you'd call the actual API)
    // For now, return success
    return NextResponse.json({ 
      message: 'Regeneration started',
      adId,
    })
  } catch (error) {
    console.error('Regenerate ad error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
