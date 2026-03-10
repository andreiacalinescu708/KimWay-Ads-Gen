import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const userId = session.metadata?.userId
      const packageId = session.metadata?.packageId

      if (!userId || !packageId) {
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Update transaction status
      await db.transaction.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: 'completed' },
      })

      // Add tokens to user
      const tokenPackage = await db.tokenPackage.findUnique({
        where: { id: packageId },
      })

      if (tokenPackage) {
        await db.user.update({
          where: { id: userId },
          data: {
            tokens: {
              increment: tokenPackage.tokenAmount,
            },
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
