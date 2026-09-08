'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/context/ThemeProvider';
import {
  Stethoscope,
  ShoppingBag,
  Calendar,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Shield,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const params = useParams<{ tenant?: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const openCart = useCartStore((state) => state.openDrawer);
  const itemCount = useCartStore((state) => state.getItemCount());
  const openWizard = useAppointmentStore((state) => state.openWizard);
  const { user, logout } = useAuthStore();
  const theme = useTheme();

  const tenant = params?.tenant ?? '';
  const prefix = tenant ? `/${tenant}` : '';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'VET' || user?.role === 'VETERINARIAN';

  const navLinks = [
    { href: `${prefix}/catalog`, label: 'Catalogo & Tienda' },
    { href: `${prefix}/services`, label: 'Servicios Clinicos' },
    { href: `${prefix}/wellness`, label: 'Planes de Salud' },
    { href: `${prefix}/pets`, label: 'Mis Mascotas' },
    { href: `${prefix}/appointments`, label: 'Mis Citas' },
    ...(isAdmin ? [{ href: `${prefix}/admin`, label: 'Panel Clínico' }] : []),
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
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo — dinámico por tenant */}
        <Link href={prefix || '/'} className="flex items-center gap-3 group">
          {theme.logoUrl ? (
            <Image
              src={theme.logoUrl}
              alt={theme.clinicName ?? 'Logo'}
              width={40}
              height={40}
              className="rounded-xl object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 group-hover:scale-105 transition-all duration-300">
              <Stethoscope className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-serif font-bold text-lg text-white tracking-tight">
                {theme.clinicName || (tenant === 'clinica-norte' ? 'Apex Clínica Norte' : tenant === 'vet-central' ? 'Apex Veterinaria Central' : 'Apex Veterinario')}
              </span>
            </div>
            <span className="text-[10px] font-sans font-medium tracking-[0.2em] text-slate-500 uppercase -mt-0.5 block">
              Salud & Cuidados
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
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
          {/* Agendar Cita */}
          <button
            onClick={() => openWizard()}
            className="nav-item hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 transition-all duration-300 shadow-lg shadow-brand-500/20"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Agendar Cita</span>
          </button>

          {/* Carrito */}
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

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all"
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 luxury-glass rounded-xl p-1 shadow-luxury z-50">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      href={`${prefix}/admin`}
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-300 hover:bg-brand-500/10 rounded-lg transition-all mt-1"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Panel Clínico
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`${prefix}/login`}
              className="nav-item hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-medium border border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Ingresar</span>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-white/[0.06]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="luxury-divider" />

      {/* Mobile Menu */}
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
          <div className="pt-2 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); openWizard(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-sans font-semibold"
            >
              <Calendar className="w-4 h-4" />
              Agendar Cita Medica
            </button>
            {!user && (
              <Link
                href={`${prefix}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-sans font-medium"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
