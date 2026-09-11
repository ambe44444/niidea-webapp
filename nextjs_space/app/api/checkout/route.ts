export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe, LEVEL_PRICES, LEVEL_LABELS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { isSlotAvailable } from '@/lib/availability';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, date, people, level } = body ?? {};

    if (!email || !phone || !date || !people || !level) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const unitPrice = LEVEL_PRICES[level];
    if (!unitPrice) {
      return NextResponse.json({ error: 'Nivel no válido' }, { status: 400 });
    }

    // Nunca cobrar por un día/nivel sin planes disponibles.
    const available = await isSlotAvailable(date, level, Number(people));
    if (!available) {
      return NextResponse.json(
        { error: 'Ya no quedan planes para esa fecha y nivel. Elige otra combinación.' },
        { status: 409 },
      );
    }

    const totalPrice = unitPrice * people;
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    // Create pending order
    const order = await prisma.order.create({
      data: {
        email,
        phone,
        date: new Date(date),
        people: Number(people),
        level,
        price: totalPrice,
        status: 'pending',
      },
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `NiIdea ${LEVEL_LABELS[level]} × ${people}`,
              description: `Experiencia sorpresa nivel ${LEVEL_LABELS[level]} para ${people} persona(s)`,
            },
            unit_amount: unitPrice,
          },
          quantity: people,
        },
      ],
      metadata: {
        orderId: order.id,
      },
      payment_intent_data: {
        // Lo que ve el cliente en su extracto bancario
        statement_descriptor_suffix: 'NIIDEA',
      },
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/buy?cancelled=true`,
    });

    // Save stripe session id
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err?.message ?? 'Error al crear checkout' }, { status: 500 });
  }
}
