'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ProductDTO, ProductCategoryDTO, Species } from '@apex/shared';
import { ProductCard } from '@/components/modules/catalog/ProductCard';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/shared/Input';
import { Search, SlidersHorizontal, Package, Tag, Filter } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<ProductCategoryDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    apiClient.get<ProductCategoryDTO[]>('/catalog/categories')
      .then((cats) => setCategories(cats || []))
      .catch((e) => console.error(e));
  }, []);

  // Fetch products with filters
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.set('categoryId', selectedCategory);
    if (selectedSpecies) queryParams.set('species', selectedSpecies);
    if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());

    apiClient
      .get<{ products: ProductDTO[] }>(`/catalog/products?${queryParams.toString()}`)
      .then((res) => {
        if (isMounted) setProducts(res.products || []);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSpecies, searchQuery]);

  useGSAP(() => {
    if (!loading && products.length > 0) {
      gsap.fromTo(
        '.product-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [loading, products]);

  return (
    <div className="relative min-h-screen">
      {/* Background ambient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl luxury-glass p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#120524]/80 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] bg-white/5 border border-gold-500/30 text-gold-400 inline-block shadow-[0_0_15px_rgba(218,165,32,0.15)]">
              Pet Store & Farmacia
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white">
              Catálogo Especializado
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Alimentos de prescripción veterinaria, antiparasitarios certificados y accesorios
              seleccionados por nuestros expertos médicos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Search bar */}
            <div className="luxury-glass p-5 rounded-2xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-400 flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Búsqueda</span>
              </h3>
              <Input
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm bg-black/40 border-white/10 focus:border-gold-500/50"
              />
            </div>

            {/* Species Filter */}
            <div className="luxury-glass p-5 rounded-2xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-400 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Especie</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: '', label: 'Todas' },
                  { id: Species.DOG, label: 'Perros' },
                  { id: Species.CAT, label: 'Gatos' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => setSelectedSpecies(sp.id)}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedSpecies === sp.id
                        ? 'bg-gold-500/20 border-gold-500/50 text-gold-300 shadow-[0_0_15px_rgba(218,165,32,0.15)]'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="luxury-glass p-5 rounded-2xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-400 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Categorías</span>
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border border-transparent text-sm font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === ''
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>Todas las categorías</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border border-transparent text-sm font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-gold-500/20 text-gold-300 border-gold-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
            <span>
              Mostrando <strong className="text-gold-400">{products.length}</strong> productos
            </span>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No se encontraron productos"
              description="Intenta ajustando tus filtros de categoría, especie o término de búsqueda."
              action={
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSpecies('');
                    setSearchQuery('');
                  }}
                  className="text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors hover:underline"
                >
                  Limpiar todos los filtros
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-32 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
