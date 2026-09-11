export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Acceso no configurado' }, { status: 500 });
    }

    // pequeño retardo: hace inviable probar contraseñas en masa
    await new Promise((r) => setTimeout(r, 600));

    if (username === 'admin' && password === adminPassword) {
      await setAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
