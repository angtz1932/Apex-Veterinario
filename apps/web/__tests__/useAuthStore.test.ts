import { useAuthStore } from '../src/stores/useAuthStore';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: Function) => fn,
}));

describe('useAuthStore – multi-tenant auth', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it('inicia con estado de usuario nulo', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('setUser actualiza el usuario autenticado y su token', () => {
    const mockUser = {
      id: 'usr-1',
      name: 'Dr. Valeria',
      email: 'valeria@apexvet.com',
      role: 'VETERINARIAN' as const,
      tenantId: 'clinica-norte',
    };

    useAuthStore.getState().setUser(mockUser, 'mock-jwt-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('mock-jwt-token');
  });

  it('logout restablece el usuario y el token a null', () => {
    useAuthStore.setState({
      user: {
        id: 'usr-1',
        name: 'Test',
        email: 'test@test.com',
        role: 'CLIENT',
        tenantId: 'clinica-norte',
      },
      token: 'jwt',
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('clearError limpia el mensaje de error', () => {
    useAuthStore.setState({ error: 'Credenciales inválidas' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
