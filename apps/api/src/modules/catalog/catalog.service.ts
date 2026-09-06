import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProductRepository } from './prisma-product.repository';
import { ProductDTO, ProductCategoryDTO } from '@apex/shared';

@Injectable()
export class CatalogService {
  constructor(private readonly productRepo: PrismaProductRepository) {}

  async listProducts(filters?: {
    categoryId?: string;
    species?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: ProductDTO[]; total: number }> {
    return this.productRepo.findAll(filters);
  }

  async getProductById(id: string): Promise<ProductDTO> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async listCategories(): Promise<ProductCategoryDTO[]> {
    return this.productRepo.findCategories();
  }
}
