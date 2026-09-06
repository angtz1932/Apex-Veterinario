'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { ProductDTO, ProductCategoryDTO, ServiceDTO } from '@apex/shared';
import { ProductCard } from '@/components/modules/catalog/ProductCard';
import { ServiceCard } from '@/components/modules/services/ServiceCard';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import {
  Calendar,
  ShoppingBag,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Activity,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HomePage() {
  const openWizard = useAppointmentStore((state) => state.openWizard);

  const [featuredProducts, setFeaturedProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<ProductCategoryDTO[]>([]);
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, srvRes] = await Promise.all([
          apiClient
            .get<{ products: ProductDTO[] }>('/catalog/products?featured=true&limit=4')
            .catch(() => ({ products: [] })),
          apiClient.get<ProductCategoryDTO[]>('/catalog/categories').catch(() => []),
          apiClient.get<ServiceDTO[]>('/services').catch(() => []),
        ]);

        setFeaturedProducts(prodRes.products || []);
        setCategories(catRes || []);
        setServices(srvRes?.slice(0, 3) || []);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      '.hero-content > *',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.hero-image-container',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  useGSAP(() => {
    if (!loading) {
      gsap.fromTo(
        '.category-card',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.product-card',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [loading]);

  return (
    <div className="space-y-20 pb-20">
      {/* ═══════════════════════════════════════
          1. HERO SECTION — Luxury
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-20">
        {/* Ambient Orbs */}
        <div className="luxury-orb luxury-orb-brand w-[500px] h-[500px] -top-40 -left-40" />
        <div className="luxury-orb luxury-orb-gold w-[300px] h-[300px] top-20 right-10" />
        <div className="luxury-orb luxury-orb-brand w-[200px] h-[200px] bottom-0 left-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="hero-content lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-sans font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Medicina Veterinaria Especializada & Pet Store Integral</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
                Salud clínica y bienestar superior para tu{' '}
                <span className="text-gold-gradient">
                  mejor amigo.
                </span>
              </h1>

              <p className="text-base sm:text-lg font-sans text-slate-400 max-w-xl leading-relaxed">
                Agenda consultas médicas con veterinarios certificados en tiempo real y adquiere
                alimentos premium, farmacia veterinaria y accesorios en un único carrito unificado.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openWizard()}
                  className="gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Agendar Cita Médica</span>
                </Button>

                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Explorar Catálogo</span>
                  </Button>
                </Link>
              </div>

              {/* Highlights Trust Bar */}
              <div className="grid grid-cols-3 gap-5 pt-7 max-w-lg">
                <div className="luxury-divider col-span-3 mb-1" />
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="text-xs font-sans font-medium text-slate-400">
                    Especialistas Certificados
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="text-xs font-sans font-medium text-slate-400">
                    Envío Gratis &gt; $50
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="text-xs font-sans font-medium text-slate-400">
                    +5.000 Mascotas
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image Presentation */}
            <div className="hero-image-container lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden luxury-glass p-1">
                <div className="rounded-[20px] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80"
                    alt="Veterinaria y cuidado de mascotas"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-1 rounded-[20px] bg-gradient-to-t from-[#120524]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold-300">
                      Urgencias & Consultas
                    </span>
                    <p className="text-lg font-serif font-bold mt-1">Atención médica humana para animales felices</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 luxury-glass p-3.5 rounded-2xl flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-sans font-extrabold text-white block">
                    99.8% Satisfacción
                  </span>
                  <span className="text-[10px] font-sans text-slate-500">Historial clínico digitalizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 luxury-divider" />
      </section>

      {/* ═══════════════════════════════════════
          2. CATEGORIES SECTION
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold-400">
              Explora por departamento
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Categorías Populares</h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-sans font-semibold text-brand-300 hover:text-brand-200 flex items-center gap-1.5 group transition-colors duration-300"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?categoryId=${cat.id}`}
              className="category-card group luxury-glass luxury-glass-hover luxury-shimmer rounded-2xl p-4 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] overflow-hidden mb-3 border border-white/[0.08] group-hover:scale-105 transition-transform duration-300">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xl">
                    🐾
                  </div>
                )}
              </div>
              <h4 className="text-xs font-sans font-bold text-slate-300 group-hover:text-brand-300 transition-colors duration-300">
                {cat.name}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. COMBO CARE PROMO BANNER — Luxury
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden luxury-shimmer">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-800/40 to-[#120524]/90 backdrop-blur-xl pointer-events-none" />
          {/* Glow accent */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-brand-500/15 blur-[60px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 border border-white/[0.08] rounded-3xl">
            <div className="max-w-xl space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-sans font-bold bg-gold-500/10 border border-gold-500/20 text-gold-300">
                <Sparkles className="w-3 h-3" />
                Beneficio Exclusivo Carrito Mixto
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Plan "Cuidado Integral": Ahorra 10% en Servicios
              </h3>
              <p className="text-xs sm:text-sm font-sans text-slate-400 leading-relaxed">
                Combina cualquier producto físico (alimento, antiparasitario o juguete) con una consulta
                o sesión de grooming en la misma orden, y obtén automáticamente un 10% de descuento en el
                servicio clínico.
              </p>
              <div className="pt-1">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => openWizard()}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Aprovechar Promoción
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. FEATURED PRODUCTS
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold-400">
              Lo más recomendado
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Productos Destacados</h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-sans font-semibold text-brand-300 hover:text-brand-200 flex items-center gap-1.5 transition-colors duration-300"
          >
            <span>Ver más productos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          5. CLINICAL SERVICES HIGHLIGHT
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold-400">
              Atención Clínica Especializada
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Nuestros Servicios Médicos</h2>
          </div>
          <Link
            href="/services"
            className="text-xs font-sans font-semibold text-brand-300 hover:text-brand-200 flex items-center gap-1.5 transition-colors duration-300"
          >
            <span>Todos los servicios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv) => (
            <ServiceCard key={srv.id} service={srv} />
          ))}
        </div>
      </section>
    </div>
  );
}
