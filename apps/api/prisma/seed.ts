import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de datos de ApexVeterinario...');

  // 1. Crear o actualizar Usuarios
  const clientUser = await prisma.user.upsert({
    where: { email: 'carlos@example.com' },
    update: {},
    create: {
      id: 'user-demo-client-1',
      name: 'Carlos Mendoza',
      email: 'carlos@example.com',
      password: 'hashed_password_demo',
      phone: '+593 99 123 4567',
      role: 'CLIENT',
    },
  });

  const vetUser1 = await prisma.user.upsert({
    where: { email: 'valeria@apexvet.com' },
    update: {},
    create: {
      id: 'user-vet-1',
      name: 'Dra. Valeria Soto',
      email: 'valeria@apexvet.com',
      password: 'hashed_password_demo',
      phone: '+593 99 765 4321',
      role: 'VETERINARIAN',
    },
  });

  const vetUser2 = await prisma.user.upsert({
    where: { email: 'martin@apexvet.com' },
    update: {},
    create: {
      id: 'user-vet-2',
      name: 'Dr. Martín Morales',
      email: 'martin@apexvet.com',
      password: 'hashed_password_demo',
      phone: '+593 99 888 9999',
      role: 'VETERINARIAN',
    },
  });

  // 2. Veterinarios
  const vet1 = await prisma.veterinarian.upsert({
    where: { userId: vetUser1.id },
    update: {},
    create: {
      id: 'vet-1',
      userId: vetUser1.id,
      specialty: 'Medicina Interna, Dermatología y Felinos',
      licenseNumber: 'VET-88392-CL',
      bio: 'Especialista con más de 9 años en clínica médica de caninos y felinos. Certificada en manejo pet-friendly.',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813576-0f81d11ff31b?auto=format&fit=crop&w=400&q=80',
      availableDays: '1,2,3,4,5,6',
      startHour: 9,
      endHour: 18,
    },
  });

  const vet2 = await prisma.veterinarian.upsert({
    where: { userId: vetUser2.id },
    update: {},
    create: {
      id: 'vet-2',
      userId: vetUser2.id,
      specialty: 'Cirugía de Tejidos Blandos y Odontología',
      licenseNumber: 'VET-91024-CL',
      bio: 'Experto en procedimientos quirúrgicos preventivos, profilaxis ultrasónica y control de trauma.',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      availableDays: '1,2,3,4,5',
      startHour: 10,
      endHour: 19,
    },
  });

  // 3. Categorías
  const categories = [
    {
      id: 'cat-alimentos',
      name: 'Alimentos',
      slug: 'alimentos',
      description: 'Nutrición balanceada de marcas premium y dietas veterinarias prescritas.',
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cat-farmacia',
      name: 'Farmacia Veterinaria',
      slug: 'farmacia',
      description: 'Antiparasitarios, vitaminas, suplementos y medicamentos certificados.',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cat-accesorios',
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Arneses de seguridad, correas resistentes, camas y comederos ergonómicos.',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cat-higiene',
      name: 'Higiene y Cuidado',
      slug: 'higiene',
      description: 'Shampoos hipoalergénicos, cepillos, toallitas y arenas aglomerantes.',
      imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cat-juguetes',
      name: 'Juguetes',
      slug: 'juguetes',
      description: 'Estimulación física y mental con materiales resistentes y no tóxicos.',
      imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 4. Servicios Clínicos
  const services = [
    {
      id: 'srv-consulta',
      name: 'Consulta Veterinaria General',
      slug: 'consulta-general',
      description: 'Examen físico exhaustivo, toma de constantes vitales, diagnóstico clínico y prescripción.',
      durationMinutes: 30,
      price: 35.0,
      compatibleSpecies: JSON.stringify(['DOG', 'CAT', 'BIRD', 'RODENT']),
      requiresVeterinarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv-vacuna',
      name: 'Vacunación Séxtuple / Triple Felina',
      slug: 'vacunacion',
      description: 'Inmunización con vacunas de alta titulación, incluye revisión física previa y carnet.',
      durationMinutes: 30,
      price: 42.0,
      compatibleSpecies: JSON.stringify(['DOG', 'CAT']),
      requiresVeterinarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv-desparasitacion',
      name: 'Desparasitación Interna y Externa',
      slug: 'desparasitacion',
      description: 'Protocolo completo para nematodos, cestodos, pulgas y garrapatas según peso de la mascota.',
      durationMinutes: 20,
      price: 28.0,
      compatibleSpecies: JSON.stringify(['DOG', 'CAT']),
      requiresVeterinarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv-grooming',
      name: 'Peluquería y Grooming Integral',
      slug: 'peluqueria-grooming',
      description: 'Baño de burbujas tibias, corte estético por raza, corte de uñas, limpieza ótica y vaciado de glándulas.',
      durationMinutes: 60,
      price: 45.0,
      compatibleSpecies: JSON.stringify(['DOG', 'CAT']),
      requiresVeterinarian: false,
      imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv-dental',
      name: 'Control y Profilaxis Dental',
      slug: 'profilaxis-dental',
      description: 'Eliminación de sarro bacteriano mediante ultrasonido, pulido y tratamiento gingival preventivo.',
      durationMinutes: 45,
      price: 75.0,
      compatibleSpecies: JSON.stringify(['DOG', 'CAT']),
      requiresVeterinarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?auto=format&fit=crop&w=600&q=80',
    },
  ];

  for (const srv of services) {
    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: srv,
      create: srv,
    });
  }

  // 5. Productos del Catálogo
  const products = [
    {
      id: 'prod-proplan-adult',
      sku: 'PUR-PRO-001',
      name: 'Purina Pro Plan Adult OptiHealth 15kg',
      slug: 'purina-pro-plan-adult-15kg',
      description: 'Nutrición completa para perros adultos de razas medianas con pollo como primer ingrediente.',
      price: 78.5,
      compareAtPrice: 89.0,
      stock: 35,
      brand: 'Purina Pro Plan',
      weightKg: 15.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['DOG']),
      categoryId: 'cat-alimentos',
      isFeatured: true,
    },
    {
      id: 'prod-royal-felino',
      sku: 'ROY-CAT-002',
      name: 'Royal Canin Feline Health Nutrition Indoor 4kg',
      slug: 'royal-canin-indoor-4kg',
      description: 'Alimento formulado para gatos adultos sedentarios de interior. Ayuda a reducir el olor de las heces y bolas de pelo.',
      price: 46.9,
      compareAtPrice: 52.0,
      stock: 24,
      brand: 'Royal Canin',
      weightKg: 4.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['CAT']),
      categoryId: 'cat-alimentos',
      isFeatured: true,
    },
    {
      id: 'prod-bravecto-medium',
      sku: 'MSD-BRAV-003',
      name: 'Bravecto Masticable 10kg - 20kg (1 comprimido)',
      slug: 'bravecto-10-20kg',
      description: 'Protección durante 12 semanas completas contra pulgas y garrapatas con sabor altamente palatable.',
      price: 38.0,
      compareAtPrice: 42.5,
      stock: 50,
      brand: 'MSD Salud Animal',
      weightKg: 0.1,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['DOG']),
      categoryId: 'cat-farmacia',
      isFeatured: true,
    },
    {
      id: 'prod-nexgard-spectra',
      sku: 'BOEH-NEX-004',
      name: 'NexGard Spectra 7.5kg - 15kg (Caja 3 tabletas)',
      slug: 'nexgard-spectra-7-15kg',
      description: 'Tratamiento oral mensual de amplio espectro contra parásitos internos y externos.',
      price: 49.9,
      compareAtPrice: 55.0,
      stock: 30,
      brand: 'Boehringer Ingelheim',
      weightKg: 0.15,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['DOG']),
      categoryId: 'cat-farmacia',
      isFeatured: false,
    },
    {
      id: 'prod-arnes-ergonomico',
      sku: 'APX-ACC-005',
      name: 'Arnés Táctico Ergonómico ApexPro Reflectivo',
      slug: 'arnes-ergonomico-apexpro',
      description: 'Arnés antitirones con distribución de presión en 4 puntos, acolchado transpirable y bandas reflectivas 3M.',
      price: 34.5,
      compareAtPrice: 39.9,
      stock: 40,
      brand: 'ApexGear',
      weightKg: 0.4,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['DOG']),
      categoryId: 'cat-accesorios',
      isFeatured: true,
    },
    {
      id: 'prod-shampoo-avena',
      sku: 'DERM-SHA-006',
      name: 'Shampoo Hipoalergénico con Avena Coloidal & Aloe 500ml',
      slug: 'shampoo-avena-aloe-500ml',
      description: 'Fórmula calmante para pieles sensibles, alérgicas o con prurito. pH neutro sin sulfatos irritantes.',
      price: 18.0,
      compareAtPrice: 22.0,
      stock: 60,
      brand: 'DermCare Vet',
      weightKg: 0.55,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['DOG', 'CAT']),
      categoryId: 'cat-higiene',
      isFeatured: false,
    },
    {
      id: 'prod-kong-classic',
      sku: 'KONG-CLA-007',
      name: 'KONG Classic Juguete Rellenable Ultra Resistente L',
      slug: 'kong-classic-juguete-l',
      description: 'Caucho natural ultrarresistente que rebota de forma impredecible. Ideal para rellenar con snacks o pasta.',
      price: 21.5,
      compareAtPrice: 25.0,
      stock: 45,
      brand: 'KONG',
      weightKg: 0.3,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
      ]),
      compatibleSpecies: JSON.stringify(['DOG']),
      categoryId: 'cat-juguetes',
      isFeatured: true,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: prod,
      create: prod,
    });
  }

  // 6. Mascotas Demo
  const pet1 = await prisma.pet.upsert({
    where: { id: 'pet-1' },
    update: {},
    create: {
      id: 'pet-1',
      ownerId: clientUser.id,
      name: 'Kira',
      species: 'DOG',
      breed: 'Golden Retriever',
      birthDate: new Date('2022-03-15'),
      weightKg: 28.5,
      sex: 'FEMALE',
      microchip: '985141002348190',
      notes: 'Muy dócil, sensible al pollo en altos porcentajes.',
      avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const pet2 = await prisma.pet.upsert({
    where: { id: 'pet-2' },
    update: {},
    create: {
      id: 'pet-2',
      ownerId: clientUser.id,
      name: 'Milo',
      species: 'CAT',
      breed: 'Siamés',
      birthDate: new Date('2023-06-20'),
      weightKg: 4.3,
      sex: 'MALE',
      microchip: '985141002348191',
      notes: 'Tranquilo, acostumbrado a cepillado diario.',
      avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    },
  });

  // 7. Historial Clínico y Vacunación para Kira
  await prisma.medicalRecord.createMany({
    data: [
      {
        petId: pet1.id,
        veterinarianId: vet1.id,
        visitDate: new Date('2024-01-10T10:30:00Z'),
        diagnosis: 'Chequeo anual de salud y control de peso',
        treatment: 'Plan nutricional equilibrado y suplementación articular preventiva con condroitina.',
        notes: 'Constantes fisiológicas normales. Peso ideal.',
      },
      {
        petId: pet1.id,
        veterinarianId: vet2.id,
        visitDate: new Date('2024-05-18T15:00:00Z'),
        diagnosis: 'Dermatitis estacional leve en patas traseras',
        treatment: 'Baño medicado con clorhexidina y ácidos grasos Omega-3 por 2 semanas.',
        notes: 'Excelente respuesta al tratamiento.',
      },
    ],
  });

  await prisma.vaccination.createMany({
    data: [
      {
        petId: pet1.id,
        vaccineName: 'Séxtuple Canina (DHPPi/L4)',
        administeredAt: new Date('2024-02-15T09:00:00Z'),
        nextDueDate: new Date('2025-02-15T09:00:00Z'),
        batchNumber: 'LOT-VAC-2024-098',
        notes: 'Sin efectos secundarios post-aplicación.',
      },
      {
        petId: pet1.id,
        vaccineName: 'Antirrábica Anual',
        administeredAt: new Date('2024-02-15T09:00:00Z'),
        nextDueDate: new Date('2025-02-15T09:00:00Z'),
        batchNumber: 'LOT-RAB-2024-112',
        notes: 'Certificado oficial emitido.',
      },
    ],
  });

  console.log('✅ Datos iniciales de ApexVeterinario cargados con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
