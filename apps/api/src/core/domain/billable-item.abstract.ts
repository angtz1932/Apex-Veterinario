import { BillableType } from '@apex/shared';

export interface ValidationContext {
  customerEmail?: string;
  petSpecies?: string;
  shippingAddressProvided?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export abstract class BillableItem {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly unitPrice: number,
    public readonly type: BillableType,
    public readonly sku?: string,
  ) {
    if (unitPrice < 0) {
      throw new Error('El precio unitario no puede ser negativo.');
    }
  }

  /**
   * Calcula el total de línea aplicando reglas polimórficas del item
   */
  public calculateTotal(quantity: number): number {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.');
    }
    return Number((this.unitPrice * quantity).toFixed(2));
  }

  /**
   * Determina si este item facturable requiere proceso de envío logístico y dirección física.
   */
  public abstract requiresShipping(): boolean;

  /**
   * Determina si este item requiere agendamiento clínico (fecha, hora, mascota, veterinario).
   */
  public abstract requiresScheduling(): boolean;

  /**
   * Valida la elegibilidad del item dentro del contexto de compra.
   */
  public abstract validateEligibility(context: ValidationContext): ValidationResult;
}
