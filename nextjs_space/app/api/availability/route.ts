export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAvailability, firstBookableDate } from '@/lib/availability'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const people = Number(searchParams.get('people') ?? '1')
    const days = await getAvailability(people)
    return NextResponse.json({ minDate: firstBookableDate(), days })
  } catch (err: any) {
    console.error('Availability error:', err)
    return NextResponse.json(
      { error: 'No se pudo cargar la disponibilidad', minDate: firstBookableDate(), days: {} },
      { status: 500 },
    )
  }
}
