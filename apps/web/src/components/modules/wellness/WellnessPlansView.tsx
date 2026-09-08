'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import {
  ShieldCheck,
  Sparkles,
  Check,
  HeartHandshake,
  Award,
  Zap,
  Clock,
  HelpCircle,
  CreditCard,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';

interface WellnessPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  monthlyPrice: number;
  annualPrice: number;
  targetAge: string;
  description: string;
  features: string[];
  savingsAnnual: number;
}

const PLANS: WellnessPlan[] = [
  {
    id: 'puppy-kitten',
    name: 'Plan Cachorro & Gatito VIP',
    badge: 'Primeros 12 meses',
    monthlyPrice: 29.99,
    annualPrice: 299.99,
    targetAge: '0 a 12 meses de edad',
    description: 'La base inmunológica perfecta para el desarrollo saludable de cachorros y gatitos.',
    savingsAnnual: 280,
    features: [
      '100% Vacunas esenciales incluidas (DHPP, Rabia, Traqueobronquitis / Triple Felina)',
      'Desparasitación interna y externa mensual con Simparica / Revolution',
      'Consultas veterinarias generales ilimitadas ($0 copago)',
      'Implantación y registro oficial de Microchip ISO',
      '10% Descuento directo en farmacia, alimentos y accesorios',
      'Pasaporte Sanitario Digital con validación QR oficial',
    ],
  },
  {
    id: 'adult-vital',
    name: 'Plan Adulto Vitalidad',
    badge: 'MÁS ELEGIDO',
    isPopular: true,
    monthlyPrice: 39.99,
    annualPrice: 399.99,
    targetAge: '1 a 7 años de edad',
    description: 'Cuidado preventivo integral de máxima categoría con odontología y laboratorio incluidos.',
    savingsAnnual: 460,
    features: [
      'Todo lo incluido en el Plan Cachorro',
      '1 Limpieza dental ultrasónica anual (Profilaxis grado I-II bajo anestesia)',
      'Perfil Bioquímico completo + Hemograma anual preventivo',
      'Consultas de urgencia 24/7 sin recargo nocturno',
      '15% Descuento en cirugías electivas y días de hospitalización',
      'Acceso prioritario y fila preferente para citas clínicas',
      'Auto-Ship programado con 10% de ahorro adicional en alimentos',
    ],
  },
  {
    id: 'senior-golden',
    name: 'Plan Senior Golden Age',
    badge: 'Cuidado Geriátrico Especializado',
    monthlyPrice: 54.99,
    annualPrice: 549.99,
    targetAge: 'Mayores de 7 años',
    description: 'Protección especializada para longevidad, articulaciones, función renal y cardíaca.',
    savingsAnnual: 650,
    features: [
      'Todo lo incluido en el Plan Adulto Vitalidad',
      '2 Chequeos geriátricos anuales con Electrocardiograma',
      '1 Ecografía Abdominal preventiva de alta resolución anual',
      'Monitoreo trimestral de Presión Arterial y Uroanálisis',
      'Terapia condroprotectora articular mensual para artritis',
      '20% Descuento en todas las áreas de la clínica y farmacia',
      'Atención y asesoría nutricional geriátrica personalizada',
    ],
  },
];

const FAQS = [
  {
    q: '¿Qué ocurre si tengo más de una mascota?',
    a: 'Ofrecemos un 15% de descuento familiar automático en la suscripción de la segunda mascota en adelante.',
  },
  {
    q: '¿Puedo cancelar mi plan en cualquier momento?',
    a: 'Sí, las membresías mensuales no tienen permanencia forzosa y puedes cancelarlas o pausarlas con un solo clic desde tu panel.',
  },
  {
    q: '¿Los procedimientos no utilizados se acumulan?',
    a: 'Las revisiones y perfiles preventivos anuales (como la profilaxis dental y analíticas) están disponibles durante los 12 meses de vigencia de tu plan.',
  },
  {
    q: '¿El plan funciona en cualquier sede de la red Apex?',
    a: 'Sí, tu membresía y Pasaporte Sanitario Digital están interconectados y son válidos en todas las clínicas de nuestra red.',
  },
];

export const WellnessPlansView: React.FC = () => {
  const params = useParams<{ tenant?: string }>();
  const theme = useTheme();
  const { user } = useAuthStore();

  const tenant = params?.tenant ?? '';
  const prefix = tenant ? `/${tenant}` : '';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<WellnessPlan | null>(null);
  const [petName, setPetName] = useState('Zeus');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleOpenSubscribe = (plan: WellnessPlan) => {
    setSelectedPlan(plan);
    setSubscribedSuccess(false);
  };

  const handleConfirmSubscription = () => {
    setSubscribedSuccess(true);
    setTimeout(() => {
      setSelectedPlan(null);
      setSubscribedSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-gold-500/20">
      {/* Background orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] bg-brand-600/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[35rem] h-[35rem] bg-gold-500/10 rounded-full mix-blend-screen filter blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Membresías Preventivas Apex Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
            Salud Médica Continua para tu Mascota con un Pago Mensual Fijo
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Evita gastos imprevistos y dale a tu compañero la mejor medicina preventiva: vacunas, consultas ilimitadas,
            limpiezas dentales y analíticas de laboratorio cubiertas al 100%.
          </p>

          {/* Billing Frequency Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="luxury-glass p-1.5 rounded-2xl border border-white/15 inline-flex items-center gap-1 shadow-lg">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensual
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-gold-gradient text-[#120524] shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#120524] text-gold-300 font-extrabold uppercase tracking-tight">
                  2 Meses Gratis
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            const periodLabel = billingCycle === 'monthly' ? '/mes' : '/año';

            return (
              <div
                key={plan.id}
                className={`luxury-glass rounded-3xl p-8 flex flex-col justify-between transition-all relative group ${
                  plan.isPopular
                    ? 'border-2 border-gold-500/50 shadow-[0_0_40px_rgba(218,165,32,0.2)] lg:-translate-y-2 bg-[#0d071d]/90'
                    : 'border border-white/10 hover:border-brand-500/40 shadow-xl'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-gradient text-[#120524] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold-500/30">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div>
                    {!plan.isPopular && plan.badge && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-300 font-bold block mb-1">
                        {plan.badge}
                      </span>
                    )}
                    <h2 className="text-2xl font-serif font-black text-white">{plan.name}</h2>
                    <p className="text-xs text-gold-400/90 font-medium mt-1">
                      Enfoque: {plan.targetAge}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="py-4 border-y border-white/10 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-serif font-black text-white tracking-tight">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{periodLabel}</span>
                    </div>

                    <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Ahorro clínico estimado de hasta ${plan.savingsAnnual}/año
                    </p>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                      Beneficios y Servicios Incluidos:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Subscribe Button */}
                <div className="pt-8 mt-6 border-t border-white/10">
                  <Button
                    variant={plan.isPopular ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={() => handleOpenSubscribe(plan)}
                    className={`w-full text-xs uppercase tracking-wider font-bold py-3.5 rounded-xl transition-all shadow-lg ${
                      plan.isPopular
                        ? 'bg-gold-gradient text-[#120524] hover:opacity-95 shadow-gold-500/20 border-none'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
                    }`}
                  >
                    <span>Suscribir a {plan.name.split(' ')[1]}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* WHY WELLNESS BANNER */}
        <div className="luxury-glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Prevención Proactiva</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detecta enfermedades a tiempo antes de que requieran hospitalización.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-300 shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Ahorro de hasta 45%</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ahorra cientos de dólares en comparación con pagar cada vacuna y consulta por separado.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Tranquilidad Total</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Citas de revisión sin costo siempre que tengas una duda sobre tu compañero.
              </p>
            </div>
          </div>
        </div>

        {/* FAQS */}
        <div className="space-y-4 max-w-3xl mx-auto pt-6">
          <div className="text-center space-y-1 mb-6">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Resolvemos tus dudas
            </span>
            <h2 className="text-2xl font-serif font-bold text-white">
              Preguntas Frecuentes sobre las Membresías
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="luxury-glass rounded-2xl p-4 border border-white/10 space-y-2 cursor-pointer transition-all hover:border-white/20"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-sm font-bold text-white">
                  <span>{faq.q}</span>
                  <HelpCircle className="w-4 h-4 text-gold-400" />
                </div>
                {openFaq === idx && (
                  <p className="text-xs text-slate-300 pt-2 border-t border-white/5 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBSCRIPTION MODAL */}
        {selectedPlan && (
          <Modal
            isOpen={!!selectedPlan}
            onClose={() => setSelectedPlan(null)}
            maxWidth="md"
            title={
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                <span className="text-white font-serif font-bold">
                  Suscripción: {selectedPlan.name}
                </span>
              </div>
            }
            description="Activa la cobertura clínica integral para tu mascota en la red Apex."
          >
            <div className="space-y-5">
              {subscribedSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    ¡Membresía Activada Exitosamente!
                  </h3>
                  <p className="text-xs text-slate-300">
                    {petName} ahora cuenta con cobertura preventiva completa. Puedes consultar su Pasaporte Sanitario Digital en cualquier momento.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Plan Seleccionado:</span>
                      <span className="text-xs font-bold text-white">{selectedPlan.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Modalidad de Pago:</span>
                      <span className="text-xs font-bold text-gold-300 uppercase">
                        {billingCycle === 'monthly' ? 'Mensual Recurrente' : 'Anual (2 meses gratis)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                      <span className="font-bold text-white">Importe Total:</span>
                      <span className="font-serif font-black text-emerald-400 text-lg">
                        ${billingCycle === 'monthly' ? selectedPlan.monthlyPrice.toFixed(2) : selectedPlan.annualPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Nombre de la Mascota Beneficiaria
                    </label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Ej. Zeus, Misha..."
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <CreditCard className="w-4 h-4 text-brand-400" />
                      <span>Método de Pago Seguro</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cobro automático respaldado con cifrado bancario TLS 256-bit. Cancela cuando lo desees sin penalización.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlan(null)}
                      className="text-xs"
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleConfirmSubscription}
                      className="bg-gold-gradient text-[#120524] font-black border-none text-xs gap-2 shadow-lg shadow-gold-500/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirmar Membresía</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
