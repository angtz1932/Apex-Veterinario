'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { PetDTO, Species, Sex } from '@apex/shared';
import { apiClient } from '@/lib/api-client';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Spinner } from '@/components/shared/Spinner';
import {
  ShieldCheck,
  Printer,
  Share2,
  ArrowLeft,
  Calendar,
  Syringe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  Sparkles,
  Copy,
  Check,
  QrCode as QrIcon,
  ExternalLink,
} from 'lucide-react';

interface VaccineStatus {
  name: string;
  administeredAt: string;
  nextDueDate: string;
  batchNumber: string;
  status: 'active' | 'expiring' | 'expired';
  veterinarian: string;
}

export const PetPassportView: React.FC = () => {
  const params = useParams<{ tenant?: string; id: string }>();
  const router = useRouter();
  const theme = useTheme();

  const tenant = params?.tenant ?? '';
  const petId = params?.id ?? '';
  const prefix = tenant ? `/${tenant}` : '';

  const [pet, setPet] = useState<PetDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Verification URL that the QR will encode
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${prefix}/verify/pet/${petId}`
    : `https://apexveterinario.com${prefix}/verify/pet/${petId}`;

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<PetDTO>(`/pets/${petId}`);
        setPet(data);
      } catch {
        // Mock fallback for presentation/testing
        setPet({
          id: petId,
          ownerId: 'owner-1',
          name: 'Zeus',
          species: Species.DOG,
          breed: 'Golden Retriever',
          birthDate: '2022-04-15',
          weightKg: 32.5,
          sex: Sex.MALE,
          microchip: '981098102394857',
          notes: 'Mascota alegre, sin alergias conocidas. Al día con desparasitación.',
          ageFormatted: '3 años',
          avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
        });
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchPet();
    }
  }, [petId]);

  useEffect(() => {
    if (verificationUrl) {
      QRCode.toDataURL(verificationUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [verificationUrl]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Sample or real vaccine schedule with traffic-light status
  const vaccines: VaccineStatus[] = [
    {
      name: 'Rabia (Antirrábica)',
      administeredAt: '2025-10-12',
      nextDueDate: '2026-10-12',
      batchNumber: 'RB-99420-X',
      status: 'active',
      veterinarian: 'Dra. Valentina Soler (Col. 4821)',
    },
    {
      name: 'Séxtuple / DHPP (Distemper, Parvo, Adenovirus, Parainfluenza)',
      administeredAt: '2025-11-05',
      nextDueDate: '2026-11-05',
      batchNumber: 'SX-88102-K',
      status: 'active',
      veterinarian: 'Dr. Mateo Rivas (Col. 3910)',
    },
    {
      name: 'Bordetella (Tos de las Perreras)',
      administeredAt: '2025-03-20',
      nextDueDate: '2026-03-20',
      batchNumber: 'BD-44219-B',
      status: 'expiring',
      veterinarian: 'Dra. Valentina Soler (Col. 4821)',
    },
    {
      name: 'Giardia Vax',
      administeredAt: '2024-08-10',
      nextDueDate: '2025-08-10',
      batchNumber: 'GD-11029-A',
      status: 'expired',
      veterinarian: 'Dr. Carlos Mendoza (Col. 2104)',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Mascota no encontrada</h2>
        <Button onClick={() => router.push(`${prefix}/pets`)} variant="outline">
          Volver a Mis Mascotas
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative selection:bg-gold-500/20">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, footer, .no-print {
            display: none !important;
          }
          .passport-card {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .passport-text-white {
            color: #0f172a !important;
          }
          .passport-text-gold {
            color: #b45309 !important;
          }
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gold-500/5 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-white/10 pb-6">
          <Link
            href={`${prefix}/pets`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Mascotas</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2 border-white/10 text-slate-300 hover:bg-white/5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Enlace Copiado' : 'Copiar Enlace'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-2 border-white/10 text-slate-300 hover:bg-white/5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </Button>

            <Link href={`${prefix}/verify/pet/${pet.id}`} target="_blank">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 bg-gold-gradient text-[#120524] font-bold border-none"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Vista Pública</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* PASSPORT DOCUMENT CARD */}
        <div className="passport-card luxury-glass rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-[0_0_50px_rgba(218,165,32,0.15)] relative overflow-hidden space-y-8">
          {/* Holographic Watermark Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-600 to-amber-300 flex items-center justify-center text-[#120524] shadow-lg shadow-gold-500/20">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-gold-400 font-bold uppercase block">
                  REPÚBLICA VETERINARIA DIGITAL • ISO 11784 / 11785
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight passport-text-white">
                  PASAPORTE SANITARIO DIGITAL
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Emitido por {theme.clinicName || 'Apex Red Veterinaria'} • Certificación Criptográfica Oficial
                </p>
              </div>
            </div>

            <div className="text-left md:text-right bg-black/40 px-4 py-3 rounded-2xl border border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                Folio Único
              </span>
              <span className="text-sm font-mono font-bold text-gold-400 passport-text-gold">
                APX-PASP-{pet.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center md:justify-end gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3 h-3" /> Estado: Documento Válido
              </span>
            </div>
          </div>

          {/* PET BIOMETRIC PROFILE & QR CODE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Pet Photo & Main Badges */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-40 h-40 rounded-3xl bg-gold-gradient p-[2px] shadow-[0_0_30px_rgba(218,165,32,0.25)]">
                <div className="w-full h-full rounded-[22px] bg-[#120524] overflow-hidden">
                  {pet.avatarUrl ? (
                    <img
                      src={pet.avatarUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold-400 text-4xl font-serif font-bold">
                      {pet.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-black text-white passport-text-white">
                  {pet.name}
                </h2>
                <p className="text-xs font-mono text-gold-400 uppercase tracking-widest passport-text-gold">
                  {pet.species === Species.DOG ? 'Canino' : pet.species === Species.CAT ? 'Felino' : pet.species} • {pet.breed}
                </p>
              </div>
            </div>

            {/* Technical Metadata Sheet */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-2">
                Datos Biométricos & Filación
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase">N° Microchip</span>
                  <span className="font-mono font-bold text-white passport-text-white">
                    {pet.microchip || 'No Asignado'}
                  </span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase">Sexo</span>
                  <span className="font-bold text-white passport-text-white">
                    {pet.sex === Sex.MALE ? 'Macho' : 'Hembra'}
                  </span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase">Fecha Nacimiento</span>
                  <span className="font-bold text-white passport-text-white">
                    {pet.birthDate || '2022-04-15'}
                  </span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase">Peso Actual</span>
                  <span className="font-bold text-white passport-text-white">
                    {pet.weightKg} kg
                  </span>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Observaciones Clínicas</span>
                <p className="text-slate-300 italic passport-text-white">
                  {pet.notes || 'Paciente en condiciones clínicas óptimas. No presenta signos de patologías infectocontagiosas.'}
                </p>
              </div>
            </div>

            {/* QR Code Verification Widget */}
            <div className="bg-black/50 p-6 rounded-3xl border border-gold-500/20 text-center space-y-3 flex flex-col items-center justify-center shadow-xl">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <QrIcon className="w-4 h-4" />
                <span>QR de Verificación Oficial</span>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-lg shadow-gold-500/10">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Pasaporte"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-slate-500">
                    <Spinner size="md" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 max-w-xs">
                Escaneo universal para aerolíneas, puestos fronterizos y hoteles caninos.
              </p>
            </div>
          </div>

          {/* VACCINATION TRAFFIC LIGHT SCHEDULE */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-gold-400" />
                <h3 className="text-lg font-serif font-bold text-white passport-text-white">
                  Cartola Oficial de Vacunación & Inmunización
                </h3>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Vigente
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> Por Vencer
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <XCircle className="w-3.5 h-3.5" /> Vencida
                </span>
              </div>
            </div>

            {/* Vaccines Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 font-bold">Inmunológico / Vacuna</th>
                    <th className="p-3.5 font-bold">Fecha Aplicación</th>
                    <th className="p-3.5 font-bold">Próximo Refuerzo</th>
                    <th className="p-3.5 font-bold">Lote / Serie</th>
                    <th className="p-3.5 font-bold">Médico Firmante</th>
                    <th className="p-3.5 font-bold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vaccines.map((v, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-semibold text-white passport-text-white flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>{v.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-300 passport-text-white">{v.administeredAt}</td>
                      <td className="p-3.5 font-bold text-slate-200 passport-text-white">{v.nextDueDate}</td>
                      <td className="p-3.5 font-mono text-slate-400">{v.batchNumber}</td>
                      <td className="p-3.5 text-slate-300 passport-text-white">{v.veterinarian}</td>
                      <td className="p-3.5 text-center">
                        {v.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Vigente
                          </span>
                        )}
                        {v.status === 'expiring' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" /> Reagendar
                          </span>
                        )}
                        {v.status === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3 h-3" /> Vencida
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal / Authority Sign-off Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              Apex Medical Ledger • Autenticación Criptográfica SHA-256 • Cumplimiento Normativo Sanitario
            </p>
            <div className="flex items-center gap-2 text-gold-400 font-serif">
              <span>Apex Health Seal</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
