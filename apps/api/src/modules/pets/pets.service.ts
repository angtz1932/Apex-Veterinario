import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaPetRepository } from './prisma-pet.repository';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetDTO, MedicalRecordDTO, VaccinationDTO } from '@apex/shared';

@Injectable()
export class PetsService {
  // Mock customer default ID for demo purposes when not logged in
  private readonly defaultOwnerId = 'user-demo-client-1';

  constructor(private readonly petRepo: PrismaPetRepository) {}

  async listPets(ownerId?: string): Promise<PetDTO[]> {
    return this.petRepo.findAllByOwner(ownerId || this.defaultOwnerId);
  }

  async getPetById(id: string): Promise<PetDTO> {
    const pet = await this.petRepo.findById(id);
    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    return pet;
  }

  async createPet(dto: CreatePetDto): Promise<PetDTO> {
    return this.petRepo.create({
      ownerId: dto.ownerId || this.defaultOwnerId,
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      birthDate: dto.birthDate,
      weightKg: dto.weightKg,
      sex: dto.sex,
      microchip: dto.microchip,
      notes: dto.notes,
    });
  }

  async addMedicalRecord(data: Omit<MedicalRecordDTO, 'id'>): Promise<MedicalRecordDTO> {
    return this.petRepo.addMedicalRecord(data);
  }

  async addVaccination(data: Omit<VaccinationDTO, 'id'>): Promise<VaccinationDTO> {
    return this.petRepo.addVaccination(data);
  }
}
