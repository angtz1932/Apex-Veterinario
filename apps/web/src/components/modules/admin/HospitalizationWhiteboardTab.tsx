'use client';

import React, { useState } from 'react';
import {
  BedDouble,
  Activity,
  Droplets,
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldAlert,
  Heart,
  Thermometer,
  UserCheck,
  Zap,
} from 'lucide-react';

interface HospitalizedPatient {
  id: string;
  boxNumber: string;
  boxType: 'CANINE' | 'FELINE' | 'ICU' | 'ISOLATION';
  petName: string;
  species: string;
  breed: string;
  weightKg: number;
  tutorName: string;
  admissionDate: string;
  diagnosis: string;
  vetInCharge: string;
  status: 'STABLE' | 'OBSERVATION' | 'CRITICAL' | 'READY_FOR_DISCHARGE';
  fluidTherapy: {
    solution: string;
    rateMlPerHour: number;
    isActive: boolean;
  };
  medications: {
    id: string;
    name: string;
    route: 'IV' | 'SC' | 'IM' | 'VO';
    dosage: string;
    frequencyHours: number;
    nextDueTime: string;
    lastAdministeredAt?: string;
  }[];
  vitalSigns: {
    temp: number;
    hr: number;
    rr: number;
    painScore: number; // 0-10
  };
}

const INITIAL_PATIENTS: HospitalizedPatient[] = [
  {
    id: 'hosp-1',
    boxNumber: 'BOX 01 - UCI Caninos',
    boxType: 'ICU',
    petName: 'Zeus',
    species: 'Canino',
    breed: 'Golden Retriever',
    weightKg: 32.5,
    tutorName: 'Carlos Mendoza',
    admissionDate: 'Hoy, 07:30 AM',
    diagnosis: 'Post-quirúrgico TPLO (Ruptura Ligamento Cruzado Craneal)',
    vetInCharge: 'Dr. Mateo Rivas (Cirugía)',
    status: 'OBSERVATION',
    fluidTherapy: {
      solution: 'Ringer Lactato + Analgesia CRI',
      rateMlPerHour: 75,
      isActive: true,
    },
    medications: [
      {
        id: 'med-1',
        name: 'Cefazolina 1g',
        route: 'IV',
        dosage: '700 mg',
        frequencyHours: 8,
        nextDueTime: '12:00 PM',
        lastAdministeredAt: '04:00 AM',
      },
      {
        id: 'med-2',
        name: 'Tramadol Clorhidrato',
        route: 'IV',
        dosage: '100 mg lento',
        frequencyHours: 6,
        nextDueTime: '01:30 PM',
        lastAdministeredAt: '07:30 AM',
      },
      {
        id: 'med-3',
        name: 'Meloxicam 0.5%',
        route: 'SC',
        dosage: '6.5 mg',
        frequencyHours: 24,
        nextDueTime: 'Mañana 08:00 AM',
        lastAdministeredAt: '08:00 AM',
      },
    ],
    vitalSigns: {
      temp: 38.6,
      hr: 98,
      rr: 22,
      painScore: 2,
    },
  },
  {
    id: 'hosp-2',
    boxNumber: 'BOX 02 - Medicina Interna',
    boxType: 'CANINE',
    petName: 'Toby',
    species: 'Canino',
    breed: 'Beagle',
    weightKg: 13.8,
    tutorName: 'Andrea Morales',
    admissionDate: 'Ayer, 06:15 PM',
    diagnosis: 'Pancreatitis Aguda Neoplásica / Vómitos intratables',
    vetInCharge: 'Dra. Valeria Soto',
    status: 'STABLE',
    fluidTherapy: {
      solution: 'Plasmalyte A + KCl 20mEq/L',
      rateMlPerHour: 40,
      isActive: true,
    },
    medications: [
      {
        id: 'med-4',
        name: 'Maropitant (Cerenia)',
        route: 'SC',
        dosage: '14 mg',
        frequencyHours: 24,
        nextDueTime: '02:00 PM',
        lastAdministeredAt: 'Ayer 02:00 PM',
      },
      {
        id: 'med-5',
        name: 'Buprenorfina 0.3mg/ml',
        route: 'IV',
        dosage: '0.25 mg',
        frequencyHours: 8,
        nextDueTime: '11:45 AM',
        lastAdministeredAt: '03:45 AM',
      },
    ],
    vitalSigns: {
      temp: 38.2,
      hr: 110,
      rr: 26,
      painScore: 3,
    },
  },
  {
    id: 'hosp-3',
    boxNumber: 'BOX 03 - Pabellón Felino Exclusivo',
    boxType: 'FELINE',
    petName: 'Misha',
    species: 'Felino',
    breed: 'Siamés',
    weightKg: 4.1,
    tutorName: 'Elena Ramos',
    admissionDate: 'Hoy, 09:00 AM',
    diagnosis: 'Síndrome FLUTD / Obstrucción Uretral Desobstruida',
    vetInCharge: 'Dr. Martín Morales',
    status: 'STABLE',
    fluidTherapy: {
      solution: 'NaCl 0.9% Osmolar',
      rateMlPerHour: 15,
      isActive: true,
    },
    medications: [
      {
        id: 'med-6',
        name: 'Prazosina 1mg',
        route: 'VO',
        dosage: '0.5 mg',
        frequencyHours: 12,
        nextDueTime: '03:00 PM',
        lastAdministeredAt: '09:15 AM',
      },
      {
        id: 'med-7',
        name: 'Buprenorfina Sublingual',
        route: 'VO',
        dosage: '0.08 mg transmucosa',
        frequencyHours: 8,
        nextDueTime: '05:00 PM',
        lastAdministeredAt: '09:00 AM',
      },
    ],
    vitalSigns: {
      temp: 38.0,
      hr: 160,
      rr: 30,
      painScore: 1,
    },
  },
  {
    id: 'hosp-4',
    boxNumber: 'BOX 04 - Aislamiento Infeccioso',
    boxType: 'ISOLATION',
    petName: 'Kira',
    species: 'Canino',
    breed: 'Pastor Alemán Cachorro',
    weightKg: 5.2,
    tutorName: 'Javier Luna',
    admissionDate: 'Ayer, 11:30 PM',
    diagnosis: 'Sospecha Parvovirosis Canina (Test Antígeno Positivo)',
    vetInCharge: 'Dra. Valeria Soto',
    status: 'CRITICAL',
    fluidTherapy: {
      solution: 'Ringer Lactato + Glucosa 5% + Metoclopramida CRI',
      rateMlPerHour: 25,
      isActive: true,
    },
    medications: [
      {
        id: 'med-8',
        name: 'Ampicilina / Sulbactam',
        route: 'IV',
        dosage: '110 mg',
        frequencyHours: 8,
        nextDueTime: '12:30 PM',
        lastAdministeredAt: '04:30 AM',
      },
      {
        id: 'med-9',
        name: 'Maropitant SC',
        route: 'SC',
        dosage: '5.2 mg',
        frequencyHours: 24,
        nextDueTime: '06:00 PM',
      },
    ],
    vitalSigns: {
      temp: 39.4,
      hr: 145,
      rr: 35,
      painScore: 4,
    },
  },
];

export const HospitalizationWhiteboardTab: React.FC<{ tenant: string }> = ({ tenant }) => {
  const [patients, setPatients] = useState<HospitalizedPatient[]>(INITIAL_PATIENTS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  const handleAdministerMed = (patientId: string, medId: string, medName: string) => {
    const nowStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: p.medications.map((m) => {
            if (m.id !== medId) return m;
            return {
              ...m,
              lastAdministeredAt: `Hoy ${nowStr}`,
            };
          }),
        };
      })
    );

    setLastActionToast(`Dosis de ${medName} registrada a las ${nowStr}`);
    setTimeout(() => setLastActionToast(null), 3000);
  };

  const handleAdjustFluids = (patientId: string, delta: number) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newRate = Math.max(0, p.fluidTherapy.rateMlPerHour + delta);
        return {
          ...p,
          fluidTherapy: {
            ...p.fluidTherapy,
            rateMlPerHour: newRate,
          },
        };
      })
    );
  };

  const handleToggleFluidStatus = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          fluidTherapy: {
            ...p.fluidTherapy,
            isActive: !p.fluidTherapy.isActive,
          },
        };
      })
    );
  };

  const handleUpdateStatus = (
    patientId: string,
    newStatus: HospitalizedPatient['status']
  ) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );
  };

  const filtered = patients.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.boxType === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Stats & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">
              Pizarra Digital de Hospitalización en Vivo
            </span>
          </div>
          <h2 className="text-lg font-serif font-bold text-white mt-1">
            Monitor de Jaulas, UCI & Fluidoterapia ({tenant})
          </h2>
          <p className="text-xs text-slate-400">
            Control horario de fármacos, bombas de infusión (ml/h) y constantes vitales en internación.
          </p>
        </div>

        {/* Box Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: `Todos (${patients.length})` },
            { id: 'ICU', label: 'UCI Críticos' },
            { id: 'CANINE', label: 'Caninos' },
            { id: 'FELINE', label: 'Felinos' },
            { id: 'ISOLATION', label: 'Aislamiento' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === flt.id
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.1]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {lastActionToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{lastActionToast}</span>
        </div>
      )}

      {/* WHITEBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((patient) => {
          const isCritical = patient.status === 'CRITICAL';
          const isObservation = patient.status === 'OBSERVATION';
          const isDischargeReady = patient.status === 'READY_FOR_DISCHARGE';

          return (
            <div
              key={patient.id}
              className={`luxury-glass rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                isCritical
                  ? 'border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)] bg-rose-950/10'
                  : 'border-white/10 hover:border-brand-500/30 shadow-xl'
              }`}
            >
              <div className="space-y-4">
                {/* Box Title Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        patient.boxType === 'ICU'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : patient.boxType === 'FELINE'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : patient.boxType === 'ISOLATION'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                        {patient.boxNumber}
                      </span>
                      <h3 className="text-base font-serif font-black text-white">
                        {patient.petName}{' '}
                        <span className="text-xs font-sans font-normal text-slate-400">
                          ({patient.breed} • {patient.weightKg} kg)
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={patient.status}
                    onChange={(e) =>
                      handleUpdateStatus(patient.id, e.target.value as any)
                    }
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isObservation
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : isDischargeReady
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    <option value="STABLE" className="bg-slate-900 text-blue-300">
                      Estable
                    </option>
                    <option value="OBSERVATION" className="bg-slate-900 text-amber-300">
                      En Observación
                    </option>
                    <option value="CRITICAL" className="bg-slate-900 text-rose-300">
                      Crítico / UCI
                    </option>
                    <option value="READY_FOR_DISCHARGE" className="bg-slate-900 text-emerald-300">
                      Listo para Alta
                    </option>
                  </select>
                </div>

                {/* Clinical Overview */}
                <div className="space-y-1 text-xs">
                  <p className="text-slate-300">
                    <strong className="text-white font-semibold">Diagnóstico: </strong>
                    <span className="text-gold-300">{patient.diagnosis}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Tutor: {patient.tutorName} • Médico: {patient.vetInCharge} • Ingreso: {patient.admissionDate}
                  </p>
                </div>

                {/* Vital Signs Monitor Ribbon */}
                <div className="grid grid-cols-4 gap-2 bg-black/40 p-2.5 rounded-2xl border border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Temp</span>
                    <span
                      className={`font-mono font-bold ${
                        patient.vitalSigns.temp > 39.2 || patient.vitalSigns.temp < 37.8
                          ? 'text-rose-400 font-black'
                          : 'text-white'
                      }`}
                    >
                      {patient.vitalSigns.temp}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">FC</span>
                    <span className="font-mono font-bold text-white">
                      {patient.vitalSigns.hr} lpm
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">FR</span>
                    <span className="font-mono font-bold text-white">
                      {patient.vitalSigns.rr} rpm
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Dolor</span>
                    <span
                      className={`font-mono font-bold ${
                        patient.vitalSigns.painScore >= 4 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {patient.vitalSigns.painScore}/10
                    </span>
                  </div>
                </div>

                {/* Fluid Therapy Pump */}
                <div className="bg-sky-950/20 border border-sky-500/20 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-sky-400 font-bold">
                      <Droplets className="w-4 h-4" />
                      <span>Bomba de Infusión IV</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFluidStatus(patient.id)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        patient.fluidTherapy.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {patient.fluidTherapy.isActive ? 'Activo (Infusión)' : 'En Pausa'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">{patient.fluidTherapy.solution}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-sky-500/10">
                    <span className="text-[11px] text-slate-400">Ritmo de Infusión:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdjustFluids(patient.id, -5)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-sky-300 text-xs min-w-[50px] text-center">
                        {patient.fluidTherapy.rateMlPerHour} ml/h
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustFluids(patient.id, +5)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Medication Timeline & Administration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-brand-400" />
                      Pauta Farmacológica Programada
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Horarios</span>
                  </div>

                  <div className="space-y-2">
                    {patient.medications.map((med) => (
                      <div
                        key={med.id}
                        className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{med.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-slate-300">
                              {med.route}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {med.dosage} • Cada {med.frequencyHours}h • Próx: <strong className="text-gold-300">{med.nextDueTime}</strong>
                          </p>
                          {med.lastAdministeredAt && (
                            <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                              Última aplicación: {med.lastAdministeredAt}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAdministerMed(patient.id, med.id, med.name)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all hover:scale-105"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Aplicar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Box Card Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5 text-brand-400" />
                  Ronda de enfermería activa
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  ID: {patient.id.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
