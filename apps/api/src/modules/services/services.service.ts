import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServiceRepository } from './prisma-service.repository';
import { ServiceDTO } from '@apex/shared';

@Injectable()
export class ServicesService {
  constructor(private readonly serviceRepo: PrismaServiceRepository) {}

  async listServices(tenantId?: string): Promise<ServiceDTO[]> {
    return this.serviceRepo.findAll(tenantId);
  }

  async getServiceById(id: string, tenantId?: string): Promise<ServiceDTO> {
    const service = await this.serviceRepo.findById(id, tenantId);
    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return service;
  }
}
