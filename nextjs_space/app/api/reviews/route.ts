export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LEVELS = ['Soft', 'Medium', 'Full'];

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 60,
      select: { id: true, name: true, stars: true, level: true, text: true },
    });
    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const text = String(body?.text ?? '').trim();
    const stars = Number(body?.stars ?? 5);
    const rawLevel = String(body?.level ?? '').trim();
    const level = LEVELS.includes(rawLevel) ? rawLevel : null;

    if (name.length < 2 || name.length > 40) {
      return NextResponse.json({ error: 'Escribe tu nombre (2-40 caracteres).' }, { status: 400 });
    }
    if (text.length < 20 || text.length > 600) {
      return NextResponse.json(
        { error: 'La reseña debe tener entre 20 y 600 caracteres.' },
        { status: 400 },
      );
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Puntuación no válida.' }, { status: 400 });
    }
    if (/https?:\/\/|www\./i.test(text)) {
      return NextResponse.json({ error: 'No se admiten enlaces en las reseñas.' }, { status: 400 });
    }

    // Anti-duplicado sencillo: mismo nombre y texto en las últimas 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dup = await prisma.review.findFirst({
      where: { name, text, createdAt: { gte: since } },
      select: { id: true },
    });
    if (dup) {
      return NextResponse.json({ ok: true, duplicated: true });
    }

    await prisma.review.create({
      data: { name, text, stars, level, approved: false },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
