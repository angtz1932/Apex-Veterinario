'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiClient } from '@/lib/api-client';
import { CreateOrderDTO, OrderDTO, BillableType } from '@apex/shared';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Calendar,
  Package,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams<{ tenant?: string }>();
  const tenant = params?.tenant;
  const { user } = useAuthStore();

  const { items, getCalculation, clearCart } = useCartStore();
  const calculation = getCalculation();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'authorizing' | 'success'>('authorizing');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-Ship Subscriptions State
  const [isAutoShip, setIsAutoShip] = useState(false);
  const [autoShipFrequency, setAutoShipFrequency] = useState<'30' | '60' | '90'>('30');
  const autoShipDiscount = isAutoShip && calculation.hasPhysicalProducts ? calculation.subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, calculation.total - autoShipDiscount);

  // Form State prefilled with authenticated user if available
  const [customer, setCustomer] = useState({
    name: user?.name || 'Carlos Mendoza',
    email: user?.email || 'carlos@example.com',
    phone: user?.phone || '+593 99 123 4567',
  });

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [shippingAddress, setShippingAddress] = useState({
    recipientName: 'Carlos Mendoza',
    street: 'Av. Las Condes 1234, Dpto 502',
    city: 'Santiago',
    state: 'Región Metropolitana',
    postalCode: '7550000',
    phone: '+56 9 8765 4321',
    additionalInfo: 'Dejar en conserjería',
  });

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'CASH_ON_DELIVERY'>('CREDIT_CARD');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
        <p className="text-sm text-slate-400">
          No hay items para procesar en checkout. Agrega productos o servicios para continuar.
        </p>
        <Link href={tenant ? `/${tenant}/catalog` : '/catalog'}>
          <Button variant="primary" size="md">
            Ir al Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setIsProcessingPayment(true);
    setPaymentStatus('authorizing');

    try {
      const orderPayload: CreateOrderDTO = {
        items,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        paymentMethod,
        shippingAddress: calculation.hasPhysicalProducts ? shippingAddress : undefined,
      };

      const createdOrder = await apiClient.post<OrderDTO>(
        '/orders/checkout',
        orderPayload,
      );

      // Simulate payment processing time for luxury feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('success');
      await new Promise(resolve => setTimeout(resolve, 1000));

      clearCart();
      const redirectTarget = tenant
        ? `/${tenant}/orders/${createdOrder.orderNumber}`
        : `/orders/${createdOrder.orderNumber}`;
      router.push(redirectTarget);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsProcessingPayment(false);
      setErrorMessage(
        err.message || 'Ocurrió un error al procesar tu orden. Revisa los datos ingresados.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Payment Processing Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120524]/90 backdrop-blur-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-brand-500/20 border-b-brand-400 animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className={`w-8 h-8 ${paymentStatus === 'success' ? 'text-emerald-400' : 'text-gold-400'}`} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-serif font-extrabold text-white">
                {paymentStatus === 'authorizing' ? 'Autorizando Transacción...' : 'Pago Aprobado'}
              </h3>
              <p className="text-sm text-gold-500/80 uppercase tracking-widest font-bold">
                {paymentStatus === 'authorizing' ? 'Contactando a la red segura' : 'Generando recibo VIP'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative min-h-screen">
        {/* Background ambient orbs */}
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <Link href="/catalog" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Paso Final
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">
                Checkout & Reservas
              </h1>
              <p className="text-xs text-slate-400 mt-2 font-light">
                Checkout unificado para productos de la boutique y servicios clínicos programados.
              </p>
            </div>
          </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">No fue posible completar la orden:</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Contact */}
          <div className="luxury-glass p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-[10px] font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-gradient text-[#120524] flex items-center justify-center shadow-[0_0_10px_rgba(218,165,32,0.3)]">
                1
              </span>
              <span>Datos del Titular</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre y Apellidos *"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                required
              />
              <Input
                label="Teléfono Móvil *"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Correo Electrónico (para comprobante VIP) *"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address (Conditional if has physical products) */}
          {calculation.hasPhysicalProducts ? (
            <div className="luxury-glass p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold-gradient text-[#120524] flex items-center justify-center shadow-[0_0_10px_rgba(218,165,32,0.3)]">
                    2
                  </span>
                  <span>Logística de Entrega</span>
                </h3>
                <Badge variant="brand" size="sm" className="bg-brand-500/20 text-brand-300 border-brand-500/30 uppercase tracking-widest font-sans">
                  <Truck className="w-3 h-3 mr-1" /> Encomienda
                </Badge>
              </div>

              <div className="space-y-4">
                <Input
                  label="Calle, Número y Depto/Casa *"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad *"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                  <Input
                    label="Región/Provincia *"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Código Postal *"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    required
                  />
                  <Input
                    label="Instrucciones al Courrier (Opcional)"
                    value={shippingAddress.additionalInfo}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, additionalInfo: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-900/40 p-5 rounded-2xl border border-brand-500/30 text-xs text-brand-200 flex items-center gap-3 backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-brand-400 shrink-0" />
              <span>
                <strong className="text-white uppercase tracking-widest text-[10px]">Solo Servicios Clínicos:</strong> No se requiere dirección de despacho. Tus citas quedarán agendadas en la sede central VIP de ApexVeterinario.
              </span>
            </div>
          )}

          {/* Auto-Ship Subscription Feature */}
          {calculation.hasPhysicalProducts && (
            <div className="luxury-glass p-6 rounded-2xl border border-gold-500/30 shadow-xl space-y-4 bg-gold-500/[0.03]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center shrink-0 border border-gold-500/30">
                    <RefreshCw className={`w-5 h-5 ${isAutoShip ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Suscripción Auto-Ship Recurrente</span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        10% Ahorro Extra
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Entregas periódicas programadas sin preocuparte por el stock de alimento o medicinas.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isAutoShip}
                    onChange={(e) => setIsAutoShip(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                </label>
              </div>

              {isAutoShip && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300 font-medium">Frecuencia de Reposición Automática:</span>
                  <div className="flex items-center gap-2">
                    {(['30', '60', '90'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setAutoShipFrequency(freq)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          autoShipFrequency === freq
                            ? 'bg-gold-gradient text-[#120524] shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        Cada {freq} días
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Payment Method */}
          <div className="luxury-glass p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-[10px] font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-gradient text-[#120524] flex items-center justify-center shadow-[0_0_10px_rgba(218,165,32,0.3)]">
                {calculation.hasPhysicalProducts ? '3' : '2'}
              </span>
              <span>Método de Pago</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'CREDIT_CARD', label: 'Crédito', icon: '💳' },
                { id: 'DEBIT_CARD', label: 'Débito', icon: '🏧' },
                { id: 'TRANSFER', label: 'Transferencia', icon: '🏦' },
                { id: 'CASH_ON_DELIVERY', label: 'Contra Entrega', icon: '💵' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(218,165,32,0.15)] text-gold-300 font-bold'
                      : 'border-white/10 bg-black/20 hover:bg-white/5 hover:border-gold-500/30 text-slate-400 font-medium'
                  }`}
                >
                  <span className="text-2xl block mb-2 opacity-90">{m.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="luxury-glass p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6 sticky top-20">
            <h3 className="text-xl font-serif font-extrabold text-white">
              Resumen del Pedido ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* List of mixed items */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-white/5 custom-scrollbar">
              {items.map((it) => (
                <div key={it.id} className="pt-4 first:pt-0 flex justify-between gap-3 text-xs">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {it.billableType === BillableType.PHYSICAL_PRODUCT ? (
                        <Badge variant="brand" size="sm" className="bg-gold-500/10 text-gold-300 border-gold-500/20 uppercase tracking-widest font-sans">
                          <Package className="w-2.5 h-2.5 mr-1" /> Producto ({it.quantity}x)
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm" className="bg-brand-500/20 text-brand-300 border-brand-500/30 uppercase tracking-widest font-sans">
                          <Calendar className="w-2.5 h-2.5 mr-1" /> Reserva
                        </Badge>
                      )}
                    </div>
                    <p className="font-bold text-white truncate text-sm">{it.title}</p>
                    {it.billableType === BillableType.VETERINARY_SERVICE && (
                      <p className="text-[10px] text-brand-300/80 font-mono">
                        TURNO: {formatDateTime((it as any).scheduledAt)}
                      </p>
                    )}
                  </div>
                  <span className="font-serif font-extrabold text-gold-300 shrink-0 text-sm">
                    {formatCurrency(it.unitPrice * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-5 border-t border-white/10 space-y-3 text-xs text-slate-300 font-light">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Subtotal</span>
                <span className="font-mono text-sm text-white">
                  {formatCurrency(calculation.subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Logística de Entrega</span>
                <span className="font-mono text-sm text-white">
                  {calculation.shippingCost === 0 ? (
                    <span className="text-gold-400 font-bold uppercase tracking-widest text-[10px]">Cortesía</span>
                  ) : (
                    formatCurrency(calculation.shippingCost)
                  )}
                </span>
              </div>

              {calculation.discount > 0 && (
                <div className="flex justify-between items-center text-gold-400 font-bold">
                  <span className="uppercase tracking-widest text-[10px]">Beneficios Aplicados</span>
                  <span className="font-mono text-sm">-{formatCurrency(calculation.discount)}</span>
                </div>
              )}

              {autoShipDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span className="uppercase tracking-widest text-[10px] flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Descuento Auto-Ship (10%)
                  </span>
                  <span className="font-mono text-sm">-{formatCurrency(autoShipDiscount)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-end text-base font-extrabold text-white">
                <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Monto Total</span>
                <span className="text-2xl font-serif text-white">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-gold-gradient text-[#120524] hover:opacity-90 font-bold border-none shadow-[0_0_20px_rgba(218,165,32,0.3)] transition-all uppercase tracking-widest text-xs h-12"
            >
              Completar Autorización
            </Button>

            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500/60" />
              <span>Pasarela de Pagos Cifrada Nivel Bancario</span>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
    </>
  );
}
