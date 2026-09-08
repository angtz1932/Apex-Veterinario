import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO, CartItem } from '@apex/shared';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('calculate')
  calculateCart(
    @Body() body: { items: CartItem[]; couponCode?: string },
  ) {
    return this.ordersService.calculateCart(body.items, body.couponCode);
  }

  @Post('checkout')
  checkout(@Body() dto: CreateOrderDTO, @TenantId() tenantId: string) {
    return this.ordersService.checkout(dto, tenantId);
  }

  @Get()
  listOrders(@TenantId() tenantId: string) {
    return this.ordersService.listOrders(tenantId);
  }

  @Get(':idOrNumber')
  getOrder(@Param('idOrNumber') idOrNumber: string, @TenantId() _tenantId: string) {
    return this.ordersService.getOrder(idOrNumber);
  }

  @Post(':id/pay')
  payOrder(
    @Param('id') id: string,
    @Body() body: { method: string; transactionId?: string },
    @TenantId() _tenantId: string,
  ) {
    return this.ordersService.processPayment(id, body);
  }

  @Post('webhook')
  handleWebhook(@Body() event: any) {
    return this.ordersService.handlePaymentWebhook(event);
  }
}
