import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(dto);
  }

  @Get('upcoming')
  async getUpcoming(@Query('userId') userId?: string) {
    return this.appointmentsService.getUpcomingAppointments(userId);
  }

  @Get('veterinarians')
  async getVeterinarians(@Query('serviceId') serviceId?: string) {
    return this.appointmentsService.getVeterinarians(serviceId);
  }

  @Get('slots')
  async getSlots(
    @Query('veterinarianId') veterinarianId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
  ) {
    return this.appointmentsService.getAvailableSlots(veterinarianId, date, serviceId);
  }

  @Get('pet/:petId')
  async getByPet(@Param('petId') petId: string) {
    return this.appointmentsService.getPetAppointments(petId);
  }
}
