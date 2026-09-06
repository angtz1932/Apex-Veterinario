import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
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

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 ApexVeterinario Backend iniciado en: http://localhost:${port}/api`);
}

bootstrap();
