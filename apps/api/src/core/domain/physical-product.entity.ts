import { BillableType, Species } from '@apex/shared';
import { BillableItem, ValidationContext, ValidationResult } from './billable-item.abstract';

export class PhysicalProduct extends BillableItem {
  constructor(
    id: string,
    title: string,
    unitPrice: number,
    sku: string,
    public readonly stock: number,
    public readonly weightKg: number = 1.0,
    public readonly compatibleSpecies: Species[] = [],
    public readonly requiresPrescription: boolean = false,
  ) {
    super(id, title, unitPrice, BillableType.PHYSICAL_PRODUCT, sku);
  }

  public override requiresShipping(): boolean {
    return true;
  }

  public override requiresScheduling(): boolean {
    return false;
  }

  public override validateEligibility(context: ValidationContext): ValidationResult {
    const errors: string[] = [];

    if (this.stock <= 0) {
      errors.push(`El producto "${this.title}" no cuenta con stock disponible actualmente.`);
    }

    if (!context.shippingAddressProvided) {
      errors.push(`El producto "${this.title}" requiere una dirección de envío válida.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public hasAvailableStock(requestedQty: number): boolean {
    return this.stock >= requestedQty;
  }
}
