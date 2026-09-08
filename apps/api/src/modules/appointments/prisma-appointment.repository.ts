import { Injectable } from '@nestjs/common';
import { IAppointmentRepository } from '../../core/repositories/appointment.repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  AppointmentDTO,
  AppointmentSlotDTO,
  VeterinarianDTO,
  AppointmentStatus,
  Species,
} from '@apex/shared';

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDTO(item: any): AppointmentDTO {
    return {
      id: item.id,
      petId: item.petId,
      petName: item.pet?.name,
      petSpecies: item.pet?.species as Species,
      serviceId: item.serviceId,
      serviceName: item.service?.name,
      veterinarianId: item.veterinarianId || undefined,
      veterinarianName: item.veterinarian?.user?.name,
      scheduledAt: item.scheduledAt.toISOString(),
      endAt: item.endAt.toISOString(),
      status: item.status as AppointmentStatus,
      notes: item.notes || undefined,
      totalPrice: item.totalPrice,
    };
  }

  async create(data: {
    petId: string;
    serviceId: string;
    veterinarianId?: string;
    scheduledAt: Date;
    endAt: Date;
    notes?: string;
    totalPrice: number;
    tenantId?: string;
  }): Promise<AppointmentDTO> {
    let resolvedTenantId: string | null = null;
    if (data.tenantId && data.tenantId !== 'default') {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: data.tenantId } });
      if (tenant) resolvedTenantId = tenant.id;
    }

    const item = await this.prisma.appointment.create({
      data: {
        petId: data.petId,
        serviceId: data.serviceId,
        veterinarianId: data.veterinarianId,
        tenantId: resolvedTenantId,
        scheduledAt: data.scheduledAt,
        endAt: data.endAt,
        notes: data.notes,
        totalPrice: data.totalPrice,
        status: AppointmentStatus.CONFIRMED,
      },
      include: {
        pet: true,
        service: true,
        veterinarian: {
          include: { user: true },
        },
      },
    });

    return this.mapToDTO(item);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentDTO | null> {
    const item = await this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        pet: true,
        service: true,
        veterinarian: {
          include: { user: true },
        },
      },
    });
    return item ? this.mapToDTO(item) : null;
  }

  async getStats(tenantId?: string) {
    let resolvedTenantId: string | undefined = undefined;
    if (tenantId && tenantId !== 'default') {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantId } });
      if (tenant) resolvedTenantId = tenant.id;
    }

    const where = resolvedTenantId ? { tenantId: resolvedTenantId } : {};

    const [totalAppointments, confirmedCount, inProgressCount, completedCount, totalOrders] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.count({ where: { ...where, status: AppointmentStatus.CONFIRMED } }),
      this.prisma.appointment.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      this.prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.order.count({ where }),
    ]);

    return {
      totalAppointments,
      confirmedCount,
      inProgressCount,
      completedCount,
      totalOrders,
      tenantId: tenantId || 'default',
    };
  }

  async findUpcoming(userId?: string): Promise<AppointmentDTO[]> {
    const where: any = {
      scheduledAt: { gte: new Date() },
      status: { not: AppointmentStatus.CANCELLED },
    };

    if (userId) {
      where.pet = { ownerId: userId };
    }

    const list = await this.prisma.appointment.findMany({
      where,
      include: {
        pet: true,
        service: true,
        veterinarian: {
          include: { user: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return list.map((item) => this.mapToDTO(item));
  }

  async findByPetId(petId: string): Promise<AppointmentDTO[]> {
    const list = await this.prisma.appointment.findMany({
      where: { petId },
      include: {
        pet: true,
        service: true,
        veterinarian: {
          include: { user: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return list.map((item) => this.mapToDTO(item));
  }

  async isSlotOccupied(
    veterinarianId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        veterinarianId,
        status: { not: AppointmentStatus.CANCELLED },
        OR: [
          {
            // Nueva cita inicia durante una cita existente
            scheduledAt: { lte: startTime },
            endAt: { gt: startTime },
          },
          {
            // Nueva cita termina durante una cita existente
            scheduledAt: { lt: endTime },
            endAt: { gte: endTime },
          },
          {
            // Nueva cita abarca completamente una cita existente
            scheduledAt: { gte: startTime },
            endAt: { lte: endTime },
          },
        ],
      },
    });

    return conflict !== null;
  }

  async getAvailableVeterinarians(serviceId?: string): Promise<VeterinarianDTO[]> {
    const vets = await this.prisma.veterinarian.findMany({
      include: { user: true },
    });

    return vets.map((v) => {
      const days = (v.availableDays || '1,2,3,4,5,6')
        .split(',')
        .map((d) => parseInt(d.trim(), 10));

      return {
        id: v.id,
        userId: v.userId,
        name: v.user.name,
        email: v.user.email,
        specialty: v.specialty,
        licenseNumber: v.licenseNumber,
        bio: v.bio || undefined,
        avatarUrl: v.avatarUrl || undefined,
        availableDays: days,
        startHour: v.startHour,
        endHour: v.endHour,
      };
    });
  }

  async getSlotsForDate(
    veterinarianId: string,
    dateStr: string,
    durationMinutes: number = 30,
  ): Promise<AppointmentSlotDTO[]> {
    const vet = await this.prisma.veterinarian.findUnique({
      where: { id: veterinarianId },
    });

    if (!vet) return [];

    const targetDate = new Date(`${dateStr}T00:00:00`);
    const dayOfWeek = targetDate.getDay();

    const allowedDays = (vet.availableDays || '1,2,3,4,5,6')
      .split(',')
      .map((d) => parseInt(d.trim(), 10));

    if (!allowedDays.includes(dayOfWeek)) {
      return [];
    }

    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        veterinarianId,
        status: { not: AppointmentStatus.CANCELLED },
        scheduledAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    const slots: AppointmentSlotDTO[] = [];
    const now = new Date();

    for (let hour = vet.startHour; hour < vet.endHour; hour++) {
      for (let min = 0; min < 60; min += durationMinutes) {
        if (hour + (min + durationMinutes) / 60 > vet.endHour) continue;

        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const slotStart = new Date(`${dateStr}T${timeStr}:00`);
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

        const isPast = slotStart < now;
        const isOccupied = existingAppointments.some((app) => {
          return (
            (slotStart >= app.scheduledAt && slotStart < app.endAt) ||
            (slotEnd > app.scheduledAt && slotEnd <= app.endAt) ||
            (slotStart <= app.scheduledAt && slotEnd >= app.endAt)
          );
        });

        slots.push({
          date: dateStr,
          time: timeStr,
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          available: !isPast && !isOccupied,
          veterinarianId,
        });
      }
    }

    return slots;
  }
}
