import { OrderDTO, CreateOrderDTO } from '@apex/shared';

export interface IOrderRepository {
  create(orderData: CreateOrderDTO, calculations: { subtotal: number; shippingCost: number; discount: number; total: number }): Promise<OrderDTO>;
  findById(id: string): Promise<OrderDTO | null>;
  findByOrderNumber(orderNumber: string): Promise<OrderDTO | null>;
  findAllByUser(userId: string): Promise<OrderDTO[]>;
}
