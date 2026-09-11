export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { experienceId } = await request.json();
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const experience = await prisma.experience.findUnique({ where: { id: experienceId } });
    if (!experience) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
    }

    if (order.assignedExperienceId) {
      await prisma.experience.update({
        where: { id: order.assignedExperienceId },
        data: { remainingCapacity: { increment: order.people } },
      });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { assignedExperienceId: experienceId, status: 'assigned' },
      }),
      prisma.experience.update({
        where: { id: experienceId },
        data: { remainingCapacity: { decrement: order.people } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
