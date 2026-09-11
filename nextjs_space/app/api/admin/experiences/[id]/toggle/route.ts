export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: { isActive: !experience.isActive },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
