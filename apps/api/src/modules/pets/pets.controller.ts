import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  async getPets(@TenantId() _tenantId: string, @Query('ownerId') ownerId?: string) {
    return this.petsService.listPets(ownerId);
  }

  @Get(':id')
  async getPetById(@Param('id') id: string, @TenantId() _tenantId: string) {
    return this.petsService.getPetById(id);
  }

  @Post()
  async createPet(@Body() dto: CreatePetDto, @TenantId() _tenantId: string) {
    return this.petsService.createPet(dto);
  }

  @Post(':id/medical-records')
  async addMedicalRecord(
    @Param('id') petId: string,
    @Body() body: any,
    @TenantId() _tenantId: string,
  ) {
    return this.petsService.addMedicalRecord({ ...body, petId });
  }

  @Post(':id/vaccinations')
  async addVaccination(
    @Param('id') petId: string,
    @Body() body: any,
    @TenantId() _tenantId: string,
  ) {
    return this.petsService.addVaccination({ ...body, petId });
  }
}
