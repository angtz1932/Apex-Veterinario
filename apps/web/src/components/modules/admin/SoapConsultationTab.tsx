'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Save,
  Sparkles,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Pill,
  Clock,
  Printer,
  ChevronDown,
} from 'lucide-react';

interface SoapTemplate {
  name: string;
  category: string;
  s: string;
  o: {
    temp: number;
    hr: number;
    rr: number;
    weight: number;
    bcs: number;
    mucosas: string;
    tllc: string;
    notes: string;
  };
  a: string;
  p: string;
}

const TEMPLATES: SoapTemplate[] = [
  {
    name: 'Gastroenteritis Aguda',
    category: 'Digestivo',
    s: 'Tutor refiere 3 episodios de vómitos alimenticios y biliosos en las últimas 18h. Hiporexia moderada, ingirió restos de comida casera hace 2 días. Heces pastosas sin melena ni hematoquecia evidente.',
    o: {
      temp: 38.6,
      hr: 110,
      rr: 24,
      weight: 24.5,
      bcs: 5,
      mucosas: 'Rosadas húmedas',
      tllc: '< 2 seg',
      notes: 'Abdomen blando depresible, ligera molestia en epigastrio. Linfonodos reactivos no palpables. Deshidratación estimada 5%.',
    },
    a: 'Gastroenteritis aguda de origen dietético / indiscreción alimentaria. Diagnóstico diferencial: Giardiasis, Parvovirosis temprana, Cuerpo extraño.',
    p: '1. Maropitant (Cerenia) 1 mg/kg SC dosis única.\n2. Omeprazol 1 mg/kg VO c/24h por 7 días.\n3. Fluidoterapia de soporte NaCl 0.9% 500ml IV ritmo 40 ml/h.\n4. Dieta blanda gastrointestinal (Gastrointestinal Low Fat) en tomas fraccionadas.\n5. Control en 48 horas o de inmediato si persisten vómitos.',
  },
  {
    name: 'Dermatitis Alérgica / Atopia',
    category: 'Dermatología',
    s: 'Prurito intenso escala 8/10 en zona podal, axilar y pabellones auriculares desde hace 3 semanas. Lamido constante interdigital. Estacional, empeora en primavera.',
    o: {
      temp: 38.3,
      hr: 95,
      rr: 20,
      weight: 18.2,
      bcs: 5,
      mucosas: 'Rosadas',
      tllc: '< 2 seg',
      notes: 'Eritema cutáneo moderado interdigital bilateral. Excoriaciones por rascado en cuello. Pabellón auricular con cerumen parduzco bilateral sin olor fétido.',
    },
    a: 'Dermatitis atópica con sobrecrecimiento secundario de Malassezia sp. en región interdigital.',
    p: '1. Oclacitinib (Apoquel) 0.4-0.6 mg/kg VO c/12h por 14 días, luego c/24h.\n2. Baños con Clorhexidina 3% + Miconazol 2% dos veces por semana.\n3. Limpieza auricular con solución ceruminolítica diaria por 5 días.\n4. Continuar protección antiparasitaria externa estricta mensual (Simparica/Nexgard).',
  },
  {
    name: 'Control Post-Quirúrgico',
    category: 'Cirugía',
    s: 'Paciente a 7 días post-operatorio de esterilización / orquiectomía. Tutor refiere buen apetito y defecación normal. Uso constante de collar isabelino.',
    o: {
      temp: 38.4,
      hr: 90,
      rr: 18,
      weight: 15.0,
      bcs: 5,
      mucosas: 'Rosadas',
      tllc: '< 2 seg',
      notes: 'Herida quirúrgica limpia, seca y en proceso avanzado de cicatrización por primera intención. Sin exudados ni dehiscencia.',
    },
    a: 'Evolución quirúrgica excelente y favorable. Sin signos de infección local.',
    p: '1. Retiro de puntos previsto a los 10-12 días post-cirugía.\n2. Mantener collar isabelino hasta el retiro de suturas.\n3. Descontinuar analgesia (Meloxicam) al cumplir los 5 días de pauta.',
  },
];

export const SoapConsultationTab: React.FC<{
  tenant: string;
  onSaveRecord?: (record: any) => void;
}> = ({ tenant, onSaveRecord }) => {
  const [selectedPet, setSelectedPet] = useState('Apolo (Golden Retriever)');
  const [tutorName, setTutorName] = useState('Carlos Mendoza');

  // S - Subjetivo
  const [subjective, setSubjective] = useState(
    'Paciente acude por control clínico preventivo y evaluación de calendario vacunal.'
  );

  // O - Objetivo
  const [temp, setTemp] = useState('38.5');
  const [hr, setHr] = useState('100');
  const [rr, setRr] = useState('22');
  const [weight, setWeight] = useState('32.0');
  const [bcs, setBcs] = useState(5); // 1-9
  const [mucosas, setMucosas] = useState('Rosadas');
  const [tllc, setTllc] = useState('< 2 seg');
  const [objectiveNotes, setObjectiveNotes] = useState(
    'Paciente alerta y responsivo. Auscultación cardiopulmonar sin soplos ni ruidos sobreagregados. Hidratación normal.'
  );

  // A - Análisis
  const [analysis, setAnalysis] = useState(
    'Paciente clínicamente sano. Apto para inmunización preventiva y plan de salud dental.'
  );

  // P - Plan
  const [plan, setPlan] = useState(
    '1. Aplicación de refuerzo anual DHPP + Rabia.\n2. Profilaxis antiparasitaria trimestral recomendada.\n3. Próximo control rutinario en 6 meses.'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const applyTemplate = (t: SoapTemplate) => {
    setSubjective(t.s);
    setTemp(t.o.temp.toString());
    setHr(t.o.hr.toString());
    setRr(t.o.rr.toString());
    setWeight(t.o.weight.toString());
    setBcs(t.o.bcs);
    setMucosas(t.o.mucosas);
    setTllc(t.o.tllc);
    setObjectiveNotes(t.o.notes);
    setAnalysis(t.a);
    setPlan(t.p);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: `soap-${Date.now()}`,
      petName: selectedPet.split(' ')[0],
      ownerName: tutorName,
      date: new Date().toLocaleDateString('es-ES'),
      diagnosis: analysis,
      treatment: plan,
      soap: {
        s: subjective,
        o: { temp, hr, rr, weight, bcs, mucosas, tllc, objectiveNotes },
        a: analysis,
        p: plan,
      },
    };

    if (onSaveRecord) {
      onSaveRecord(entry);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Templates */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
              Historia Clínica Orientada a Problemas (HCOP)
            </span>
          </div>
          <h2 className="text-lg font-serif font-bold text-white mt-1">
            Módulo de Consulta SOAP & Prescripción Clínica
          </h2>
          <p className="text-xs text-slate-400">
            Formato médico estándar internacional (Subjetivo, Objetivo, Análisis, Plan) con cálculo de constantes vitales.
          </p>
        </div>

        {/* Template Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Plantillas Rápidas:
          </span>
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-slate-200 font-medium transition-all hover:scale-105"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>¡Expediente SOAP guardado y sincronizado exitosamente con la Ficha del Paciente!</span>
          </div>
          <span className="text-[10px] uppercase font-mono text-emerald-400">Ledger Actualizado</span>
        </div>
      )}

      {/* Main SOAP Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Patient Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Paciente Seleccionado
            </label>
            <select
              value={selectedPet}
              onChange={(e) => {
                setSelectedPet(e.target.value);
                if (e.target.value.includes('Apolo')) setTutorName('Carlos Mendoza');
                else if (e.target.value.includes('Misha')) setTutorName('Elena Ramos');
                else if (e.target.value.includes('Thor')) setTutorName('Roberto Gómez');
                else setTutorName('Mariana Silva');
              }}
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="Apolo (Golden Retriever)">Apolo (Canino - Golden Retriever, 3 años)</option>
              <option value="Misha (Felino Siamés)">Misha (Felino - Siamés, 2 años)</option>
              <option value="Thor (Bulldog Francés)">Thor (Canino - Bulldog Francés, 4 años)</option>
              <option value="Luna (Europeo Común)">Luna (Felino - Mestizo, 1 año)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Tutor Legal / Responsable
            </label>
            <input
              type="text"
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* 4 SOAP TILES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* S - SUBJETIVO */}
          <div className="luxury-glass p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-brand-300 border-b border-white/10 pb-2">
              <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs">
                S
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Subjetivo (Anamnesis & Motivo)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Historia clínica según el tutor, cambios de conducta, hábitos dietéticos, síntomas referidos.
            </p>
            <textarea
              rows={5}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 leading-relaxed resize-none"
              required
            />
          </div>

          {/* O - OBJETIVO */}
          <div className="luxury-glass p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-gold-400 border-b border-white/10 pb-2">
              <span className="w-6 h-6 rounded-lg bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-xs">
                O
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Objetivo (Examen Físico & Constantes)
              </h3>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold">Temp (°C)</span>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-white focus:outline-none"
                />
              </div>

              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold">FC (lpm)</span>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-white focus:outline-none"
                />
              </div>

              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold">FR (rpm)</span>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-white focus:outline-none"
                />
              </div>

              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold">Peso (kg)</span>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-white focus:outline-none"
                />
              </div>

              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold">Condición BCS</span>
                <select
                  value={bcs}
                  onChange={(e) => setBcs(Number(e.target.value))}
                  className="w-full bg-transparent font-mono font-bold text-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n} className="bg-slate-900 text-white">
                      BCS {n}/9 {n === 5 ? '(Ideal)' : n < 5 ? '(Bajo)' : '(Sobrepeso)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold">Mucosas</span>
                <input
                  type="text"
                  value={mucosas}
                  onChange={(e) => setMucosas(e.target.value)}
                  className="w-full bg-transparent font-bold text-white focus:outline-none text-xs"
                />
              </div>

              <div className="bg-black/40 p-2 rounded-xl border border-white/5 col-span-2">
                <span className="text-[10px] text-slate-400 block font-bold">TLLC / Hidratación</span>
                <input
                  type="text"
                  value={tllc}
                  onChange={(e) => setTllc(e.target.value)}
                  className="w-full bg-transparent font-bold text-white focus:outline-none text-xs"
                />
              </div>
            </div>

            <textarea
              rows={2}
              value={objectiveNotes}
              onChange={(e) => setObjectiveNotes(e.target.value)}
              placeholder="Hallazgos en palpación, auscultación o inspección..."
              className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* A - ANÁLISIS */}
          <div className="luxury-glass p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-white/10 pb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                A
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Análisis (Diagnóstico & Juicio Clínico)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Diagnóstico presuntivo, diagnósticos diferenciales, evaluación pronóstica.
            </p>
            <textarea
              rows={4}
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
              required
            />
          </div>

          {/* P - PLAN */}
          <div className="luxury-glass p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 border-b border-white/10 pb-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs">
                P
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Plan (Tratamiento & Prescripción Rx)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Medicamentos administrados, receta para casa, exámenes complementarios solicitados y próxima cita.
            </p>
            <textarea
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
              required
            />
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            Registro protegido con firma digital de la clínica ({tenant})
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Receta</span>
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Ficha SOAP</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
