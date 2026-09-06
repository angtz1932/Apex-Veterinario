'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { PetDTO } from '@apex/shared';
import { PetCard } from '@/components/modules/pets/PetCard';
import { PetFormModal } from '@/components/modules/pets/PetFormModal';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Heart, Plus, ShieldCheck } from 'lucide-react';

export default function PetsPage() {
  const [pets, setPets] = useState<PetDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<PetDTO[]>('/pets');
      setPets(res || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background ambient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              Membresía & Pasaportes Clínicos
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1">
              VIP Pets
            </h1>
            <p className="text-xs text-slate-400 mt-2 font-light">
              Administra los perfiles médicos, calendario de vacunas y turnos clínicos de tus compañeros.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gold-gradient text-[#120524] hover:opacity-90 font-bold border-none gap-2 shadow-[0_0_20px_rgba(218,165,32,0.3)] shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nuevo Miembro</span>
          </Button>
        </div>

      {/* Pets Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aún no tienes mascotas registradas"
          description="Registra a tu perro, gato u otra mascota para llevar su historial médico y agendar consultas rápidamente."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Registrar Mi Primera Mascota
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      {/* Modal to create pet */}
      <PetFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchPets}
      />
    </div>
  </div>
  );
}
