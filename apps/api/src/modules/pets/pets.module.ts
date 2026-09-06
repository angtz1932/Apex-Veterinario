import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { PrismaPetRepository } from './prisma-pet.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaPetRepository, PrismaService],
  exports: [PetsService, PrismaPetRepository],
})
export class PetsModule {}
