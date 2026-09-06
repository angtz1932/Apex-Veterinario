import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  async getCategories() {
    return this.catalogService.listCategories();
  }

  @Get('products')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('species') species?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.catalogService.listProducts({
      categoryId,
      species,
      search,
      featured: featured === 'true' ? true : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.catalogService.getProductById(id);
  }
}
