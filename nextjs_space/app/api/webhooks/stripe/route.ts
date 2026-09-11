export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { assignExperience } from '@/lib/assign-experience';
import { deliverPurchaseConfirmation } from '@/lib/deliver';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session?.metadata?.orderId;

    if (orderId) {
      try {
        const existing = await prisma.order.findUnique({ where: { id: orderId } });

        // Idempotencia: Stripe reenvía eventos. Si ya estaba procesado, no repetir.
        const alreadyProcessed =
          !!existing && existing.status !== 'pending' && !!existing.assignedExperienceId;

        if (!alreadyProcessed) {
          if (existing?.status === 'pending') {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'paid' },
            });
          }

          // Asignar experiencia sorpresa (la función ya es idempotente)
          await assignExperience(orderId);

          // Confirmación al cliente + aviso de venta a la dueña.
          // No revela el plan: eso se envía el día de la experiencia.
          await deliverPurchaseConfirmation(orderId);
        }
      } catch (err: any) {
        console.error('Error processing webhook:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
