import { Controller, Get, Post, Patch, Body, Query, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { AppointmentStatus } from '@apex/shared';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(
    @Body() dto: CreateAppointmentDto,
    @TenantId() tenantId: string,
  ) {
    return this.appointmentsService.createAppointment({ ...dto, tenantId });
  }

  @Get('stats')
  async getStats(@TenantId() tenantId: string) {
    return this.appointmentsService.getClinicStats(tenantId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @TenantId() _tenantId: string,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, status);
  }

  @Get('upcoming')
  async getUpcoming(@TenantId() _tenantId: string, @Query('userId') userId?: string) {
    return this.appointmentsService.getUpcomingAppointments(userId);
  }

  @Get('veterinarians')
  async getVeterinarians(@TenantId() _tenantId: string, @Query('serviceId') serviceId?: string) {
    return this.appointmentsService.getVeterinarians(serviceId);
  }

  @Get('slots')
  async getSlots(
    @Query('veterinarianId') veterinarianId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
    @TenantId() _tenantId: string,
  ) {
    return this.appointmentsService.getAvailableSlots(veterinarianId, date, serviceId);
  }

  @Get('pet/:petId')
  async getByPet(@Param('petId') petId: string, @TenantId() _tenantId: string) {
    return this.appointmentsService.getPetAppointments(petId);
  }
}
