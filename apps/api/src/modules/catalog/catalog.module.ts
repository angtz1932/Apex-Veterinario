import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { PrismaProductRepository } from './prisma-product.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PrismaProductRepository, PrismaService],
  exports: [CatalogService, PrismaProductRepository],
})
export class CatalogModule {}
