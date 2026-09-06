'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import {
  Stethoscope,
  ShoppingBag,
  Calendar,
  Menu,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openCart = useCartStore((state) => state.openDrawer);
  const itemCount = useCartStore((state) => state.getItemCount());
  const openWizard = useAppointmentStore((state) => state.openWizard);

  const navLinks = [
    { href: '/catalog', label: 'Catálogo & Tienda' },
    { href: '/services', label: 'Servicios Clínicos' },
    { href: '/pets', label: 'Mis Mascotas' },
    { href: '/appointments', label: 'Mis Citas' },
  ];

  useGSAP(() => {
    gsap.fromTo(
      '.navbar-container',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.nav-item',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  return (
    <header className="navbar-container sticky top-0 z-40 w-full bg-[#060010]/70 backdrop-blur-2xl transition-all">
      {/* Top luxury gold line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 group-hover:scale-105 transition-all duration-300">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-serif font-bold text-lg text-white tracking-tight">Apex</span>
              <span className="font-serif font-bold text-lg text-gold-gradient">Veterinario</span>
            </div>
            <span className="text-[10px] font-sans font-medium tracking-[0.2em] text-slate-500 uppercase -mt-0.5 block">
              Salud & Cuidados
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'nav-item px-3.5 py-2 text-sm font-sans font-medium rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-white/[0.08] text-brand-300 font-semibold border border-brand-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Quick Appointment Booking Button */}
          <button
            onClick={() => openWizard()}
            className="nav-item hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Agendar Cita</span>
          </button>

          {/* Mixed Cart Button with Badge */}
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="nav-item relative p-2.5 rounded-xl border border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-brand-300 hover:border-white/20 transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-brand-500 to-brand-400 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-white/[0.06]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Bottom luxury divider */}
      <div className="luxury-divider" />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060010]/95 backdrop-blur-2xl px-4 pt-2 pb-4 space-y-1 shadow-luxury">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-slate-400 hover:bg-white/[0.06] hover:text-brand-300 transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWizard();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-sans font-semibold shadow-lg shadow-brand-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita Médica</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
