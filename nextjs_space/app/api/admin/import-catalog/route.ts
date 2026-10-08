export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/import-catalog
 * Importa experiencias en bloque desde JSON.
 * Body: { password: string, experiences: Experience[], mode: 'append' | 'replace' }
 * - mode='append': añade sin borrar las existentes
 * - mode='replace': borra todas las experiencias activas primero, luego inserta
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, experiences, mode = 'append' } = body ?? {};

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!Array.isArray(experiences) || experiences.length === 0) {
      return NextResponse.json({ error: 'No se enviaron experiencias' }, { status: 400 });
    }

    let deleted = 0;
    if (mode === 'replace') {
      // Borra solo las experiencias sin pedidos asignados
      const result = await prisma.experience.deleteMany({
        where: { orders: { none: {} } },
      });
      deleted = result.count;
    }

    // Inserta en lotes de 500
    const BATCH = 500;
    let inserted = 0;
    for (let i = 0; i < experiences.length; i += BATCH) {
      const batch = experiences.slice(i, i + BATCH);
      await prisma.experience.createMany({
        data: batch.map((e: any) => ({
          name: e.name ?? 'Experiencia sorpresa',
          level: e.level ?? 'medium',
          date: new Date(e.date),
          time: e.time ?? '20:00',
          location: e.location ?? 'Madrid',
          capacity: Number(e.capacity ?? 10),
          remainingCapacity: Number(e.remaining_capacity ?? e.remainingCapacity ?? e.capacity ?? 10),
          isActive: e.is_active ?? e.isActive ?? true,
          category: e.category ?? null,
          description: e.description ?? null,
          neighborhood: e.neighborhood ?? null,
          costPerPerson: e.cost_per_person ?? e.costPerPerson ?? null,
          marginPerPerson: e.margin_per_person ?? e.marginPerPerson ?? null,
          sourceUrl: e.source_url ?? e.sourceUrl ?? null,
          sourceName: e.source_name ?? e.sourceName ?? null,
        })),
        skipDuplicates: false,
      });
      inserted += batch.length;
    }

    return NextResponse.json({
      ok: true,
      deleted,
      inserted,
      total: await prisma.experience.count({ where: { isActive: true } }),
    });
  } catch (err: any) {
    console.error('Import catalog error:', err);
    return NextResponse.json({ error: err?.message ?? 'Error al importar' }, { status: 500 });
  }
}

/**
 * GET /api/admin/import-catalog?password=XXX
 * Devuelve el número de experiencias activas (para verificar el estado del import)
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const active = await prisma.experience.count({ where: { isActive: true } });
  const total = await prisma.experience.count();

  return NextResponse.json({ active, total });
}
