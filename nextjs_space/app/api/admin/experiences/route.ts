export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { date: 'asc' },
      include: { _count: { select: { orders: true } } },
    });
    return NextResponse.json(experiences);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, level, date, time, location, capacity, category, description, neighborhood, costPerPerson, marginPerPerson, sourceUrl, sourceName } = body ?? {};

    if (!name || !level || !date || !time || !location || !capacity) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: {
        name,
        level,
        date: new Date(date),
        time,
        location,
        capacity: Number(capacity),
        remainingCapacity: Number(capacity),
        category: category || null,
        description: description || null,
        neighborhood: neighborhood || null,
        costPerPerson: costPerPerson ? Number(costPerPerson) : null,
        marginPerPerson: marginPerPerson ? Number(marginPerPerson) : null,
        sourceUrl: sourceUrl || null,
        sourceName: sourceName || null,
      },
    });

    return NextResponse.json(experience);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
