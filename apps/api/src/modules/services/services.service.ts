import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServiceRepository } from './prisma-service.repository';
import { ServiceDTO } from '@apex/shared';

@Injectable()
export class ServicesService {
  constructor(private readonly serviceRepo: PrismaServiceRepository) {}

  async listServices(): Promise<ServiceDTO[]> {
    return this.serviceRepo.findAll();
  }

  async getServiceById(id: string): Promise<ServiceDTO> {
    const service = await this.serviceRepo.findById(id);
    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return service;
  }
}
