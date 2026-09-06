'use client';

import React, { useState } from 'react';
import { PetDTO, MedicalRecordDTO, VaccinationDTO } from '@apex/shared';
import { Modal } from '@/components/shared/Modal';
import { Tabs } from '@/components/shared/Tabs';
import { Badge } from '@/components/shared/Badge';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  Syringe,
  Calendar,
  User,
  Activity,
  CheckCircle,
} from 'lucide-react';

export const MedicalHistoryModal: React.FC<{
  pet: PetDTO | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pet, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('history');

  if (!pet) return null;

  const records = pet.medicalRecords || [];
  const vaccinations = pet.vaccinations || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-brand-300 flex items-center justify-center border border-white/10">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-slate-100">Ficha Clínica: {pet.name}</span>
        </div>
      }
      description={`Historial médico y cartola de vacunación oficial (${pet.species} • ${pet.breed})`}
    >
      <div className="space-y-4">
        <Tabs
          activeId={activeTab}
          onChange={setActiveTab}
          items={[
            {
              id: 'history',
              label: 'Consultas & Diagnósticos',
              count: records.length,
              icon: <FileText className="w-3.5 h-3.5" />,
            },
            {
              id: 'vaccines',
              label: 'Inmunización & Vacunas',
              count: vaccinations.length,
              icon: <Syringe className="w-3.5 h-3.5" />,
            },
          ]}
        />

        {/* Tab 1: Medical Records Timeline */}
        {activeTab === 'history' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {records.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                No hay registros médicos cargados para esta mascota.
              </p>
            ) : (
              records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-brand-400" />
                      <span>{formatDate(rec.visitDate)}</span>
                    </div>
                    {rec.veterinarianName && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        Atendido por: {rec.veterinarianName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-bold text-slate-300">Diagnóstico: </span>
                      <span className="text-slate-100">{rec.diagnosis}</span>
                    </p>
                    <p>
                      <span className="font-bold text-slate-300">Tratamiento prescrito: </span>
                      <span className="text-slate-400">{rec.treatment}</span>
                    </p>
                    {rec.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-white/5 p-2 rounded-lg border border-white/10">
                        "{rec.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Vaccinations */}
        {activeTab === 'vaccines' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {vaccinations.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                No hay registro de vacunas aplicadas aún.
              </p>
            ) : (
              vaccinations.map((vac) => (
                <div
                  key={vac.id}
                  className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{vac.vaccineName}</h4>
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3" /> Aplicada
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Fecha: {formatDate(vac.administeredAt)}
                      {vac.batchNumber && ` • Lote: ${vac.batchNumber}`}
                    </p>
                  </div>

                  {vac.nextDueDate && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Próxima dosis
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {formatDate(vac.nextDueDate)}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
