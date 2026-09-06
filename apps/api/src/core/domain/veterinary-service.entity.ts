import { BillableType, Species } from '@apex/shared';
import { BillableItem, ValidationContext, ValidationResult } from './billable-item.abstract';

export class VeterinaryService extends BillableItem {
  constructor(
    id: string,
    title: string,
    unitPrice: number,
    public readonly durationMinutes: number,
    public readonly compatibleSpecies: Species[] = [],
    public readonly requiresVeterinarian: boolean = true,
    public readonly petId?: string,
    public readonly veterinarianId?: string,
    public readonly scheduledAt?: Date,
  ) {
    super(id, title, unitPrice, BillableType.VETERINARY_SERVICE);
  }

  public override requiresShipping(): boolean {
    return false;
  }

  public override requiresScheduling(): boolean {
    return true;
  }

  public override validateEligibility(context: ValidationContext): ValidationResult {
    const errors: string[] = [];

    if (!this.petId) {
      errors.push(`El servicio "${this.title}" requiere tener asignada una mascota.`);
    }

    if (!this.scheduledAt) {
      errors.push(`El servicio "${this.title}" debe tener una fecha y hora agendada.`);
    } else if (new Date(this.scheduledAt) < new Date()) {
      errors.push(`La fecha agendada para "${this.title}" no puede estar en el pasado.`);
    }

    if (this.requiresVeterinarian && !this.veterinarianId) {
      errors.push(`El servicio clínico "${this.title}" requiere un veterinario asignado.`);
    }

    if (context.petSpecies && this.compatibleSpecies.length > 0) {
      const isSpeciesCompatible = this.compatibleSpecies.includes(context.petSpecies as Species);
      if (!isSpeciesCompatible) {
        errors.push(
          `El servicio "${this.title}" no es compatible con la especie seleccionada (${context.petSpecies}).`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
