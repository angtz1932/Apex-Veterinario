import React from 'react';
import Link from 'next/link';
import { Stethoscope, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#060010]/80 backdrop-blur-2xl text-slate-400">
      {/* Top luxury gradient line */}
      <div className="luxury-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/15">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-white text-lg tracking-tight">
                Apex<span className="text-gold-gradient">Veterinario</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Centro clínico de alta especialidad y tienda integral para el cuidado, nutrición y bienestar de tus mascotas.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-sans font-medium bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Médicos veterinarios certificados y colegiados</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-slate-300 mb-4">
              Servicios Clínicos
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link href="/services" className="hover:text-brand-300 transition-colors duration-300">Consulta General</Link></li>
              <li><Link href="/services" className="hover:text-brand-300 transition-colors duration-300">Vacunación & Desparasitación</Link></li>
              <li><Link href="/services" className="hover:text-brand-300 transition-colors duration-300">Grooming & Estética Canina</Link></li>
              <li><Link href="/services" className="hover:text-brand-300 transition-colors duration-300">Profilaxis y Odontología</Link></li>
              <li><Link href="/appointments" className="hover:text-brand-300 transition-colors duration-300">Gestión de Citas</Link></li>
            </ul>
          </div>

          {/* Store Categories */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-slate-300 mb-4">
              Tienda & Catálogo
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link href="/catalog?categoryId=cat-alimentos" className="hover:text-brand-300 transition-colors duration-300">Alimentos Premium</Link></li>
              <li><Link href="/catalog?categoryId=cat-farmacia" className="hover:text-brand-300 transition-colors duration-300">Farmacia Veterinaria</Link></li>
              <li><Link href="/catalog?categoryId=cat-accesorios" className="hover:text-brand-300 transition-colors duration-300">Arneses y Accesorios</Link></li>
              <li><Link href="/catalog?categoryId=cat-higiene" className="hover:text-brand-300 transition-colors duration-300">Higiene y Cuidado</Link></li>
              <li><Link href="/catalog?categoryId=cat-juguetes" className="hover:text-brand-300 transition-colors duration-300">Juguetes Interactivos</Link></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3 text-xs text-slate-500">
            <h4 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-slate-300 mb-4">
              Atención & Contacto
            </h4>
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>Lun - Sáb: 09:00 a 19:00 hrs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>Av. Las Palmeras 1420, Vitacura</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>+56 9 8765 4321 (Urgencias 24/7)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <span>contacto@apexveterinario.com</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <p>© {new Date().getFullYear()} ApexVeterinario S.A. Todos los derechos reservados.</p>
          <p className="text-slate-700">Plataforma modular con arquitectura limpia.</p>
        </div>
      </div>
    </footer>
  );
};
