// app/api/webhooks/stripe/route.js
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import UserSubscription from '@/models/UserSubscription'
import connectMongoDB from '@/utils/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Update the user's subscription status in your database
    try {
      await connectMongoDB()
      
      const customerEmail = session.customer_email || session.customer_details?.email
      const subscriptionType = session.metadata?.subscriptionType || 
                             (session.amount_total === 999 ? 'monthly' : 'yearly')

      if (customerEmail) {
        await UserSubscription.findOneAndUpdate(
          { email: customerEmail },
          { 
            isSubscribed: true,
            subscriptionType,
            stripeCustomerId: session.customer
          },
          { upsert: true }
        )
      }
    } catch (err) {
      console.error('Error updating subscription:', err)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}