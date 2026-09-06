import { BillableItem } from '../domain/billable-item.abstract';
import { PhysicalProduct } from '../domain/physical-product.entity';
import { VeterinaryService } from '../domain/veterinary-service.entity';

export interface IDiscountStrategy {
  calculateDiscount(items: BillableItem[], couponCode?: string): number;
}

export class ComboCareDiscountStrategy implements IDiscountStrategy {
  /**
   * Promoción "Cuidado Integral": 10% de descuento en servicios si compras un producto físico en la misma orden
   */
  public calculateDiscount(items: BillableItem[], couponCode?: string): number {
    let discount = 0;

    const hasProduct = items.some((item) => item instanceof PhysicalProduct);
    const services = items.filter(
      (item): item is VeterinaryService => item instanceof VeterinaryService,
    );

    if (hasProduct && services.length > 0) {
      const servicesSubtotal = services.reduce((sum, s) => sum + s.unitPrice, 0);
      discount += Number((servicesSubtotal * 0.1).toFixed(2));
    }

    if (couponCode && couponCode.toUpperCase() === 'APEXBIENVENIDO') {
      const totalSubtotal = items.reduce((sum, i) => sum + i.unitPrice, 0);
      discount += Number((totalSubtotal * 0.15).toFixed(2));
    }

    return Number(discount.toFixed(2));
  }
}
