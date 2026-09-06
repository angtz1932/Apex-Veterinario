import { AppointmentDTO, AppointmentSlotDTO, VeterinarianDTO } from '@apex/shared';

export interface IAppointmentRepository {
  create(data: {
    petId: string;
    serviceId: string;
    veterinarianId?: string;
    scheduledAt: Date;
    endAt: Date;
    notes?: string;
    totalPrice: number;
  }): Promise<AppointmentDTO>;

  findUpcoming(userId?: string): Promise<AppointmentDTO[]>;
  findByPetId(petId: string): Promise<AppointmentDTO[]>;
  isSlotOccupied(veterinarianId: string, startTime: Date, endTime: Date): Promise<boolean>;
  getAvailableVeterinarians(serviceId?: string): Promise<VeterinarianDTO[]>;
  getSlotsForDate(veterinarianId: string, date: string, durationMinutes: number): Promise<AppointmentSlotDTO[]>;
}
