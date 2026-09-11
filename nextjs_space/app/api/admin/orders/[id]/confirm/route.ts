export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const confirmed = Boolean(body?.confirmed);
    const note = typeof body?.note === 'string' ? body.note.slice(0, 500) : undefined;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    await prisma.order.update({
      where: { id },
      data: {
        reservationConfirmed: confirmed,
        ...(note !== undefined ? { reservationNote: note } : {}),
      },
    });

    return NextResponse.json({ success: true, reservationConfirmed: confirmed });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
