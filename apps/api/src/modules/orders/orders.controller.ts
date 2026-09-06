import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO, CartItem } from '@apex/shared';

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
  checkout(@Body() dto: CreateOrderDTO) {
    return this.ordersService.checkout(dto);
  }

  @Get(':idOrNumber')
  getOrder(@Param('idOrNumber') idOrNumber: string) {
    return this.ordersService.getOrder(idOrNumber);
  }
}
