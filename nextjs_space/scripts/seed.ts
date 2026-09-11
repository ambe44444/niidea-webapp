import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const experiences = [
    // ——— SOFT (25€/pers — coste máx 15€) ———
    {
      id: 'exp-soft-1',
      name: 'Cata de vinos en Malasaña',
      level: 'soft',
      date: new Date('2026-08-01'),
      time: '19:00',
      location: 'Calle Fuencarral 45, Madrid',
      capacity: 15,
      remainingCapacity: 15,
      category: 'experiencia',
      description: 'Cata guiada de 5 vinos nacionales con maridaje de tapas en bodega centenaria.',
      neighborhood: 'Malasaña',
      costPerPerson: 1200, // 12€
      marginPerPerson: 1300, // 13€
      sourceName: 'Bodega La Ardosa',
    },
    {
      id: 'exp-soft-2',
      name: 'Taller de cerámica en Lavapiés',
      level: 'soft',
      date: new Date('2026-08-02'),
      time: '18:00',
      location: 'Calle Embajadores 22, Madrid',
      capacity: 10,
      remainingCapacity: 10,
      category: 'experiencia',
      description: 'Clase de torno y modelado de 2 horas. Te llevas tu pieza.',
      neighborhood: 'Lavapiés',
      costPerPerson: 1400, // 14€
      marginPerPerson: 1100, // 11€
      sourceName: 'Taller Tierra',
    },
    {
      id: 'exp-soft-3',
      name: 'Ruta gastro por La Latina',
      level: 'soft',
      date: new Date('2026-08-03'),
      time: '20:00',
      location: 'Plaza de la Cebada, Madrid',
      capacity: 20,
      remainingCapacity: 20,
      category: 'restaurante',
      description: 'Recorrido por 3 tabernas clásicas con tapa + caña en cada una.',
      neighborhood: 'La Latina',
      costPerPerson: 1500, // 15€
      marginPerPerson: 1000, // 10€
      sourceName: 'Ruta por La Latina',
    },
    {
      id: 'exp-soft-4',
      name: 'Yoga al atardecer en Retiro',
      level: 'soft',
      date: new Date('2026-08-08'),
      time: '19:30',
      location: 'Parque del Retiro, Madrid',
      capacity: 25,
      remainingCapacity: 25,
      category: 'experiencia',
      description: 'Sesión de yoga al aire libre con vistas al lago. Incluye esterilla y smoothie.',
      neighborhood: 'Retiro',
      costPerPerson: 800, // 8€
      marginPerPerson: 1700, // 17€
      sourceName: 'Yoga Madrid',
    },

    // ——— MEDIUM (30€/pers — coste máx 20€) ———
    {
      id: 'exp-med-1',
      name: 'Escape Room inmersivo',
      level: 'medium',
      date: new Date('2026-08-01'),
      time: '20:00',
      location: 'Calle Gran Vía 28, Madrid',
      capacity: 8,
      remainingCapacity: 8,
      category: 'experiencia',
      description: 'Escape room temático de terror con actores reales. 75 min de adrenalina.',
      neighborhood: 'Centro',
      costPerPerson: 1800, // 18€
      marginPerPerson: 1200, // 12€
      sourceName: 'Exit Madrid',
    },
    {
      id: 'exp-med-2',
      name: 'Show de comedia + cena',
      level: 'medium',
      date: new Date('2026-08-02'),
      time: '21:00',
      location: 'Calle Huertas 11, Madrid',
      capacity: 12,
      remainingCapacity: 12,
      category: 'teatro',
      description: 'Monólogos en sala íntima con cena ligera y 2 copas incluidas.',
      neighborhood: 'Huertas',
      costPerPerson: 2000, // 20€
      marginPerPerson: 1000, // 10€
      sourceName: 'Comedy Club Madrid',
    },
    {
      id: 'exp-med-3',
      name: 'Clase de coctelería secreta',
      level: 'medium',
      date: new Date('2026-08-03'),
      time: '19:00',
      location: 'Calle Ponzano 15, Madrid',
      capacity: 10,
      remainingCapacity: 10,
      category: 'experiencia',
      description: 'Aprende a preparar 3 cócteles clásicos en un bar speakeasy oculto.',
      neighborhood: 'Chamberí',
      costPerPerson: 1600, // 16€
      marginPerPerson: 1400, // 14€
      sourceName: 'Bar Santamaría',
    },
    {
      id: 'exp-med-4',
      name: 'Tour street art + DJ set',
      level: 'medium',
      date: new Date('2026-08-08'),
      time: '18:30',
      location: 'Tabacalera, Lavapiés',
      capacity: 15,
      remainingCapacity: 15,
      category: 'ocio',
      description: 'Ruta por los murales más potentes de Madrid + sesión DJ privada en azotea.',
      neighborhood: 'Lavapiés',
      costPerPerson: 1500, // 15€
      marginPerPerson: 1500, // 15€
      sourceName: 'Madrid Street Art',
    },

    // ——— FULL (35€/pers — coste máx 24€) ———
    {
      id: 'exp-full-1',
      name: 'Fiesta en azotea secreta',
      level: 'full',
      date: new Date('2026-08-01'),
      time: '22:00',
      location: 'Rooftop secreto, Centro Madrid',
      capacity: 30,
      remainingCapacity: 30,
      category: 'fiesta',
      description: 'Terraza privada con DJ, barra libre 2h y vistas 360° a Madrid.',
      neighborhood: 'Centro',
      costPerPerson: 2200, // 22€
      marginPerPerson: 1300, // 13€
      sourceName: 'Rooftop Events',
    },
    {
      id: 'exp-full-2',
      name: 'Cena clandestina + espectáculo',
      level: 'full',
      date: new Date('2026-08-02'),
      time: '21:00',
      location: 'Ubicación secreta, Chamberí',
      capacity: 20,
      remainingCapacity: 20,
      category: 'restaurante',
      description: 'Menú degustación de 5 platos en local oculto con show en vivo.',
      neighborhood: 'Chamberí',
      costPerPerson: 2400, // 24€
      marginPerPerson: 1100, // 11€
      sourceName: 'Clandestina Madrid',
    },
    {
      id: 'exp-full-3',
      name: 'Gymkhana nocturna por Madrid',
      level: 'full',
      date: new Date('2026-08-03'),
      time: '20:30',
      location: 'Punto de encuentro: Sol',
      capacity: 25,
      remainingCapacity: 25,
      category: 'experiencia',
      description: 'Pruebas, misterio y sorpresas por las calles de Madrid de noche. 3h de pura acción.',
      neighborhood: 'Centro',
      costPerPerson: 1800, // 18€
      marginPerPerson: 1700, // 17€
      sourceName: 'Madrid Adventures',
    },
    {
      id: 'exp-full-4',
      name: 'Pool party + brunch sorpresa',
      level: 'full',
      date: new Date('2026-08-08'),
      time: '12:00',
      location: 'Hotel exclusivo, Salamanca',
      capacity: 30,
      remainingCapacity: 30,
      category: 'fiesta',
      description: 'Piscina privada en hotel de lujo, brunch con DJ y fotógrafo.',
      neighborhood: 'Salamanca',
      costPerPerson: 2300, // 23€
      marginPerPerson: 1200, // 12€
      sourceName: 'Hotel Wellington Events',
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: { ...exp },
      create: { ...exp },
    });
  }

  console.log('Seeded', experiences.length, 'experiences');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
