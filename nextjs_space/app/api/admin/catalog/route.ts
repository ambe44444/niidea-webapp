export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const PRICES: Record<string, number> = { soft: 2500, medium: 3000, full: 3500 };

function esc(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function eur(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return '';
  return (cents / 100).toFixed(2).replace('.', ',');
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const authorized = (await isAdminAuthenticated()) || (!!secret && secret === process.env.CRON_SECRET);
  if (!authorized) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const experiences = await prisma.experience.findMany({
    orderBy: [{ isActive: 'desc' }, { date: 'asc' }],
    include: { _count: { select: { orders: true } } },
  });

  const header = [
    'Estado',
    'Plan',
    'Nivel',
    'PVP por persona (\u20ac)',
    'Coste por persona (\u20ac)',
    'Margen por persona (\u20ac)',
    'Margen (%)',
    'Categoria',
    'Barrio',
    'Fecha',
    'Hora',
    'Lugar',
    'Plazas totales',
    'Plazas libres',
    'Pedidos',
    'Origen',
    'Enlace',
    'Auto-descubierto',
  ];

  const rows = experiences.map((e) => {
    const pvp = PRICES[e.level] ?? 0;
    const cost = e.costPerPerson ?? null;
    const margin = e.marginPerPerson ?? (cost !== null ? pvp - cost : null);
    const pct = margin !== null && pvp > 0 ? ((margin / pvp) * 100).toFixed(0) : '';
    return [
      e.isActive ? 'Activo' : 'Inactivo',
      e.name,
      e.level,
      eur(pvp),
      eur(cost),
      eur(margin),
      pct,
      e.category ?? '',
      e.neighborhood ?? '',
      e.date.toISOString().slice(0, 10),
      e.time,
      e.location,
      e.capacity,
      e.remainingCapacity,
      e._count.orders,
      e.sourceName ?? '',
      e.sourceUrl ?? '',
      e.autoDiscovered ? 'Si' : 'No',
    ];
  });

  // BOM + ';' para que Excel/SharePoint en español lo abra bien
  const csv =
    '\uFEFF' +
    [header, ...rows].map((r) => r.map(esc).join(';')).join('\r\n') +
    '\r\n';

  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="niidea-catalogo-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
