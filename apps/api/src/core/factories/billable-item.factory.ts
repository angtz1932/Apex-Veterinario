import { BillableType, CartItem, ProductCartItem, ServiceCartItem } from '@apex/shared';
import { BillableItem } from '../domain/billable-item.abstract';
import { PhysicalProduct } from '../domain/physical-product.entity';
import { VeterinaryService } from '../domain/veterinary-service.entity';

export class BillableItemFactory {
  public static createFromCartItem(item: CartItem): BillableItem {
    switch (item.billableType) {
      case BillableType.PHYSICAL_PRODUCT: {
        const prod = item as ProductCartItem;
        return new PhysicalProduct(
          prod.productId,
          prod.title,
          prod.unitPrice,
          prod.sku,
          prod.stockAvailable,
          prod.weightKg,
        );
      }

      case BillableType.VETERINARY_SERVICE: {
        const srv = item as ServiceCartItem;
        return new VeterinaryService(
          srv.serviceId,
          srv.title,
          srv.unitPrice,
          srv.durationMinutes,
          srv.petSpecies ? [srv.petSpecies] : [],
          true,
          srv.petId,
          srv.veterinarianId,
          srv.scheduledAt ? new Date(srv.scheduledAt) : undefined,
        );
      }

      default:
        throw new Error(`Tipo de item facturable no soportado: ${(item as any).billableType}`);
    }
  }
}
