import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Get single ad
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adId = params.id

    const ad = await db.ad.findFirst({
      where: { 
        id: adId, 
        userId: session.user.id 
      },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Get ad error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update ad (script)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { script } = await req.json()
    const adId = params.id

    // Check if ad belongs to user
    const ad = await db.ad.findFirst({
      where: { id: adId, userId: session.user.id },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    const updatedAd = await db.ad.update({
      where: { id: adId },
      data: { script, status: 'draft' },
    })

    return NextResponse.json({ ad: updatedAd })
  } catch (error) {
    console.error('Update ad error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete ad
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adId = params.id

    // Check if ad belongs to user
    const ad = await db.ad.findFirst({
      where: { id: adId, userId: session.user.id },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    await db.ad.delete({
      where: { id: adId },
    })

    return NextResponse.json({ message: 'Ad deleted' })
  } catch (error) {
    console.error('Delete ad error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
