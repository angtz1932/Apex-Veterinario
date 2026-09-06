import { BillableType, Species, Sex, AppointmentStatus, OrderStatus, PaymentStatus, UserRole } from '../enums';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface VeterinarianDTO {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  bio?: string;
  avatarUrl?: string;
  availableDays: number[]; // 0=Sunday, 1=Monday, etc.
  startHour: number; // 9 = 09:00
  endHour: number; // 18 = 18:00
}

export interface PetDTO {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string;
  weightKg: number;
  sex: Sex;
  microchip?: string;
  notes?: string;
  avatarUrl?: string;
  ageFormatted?: string;
  medicalRecords?: MedicalRecordDTO[];
  vaccinations?: VaccinationDTO[];
}

export interface MedicalRecordDTO {
  id: string;
  petId: string;
  veterinarianId: string;
  veterinarianName?: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

export interface VaccinationDTO {
  id: string;
  petId: string;
  vaccineName: string;
  administeredAt: string;
  nextDueDate?: string;
  batchNumber?: string;
  notes?: string;
}

export interface ProductCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductVariantDTO {
  id: string;
  productId: string;
  name: string;
  sku: string;
  presentation: string; // e.g. "3 kg", "15 kg", "Pack 30 tabletas"
  price: number;
  stock: number;
}

export interface ProductDTO {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  brand: string;
  weightKg: number;
  images: string[];
  compatibleSpecies: Species[];
  categoryId: string;
  category?: ProductCategoryDTO;
  variants?: ProductVariantDTO[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  compatibleSpecies: Species[];
  requiresVeterinarian: boolean;
  imageUrl?: string;
  isActive: boolean;
}

export interface AppointmentSlotDTO {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  startTime: string; // ISO String
  endTime: string; // ISO String
  available: boolean;
  veterinarianId?: string;
}

export interface AppointmentDTO {
  id: string;
  petId: string;
  petName?: string;
  petSpecies?: Species;
  serviceId: string;
  serviceName?: string;
  veterinarianId?: string;
  veterinarianName?: string;
  scheduledAt: string;
  endAt: string;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
}

// Cart Item Models (Mixed Cart Abstraction)
export interface BaseCartItem {
  id: string; // Unique cart line item ID
  billableType: BillableType;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface ProductCartItem extends BaseCartItem {
  billableType: BillableType.PHYSICAL_PRODUCT;
  productId: string;
  variantId?: string;
  sku: string;
  imageUrl?: string;
  weightKg: number;
  stockAvailable: number;
}

export interface ServiceCartItem extends BaseCartItem {
  billableType: BillableType.VETERINARY_SERVICE;
  serviceId: string;
  durationMinutes: number;
  petId: string;
  petName: string;
  petSpecies: Species;
  veterinarianId?: string;
  veterinarianName?: string;
  scheduledAt: string; // ISO Date String
  timeSlot: string; // e.g. "10:30"
}

export type CartItem = ProductCartItem | ServiceCartItem;

export interface CartCalculation {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  hasPhysicalProducts: boolean;
  hasServices: boolean;
  totalWeightKg: number;
}

export interface AddressDTO {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  additionalInfo?: string;
}

export interface CreateOrderDTO {
  items: CartItem[];
  shippingAddress?: AddressDTO;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'CASH_ON_DELIVERY';
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}

export interface OrderItemDTO {
  id: string;
  billableType: BillableType;
  title: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productId?: string;
  serviceId?: string;
  appointmentId?: string;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  hasPhysicalProducts: boolean;
  hasServices: boolean;
  shippingAddress?: AddressDTO;
  items: OrderItemDTO[];
  createdAt: string;
}
