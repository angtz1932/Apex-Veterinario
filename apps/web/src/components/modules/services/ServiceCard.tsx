'use client';

import React from 'react';
import { ServiceDTO, Species } from '@apex/shared';
import { formatCurrency } from '@/lib/utils';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Clock, Calendar, Stethoscope, ShieldCheck } from 'lucide-react';

export const ServiceCard: React.FC<{ service: ServiceDTO }> = ({ service }) => {
  const openWizard = useAppointmentStore((state) => state.openWizard);

  return (
    <div className="luxury-glass luxury-glass-hover luxury-shimmer rounded-2xl p-6 flex flex-col justify-between group">
      <div>
        {/* Header Icon & Duration */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-300 flex items-center justify-center border border-brand-500/15 group-hover:scale-105 group-hover:shadow-glow-sm transition-all duration-300">
            <Stethoscope className="w-6 h-6" />
          </div>
          <Badge variant="brand" size="md">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {service.durationMinutes} min
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-serif font-bold text-slate-100 group-hover:text-brand-300 transition-colors duration-300">
          {service.name}
        </h3>
        <p className="mt-2 text-xs font-sans text-slate-500 leading-relaxed">
          {service.description}
        </p>

        {/* Species Compatibility */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
          {service.compatibleSpecies?.map((sp) => (
            <Badge key={sp} variant="neutral" size="sm">
              {sp === Species.DOG ? '🐶 Caninos' : sp === Species.CAT ? '🐱 Felinos' : sp}
            </Badge>
          ))}
          {service.requiresVeterinarian && (
            <span className="inline-flex items-center gap-1 text-[10px] font-sans text-gold-400 font-semibold ml-auto">
              <ShieldCheck className="w-3 h-3" /> Médico Colegiado
            </span>
          )}
        </div>
      </div>

      {/* Pricing & Booking CTA */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans text-slate-600 block font-semibold uppercase tracking-[0.15em]">
            Arancel por sesión
          </span>
          <span className="text-lg font-sans font-extrabold text-white">
            {formatCurrency(service.price)}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openWizard(service)}
          className="gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agendar Turno</span>
        </Button>
      </div>
    </div>
  );
};
