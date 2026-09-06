export enum BillableType {
  PHYSICAL_PRODUCT = 'PHYSICAL_PRODUCT',
  VETERINARY_SERVICE = 'VETERINARY_SERVICE',
}

export enum Species {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RODENT = 'RODENT',
  OTHER = 'OTHER',
}

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum UserRole {
  CLIENT = 'CLIENT',
  VETERINARIAN = 'VETERINARIAN',
  ADMIN = 'ADMIN',
}
