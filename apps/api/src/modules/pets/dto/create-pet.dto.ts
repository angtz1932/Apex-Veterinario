import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Species, Sex } from '@apex/shared';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la mascota es obligatorio' })
  name: string;

  @IsEnum(Species, { message: 'Especie no válida' })
  @IsNotEmpty()
  species: Species;

  @IsString()
  @IsNotEmpty({ message: 'La raza es obligatoria' })
  breed: string;

  @IsDateString({}, { message: 'Fecha de nacimiento no válida' })
  @IsNotEmpty()
  birthDate: string;

  @IsNumber({}, { message: 'El peso debe ser numérico' })
  @IsNotEmpty()
  weightKg: number;

  @IsEnum(Sex, { message: 'Sexo no válido' })
  @IsNotEmpty()
  sex: Sex;

  @IsString()
  @IsOptional()
  microchip?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;
}
