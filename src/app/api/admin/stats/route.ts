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

    const [
      totalUsers,
      totalAds,
      totalTransactions,
      totalRevenue,
      recentUsers,
      recentAds,
    ] = await Promise.all([
      db.user.count(),
      db.ad.count(),
      db.transaction.count({ where: { status: 'completed' } }),
      db.transaction.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
      }),
      db.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      db.ad.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAds,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentUsers,
      recentAds,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
