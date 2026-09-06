import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaOrderRepository } from './prisma-order.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [AppointmentsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaOrderRepository, PrismaService],
  exports: [OrdersService, PrismaOrderRepository],
})
export class OrdersModule {}
