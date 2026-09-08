'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/context/ThemeProvider';
import {
  Calendar,
  Users,
  Package,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Stethoscope,
  Activity,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  BedDouble,
} from 'lucide-react';
import { SoapConsultationTab } from '@/components/modules/admin/SoapConsultationTab';
import { HospitalizationWhiteboardTab } from '@/components/modules/admin/HospitalizationWhiteboardTab';

interface MockAppointment {
  id: string;
  petName: string;
  species: string;
  ownerName: string;
  serviceName: string;
  veterinarian: string;
  time: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  price: number;
}

interface MockInventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

interface MockMedicalEntry {
  id: string;
  petName: string;
  ownerName: string;
  date: string;
  vetName: string;
  diagnosis: string;
  treatment: string;
  type: 'CONSULTATION' | 'VACCINATION';
}

export default function AdminDashboardPage() {
  const params = useParams<{ tenant: string }>();
  const router = useRouter();
  const { user, login } = useAuthStore();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<'agenda' | 'soap' | 'hospital' | 'medical' | 'inventory'>('agenda');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de datos interactivos para el dashboard
  const [appointments, setAppointments] = useState<MockAppointment[]>([
    {
      id: 'apt-1',
      petName: 'Apolo',
      species: 'Canino (Golden Retriever)',
      ownerName: 'Carlos Mendoza',
      serviceName: 'Consulta Veterinaria General',
      veterinarian: 'Dra. Valeria Soto',
      time: '09:30 AM',
      status: 'CONFIRMED',
      price: 35.0,
    },
    {
      id: 'apt-2',
      petName: 'Misha',
      species: 'Felino (Siamés)',
      ownerName: 'Elena Ramos',
      serviceName: 'Plan de Vacunación Integral',
      veterinarian: 'Dr. Martín Morales',
      time: '11:00 AM',
      status: 'IN_PROGRESS',
      price: 30.0,
    },
    {
      id: 'apt-3',
      petName: 'Thor',
      species: 'Canino (Bulldog Francés)',
      ownerName: 'Roberto Gómez',
      serviceName: 'Control y Profilaxis Dental',
      veterinarian: 'Dra. Valeria Soto',
      time: '02:15 PM',
      status: 'CONFIRMED',
      price: 75.0,
    },
    {
      id: 'apt-4',
      petName: 'Luna',
      species: 'Felino (Europeo común)',
      ownerName: 'Mariana Silva',
      serviceName: 'Desparasitación Interna y Externa',
      veterinarian: 'Dr. Martín Morales',
      time: '04:00 PM',
      status: 'COMPLETED',
      price: 28.0,
    },
  ]);

  const [inventory, setInventory] = useState<MockInventoryItem[]>([
    {
      id: 'inv-1',
      name: 'Purina Pro Plan Adult OptiHealth 15kg',
      sku: 'PUR-PRO-001',
      category: 'Alimentos',
      stock: 35,
      price: 78.5,
      status: 'IN_STOCK',
    },
    {
      id: 'inv-2',
      name: 'Royal Canin Feline Indoor 4kg',
      sku: 'ROY-CAT-002',
      category: 'Alimentos',
      stock: 4,
      price: 46.9,
      status: 'LOW_STOCK',
    },
    {
      id: 'inv-3',
      name: 'Bravecto Masticable 10-20kg',
      sku: 'MSD-BRAV-003',
      category: 'Farmacia',
      stock: 50,
      price: 38.0,
      status: 'IN_STOCK',
    },
    {
      id: 'inv-4',
      name: 'Vacuna Séxtuple Canina DHPPi',
      sku: 'BIO-VAC-004',
      category: 'Biológicos',
      stock: 2,
      price: 22.0,
      status: 'LOW_STOCK',
    },
  ]);

  const [medicalEntries, setMedicalEntries] = useState<MockMedicalEntry[]>([
    {
      id: 'med-1',
      petName: 'Apolo',
      ownerName: 'Carlos Mendoza',
      date: 'Hoy, 09:45 AM',
      vetName: 'Dra. Valeria Soto',
      diagnosis: 'Otitis externa eritematosa leve en oído derecho',
      treatment: 'Gotas óticas con ciprofloxacino y limpieza diaria por 7 días',
      type: 'CONSULTATION',
    },
    {
      id: 'med-2',
      petName: 'Luna',
      ownerName: 'Mariana Silva',
      date: 'Ayer, 04:30 PM',
      vetName: 'Dr. Martín Morales',
      diagnosis: 'Control preventivo y refuerzo inmunológico',
      treatment: 'Vacuna antirrábica aplicada. Carnet firmado.',
      type: 'VACCINATION',
    },
  ]);

  // Formulario nueva historia clínica
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [targetPet, setTargetPet] = useState('Apolo');

  const handleUpdateStatus = (id: string, newStatus: MockAppointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  };

  const handleAdjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            status: newStock === 0 ? 'OUT_OF_STOCK' : newStock <= 5 ? 'LOW_STOCK' : 'IN_STOCK',
          };
        }
        return item;
      }),
    );
  };

  const handleSaveMedicalRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis || !newTreatment) return;

    const newRecord: MockMedicalEntry = {
      id: `med-${Date.now()}`,
      petName: targetPet,
      ownerName: targetPet === 'Apolo' ? 'Carlos Mendoza' : 'Elena Ramos',
      date: 'Reciente',
      vetName: user?.name ?? 'Dr. Veterinario',
      diagnosis: newDiagnosis,
      treatment: newTreatment,
      type: 'CONSULTATION',
    };

    setMedicalEntries([newRecord, ...medicalEntries]);
    setNewDiagnosis('');
    setNewTreatment('');
  };

  const handleDemoVetLogin = async () => {
    try {
      await login('valeria@apexvet.com', 'demo1234', params.tenant);
    } catch {
      // fallback local si el api aún no estuviera escuchando
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchStatus = filterStatus === 'ALL' || apt.status === filterStatus;
    const matchSearch =
      apt.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#060010] text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera del Panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
                  Panel Clínico Administrativo
                </h1>
                <p className="text-xs text-brand-300 font-sans tracking-wider uppercase">
                  {theme.clinicName ?? 'Apex Veterinario'} • Tenant: {params.tenant}
                </p>
              </div>
            </div>
          </div>

          {/* Estado de Sesión / Acceso Rápido */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-xs">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-slate-400 uppercase text-[10px]">{user.role}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Modo Demostración:</span>
                <button
                  onClick={handleDemoVetLogin}
                  className="px-3.5 py-2 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-medium hover:bg-brand-500/30 transition-all flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Conectar como Veterinaria
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="luxury-glass p-5 rounded-2xl space-y-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider font-medium">Citas Hoy</span>
              <Calendar className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 2 pendientes por atender
            </p>
          </div>

          <div className="luxury-glass p-5 rounded-2xl space-y-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider font-medium">Pacientes Activos</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">128</div>
            <p className="text-[11px] text-slate-400">Perros, gatos y exóticos</p>
          </div>

          <div className="luxury-glass p-5 rounded-2xl space-y-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider font-medium">Ingresos Estimados</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">$ 168.00</div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Facturación acumulada
            </p>
          </div>

          <div className="luxury-glass p-5 rounded-2xl space-y-2 border border-white/10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider font-medium">Alertas Stock</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">2</div>
            <p className="text-[11px] text-amber-400/80">Productos por agotarse</p>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
              activeTab === 'agenda'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Agenda de Consultas
          </button>

          <button
            onClick={() => setActiveTab('soap')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
              activeTab === 'soap'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Consulta Médica (SOAP)
          </button>

          <button
            onClick={() => setActiveTab('hospital')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
              activeTab === 'hospital'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            Monitor Hospitalización (UCI)
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
              activeTab === 'medical'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Fichas Médicas & Vacunas
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventario & Farmacia
          </button>
        </div>

        {/* CONTENIDO TAB 1: AGENDA DE CONSULTAS */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Buscador */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar mascota, dueño o servicio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Filtros de estado */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === st
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL'
                      ? 'Todas'
                      : st === 'CONFIRMED'
                      ? 'Confirmadas'
                      : st === 'IN_PROGRESS'
                      ? 'En Curso'
                      : 'Completadas'}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Citas */}
            <div className="grid grid-cols-1 gap-3">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="luxury-glass p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-500/30 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{apt.petName}</h3>
                        <span className="text-xs text-slate-400">({apt.species})</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            apt.status === 'CONFIRMED'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : apt.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {apt.status === 'CONFIRMED'
                            ? 'Confirmada'
                            : apt.status === 'IN_PROGRESS'
                            ? 'En Consulta'
                            : 'Completada'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{apt.serviceName}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tutor: {apt.ownerName} • Especialista: {apt.veterinarian} • Horario: {apt.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center">
                    <span className="text-sm font-bold text-white mr-2">${apt.price.toFixed(2)}</span>
                    {apt.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-all flex items-center gap-1"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Llamar a Consulta
                      </button>
                    )}
                    {apt.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30 transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Finalizar Consulta
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENIDO TAB SOAP: CONSULTA MÉDICA */}
        {activeTab === 'soap' && (
          <SoapConsultationTab
            tenant={params.tenant}
            onSaveRecord={(newEntry) => setMedicalEntries([newEntry, ...medicalEntries])}
          />
        )}

        {/* CONTENIDO TAB HOSPITAL: MONITOR DE HOSPITALIZACIÓN Y UCI */}
        {activeTab === 'hospital' && (
          <HospitalizationWhiteboardTab tenant={params.tenant} />
        )}

        {/* CONTENIDO TAB 2: FICHAS MÉDICAS Y VACUNAS */}
        {activeTab === 'medical' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario Nueva Ficha Médica */}
            <div className="lg:col-span-1 luxury-glass p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Registrar Ficha Clínica
                </h2>
              </div>
              <form onSubmit={handleSaveMedicalRecord} className="space-y-3.5">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Mascota Paciente</label>
                  <select
                    value={targetPet}
                    onChange={(e) => setTargetPet(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Apolo">Apolo (Golden Retriever - Carlos Mendoza)</option>
                    <option value="Misha">Misha (Siamés - Elena Ramos)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Diagnóstico Clínico</label>
                  <textarea
                    rows={3}
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    placeholder="Ej. Faringitis bacteriana, peso 32kg, temperatura 38.5°C..."
                    className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tratamiento & Prescripción</label>
                  <textarea
                    rows={3}
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    placeholder="Ej. Amoxicilina 250mg c/12h por 7 días, reposo y dieta blanda..."
                    className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold hover:from-brand-500 hover:to-brand-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Guardar Historial Clínico
                </button>
              </form>
            </div>

            {/* Historial Registrado */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Expedientes Clínicos Recientes
              </h2>
              {medicalEntries.map((med) => (
                <div
                  key={med.id}
                  className="luxury-glass p-5 rounded-2xl border border-white/10 space-y-2 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{med.petName}</span>
                      <span className="text-xs text-slate-400">({med.ownerName})</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{med.date}</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong className="text-brand-300 font-medium">Diagnóstico: </strong>
                      <span className="text-slate-300">{med.diagnosis}</span>
                    </p>
                    <p>
                      <strong className="text-emerald-400 font-medium">Tratamiento: </strong>
                      <span className="text-slate-300">{med.treatment}</span>
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                    Profesional a cargo: {med.vetName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENIDO TAB 3: INVENTARIO */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catálogo Físico y Farmacia Veterinaria
              </h2>
              <span className="text-xs text-slate-500">
                Ajuste directo de stock para clínica: {params.tenant}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="luxury-glass p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {item.category} • SKU: {item.sku}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-0.5">{item.name}</h3>
                    <p className="text-xs font-bold text-emerald-400 mt-1">${item.price.toFixed(2)}</p>
                    <span
                      className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'IN_STOCK'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.status === 'IN_STOCK'
                        ? `${item.stock} disponibles`
                        : `¡Alerta! Solo ${item.stock} restantes`}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-slate-400">Stock</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-sm transition-all"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.stock}</span>
                      <button
                        onClick={() => handleAdjustStock(item.id, +1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-sm transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
