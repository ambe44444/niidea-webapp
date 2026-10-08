export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * PATCH /api/admin/orders/[id]/reassign
 * Reasigna un pedido ya asignado a otra experiencia.
 * Body: { experienceId: string }
 * - Libera las plazas del plan anterior.
 * - Ocupa las plazas del nuevo plan.
 * - Mantiene el pedido en estado 'assigned'.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { experienceId } = await request.json();

    if (!experienceId) {
      return NextResponse.json({ error: 'Falta experienceId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const experience = await prisma.experience.findUnique({ where: { id: experienceId } });
    if (!experience) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
    }

    // Si se reasigna al mismo plan, no hacemos nada.
    if (order.assignedExperienceId === experienceId) {
      return NextResponse.json({ success: true, unchanged: true });
    }

    if ((experience.remainingCapacity ?? 0) < order.people) {
      return NextResponse.json(
        { error: 'El plan elegido no tiene plazas suficientes.' },
        { status: 409 },
      );
    }

    const ops: any[] = [];

    // Libera plazas del plan anterior (si lo había).
    if (order.assignedExperienceId) {
      ops.push(
        prisma.experience.update({
          where: { id: order.assignedExperienceId },
          data: { remainingCapacity: { increment: order.people } },
        }),
      );
    }

    // Ocupa plazas del nuevo plan y actualiza el pedido.
    ops.push(
      prisma.experience.update({
        where: { id: experienceId },
        data: { remainingCapacity: { decrement: order.people } },
      }),
      prisma.order.update({
        where: { id },
        data: { assignedExperienceId: experienceId, status: 'assigned' },
      }),
    );

    await prisma.$transaction(ops);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
