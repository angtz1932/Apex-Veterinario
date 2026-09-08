import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalErrorHandler } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('ApexVeterinarioAPI');
  const app = await NestFactory.create(AppModule);

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  // CORS habilitado para frontend Next.js
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Validación global estricta de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Manejo centralizado de excepciones
  app.useGlobalFilters(new GlobalErrorHandler());

  // Configuración Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('ApexVeterinario API')
    .setDescription('API REST Multi-Tenant para clínicas veterinarias (Auth, Catálogo, Citas, Mascotas, Órdenes y Pagos)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-tenant-id', in: 'header' }, 'x-tenant-id')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 ApexVeterinario Backend iniciado en: http://localhost:${port}/api`);
  logger.log(`📚 Documentación Swagger interactiva en: http://localhost:${port}/api/docs`);
}

bootstrap();
