import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
  }

  try {
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id! }
    })

    if (user?.isPremium) {
      return NextResponse.json({ error: "Already premium" }, { status: 400 })
    }

    let customerId = user?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user?.name,
        metadata: { userId: user?.id }
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user?.id },
        data: { stripeCustomerId: customerId }
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/premium?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium?canceled=true`,
      metadata: { userId: user?.id }
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 })
  }
}
