import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PetsModule } from './modules/pets/pets.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CatalogModule,
    ServicesModule,
    AppointmentsModule,
    PetsModule,
    OrdersModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
