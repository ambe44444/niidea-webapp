export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { deliverReveal } from '@/lib/deliver';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * Envío manual de la revelación del plan desde el panel de admin.
 * Manda email siempre y, si Twilio está configurado, también WhatsApp/SMS.
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Falta orderId' }, { status: 400 });
    }

    const result = await deliverReveal(orderId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.errors.join(' | ') || 'No se pudo enviar' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
