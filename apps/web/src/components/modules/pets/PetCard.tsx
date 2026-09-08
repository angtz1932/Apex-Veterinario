'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PetDTO, Species } from '@apex/shared';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { MedicalHistoryModal } from './MedicalHistoryModal';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import {
  Heart,
  Calendar,
  Activity,
  CalendarPlus,
  Scale,
  Sparkles,
  Award,
  QrCode,
} from 'lucide-react';

export const PetCard: React.FC<{ pet: PetDTO }> = ({ pet }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const openWizard = useAppointmentStore((state) => state.openWizard);
  const params = useParams<{ tenant?: string }>();
  const tenant = params?.tenant ?? '';
  const prefix = tenant ? `/${tenant}` : '';

  const isDog = pet.species === Species.DOG;
  const isCat = pet.species === Species.CAT;

  return (
    <>
      <div className="luxury-glass luxury-glass-hover p-5 space-y-3 flex flex-col justify-between group shadow-xl">
        <div>
          {/* Header Avatar & Species */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-2xl bg-gold-gradient p-[1px] shadow-[0_0_15px_rgba(218,165,32,0.15)] group-hover:shadow-[0_0_20px_rgba(218,165,32,0.3)] transition-all">
                <div className="w-full h-full rounded-2xl bg-[#120524] overflow-hidden flex items-center justify-center text-gold-400 font-serif font-bold text-xl">
                {pet.avatarUrl ? (
                  <img
                    src={pet.avatarUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span>{pet.name.charAt(0)}</span>
                )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif font-extrabold text-white">{pet.name}</h3>
                  <Badge variant="brand" size="sm" className="bg-gold-500/10 text-gold-300 border-gold-500/20 font-sans">
                    {isDog ? '🐶 Canino' : isCat ? '🐱 Felino' : pet.species}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{pet.breed}</p>
                <p className="text-[10px] text-gold-500/60 font-mono mt-0.5">CHIP ID: {pet.microchip || Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Stats Bar (Calculated Age, Weight, Sex) */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 text-center bg-black/40 rounded-xl my-4">
            <div>
              <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-widest">Edad</span>
              <span className="text-xs font-bold text-gold-300">
                {pet.ageFormatted || '1 año'}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-widest">Peso</span>
              <span className="text-xs font-bold text-gold-300">
                {pet.weightKg} kg
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-widest">Sexo</span>
              <span className="text-xs font-bold text-gold-300">
                {pet.sex === 'FEMALE' ? 'Hembra' : 'Macho'}
              </span>
            </div>
          </div>

          {/* Microchip and Notes */}
          {pet.microchip && (
            <p className="text-[11px] text-slate-500 font-mono mb-1">
              Chip: {pet.microchip}
            </p>
          )}
          {pet.notes && (
            <p className="text-xs text-slate-400 italic line-clamp-2">
              "{pet.notes}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHistoryOpen(true)}
              className="flex-1 text-xs gap-1.5 border-white/10 hover:bg-white/5 hover:border-gold-500/50 text-slate-300 transition-all font-bold uppercase tracking-wider"
            >
              <Activity className="w-3.5 h-3.5 text-gold-400" />
              <span>Ficha Médica</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => openWizard()}
              className="flex-1 text-xs gap-1.5 bg-gold-gradient text-[#120524] hover:opacity-90 border-none transition-all font-bold uppercase tracking-wider"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </Button>
          </div>

          {/* Direct Link to Official Pet Health Passport */}
          <Link
            href={`${prefix}/pets/${pet.id}/passport`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20 text-xs font-bold uppercase tracking-wider transition-all shadow-sm group-hover:border-gold-500/50"
          >
            <QrCode className="w-3.5 h-3.5 text-gold-400" />
            <span>Pasaporte Sanitario & QR</span>
          </Link>
        </div>
      </div>

      <MedicalHistoryModal
        pet={pet}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </>
  );
};
