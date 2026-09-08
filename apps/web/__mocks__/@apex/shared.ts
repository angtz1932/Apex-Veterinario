// Mock de @apex/shared para Jest y TypeScript
export enum BillableType {
  PHYSICAL_PRODUCT = 'PHYSICAL_PRODUCT',
  VETERINARY_SERVICE = 'VETERINARY_SERVICE',
}

export interface CartItem {
  id: string;
  billableType: BillableType;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface ProductCartItem extends CartItem {
  billableType: BillableType.PHYSICAL_PRODUCT;
  productId: string;
  sku: string;
  weightKg: number;
  stockAvailable: number;
  imageUrl: string;
}

export interface ServiceCartItem extends CartItem {
  billableType: BillableType.VETERINARY_SERVICE;
  serviceId: string;
  duration: number;
}

export interface CartCalculation {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  hasPhysicalProducts: boolean;
  hasServices: boolean;
  totalWeightKg: number;
}

export interface PetDTO {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weightKg?: number;
  avatarUrl?: string;
}

export interface ServiceDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export interface VeterinarianDTO {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

export interface AppointmentSlotDTO {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    title: string;
    unitPrice: number;
    totalPrice: number;
    quantity: number;
    billableType: BillableType;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}
