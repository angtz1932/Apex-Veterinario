import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CartItem,
  ProductCartItem,
  ServiceCartItem,
  BillableType,
  CartCalculation,
} from '@apex/shared';

interface CartStore {
  tenantId: string;
  items: CartItem[];
  isDrawerOpen: boolean;
  couponCode: string;

  // Tenant
  setTenant: (id: string) => void;

  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  addProduct: (
    product: {
      id: string;
      name: string;
      price: number;
      sku: string;
      images: string[];
      weightKg: number;
      stock: number;
    },
    quantity?: number,
  ) => void;
  addService: (serviceItem: Omit<ServiceCartItem, 'id' | 'billableType' | 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setCouponCode: (code: string) => void;
  clearCart: () => void;

  // Computed
  getCalculation: () => CartCalculation;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      tenantId: '',
      items: [],
      isDrawerOpen: false,
      couponCode: '',

      /** Cambia de tenant y limpia el carrito automaticamente. */
      setTenant: (id) => {
        const { tenantId } = get();
        if (tenantId !== id) {
          set({ tenantId: id, items: [], couponCode: '' });
        }
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addProduct: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.billableType === BillableType.PHYSICAL_PRODUCT &&
              (item as ProductCartItem).productId === product.id,
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex] as ProductCartItem;
            const newQty = Math.min(
              currentItem.quantity + quantity,
              product.stock || 99,
            );
            updatedItems[existingIndex] = { ...currentItem, quantity: newQty };
            return { items: updatedItems, isDrawerOpen: true };
          }

          const newItem: ProductCartItem = {
            id: `prod-cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            billableType: BillableType.PHYSICAL_PRODUCT,
            productId: product.id,
            title: product.name,
            sku: product.sku,
            unitPrice: product.price,
            quantity,
            weightKg: product.weightKg || 1,
            stockAvailable: product.stock,
            imageUrl: product.images?.[0] || '',
          };

          return { items: [...state.items, newItem], isDrawerOpen: true };
        });
      },

      addService: (serviceData) => {
        set((state) => {
          const newItem: ServiceCartItem = {
            ...serviceData,
            id: `srv-cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            billableType: BillableType.VETERINARY_SERVICE,
            quantity: 1,
          };
          return { items: [...state.items, newItem], isDrawerOpen: true };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) { get().removeItem(itemId); return; }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId && item.billableType === BillableType.PHYSICAL_PRODUCT) {
              const maxStock = (item as ProductCartItem).stockAvailable || 99;
              return { ...item, quantity: Math.min(quantity, maxStock) };
            }
            return item;
          }),
        }));
      },

      setCouponCode: (couponCode) => set({ couponCode }),

      clearCart: () => set({ items: [], couponCode: '' }),

      getCalculation: () => {
        const { items, couponCode } = get();

        const physicalItems = items.filter(
          (i): i is ProductCartItem => i.billableType === BillableType.PHYSICAL_PRODUCT,
        );
        const serviceItems = items.filter(
          (i): i is ServiceCartItem => i.billableType === BillableType.VETERINARY_SERVICE,
        );

        const subtotal = Number(
          items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2),
        );

        const subtotalPhysical = physicalItems.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
        const totalWeightKg = physicalItems.reduce(
          (sum, item) => sum + item.weightKg * item.quantity,
          0,
        );

        let shippingCost = 0;
        if (physicalItems.length > 0 && subtotalPhysical < 50) {
          shippingCost = Number((4.99 + totalWeightKg * 1.5).toFixed(2));
        }

        let discount = 0;
        if (physicalItems.length > 0 && serviceItems.length > 0) {
          const servicesSubtotal = serviceItems.reduce((sum, item) => sum + item.unitPrice, 0);
          discount += Number((servicesSubtotal * 0.1).toFixed(2));
        }
        if (couponCode.toUpperCase() === 'APEXBIENVENIDO') {
          discount += Number((subtotal * 0.15).toFixed(2));
        }

        const total = Number(Math.max(0, subtotal + shippingCost - discount).toFixed(2));

        return {
          subtotal,
          shippingCost,
          discount,
          total,
          hasPhysicalProducts: physicalItems.length > 0,
          hasServices: serviceItems.length > 0,
          totalWeightKg: Number(totalWeightKg.toFixed(2)),
        };
      },

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'apex_veterinario_cart',
      partialize: (state) => ({
        tenantId: state.tenantId,
        items: state.items,
        couponCode: state.couponCode,
      }),
    },
  ),
);
