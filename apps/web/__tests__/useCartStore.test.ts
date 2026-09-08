import { useCartStore } from '../src/stores/useCartStore';

// Mock para zustand/middleware persist (no necesita localStorage en tests)
jest.mock('zustand/middleware', () => ({
  persist: (fn: Function) => fn,
}));

describe('useCartStore – multi-tenant', () => {
  beforeEach(() => {
    useCartStore.setState({
      tenantId: '',
      items: [],
      couponCode: '',
      isDrawerOpen: false,
    });
  });

  it('setTenant limpia el carrito al cambiar de tenant', () => {
    useCartStore.getState().setTenant('clinica1');
    useCartStore.setState({ items: [{ id: '1' } as any] });

    useCartStore.getState().setTenant('clinica2');

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().tenantId).toBe('clinica2');
  });

  it('setTenant NO limpia el carrito si el tenant es el mismo', () => {
    useCartStore.getState().setTenant('clinica1');
    useCartStore.setState({ items: [{ id: '1' } as any] });

    useCartStore.getState().setTenant('clinica1');

    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('getItemCount devuelve 0 con carrito vacio', () => {
    expect(useCartStore.getState().getItemCount()).toBe(0);
  });

  it('clearCart vacia los items y el cupon', () => {
    useCartStore.setState({ items: [{ id: '1', quantity: 2 } as any], couponCode: 'TEST' });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().couponCode).toBe('');
  });
});
