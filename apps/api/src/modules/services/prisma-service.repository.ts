import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../core/repositories/service.repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ServiceDTO, Species } from '@apex/shared';

@Injectable()
export class PrismaServiceRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDTO(service: any): ServiceDTO {
    let compatibleSpecies: Species[] = [];
    try {
      compatibleSpecies =
        typeof service.compatibleSpecies === 'string'
          ? JSON.parse(service.compatibleSpecies)
          : service.compatibleSpecies || [];
    } catch {
      compatibleSpecies = [Species.DOG, Species.CAT];
    }

    return {
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price,
      compatibleSpecies,
      requiresVeterinarian: service.requiresVeterinarian,
      imageUrl: service.imageUrl,
      isActive: service.isActive,
    };
  }

  async findAll(_tenantId?: string): Promise<ServiceDTO[]> {
    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    return services.map((s) => this.mapToDTO(s));
  }

  async findById(id: string, _tenantId?: string): Promise<ServiceDTO | null> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    return service ? this.mapToDTO(service) : null;
  }

  async findBySlug(slug: string, _tenantId?: string): Promise<ServiceDTO | null> {
    const service = await this.prisma.service.findUnique({
      where: { slug },
    });
    return service ? this.mapToDTO(service) : null;
  }
}
