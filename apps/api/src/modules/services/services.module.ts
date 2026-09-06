import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaServiceRepository } from './prisma-service.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaServiceRepository, PrismaService],
  exports: [ServicesService, PrismaServiceRepository],
})
export class ServicesModule {}
