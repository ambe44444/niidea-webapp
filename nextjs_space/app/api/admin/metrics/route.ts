export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalOrders, paidOrders, todayOrders, allOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({ where: { status: { in: ['paid', 'assigned'] } } }),
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.findMany({ where: { status: { in: ['paid', 'assigned'] } }, select: { level: true, price: true } }),
    ]);

    const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o?.price ?? 0), 0);
    const revenueByLevel = {
      soft: allOrders.filter((o: any) => o?.level === 'soft').reduce((s: number, o: any) => s + (o?.price ?? 0), 0),
      medium: allOrders.filter((o: any) => o?.level === 'medium').reduce((s: number, o: any) => s + (o?.price ?? 0), 0),
      full: allOrders.filter((o: any) => o?.level === 'full').reduce((s: number, o: any) => s + (o?.price ?? 0), 0),
    };

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      todayOrders,
      revenueByLevel,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
