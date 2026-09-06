'use client';

import React from 'react';
import Link from 'next/link';
import { ProductDTO, Species } from '@apex/shared';
import { formatCurrency, getSpeciesLabel } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { Badge } from '@/components/shared/Badge';
import { ShoppingBag, Star, PackageCheck } from 'lucide-react';

export const ProductCard: React.FC<{ product: ProductDTO }> = ({ product }) => {
  const addProduct = useCartStore((state) => state.addProduct);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="product-card group luxury-glass luxury-glass-hover luxury-shimmer rounded-2xl p-4 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-square w-full rounded-xl bg-white/[0.03] overflow-hidden mb-3 border border-white/[0.06]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              Sin imagen
            </div>
          )}

          {/* Ribbon badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {discountPercent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-extrabold bg-rose-500/90 text-white shadow-lg shadow-rose-500/20 backdrop-blur-sm">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-gold-500/90 text-white shadow-lg shadow-gold-500/20 backdrop-blur-sm flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-current" /> Destacado
              </span>
            )}
          </div>

          {/* Species indicator */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {product.compatibleSpecies?.map((sp) => (
              <Badge key={sp} variant="neutral" size="sm" className="bg-[#120524]/70 text-white/80 backdrop-blur-md border-white/10 text-[9px]">
                {sp === Species.DOG ? '🐶 Perro' : sp === Species.CAT ? '🐱 Gato' : sp}
              </Badge>
            ))}
          </div>
        </div>

        {/* Brand & Title */}
        <div className="space-y-1">
          <p className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-[0.15em]">
            {product.brand}
          </p>
          <Link href={`/catalog/${product.id}`} className="block">
            <h4 className="text-sm font-sans font-bold text-slate-100 line-clamp-2 hover:text-brand-300 transition-colors duration-300">
              {product.name}
            </h4>
          </Link>
          <p className="text-xs font-sans text-slate-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-sans font-extrabold text-white">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs font-sans text-slate-600 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans font-medium mt-0.5">
            <PackageCheck className="w-3 h-3" />
            <span>{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
          </div>
        </div>

        <button
          onClick={() => addProduct(product, 1)}
          disabled={product.stock <= 0}
          className="p-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-brand-500/20 hover:text-brand-300 border border-white/[0.08] hover:border-brand-500/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95"
          title="Agregar al Carrito"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
