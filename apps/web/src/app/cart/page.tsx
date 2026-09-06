'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { CartItemRow } from '@/components/modules/cart/CartItemRow';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

export default function CartPage() {
  const { items, getCalculation, couponCode, setCouponCode, clearCart } =
    useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const calculation = getCalculation();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponCode(inputCoupon.trim());
    if (inputCoupon.trim().toUpperCase() === 'APEXBIENVENIDO') {
      setCouponMsg('¡Cupón del 15% de bienvenida aplicado!');
    } else {
      setCouponMsg('Cupón registrado.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen">
        {/* Background ambient orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 py-20">
          <EmptyState
            icon={ShoppingBag}
            title="Tu carrito de compras está vacío"
            description="Explora nuestro catálogo con alimentos de prescripción o agenda un turno clínico para tu mascota."
            action={
              <div className="flex gap-3">
                <Link href="/catalog">
                  <Button variant="primary" size="md" className="bg-gold-gradient text-[#120524] hover:opacity-90 font-bold border-none transition-all shadow-[0_0_20px_rgba(218,165,32,0.3)]">
                    Explorar Catálogo
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="md" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10 font-bold">
                    Servicios Veterinarios
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background ambient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                Resumen de Orden
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">
                Bolsa de Compras
              </h1>
              <p className="text-xs text-slate-400 mt-2 font-light">
                Productos físicos y servicios clínicos integrados en un único pedido.
              </p>
            </div>
          </div>

          <button
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80 hover:text-rose-400 transition-colors"
          >
            Vaciar bolsa
          </button>
        </div>

      {/* Combo Promotion Ribbon */}
      {calculation.hasPhysicalProducts && calculation.hasServices && (
        <div className="bg-gradient-to-r from-gold-500/20 to-brand-500/20 border border-gold-500/30 px-5 py-3 rounded-2xl text-gold-200 flex items-center justify-between text-xs font-medium shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-gold-400" />
            <span>
              <strong className="text-gold-400 font-bold uppercase tracking-widest text-[10px]">¡Beneficio VIP Activo!</strong> Obtienes 10% de cortesía en servicios clínicos por incluir productos.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-7 luxury-glass p-6 rounded-2xl border border-white/10 shadow-xl divide-y divide-white/10">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            Items en tu orden ({items.length})
          </h2>
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="luxury-glass p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xl font-serif font-extrabold text-white">
              Resumen Financiero
            </h3>

            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-3 text-gold-500/50" />
                <input
                  type="text"
                  placeholder="Código de Cortesía (ej: APEXVIP)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
              <Button type="submit" variant="outline" size="sm" className="border-white/10 hover:border-gold-500/50 hover:bg-gold-500/10 text-gold-400 font-bold">
                Aplicar
              </Button>
            </form>
            {couponMsg && (
              <p className="text-[11px] text-gold-400 font-semibold">{couponMsg}</p>
            )}

            {/* Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-slate-300 font-light">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Subtotal</span>
                <span className="font-mono text-sm text-white">
                  {formatCurrency(calculation.subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold text-slate-400">
                  <Truck className="w-3.5 h-3.5 text-gold-500/50" />
                  <span>Servicio de Entrega</span>
                </div>
                <span className="font-mono text-sm text-white">
                  {calculation.shippingCost === 0 ? (
                    <span className="text-gold-400 font-bold text-[10px] uppercase tracking-widest">Cortesía</span>
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

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400">Total a Pagar</span>
                <span className="text-2xl font-serif font-extrabold text-white">
                  {formatCurrency(calculation.total)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full pt-2">
              <Button variant="primary" size="lg" className="w-full gap-2 bg-gold-gradient text-[#120524] hover:opacity-90 font-bold border-none shadow-[0_0_20px_rgba(218,165,32,0.3)] transition-all uppercase tracking-widest text-xs">
                <span>Completar Orden</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 pt-2 uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500/60" />
              <span>Transacción Encriptada & Segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
