import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../core/repositories/order.repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  OrderDTO,
  CreateOrderDTO,
  OrderStatus,
  PaymentStatus,
  BillableType,
  OrderItemDTO,
} from '@apex/shared';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDTO(order: any): OrderDTO {
    let address = undefined;
    try {
      address =
        typeof order.shippingAddress === 'string'
          ? JSON.parse(order.shippingAddress)
          : order.shippingAddress;
    } catch {
      address = undefined;
    }

    const items: OrderItemDTO[] = (order.items || []).map((it: any) => ({
      id: it.id,
      billableType: it.billableType as BillableType,
      title: it.title,
      sku: it.sku || undefined,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      totalPrice: it.totalPrice,
      productId: it.productId || undefined,
      serviceId: it.serviceId || undefined,
      appointmentId: it.appointmentId || undefined,
    }));

    const hasPhysical = items.some(
      (i) => i.billableType === BillableType.PHYSICAL_PRODUCT,
    );
    const hasServices = items.some(
      (i) => i.billableType === BillableType.VETERINARY_SERVICE,
    );

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId || undefined,
      status: order.status as OrderStatus,
      paymentStatus: order.paymentStatus as PaymentStatus,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      hasPhysicalProducts: hasPhysical,
      hasServices: hasServices,
      shippingAddress: address,
      items,
      createdAt: order.createdAt.toISOString(),
    };
  }

  async create(
    orderData: CreateOrderDTO,
    calculations: {
      subtotal: number;
      shippingCost: number;
      discount: number;
      total: number;
    },
  ): Promise<OrderDTO> {
    const orderNumber = `APX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const created = await this.prisma.order.create({
      data: {
        orderNumber,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        subtotal: calculations.subtotal,
        shippingCost: calculations.shippingCost,
        discount: calculations.discount,
        total: calculations.total,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress
          ? JSON.stringify(orderData.shippingAddress)
          : null,
        items: {
          create: orderData.items.map((item) => ({
            billableType: item.billableType,
            title: item.title,
            sku: (item as any).sku || null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: Number((item.unitPrice * item.quantity).toFixed(2)),
            productId: (item as any).productId || null,
            serviceId: (item as any).serviceId || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapToDTO(created);
  }

  async findById(id: string): Promise<OrderDTO | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return order ? this.mapToDTO(order) : null;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDTO | null> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    return order ? this.mapToDTO(order) : null;
  }

  async findAllByUser(userId: string): Promise<OrderDTO[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => this.mapToDTO(o));
  }
}
