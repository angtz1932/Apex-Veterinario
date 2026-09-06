import { BillableItem } from '../domain/billable-item.abstract';
import { PhysicalProduct } from '../domain/physical-product.entity';

export interface IShippingStrategy {
  calculate(items: BillableItem[], destinationPostalCode?: string): number;
}

export class StandardShippingStrategy implements IShippingStrategy {
  private readonly baseFee = 4.99;
  private readonly costPerKg = 1.5;
  private readonly freeShippingThreshold = 50.0;

  public calculate(items: BillableItem[], destinationPostalCode?: string): number {
    // Solo los PhysicalProduct requieren despacho y aportan peso
    const physicalItems = items.filter(
      (item): item is PhysicalProduct => item instanceof PhysicalProduct && item.requiresShipping(),
    );

    // Si no hay productos físicos (ej: solo servicios clínicos), el costo de envío es 0
    if (physicalItems.length === 0) {
      return 0.0;
    }

    const subtotalPhysical = physicalItems.reduce(
      (sum, item) => sum + item.unitPrice,
      0,
    );

    // Envío gratuito si supera el umbral
    if (subtotalPhysical >= this.freeShippingThreshold) {
      return 0.0;
    }

    const totalWeight = physicalItems.reduce(
      (sum, item) => sum + (item.weightKg || 1),
      0,
    );

    const calculated = this.baseFee + totalWeight * this.costPerKg;
    return Number(calculated.toFixed(2));
  }
}

export class ExpressShippingStrategy implements IShippingStrategy {
  private readonly expressBaseFee = 9.99;
  private readonly costPerKg = 2.5;

  public calculate(items: BillableItem[]): number {
    const physicalItems = items.filter(
      (item): item is PhysicalProduct => item instanceof PhysicalProduct && item.requiresShipping(),
    );

    if (physicalItems.length === 0) return 0.0;

    const totalWeight = physicalItems.reduce((sum, item) => sum + (item.weightKg || 1), 0);
    return Number((this.expressBaseFee + totalWeight * this.costPerKg).toFixed(2));
  }
}
