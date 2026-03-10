import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Get all ads for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ads = await db.ad.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ads })
  } catch (error) {
    console.error('Get ads error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create new ad
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productName, productDescription, productImageUrl, script } = await req.json()

    if (!productName || !productDescription || !script) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ad = await db.ad.create({
      data: {
        userId: session.user.id,
        productName,
        productDescription,
        productImageUrl,
        script,
        status: 'draft',
      },
    })

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Create ad error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
