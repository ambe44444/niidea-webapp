import { prisma } from './prisma'

export const LEVEL_KEYS = ['soft', 'medium', 'full'] as const
export type LevelKey = (typeof LEVEL_KEYS)[number]

/** Días mínimos de antelación para poder gestionar la reserva. */
export const MIN_LEAD_DAYS = 2

export type AvailabilityMap = Record<string, LevelKey[]>

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Primera fecha comprable (hoy + MIN_LEAD_DAYS), en formato YYYY-MM-DD. */
export function firstBookableDate(now = new Date()): string {
  const d = new Date(now)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + MIN_LEAD_DAYS)
  return dateKey(d)
}

/**
 * Devuelve, para cada fecha con stock real, los niveles que se pueden vender
 * a un grupo de `people` personas. Una fecha sin ningún nivel disponible
 * simplemente no aparece en el mapa, así el calendario la bloquea.
 */
export async function getAvailability(people: number): Promise<AvailabilityMap> {
  const group = Math.max(1, Math.min(10, Math.floor(people) || 1))
  const from = new Date(`${firstBookableDate()}T00:00:00.000Z`)

  const rows = await prisma.experience.findMany({
    where: {
      isActive: true,
      date: { gte: from },
      remainingCapacity: { gte: group },
    },
    select: { date: true, level: true },
  })

  const map: AvailabilityMap = {}
  for (const row of rows) {
    const level = row.level as LevelKey
    if (!LEVEL_KEYS.includes(level)) continue
    const key = dateKey(row.date)
    if (!map[key]) map[key] = []
    if (!map[key].includes(level)) map[key].push(level)
  }

  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => LEVEL_KEYS.indexOf(a) - LEVEL_KEYS.indexOf(b))
  }

  return map
}

/** Comprobación puntual usada por el checkout antes de cobrar. */
export async function isSlotAvailable(
  date: string,
  level: string,
  people: number,
): Promise<boolean> {
  const group = Math.max(1, Math.floor(people) || 1)
  const day = date.slice(0, 10)
  if (day < firstBookableDate()) return false

  const count = await prisma.experience.count({
    where: {
      isActive: true,
      level,
      remainingCapacity: { gte: group },
      date: {
        gte: new Date(`${day}T00:00:00.000Z`),
        lte: new Date(`${day}T23:59:59.999Z`),
      },
    },
  })

  return count > 0
}
