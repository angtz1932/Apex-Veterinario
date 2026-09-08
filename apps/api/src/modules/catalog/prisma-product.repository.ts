import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../core/repositories/product.repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ProductDTO, ProductCategoryDTO, Species } from '@apex/shared';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDTO(product: any): ProductDTO {
    let images: string[] = [];
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
    } catch {
      images = [product.images || ''];
    }

    let compatibleSpecies: Species[] = [];
    try {
      compatibleSpecies =
        typeof product.compatibleSpecies === 'string'
          ? JSON.parse(product.compatibleSpecies)
          : product.compatibleSpecies || [];
    } catch {
      compatibleSpecies = [Species.DOG, Species.CAT];
    }

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
      brand: product.brand,
      weightKg: product.weightKg,
      images,
      compatibleSpecies,
      categoryId: product.categoryId,
      category: product.category,
      variants: product.variants,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    };
  }

  async findAll(filters?: {
    categoryId?: string;
    species?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: ProductDTO[]; total: number }> {
    const where: any = { isActive: true };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.featured !== undefined) {
      where.isFeatured = filters.featured;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { brand: { contains: filters.search } },
      ];
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    let products = items.map((item) => this.mapToDTO(item));

    if (filters?.species) {
      products = products.filter((p) =>
        p.compatibleSpecies.includes(filters.species as Species),
      );
    }

    return { products, total };
  }

  async findById(id: string): Promise<ProductDTO | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });

    return product ? this.mapToDTO(product) : null;
  }

  async findBySku(sku: string): Promise<ProductDTO | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        category: true,
        variants: true,
      },
    });

    return product ? this.mapToDTO(product) : null;
  }

  async findCategories(): Promise<ProductCategoryDTO[]> {
    return this.prisma.productCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async updateStock(id: string, stock: number): Promise<ProductDTO | null> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock },
      include: {
        category: true,
        variants: true,
      },
    });
    return product ? this.mapToDTO(product) : null;
  }
}
