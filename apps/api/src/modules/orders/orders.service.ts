import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaOrderRepository } from './prisma-order.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AppointmentsService } from '../appointments/appointments.service';
import {
  CreateOrderDTO,
  OrderDTO,
  CartCalculation,
  CartItem,
  BillableType,
  ServiceCartItem,
  PaymentStatus,
} from '@apex/shared';
import { BillableItemFactory } from '../../core/factories/billable-item.factory';
import { StandardShippingStrategy } from '../../core/strategies/shipping.strategy';
import { ComboCareDiscountStrategy } from '../../core/strategies/discount.strategy';
import { PhysicalProduct } from '../../core/domain/physical-product.entity';

@Injectable()
export class OrdersService {
  private readonly shippingStrategy = new StandardShippingStrategy();
  private readonly discountStrategy = new ComboCareDiscountStrategy();

  constructor(
    private readonly orderRepo: PrismaOrderRepository,
    private readonly prisma: PrismaService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  public calculateCart(items: CartItem[], couponCode?: string): CartCalculation {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        shippingCost: 0,
        discount: 0,
        total: 0,
        hasPhysicalProducts: false,
        hasServices: false,
        totalWeightKg: 0,
      };
    }

    // Instanciar modelos de dominio polimórficos
    const billableItems = items.map((i) => BillableItemFactory.createFromCartItem(i));

    const subtotal = Number(
      billableItems
        .reduce((sum, item, idx) => sum + item.calculateTotal(items[idx].quantity), 0)
        .toFixed(2),
    );

    const shippingCost = this.shippingStrategy.calculate(billableItems);
    const discount = this.discountStrategy.calculateDiscount(billableItems, couponCode);
    const total = Number(Math.max(0, subtotal + shippingCost - discount).toFixed(2));

    const hasPhysicalProducts = billableItems.some((b) => b instanceof PhysicalProduct);
    const hasServices = billableItems.some((b) => !b.requiresShipping() && b.requiresScheduling());

    const totalWeightKg = billableItems
      .filter((b): b is PhysicalProduct => b instanceof PhysicalProduct)
      .reduce((sum, p) => sum + (p.weightKg || 1), 0);

    return {
      subtotal,
      shippingCost,
      discount,
      total,
      hasPhysicalProducts,
      hasServices,
      totalWeightKg: Number(totalWeightKg.toFixed(2)),
    };
  }

  async checkout(dto: CreateOrderDTO, tenantId?: string): Promise<OrderDTO> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El carrito está vacío. Agrega items antes de proceder.');
    }

    // 1. Instanciar y validar polimorfismo de dominio
    const billableItems = dto.items.map((i) => BillableItemFactory.createFromCartItem(i));
    const validationContext = {
      shippingAddressProvided: Boolean(dto.shippingAddress && dto.shippingAddress.street),
      customerEmail: dto.customerEmail,
    };

    for (const item of billableItems) {
      const validation = item.validateEligibility(validationContext);
      if (!validation.isValid) {
        throw new BadRequestException(validation.errors.join(' '));
      }
    }

    // 2. Validar y descontar stock de productos físicos
    for (const item of dto.items) {
      if (item.billableType === BillableType.PHYSICAL_PRODUCT) {
        const prod = await this.prisma.product.findUnique({
          where: { id: (item as any).productId },
        });

        if (!prod) {
          throw new NotFoundException(`Producto ${item.title} no encontrado.`);
        }

        if (prod.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para "${prod.name}". Disponible: ${prod.stock}, solicitado: ${item.quantity}.`,
          );
        }

        // Descontar inventario
        await this.prisma.product.update({
          where: { id: prod.id },
          data: { stock: prod.stock - item.quantity },
        });
      }
    }

    // 3. Crear citas clínicas correspondientes a los servicios veterinarios agendados
    for (const item of dto.items) {
      if (item.billableType === BillableType.VETERINARY_SERVICE) {
        const srvItem = item as ServiceCartItem;
        if (srvItem.petId && srvItem.scheduledAt) {
          await this.appointmentsService.createAppointment({
            petId: srvItem.petId,
            serviceId: srvItem.serviceId,
            veterinarianId: srvItem.veterinarianId,
            scheduledAt: srvItem.scheduledAt,
            notes: `Cita reservada mediante orden web por ${dto.customerName}`,
          });
        }
      }
    }

    // 4. Calcular importes con las Strategies
    const calculations = this.calculateCart(dto.items);

    // 5. Crear la orden de compra persistente
    return this.orderRepo.create(dto, calculations, tenantId);
  }

  async listOrders(tenantId?: string): Promise<OrderDTO[]> {
    return this.orderRepo.findAll(tenantId);
  }

  async getOrder(idOrNumber: string): Promise<OrderDTO> {
    let order = await this.orderRepo.findByOrderNumber(idOrNumber);
    if (!order) {
      order = await this.orderRepo.findById(idOrNumber);
    }
    if (!order) {
      throw new NotFoundException(`Orden ${idOrNumber} no encontrada`);
    }
    return order;
  }

  async processPayment(orderId: string, paymentDetails: { method: string; transactionId?: string }) {
    const order = await this.getOrder(orderId);
    if (!order) {
      throw new NotFoundException(`Orden ${orderId} no encontrada`);
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: paymentDetails.method,
      },
      include: { items: true },
    });

    return {
      success: true,
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
      paymentStatus: updated.paymentStatus,
      transactionId: paymentDetails.transactionId || `tx_${Date.now()}`,
      paidAt: new Date().toISOString(),
    };
  }

  async handlePaymentWebhook(event: { type: string; data: { orderId?: string; orderNumber?: string; status?: string } }) {
    const orderTarget = event?.data?.orderId || event?.data?.orderNumber;
    if (!orderTarget) {
      return { received: true, processed: false, reason: 'No order identifier' };
    }

    const order = await this.getOrder(orderTarget);
    if (!order) {
      throw new NotFoundException(`Orden ${orderTarget} no encontrada para webhook`);
    }

    if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
        },
      });
    }

    return { received: true, processed: true, orderId: order.id };
  }
}
