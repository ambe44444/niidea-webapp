export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deliverReveal } from '@/lib/deliver';
import { sendNiIdeaEmail, OWNER_EMAIL } from '@/lib/notify';
import { buildOwnerAlertEmail, formatDateEs } from '@/lib/messages';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const expected = process.env.CRON_SECRET;

  // Se acepta el secreto por parámetro (?secret=) o por cabecera Authorization: Bearer
  const fromQuery = url.searchParams.get('secret');
  const authHeader = request.headers.get('authorization') ?? '';
  const fromHeader = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!expected || (fromQuery !== expected && fromHeader !== expected)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // La revelación se envía el DÍA ANTES del plan:
  // buscamos los pedidos cuya experiencia es mañana.
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  try {
    const orders = await prisma.order.findMany({
      where: {
        date: { gte: tomorrow, lt: dayAfter },
        status: 'assigned',
        whatsappSent: false,
      },
      select: { id: true },
    });

    const results = [];
    for (const order of orders) {
      const res = await deliverReveal(order.id);
      results.push({ orderId: order.id, ...res });
    }

    const sent = results.filter((r) => r.success).length;

    /* ---- Aviso 1: planes de mañana que aún no están reservados ---- */
    let pendingReservations = 0;
    const pending = await prisma.order.findMany({
      where: {
        date: { gte: tomorrow, lt: dayAfter },
        status: 'assigned',
        reservationConfirmed: false,
      },
      include: { assignedExperience: true },
    });
    pendingReservations = pending.length;
    if (pending.length > 0) {
      const rows = pending.map((o) => [
        '📌',
        o.assignedExperience?.name ?? 'Sin plan asignado',
        `${o.assignedExperience?.time ?? '--'} · ${o.assignedExperience?.location ?? '--'} · ${o.people} pers. · ${o.email}`,
      ]) as Array<[string, string, string]>;
      const alert = buildOwnerAlertEmail({
        kicker: 'Reservas pendientes',
        title: `Mañana hay ${pending.length} plan${pending.length > 1 ? 'es' : ''} sin reservar`,
        intro:
          'Estos pedidos ya tienen plan asignado y el cliente recibe hoy la revelación, pero tú aún no has marcado la reserva como hecha. Llama al sitio y marca la casilla en el panel.',
        rows,
        outro: 'Panel → Pedidos → abre el plan → «Ya he reservado en el sitio».',
        subject: `⚠️ ${pending.length} reserva(s) sin confirmar para mañana`,
      });
      await sendNiIdeaEmail({
        notificationId: process.env.NOTIF_ID_AVISO_PEDIDO_SIN_PLAN,
        to: OWNER_EMAIL,
        subject: alert.subject,
        html: alert.html,
      });
    }

    /* ---- Aviso 2: se acaba el catálogo de planes futuros ---- */
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const future = await prisma.experience.findMany({
      where: { isActive: true, date: { gte: today }, remainingCapacity: { gt: 0 } },
      select: { date: true },
    });
    const days = Array.from(new Set(future.map((e) => e.date.toISOString().slice(0, 10)))).sort();
    const lastDay = days[days.length - 1];
    let catalogWarning = false;
    if (days.length <= 7) {
      catalogWarning = true;
      const alert = buildOwnerAlertEmail({
        kicker: 'Catálogo',
        title: `Solo quedan ${days.length} día(s) con planes disponibles`,
        intro:
          'El calendario de la web solo permite reservar días en los que hay planes con plazas. Si el catálogo se vacía, la web deja de vender.',
        rows: [
          ['📅', 'Días abiertos', String(days.length)],
          ['🏁', 'Último día con planes', lastDay ? formatDateEs(new Date(`${lastDay}T00:00:00.000Z`)) : 'ninguno'],
          ['🎟️', 'Planes con plazas', String(future.length)],
        ],
        outro: 'Revisa el buscador diario de planes o añade experiencias a mano desde el panel.',
        subject: `🔔 Catálogo NiIdea: solo ${days.length} día(s) con planes`,
      });
      await sendNiIdeaEmail({
        notificationId: process.env.NOTIF_ID_AVISO_PEDIDO_SIN_PLAN,
        to: OWNER_EMAIL,
        subject: alert.subject,
        html: alert.html,
      });
    }

    return NextResponse.json({
      candidates: orders.length,
      sent,
      pendingReservations,
      openDays: days.length,
      lastOpenDay: lastDay ?? null,
      catalogWarning,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
