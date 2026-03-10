import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const RUNWAY_API_URL = 'https://api.runwayml.com/v1'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const generationId = searchParams.get('generationId')
    const adId = searchParams.get('adId')

    if (!generationId || !adId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Check if ad belongs to user
    const ad = await db.ad.findFirst({
      where: { id: adId, userId: session.user.id },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    // Check Runway generation status
    const response = await fetch(`${RUNWAY_API_URL}/generations/${generationId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
    }

    const data = await response.json()
    const status = data.status

    if (status === 'completed') {
      // Update ad with video URL
      await db.ad.update({
        where: { id: adId },
        data: {
          status: 'completed',
          videoUrl: data.outputUrl,
        },
      })

      return NextResponse.json({
        status: 'completed',
        videoUrl: data.outputUrl,
      })
    } else if (status === 'failed') {
      await db.ad.update({
        where: { id: adId },
        data: { status: 'failed' },
      })

      return NextResponse.json({ status: 'failed' })
    }

    return NextResponse.json({ status: 'generating' })
  } catch (error) {
    console.error('Runway status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
