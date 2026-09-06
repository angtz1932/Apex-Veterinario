'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ProductDTO, Species } from '@apex/shared';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Spinner } from '@/components/shared/Spinner';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
  Plus,
  Minus,
  CheckCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const addProduct = useCartStore((state) => state.addProduct);

  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiClient
      .get<ProductDTO>(`/catalog/products/${id}`)
      .then((p) => setProduct(p))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Producto no encontrado</h2>
        <Link href="/catalog">
          <Button variant="primary" size="sm">
            Volver al Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addProduct(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Boutique</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 luxury-glass rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
          {/* Left: Product Image */}
          <div className="md:col-span-6">
            <div className="aspect-square w-full rounded-2xl bg-black/40 overflow-hidden border border-white/5 flex items-center justify-center relative shadow-inner">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                />
              ) : (
                <Package className="w-20 h-20 text-white/10" />
              )}
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="md:col-span-6 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                  {product.brand}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-500">SKU: {product.sku}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
                {product.name}
              </h1>

              {/* Species Badges */}
              <div className="flex flex-wrap gap-2">
                {product.compatibleSpecies?.map((sp) => (
                  <Badge key={sp} variant="brand" size="md" className="bg-white/5 text-slate-300 border-white/10 uppercase tracking-widest font-sans text-[9px]">
                    {sp === Species.DOG ? '🐶 EXCLUSIVO CANINOS' : sp === Species.CAT ? '🐱 EXCLUSIVO FELINOS' : sp}
                  </Badge>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-4 pt-4">
                <span className="text-4xl font-serif font-extrabold text-gold-300">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xl font-serif text-slate-500 line-through decoration-slate-500/50">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 font-light leading-relaxed pt-6 border-t border-white/10">
                {product.description}
              </p>

              {/* Stock status */}
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <span
                  className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                    product.stock > 0 ? 'bg-emerald-400 text-emerald-400' : 'bg-rose-500 text-rose-500'
                  }`}
                />
                <span className={product.stock > 0 ? 'text-emerald-400' : 'text-rose-500'}>
                  {product.stock > 0 ? `Colección Disponible: ${product.stock} unidades` : 'Agotado Temporalmente'}
                </span>
              </div>
            </div>

          {/* Add to cart section */}
          <div className="space-y-6 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-xl bg-black/40 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-white font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 gap-3 bg-gold-gradient text-[#120524] hover:opacity-90 font-bold border-none shadow-[0_0_20px_rgba(218,165,32,0.3)] transition-all h-14"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="uppercase tracking-widest text-[10px]">Añadir a la Colección ({formatCurrency(product.price * quantity)})</span>
              </Button>
            </div>

            {addedNotice && (
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle className="w-4 h-4" /> ¡Pieza añadida exitosamente!
              </p>
            )}

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gold-500/70 shrink-0" />
                <span>Despacho VIP Logístico 24h</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-500/70 shrink-0" />
                <span>Certificado de Autenticidad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
