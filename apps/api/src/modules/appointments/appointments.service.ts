import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaAppointmentRepository } from './prisma-appointment.repository';
import { PrismaServiceRepository } from '../services/prisma-service.repository';
import { PrismaPetRepository } from '../pets/prisma-pet.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDTO, AppointmentSlotDTO, VeterinarianDTO, Species } from '@apex/shared';
import { VeterinaryService } from '../../core/domain/veterinary-service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepo: PrismaAppointmentRepository,
    private readonly serviceRepo: PrismaServiceRepository,
    private readonly petRepo: PrismaPetRepository,
  ) {}

  async createAppointment(dto: CreateAppointmentDto): Promise<AppointmentDTO> {
    // 1. Validar existencia del servicio clínico
    const service = await this.serviceRepo.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundException(`El servicio clínico ${dto.serviceId} no existe.`);
    }

    // 2. Validar existencia de la mascota
    const pet = await this.petRepo.findById(dto.petId);
    if (!pet) {
      throw new NotFoundException(`La mascota ${dto.petId} no fue encontrada.`);
    }

    // 3. Crear entidad de dominio para validar reglas de negocio
    const scheduledStart = new Date(dto.scheduledAt);
    const scheduledEnd = new Date(
      scheduledStart.getTime() + service.durationMinutes * 60000,
    );

    const domainService = new VeterinaryService(
      service.id,
      service.name,
      service.price,
      service.durationMinutes,
      service.compatibleSpecies,
      service.requiresVeterinarian,
      pet.id,
      dto.veterinarianId,
      scheduledStart,
    );

    const validation = domainService.validateEligibility({
      petSpecies: pet.species,
    });

    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(' '));
    }

    // 4. Validar disponibilidad del veterinario (evitar colisiones y doble reserva)
    if (dto.veterinarianId) {
      const isOccupied = await this.appointmentRepo.isSlotOccupied(
        dto.veterinarianId,
        scheduledStart,
        scheduledEnd,
      );

      if (isOccupied) {
        throw new ConflictException(
          'El horario seleccionado ya no está disponible para el veterinario elegido.',
        );
      }
    }

    // 5. Persistir cita
    return this.appointmentRepo.create({
      petId: dto.petId,
      serviceId: dto.serviceId,
      veterinarianId: dto.veterinarianId,
      scheduledAt: scheduledStart,
      endAt: scheduledEnd,
      notes: dto.notes,
      totalPrice: domainService.calculateTotal(1),
    });
  }

  async getUpcomingAppointments(userId?: string): Promise<AppointmentDTO[]> {
    return this.appointmentRepo.findUpcoming(userId);
  }

  async getPetAppointments(petId: string): Promise<AppointmentDTO[]> {
    return this.appointmentRepo.findByPetId(petId);
  }

  async getVeterinarians(serviceId?: string): Promise<VeterinarianDTO[]> {
    return this.appointmentRepo.getAvailableVeterinarians(serviceId);
  }

  async getAvailableSlots(
    veterinarianId: string,
    date: string,
    serviceId: string,
  ): Promise<AppointmentSlotDTO[]> {
    const service = await this.serviceRepo.findById(serviceId);
    const duration = service ? service.durationMinutes : 30;
    return this.appointmentRepo.getSlotsForDate(veterinarianId, date, duration);
  }
}
