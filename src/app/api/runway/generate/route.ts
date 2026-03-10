import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const RUNWAY_API_URL = 'https://api.runwayml.com/v1'

// Costuri tokenuri
const VIDEO_GENERATION_COST = 10
const VIDEO_REGENERATION_COST = 5

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { adId, isFree = false } = await req.json()

    // Get user and ad details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { tokens: true, freeUsed: true },
    })

    const ad = await db.ad.findUnique({
      where: { id: adId },
    })

    if (!user || !ad) {
      return NextResponse.json({ error: 'User or ad not found' }, { status: 404 })
    }

    // Check if user can use free generation
    let cost = VIDEO_GENERATION_COST
    let useFree = false

    if (isFree && !user.freeUsed) {
      useFree = true
      cost = 0
    } else if (user.tokens < cost) {
      return NextResponse.json({ error: 'Insufficient tokens' }, { status: 403 })
    }

    // Update ad status to generating
    await db.ad.update({
      where: { id: adId },
      data: { status: 'generating' },
    })

    // Call Runway API to generate video
    // Note: This is a simplified version. Runway API might require different implementation
    const response = await fetch(`${RUNWAY_API_URL}/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: ad.script,
        // Add other Runway-specific parameters
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Runway API error:', error)
      
      // Update ad status to failed
      await db.ad.update({
        where: { id: adId },
        data: { status: 'failed' },
      })
      
      return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 })
    }

    const data = await response.json()
    const generationId = data.id

    // Deduct tokens if not free
    if (!useFree) {
      await db.user.update({
        where: { id: session.user.id },
        data: { tokens: { decrement: cost } },
      })
    } else {
      await db.user.update({
        where: { id: session.user.id },
        data: { freeUsed: true },
      })
    }

    // Log token usage
    await db.tokenUsage.create({
      data: {
        userId: session.user.id,
        adId: adId,
        action: 'generate_video',
        tokensUsed: cost,
      },
    })

    return NextResponse.json({ 
      generationId,
      message: 'Video generation started',
    })
  } catch (error) {
    console.error('Runway generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
