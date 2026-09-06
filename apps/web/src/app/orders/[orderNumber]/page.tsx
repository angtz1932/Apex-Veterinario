'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { OrderDTO, BillableType } from '@apex/shared';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import {
  CheckCircle2,
  Package,
  Calendar,
  Truck,
  ArrowRight,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    apiClient
      .get<OrderDTO>(`/orders/${orderNumber}`)
      .then((res) => setOrder(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400">Cargando comprobante de compra...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Orden no encontrada</h2>
        <p className="text-xs text-slate-400">
          No pudimos localizar la orden solicitada. Revisa el código o consulta tu historial.
        </p>
        <Link href="/">
          <Button variant="primary" size="sm">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 min-h-screen">
      {/* Background ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />

      {/* Success Badge Banner */}
      <div className="relative text-center space-y-4 luxury-glass border border-white/10 p-10 rounded-3xl shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-gold-gradient text-[#120524] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(218,165,32,0.4)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
          Autorización Exitosa
        </h1>
        <p className="text-xs sm:text-sm text-gold-500/80 uppercase tracking-widest font-bold max-w-md mx-auto">
          BIENVENIDO A LA EXPERIENCIA APEX VETERINARIO
        </p>
        <p className="text-sm text-slate-300 max-w-md mx-auto font-light leading-relaxed">
          Hemos recibido tu pago de forma segura y tus servicios exclusivos han sido
          registrados en nuestro sistema VIP.
        </p>
        <div className="inline-block mt-4 font-mono text-sm font-bold text-gold-300 bg-gold-500/10 px-6 py-2.5 rounded-full border border-gold-500/30 tracking-widest">
          COMPROBANTE: {order.orderNumber}
        </div>
      </div>

      {/* Order Details Card */}
      <div className="relative luxury-glass rounded-2xl border border-white/10 p-8 shadow-2xl space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-white/10 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold mb-1">Fecha de Emisión</span>
            <strong className="text-white font-mono text-sm">{formatDateTime(order.createdAt)}</strong>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold mb-1">Estado de Cuenta</span>
            <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 uppercase tracking-widest font-sans">
              Liquidado
            </Badge>
          </div>
        </div>

        {/* Polymorphic items summary */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 mb-4">
            Resumen de Facturación
          </h3>
          <div className="space-y-4 divide-y divide-white/5">
            {order.items?.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gold-400 flex items-center justify-center shrink-0 shadow-inner">
                    {item.billableType === BillableType.PHYSICAL_PRODUCT ? (
                      <Package className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">
                      Cant: {item.quantity} • {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                </div>
                <span className="font-serif font-extrabold text-gold-300 text-base">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address info if applicable */}
        {order.shippingAddress && (
          <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-xs space-y-2 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-white mb-2">
              <Truck className="w-4 h-4 text-gold-400" />
              <span className="uppercase tracking-widest text-[10px] text-gold-400">Destino de Logística</span>
            </div>
            <p className="text-slate-300 font-medium text-sm">{order.shippingAddress.street}</p>
            <p className="text-slate-400 font-light">
              {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.postalCode})
            </p>
          </div>
        )}

        {/* Financial Breakdown */}
        <div className="pt-6 border-t border-white/10 space-y-3 text-xs text-slate-300 font-light">
          <div className="flex justify-between items-center">
            <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Subtotal</span>
            <span className="font-mono text-sm text-white">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Logística</span>
            <span className="font-mono text-sm text-white">
              {order.shippingCost === 0 ? (
                <span className="text-gold-400 font-bold uppercase tracking-widest text-[10px]">Cortesía</span>
              ) : (
                formatCurrency(order.shippingCost)
              )}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between items-center text-gold-400 font-bold">
              <span className="uppercase tracking-widest text-[10px]">Beneficios Exclusivos</span>
              <span className="font-mono text-sm">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="pt-4 border-t border-white/10 flex justify-between items-end text-base font-extrabold text-white">
            <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Liquidación Final</span>
            <span className="text-2xl font-serif text-white">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/appointments">
          <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-white/20 text-white hover:bg-white/10 transition-colors uppercase tracking-widest text-[10px] font-bold">
            <Calendar className="w-4 h-4" />
            <span>Mis Reservas VIP</span>
          </Button>
        </Link>
        <Link href="/catalog">
          <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 bg-gold-gradient text-[#120524] hover:opacity-90 border-none shadow-[0_0_15px_rgba(218,165,32,0.3)] transition-all uppercase tracking-widest text-[10px] font-bold">
            <span>Catálogo Exclusivo</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
