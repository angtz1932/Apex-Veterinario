import { Injectable } from '@nestjs/common';
import { IPetRepository } from '../../core/repositories/pet.repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PetDTO, MedicalRecordDTO, VaccinationDTO, Species, Sex } from '@apex/shared';

@Injectable()
export class PrismaPetRepository implements IPetRepository {
  constructor(private readonly prisma: PrismaService) {}

  private calculateAge(birthDate: Date): string {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && now.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    return `${years} ${years === 1 ? 'año' : 'años'} ${months > 0 ? `${months} m` : ''}`.trim();
  }

  private mapToDTO(item: any): PetDTO {
    const birth = new Date(item.birthDate);
    return {
      id: item.id,
      ownerId: item.ownerId,
      name: item.name,
      species: item.species as Species,
      breed: item.breed,
      birthDate: birth.toISOString(),
      weightKg: item.weightKg,
      sex: item.sex as Sex,
      microchip: item.microchip || undefined,
      notes: item.notes || undefined,
      avatarUrl: item.avatarUrl || undefined,
      ageFormatted: this.calculateAge(birth),
      medicalRecords: item.medicalRecords?.map((m: any) => ({
        id: m.id,
        petId: m.petId,
        veterinarianId: m.veterinarianId,
        veterinarianName: m.veterinarian?.user?.name,
        visitDate: m.visitDate.toISOString(),
        diagnosis: m.diagnosis,
        treatment: m.treatment,
        notes: m.notes || undefined,
      })),
      vaccinations: item.vaccinations?.map((v: any) => ({
        id: v.id,
        petId: v.petId,
        vaccineName: v.vaccineName,
        administeredAt: v.administeredAt.toISOString(),
        nextDueDate: v.nextDueDate ? v.nextDueDate.toISOString() : undefined,
        batchNumber: v.batchNumber || undefined,
        notes: v.notes || undefined,
      })),
    };
  }

  async findAllByOwner(ownerId: string): Promise<PetDTO[]> {
    const pets = await this.prisma.pet.findMany({
      where: { ownerId },
      include: {
        medicalRecords: {
          include: {
            veterinarian: { include: { user: true } },
          },
          orderBy: { visitDate: 'desc' },
        },
        vaccinations: {
          orderBy: { administeredAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return pets.map((p) => this.mapToDTO(p));
  }

  async findById(id: string): Promise<PetDTO | null> {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        medicalRecords: {
          include: {
            veterinarian: { include: { user: true } },
          },
          orderBy: { visitDate: 'desc' },
        },
        vaccinations: {
          orderBy: { administeredAt: 'desc' },
        },
      },
    });

    return pet ? this.mapToDTO(pet) : null;
  }

  async create(data: Omit<PetDTO, 'id' | 'ageFormatted'>): Promise<PetDTO> {
    const created = await this.prisma.pet.create({
      data: {
        ownerId: data.ownerId,
        name: data.name,
        species: data.species,
        breed: data.breed,
        birthDate: new Date(data.birthDate),
        weightKg: data.weightKg,
        sex: data.sex,
        microchip: data.microchip,
        notes: data.notes,
        avatarUrl: data.avatarUrl,
      },
      include: {
        medicalRecords: true,
        vaccinations: true,
      },
    });

    return this.mapToDTO(created);
  }

  async update(id: string, data: Partial<PetDTO>): Promise<PetDTO> {
    const updateData: any = { ...data };
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }
    delete updateData.id;
    delete updateData.ageFormatted;
    delete updateData.medicalRecords;
    delete updateData.vaccinations;

    const updated = await this.prisma.pet.update({
      where: { id },
      data: updateData,
      include: {
        medicalRecords: true,
        vaccinations: true,
      },
    });

    return this.mapToDTO(updated);
  }

  async addMedicalRecord(data: Omit<MedicalRecordDTO, 'id'>): Promise<MedicalRecordDTO> {
    const record = await this.prisma.medicalRecord.create({
      data: {
        petId: data.petId,
        veterinarianId: data.veterinarianId,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        notes: data.notes,
      },
      include: {
        veterinarian: { include: { user: true } },
      },
    });

    return {
      id: record.id,
      petId: record.petId,
      veterinarianId: record.veterinarianId,
      veterinarianName: record.veterinarian.user.name,
      visitDate: record.visitDate.toISOString(),
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      notes: record.notes || undefined,
    };
  }

  async addVaccination(data: Omit<VaccinationDTO, 'id'>): Promise<VaccinationDTO> {
    const vax = await this.prisma.vaccination.create({
      data: {
        petId: data.petId,
        vaccineName: data.vaccineName,
        administeredAt: new Date(data.administeredAt),
        nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : undefined,
        batchNumber: data.batchNumber,
        notes: data.notes,
      },
    });

    return {
      id: vax.id,
      petId: vax.petId,
      vaccineName: vax.vaccineName,
      administeredAt: vax.administeredAt.toISOString(),
      nextDueDate: vax.nextDueDate ? vax.nextDueDate.toISOString() : undefined,
      batchNumber: vax.batchNumber || undefined,
      notes: vax.notes || undefined,
    };
  }
}
