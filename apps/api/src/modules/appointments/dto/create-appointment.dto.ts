import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'La mascota es obligatoria para agendar' })
  petId: string;

  @IsString()
  @IsNotEmpty({ message: 'El servicio clínico es obligatorio' })
  serviceId: string;

  @IsString()
  @IsOptional()
  veterinarianId?: string;

  @IsDateString({}, { message: 'La fecha debe tener un formato ISO válido' })
  @IsNotEmpty({ message: 'La fecha y hora de la cita es obligatoria' })
  scheduledAt: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
