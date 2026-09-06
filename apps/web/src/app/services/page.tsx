'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { ServiceDTO, Species } from '@apex/shared';
import { ServiceCard } from '@/components/modules/services/ServiceCard';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/shared/Button';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Stethoscope, Calendar, ShieldCheck, Award, HeartPulse } from 'lucide-react';

export default function ServicesPage() {
  const openWizard = useAppointmentStore((state) => state.openWizard);

  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<ServiceDTO[]>('/services')
      .then((res) => setServices(res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background ambient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header Banner */}
        <div className="rounded-3xl luxury-glass p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#120524]/80 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] bg-white/5 border border-gold-500/30 text-gold-400 inline-block shadow-[0_0_15px_rgba(218,165,32,0.15)]">
              Hospital & Clínica Veterinaria
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white">
              Servicios Clínicos VIP
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Medicina preventiva, consultas generales, planes de vacunación, desparasitación,
              profilaxis y grooming profesional. Todo con el respaldo de nuestros médicos veterinarios colegiados.
            </p>
            <div className="pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => openWizard()}
                className="bg-gold-gradient text-[#120524] hover:opacity-90 font-bold border-none gap-2 shadow-[0_0_20px_rgba(218,165,32,0.3)] transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Turno Premium</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-serif font-bold text-white">Catálogo de Procedimientos</h2>
            <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold">
              {services.length} Servicios Disponibles
            </span>
          </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
      {/* Quality Guarantees Bar */}
      <div className="luxury-glass rounded-2xl border border-white/10 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="space-y-1">
          <Award className="w-8 h-8 text-gold-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest mt-2">Profesionales Certificados</h4>
          <p className="text-xs text-slate-400">Médicos veterinarios con formación continua.</p>
        </div>
        <div className="space-y-1">
          <ShieldCheck className="w-8 h-8 text-gold-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest mt-2">Equipamiento Moderno</h4>
          <p className="text-xs text-slate-400">Instrumental esterilizado y tecnología segura.</p>
        </div>
        <div className="space-y-1">
          <HeartPulse className="w-8 h-8 text-gold-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest mt-2">Historial Digital Unificado</h4>
          <p className="text-xs text-slate-400">Toda la evolución de tu mascota accesible online.</p>
        </div>
      </div>
    </div>
  </div>
  );
}
