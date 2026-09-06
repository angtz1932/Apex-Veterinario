import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  async getPets(@Query('ownerId') ownerId?: string) {
    return this.petsService.listPets(ownerId);
  }

  @Get(':id')
  async getPetById(@Param('id') id: string) {
    return this.petsService.getPetById(id);
  }

  @Post()
  async createPet(@Body() dto: CreatePetDto) {
    return this.petsService.createPet(dto);
  }

  @Post(':id/medical-records')
  async addMedicalRecord(
    @Param('id') petId: string,
    @Body() body: { veterinarianId: string; diagnosis: string; treatment: string; notes?: string; visitDate?: string },
  ) {
    return this.petsService.addMedicalRecord({
      petId,
      veterinarianId: body.veterinarianId,
      visitDate: body.visitDate || new Date().toISOString(),
      diagnosis: body.diagnosis,
      treatment: body.treatment,
      notes: body.notes,
    });
  }

  @Post(':id/vaccinations')
  async addVaccination(
    @Param('id') petId: string,
    @Body() body: { vaccineName: string; administeredAt?: string; nextDueDate?: string; batchNumber?: string; notes?: string },
  ) {
    return this.petsService.addVaccination({
      petId,
      vaccineName: body.vaccineName,
      administeredAt: body.administeredAt || new Date().toISOString(),
      nextDueDate: body.nextDueDate,
      batchNumber: body.batchNumber,
      notes: body.notes,
    });
  }
}
