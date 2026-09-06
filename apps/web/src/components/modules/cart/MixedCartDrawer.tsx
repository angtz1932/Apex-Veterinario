'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { CartItemRow } from './CartItemRow';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const MixedCartDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, items, getCalculation, couponCode, setCouponCode } =
    useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponAppliedMessage, setCouponAppliedMessage] = useState('');

  if (!isDrawerOpen) return null;

  const calculation = getCalculation();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponCode(inputCoupon.trim());
    if (inputCoupon.trim().toUpperCase() === 'APEXBIENVENIDO') {
      setCouponAppliedMessage('¡Cupón del 15% aplicado!');
    } else {
      setCouponAppliedMessage('Cupón registrado');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#060010]/80 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1a0b2e]/90 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col border-l border-white/10">
          {/* Header */}
          <div className="p-4 sm:px-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-brand-300 flex items-center justify-center border border-white/10">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-100">Carrito Mixto</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Combo Promotion Ribbon */}
          {calculation.hasPhysicalProducts && calculation.hasServices && (
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2 text-white flex items-center gap-2 text-xs font-medium shadow-xs">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                ¡Beneficio Activo! 10% de descuento en servicios por combinar con productos.
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:px-6 space-y-2">
            {items.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Tu carrito está vacío"
                description="Agrega productos para consentir a tu mascota o agenda un servicio clínico para su bienestar."
                action={
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        closeDrawer();
                      }}
                    >
                      <Link href="/catalog">Explorar Catálogo</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        closeDrawer();
                      }}
                    >
                      <Link href="/services">Ver Servicios Clínicos</Link>
                    </Button>
                  </div>
                }
              />
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:px-6 border-t border-white/10 bg-black/20 space-y-3.5">
              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Código (Ej: APEXBIENVENIDO)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm">
                  Aplicar
                </Button>
              </form>
              {couponAppliedMessage && (
                <p className="text-[11px] text-teal-400 font-medium">{couponAppliedMessage}</p>
              )}

              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-100">
                    {formatCurrency(calculation.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Envío Logístico</span>
                  </div>
                  <span className="font-semibold text-slate-100">
                    {calculation.shippingCost === 0 ? (
                      <span className="text-teal-400 font-bold">¡GRATIS!</span>
                    ) : (
                      formatCurrency(calculation.shippingCost)
                    )}
                  </span>
                </div>

                {calculation.discount > 0 && (
                  <div className="flex justify-between text-teal-400 font-medium">
                    <span>Descuentos aplicados</span>
                    <span>-{formatCurrency(calculation.discount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-slate-100">
                  <span>Total estimado</span>
                  <span className="text-base text-brand-300">
                    {formatCurrency(calculation.total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link href="/checkout" onClick={closeDrawer} className="block w-full">
                <Button variant="primary" size="md" className="w-full gap-2">
                  <span>Continuar al Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pago protegido con encriptación SSL de 256 bits</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
