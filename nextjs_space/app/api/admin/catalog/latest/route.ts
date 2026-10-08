export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import fs from 'fs';

/**
 * GET /api/admin/catalog/latest
 * Devuelve metadatos del último catálogo generado y un enlace de descarga.
 *
 * - Los datos (nº de experiencias activas/totales, fecha) salen de la base de datos,
 *   así funciona en producción sin depender del sistema de archivos.
 * - Si existe el fichero de la tarea diaria (niidea_daily_last_run.json) añadimos
 *   la info del último envío por email.
 * - El enlace de descarga apunta a /api/admin/catalog (genera el catálogo al vuelo).
 */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const [totalExperiences, activeExperiences, latest] = await Promise.all([
      prisma.experience.count(),
      prisma.experience.count({ where: { isActive: true } }),
      prisma.experience.findFirst({ orderBy: { date: 'desc' }, select: { date: true } }),
    ]);

    // Info opcional de la tarea diaria (solo disponible en la máquina que la ejecuta).
    let dailyRun: Record<string, unknown> | null = null;
    for (const p of [
      '/home/ubuntu/shared/niidea_daily_last_run.json',
      '/home/ubuntu/niidea_daily_last_run.json',
    ]) {
      try {
        if (fs.existsSync(p)) {
          dailyRun = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        }
      } catch {
        /* ignoramos: en producción puede no existir */
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    return NextResponse.json({
      generatedAt: today,
      totalExperiences,
      activeExperiences,
      lastExperienceDate: latest?.date ? latest.date.toISOString().slice(0, 10) : null,
      filename: `niidea-catalogo-${today}.csv`,
      downloadUrl: '/api/admin/catalog',
      dailyRun,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
