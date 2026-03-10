import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const packages = await db.tokenPackage.findMany({
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Admin packages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, price, tokenAmount, stripePriceId } = await req.json()

    const package_ = await db.tokenPackage.create({
      data: {
        name,
        description,
        price,
        tokenAmount,
        stripePriceId,
      },
    })

    return NextResponse.json({ package: package_ })
  } catch (error) {
    console.error('Admin create package error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...data } = await req.json()

    const package_ = await db.tokenPackage.update({
      where: { id },
      data,
    })

    return NextResponse.json({ package: package_ })
  } catch (error) {
    console.error('Admin update package error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
