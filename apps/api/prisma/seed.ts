import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de datos Multi-Tenant de ApexVeterinario...');

  const defaultPassword = await bcrypt.hash('demo1234', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 1. Crear Inquilinos (Tenants)
  const tenantNorte = await prisma.tenant.upsert({
    where: { slug: 'clinica-norte' },
    update: {
      name: 'Apex Clínica Norte',
      primaryColor: '#0f766e',
      phone: '+593 99 111 2233',
      address: 'Av. Juan Tanca Marengo Km 4.5, Guayaquil',
      logoUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80',
    },
    create: {
      id: 'tenant-clinica-norte',
      slug: 'clinica-norte',
      name: 'Apex Clínica Norte',
      primaryColor: '#0f766e',
      phone: '+593 99 111 2233',
      address: 'Av. Juan Tanca Marengo Km 4.5, Guayaquil',
      logoUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80',
    },
  });

  const tenantCentral = await prisma.tenant.upsert({
    where: { slug: 'vet-central' },
    update: {
      name: 'Apex Veterinaria Central',
      primaryColor: '#7c3aed',
      phone: '+593 99 444 5566',
      address: 'Calle 9 de Octubre y Malecón, Guayaquil',
      logoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    },
    create: {
      id: 'tenant-vet-central',
      slug: 'vet-central',
      name: 'Apex Veterinaria Central',
      primaryColor: '#7c3aed',
      phone: '+593 99 444 5566',
      address: 'Calle 9 de Octubre y Malecón, Guayaquil',
      logoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('✅ Tenants creados:', tenantNorte.name, '|', tenantCentral.name);

  // 2. Usuarios
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@apexvet.com' },
    update: { password: adminPassword },
    create: {
      id: 'user-admin-global',
      name: 'Administrador General',
      email: 'admin@apexvet.com',
      password: adminPassword,
      phone: '+593 99 000 0000',
      role: 'ADMIN',
      tenantId: tenantNorte.id,
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'carlos@example.com' },
    update: { password: defaultPassword, tenantId: tenantNorte.id },
    create: {
      id: 'user-demo-client-1',
      name: 'Carlos Mendoza',
      email: 'carlos@example.com',
      password: defaultPassword,
      phone: '+593 99 123 4567',
      role: 'CLIENT',
      tenantId: tenantNorte.id,
    },
  });

  const vetUser1 = await prisma.user.upsert({
    where: { email: 'valeria@apexvet.com' },
    update: { password: defaultPassword, tenantId: tenantNorte.id },
    create: {
      id: 'user-vet-1',
      name: 'Dra. Valeria Soto',
      email: 'valeria@apexvet.com',
      password: defaultPassword,
      phone: '+593 99 765 4321',
      role: 'VETERINARIAN',
      tenantId: tenantNorte.id,
    },
  });

  const vetUser2 = await prisma.user.upsert({
    where: { email: 'martin@apexvet.com' },
    update: { password: defaultPassword, tenantId: tenantCentral.id },
    create: {
      id: 'user-vet-2',
      name: 'Dr. Martín Morales',
      email: 'martin@apexvet.com',
      password: defaultPassword,
      phone: '+593 99 888 9999',
      role: 'VETERINARIAN',
      tenantId: tenantCentral.id,
    },
  });

  // 3. Veterinarios
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

  // 4. Categorías de Productos
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

  // 5. Servicios Clínicos (compartidos o con tenantId)
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
      tenantId: tenantNorte.id,
    },
    {
      id: 'srv-vacunacion',
      name: 'Plan de Vacunación Integral',
      slug: 'vacunacion-integral',
      description: 'Inmunización con biológicos de alta calidad. Incluye evaluación previa de aptitud y carnet oficial.',
      durationMinutes: 25,
      price: 30.0,
      compatibleSpecies: JSON.stringify(['DOG', 'CAT']),
      requiresVeterinarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
      tenantId: tenantNorte.id,
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
      tenantId: tenantCentral.id,
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
      tenantId: tenantCentral.id,
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
      tenantId: tenantNorte.id,
    },
  ];

  for (const srv of services) {
    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: srv,
      create: srv,
    });
  }

  // 6. Productos del Catálogo
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
      tenantId: tenantNorte.id,
      isFeatured: true,
    },
    {
      id: 'prod-royal-felino',
      sku: 'ROY-CAT-002',
      name: 'Royal Canin Feline Health Nutrition Indoor 4kg',
      slug: 'royal-canin-indoor-4kg',
      description: 'Alimento formulado para gatos adultos sedentarios de interior. Ayuda a reducir el olor de las heces.',
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
      tenantId: tenantNorte.id,
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
      tenantId: tenantCentral.id,
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

  // 7. Mascotas demo
  const pet1 = await prisma.pet.upsert({
    where: { id: 'pet-demo-1' },
    update: { tenantId: tenantNorte.id },
    create: {
      id: 'pet-demo-1',
      ownerId: clientUser.id,
      tenantId: tenantNorte.id,
      name: 'Apolo',
      species: 'DOG',
      breed: 'Golden Retriever',
      birthDate: new Date('2021-04-10T00:00:00Z'),
      weightKg: 31.5,
      sex: 'MALE',
      microchip: 'CHIP-EC-99302194',
      notes: 'Mascota muy activa y sociable. Alérgica al polen en primavera.',
      avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const pet2 = await prisma.pet.upsert({
    where: { id: 'pet-demo-2' },
    update: { tenantId: tenantCentral.id },
    create: {
      id: 'pet-demo-2',
      ownerId: clientUser.id,
      tenantId: tenantCentral.id,
      name: 'Misha',
      species: 'CAT',
      breed: 'Siamés',
      birthDate: new Date('2022-08-15T00:00:00Z'),
      weightKg: 4.2,
      sex: 'FEMALE',
      microchip: 'CHIP-EC-88129034',
      notes: 'Tranquila, de interior exclusivamente.',
      avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('✅ Mascotas creadas:', pet1.name, '|', pet2.name);
  console.log('🎉 Siembra Multi-Tenant de ApexVeterinario finalizada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
