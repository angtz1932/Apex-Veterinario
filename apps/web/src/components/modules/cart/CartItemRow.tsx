'use client';

import React from 'react';
import Image from 'next/image';
import {
  CartItem,
  ProductCartItem,
  ServiceCartItem,
  BillableType,
} from '@apex/shared';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { Trash2, Calendar, Stethoscope, Plus, Minus, Package, User } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';

export const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Polimorfismo en renderizado de Producto Físico
  if (item.billableType === BillableType.PHYSICAL_PRODUCT) {
    const product = item as ProductCartItem;    return (
      <div className="flex gap-4 py-4 border-b border-white/10 last:border-0 group">
        {/* Product Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl bg-gold-gradient p-[1px] shadow-[0_0_15px_rgba(218,165,32,0.1)] group-hover:shadow-[0_0_20px_rgba(218,165,32,0.2)] transition-all shrink-0">
          <div className="w-full h-full rounded-xl bg-[#120524] overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <Package className="w-8 h-8 text-gold-500/50" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Badge variant="brand" size="sm" className="bg-gold-500/10 text-gold-300 border-gold-500/20 font-sans tracking-widest uppercase">
                  <Package className="w-3 h-3 mr-0.5" />
                  Boutique
                </Badge>
                {product.weightKg && (
                  <span className="text-[10px] text-slate-400 font-mono">{product.weightKg} kg</span>
                )}
              </div>
              <h4 className="text-sm font-serif font-bold text-white truncate leading-snug">
                {product.title}
              </h4>
            </div>
            <button
              onClick={() => removeItem(product.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all rounded-lg"
              title="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center border border-white/10 rounded-lg bg-black/40 shadow-inner">
              <button
                onClick={() => updateQuantity(product.id, product.quantity - 1)}
                className="p-1.5 text-slate-300 hover:bg-white/10 hover:text-gold-400 rounded-l-md transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-white">
                {product.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, product.quantity + 1)}
                className="p-1.5 text-slate-300 hover:bg-white/10 hover:text-gold-400 rounded-r-md transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm font-serif font-extrabold text-gold-300">
                {formatCurrency(product.unitPrice * product.quantity)}
              </p>
              {product.quantity > 1 && (
                <p className="text-[10px] text-slate-500 font-mono">
                  {formatCurrency(product.unitPrice)} c/u
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Polimorfismo en renderizado de Servicio Clínico
  const service = item as ServiceCartItem;
  return (
    <div className="flex gap-4 py-4 border-b border-white/10 last:border-0 bg-white/5 backdrop-blur-sm p-4 rounded-xl border-l-[3px] border-l-gold-500">
      <div className="relative w-12 h-12 rounded-xl bg-gold-gradient p-[1px] shrink-0">
        <div className="w-full h-full rounded-xl bg-[#120524] flex items-center justify-center text-gold-400">
          <Stethoscope className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Badge variant="success" size="sm" className="bg-brand-500/20 text-brand-300 border-brand-500/30 uppercase tracking-widest font-sans">
                <Calendar className="w-3 h-3 mr-0.5" />
                Reserva VIP
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">
                {service.durationMinutes} min
              </span>
            </div>
            <h4 className="text-sm font-serif font-bold text-white leading-snug">
              {service.title}
            </h4>
          </div>
          <button
            onClick={() => removeItem(service.id)}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all rounded-lg"
            title="Cancelar cita del carrito"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Appointment metadata details */}
        <div className="mt-3 space-y-1 bg-black/40 p-3 rounded-lg border border-white/5 text-[11px] text-slate-300 font-light">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gold-400 uppercase tracking-widest text-[9px]">Paciente:</span>
            <span className="text-white">{service.petName}</span>
          </div>
          {service.veterinarianName && (
            <div className="flex items-center gap-2 mt-1">
              <User className="w-3 h-3 text-gold-500/50" />
              <span className="font-medium text-slate-200">Dr(a). {service.veterinarianName}</span>
            </div>
          )}
          {service.scheduledAt && (
            <div className="flex items-center gap-2 mt-1 text-brand-300 font-medium">
              <Calendar className="w-3 h-3" />
              <span>{formatDateTime(service.scheduledAt)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-[9px] text-brand-300 font-bold uppercase tracking-widest border border-brand-500/30 bg-brand-900/40 px-2 py-0.5 rounded">
            Sin Costo de Entrega
          </span>
          <p className="text-sm font-serif font-extrabold text-gold-300">
            {formatCurrency(service.unitPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};
