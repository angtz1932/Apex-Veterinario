'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { AppointmentDTO, AppointmentStatus } from '@apex/shared';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export default function AppointmentsPage() {
  const openWizard = useAppointmentStore((state) => state.openWizard);

  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<AppointmentDTO[]>('/appointments/upcoming')
      .then((res) => setAppointments(res || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Agenda Médica
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Mis Citas Clínicas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revisa tus próximos turnos veterinarios, horarios confirmados y profesionales a cargo.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => openWizard()}
          className="gap-2 shrink-0 shadow-md shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No tienes citas agendadas"
          description="Agenda una consulta preventiva, vacuna o sesión de peluquería para tu mascota."
          action={
            <Button variant="primary" size="sm" onClick={() => openWizard()}>
              Agendar Primera Cita
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-3 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{app.serviceName}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Mascota: <strong className="text-slate-200">{app.petName}</strong>
                    </p>
                  </div>
                </div>

                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3" /> Confirmada
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>{formatDateTime(app.scheduledAt)}</span>
                </div>
                {app.veterinarianName && (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    <span>{app.veterinarianName}</span>
                  </div>
                )}
              </div>

              {app.notes && (
                <p className="text-[11px] text-slate-400 bg-black/20 p-2 rounded-lg italic border border-white/5">
                  "{app.notes}"
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-slate-400">Arancel del servicio:</span>
                <span className="font-extrabold text-brand-300">
                  {formatCurrency(app.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
