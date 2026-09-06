import { ServiceDTO } from '@apex/shared';

export interface IServiceRepository {
  findAll(): Promise<ServiceDTO[]>;
  findById(id: string): Promise<ServiceDTO | null>;
  findBySlug(slug: string): Promise<ServiceDTO | null>;
}
