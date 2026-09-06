import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaAppointmentRepository } from './prisma-appointment.repository';
import { PrismaServiceRepository } from '../services/prisma-service.repository';
import { PrismaPetRepository } from '../pets/prisma-pet.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    PrismaAppointmentRepository,
    PrismaServiceRepository,
    PrismaPetRepository,
    PrismaService,
  ],
  exports: [AppointmentsService, PrismaAppointmentRepository],
})
export class AppointmentsModule {}
