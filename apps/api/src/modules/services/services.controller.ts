import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices(@TenantId() tenantId: string) {
    return this.servicesService.listServices(tenantId);
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.servicesService.getServiceById(id, tenantId);
  }
}
