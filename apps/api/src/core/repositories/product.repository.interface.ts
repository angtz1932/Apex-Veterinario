import { ProductDTO, ProductCategoryDTO } from '@apex/shared';

export interface IProductRepository {
  findAll(filters?: {
    categoryId?: string;
    species?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: ProductDTO[]; total: number }>;

  findById(id: string): Promise<ProductDTO | null>;
  findBySku(sku: string): Promise<ProductDTO | null>;
  findCategories(): Promise<ProductCategoryDTO[]>;
}
