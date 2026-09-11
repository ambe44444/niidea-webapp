import { prisma } from './prisma';

export async function assignExperience(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;

  // Idempotencia: si ya tiene experiencia asignada, no volver a asignar
  // (Stripe puede reenviar el mismo webhook varias veces)
  if (order.assignedExperienceId) return order;

  // Date range for the order day
  const startOfDay = new Date(order.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(order.date);
  endOfDay.setHours(23, 59, 59, 999);

  // Find all compatible experiences: same level, same date, enough capacity, active
  const candidates = await prisma.experience.findMany({
    where: {
      level: order.level,
      date: { gte: startOfDay, lte: endOfDay },
      remainingCapacity: { gte: order.people },
      isActive: true,
    },
    orderBy: { remainingCapacity: 'desc' },
  });

  if (candidates.length === 0) return null;

  // Pick a random candidate to keep experiences varied for customers
  const experience = candidates[Math.floor(Math.random() * candidates.length)];

  // Atomically assign and reduce capacity
  const [updatedOrder] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        assignedExperienceId: experience.id,
        status: 'assigned',
      },
    }),
    prisma.experience.update({
      where: { id: experience.id },
      data: {
        remainingCapacity: { decrement: order.people },
      },
    }),
  ]);

  return updatedOrder;
}
