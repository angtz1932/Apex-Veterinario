'use client';

import React, { useState, useEffect } from 'react';
import { useAppointmentStore, BookingStep } from '@/stores/useAppointmentStore';
import { useCartStore } from '@/stores/useCartStore';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Spinner } from '@/components/shared/Spinner';
import { apiClient } from '@/lib/api-client';
import {
  ServiceDTO,
  PetDTO,
  VeterinarianDTO,
  AppointmentSlotDTO,
} from '@apex/shared';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const BookingWizardModal: React.FC = () => {
  const {
    isWizardOpen,
    closeWizard,
    currentStep,
    setStep,
    selectedService,
    selectedPet,
    selectedVet,
    selectedDate,
    selectedSlot,
    clientNotes,
    selectService,
    selectPet,
    selectVet,
    selectDate,
    selectSlot,
    setClientNotes,
    resetWizard,
  } = useAppointmentStore();

  const addServiceToCart = useCartStore((state) => state.addService);

  // Local state for fetched data
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [pets, setPets] = useState<PetDTO[]>([]);
  const [vets, setVets] = useState<VeterinarianDTO[]>([]);
  const [slots, setSlots] = useState<AppointmentSlotDTO[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  // Fetch initial services, pets, vets
  useEffect(() => {
    if (!isWizardOpen) return;

    const fetchInitial = async () => {
      setIsLoadingInitial(true);
      try {
        const [servicesRes, petsRes, vetsRes] = await Promise.all([
          apiClient.get<ServiceDTO[]>('/services').catch(() => []),
          apiClient.get<PetDTO[]>('/pets').catch(() => []),
          apiClient.get<VeterinarianDTO[]>('/appointments/veterinarians').catch(() => []),
        ]);
        setServices(servicesRes);
        setPets(petsRes);
        setVets(vetsRes);
      } catch (err) {
        console.error('Error fetching wizard data:', err);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchInitial();
  }, [isWizardOpen]);

  // Fetch slots whenever date or vet or service changes
  useEffect(() => {
    if (!selectedVet || !selectedDate || !selectedService) return;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await apiClient.get<AppointmentSlotDTO[]>(
          `/appointments/slots?veterinarianId=${selectedVet.id}&date=${selectedDate}&serviceId=${selectedService.id}`,
        );
        setSlots(res);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedVet, selectedDate, selectedService]);

  const handleFinishBooking = () => {
    if (!selectedService || !selectedPet || !selectedSlot) return;

    // Agregar al carrito mixto
    addServiceToCart({
      serviceId: selectedService.id,
      title: `${selectedService.name} - ${selectedPet.name}`,
      unitPrice: selectedService.price,
      durationMinutes: selectedService.durationMinutes,
      petId: selectedPet.id,
      petName: selectedPet.name,
      petSpecies: selectedPet.species,
      veterinarianId: selectedVet?.id,
      veterinarianName: selectedVet?.name,
      scheduledAt: selectedSlot.startTime,
      timeSlot: selectedSlot.time,
    });

    resetWizard();
  };

  const stepTitles: Record<BookingStep, string> = {
    SERVICE: '1. Selecciona el Servicio Clínico',
    PET: '2. Selecciona a tu Mascota',
    VET: '3. Elige el Profesional Veterinario',
    DATETIME: '4. Fecha y Horario Disponible',
    CONFIRM: '5. Confirmación del Turno',
  };

  return (
    <Modal
      isOpen={isWizardOpen}
      onClose={closeWizard}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-brand-300 flex items-center justify-center border border-white/10">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-slate-100">Agendamiento de Citas Clínicas</span>
        </div>
      }
      description={stepTitles[currentStep]}
      maxWidth="xl"
    >
      {isLoadingInitial ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Spinner size="lg" />
          <p className="text-xs text-slate-500">Cargando disponibilidad de la clínica...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wizard Step Progress Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            {(['SERVICE', 'PET', 'VET', 'DATETIME', 'CONFIRM'] as BookingStep[]).map(
              (step, idx) => {
                const stepNames = ['Servicio', 'Mascota', 'Veterinario', 'Horario', 'Listo'];
                const isCurrent = currentStep === step;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-1 font-medium ${
                      isCurrent
                        ? 'text-brand-300 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isCurrent
                          ? 'bg-brand-500/30 text-brand-300 border border-brand-400/50'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="hidden sm:inline">{stepNames[idx]}</span>
                  </div>
                );
              },
            )}
          </div>

          {/* STEP 1: SERVICE SELECTION */}
          {currentStep === 'SERVICE' && (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => selectService(srv)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    selectedService?.id === srv.id
                      ? 'border-brand-500 bg-brand-500/20 shadow-xs backdrop-blur-sm'
                      : 'border-white/10 hover:border-brand-400/50 hover:bg-white/10 bg-white/5 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 text-brand-300 flex items-center justify-center shrink-0 border border-white/10">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">{srv.name}</h4>
                        <Badge variant="brand" size="sm">
                          <Clock className="w-3 h-3 mr-0.5" />
                          {srv.durationMinutes} min
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {srv.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-brand-300">
                      {formatCurrency(srv.price)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1 group-hover:text-brand-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: PET SELECTION */}
          {currentStep === 'PET' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>¿Para cuál de tus mascotas es la cita?</span>
                {selectedService && (
                  <Badge variant="neutral" size="sm" className="bg-white/10 text-white border-white/10">
                    {selectedService.name}
                  </Badge>
                )}
              </div>

              <div className="space-y-2.5">
                {pets.map((pet) => {
                  const isSelected = selectedPet?.id === pet.id;
                  return (
                    <div
                      key={pet.id}
                      onClick={() => selectPet(pet)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/20 shadow-xs backdrop-blur-sm'
                          : 'border-white/10 hover:border-brand-400/50 hover:bg-white/10 bg-white/5 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 text-brand-300 flex items-center justify-center font-bold text-sm border border-white/10">
                          {pet.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-100">{pet.name}</h4>
                            <Badge variant="neutral" size="sm" className="bg-white/10 text-slate-300 border border-white/10">
                              {pet.breed}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">
                            {pet.ageFormatted || 'Edad registrada'} • {pet.weightKg} kg
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('SERVICE')}
                className="mt-2"
              >
                <ChevronLeft className="w-4 h-4" /> Volver a Servicios
              </Button>
            </div>
          )}

          {/* STEP 3: VETERINARIAN SELECTION */}
          {currentStep === 'VET' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Selecciona al especialista encargado del procedimiento clínico:
              </p>

              <div className="space-y-2.5">
                {vets.map((vet) => {
                  const isSelected = selectedVet?.id === vet.id;
                  return (
                    <div
                      key={vet.id}
                      onClick={() => selectVet(vet)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/20 shadow-xs backdrop-blur-sm'
                          : 'border-white/10 hover:border-brand-400/50 hover:bg-white/10 bg-white/5 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/5 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                          {vet.avatarUrl ? (
                            <img
                              src={vet.avatarUrl}
                              alt={vet.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-brand-300" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">{vet.name}</h4>
                          <p className="text-xs text-brand-300 font-medium">
                            {vet.specialty}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Licencia: {vet.licenseNumber} • Horario: {vet.startHour}:00 - {vet.endHour}:00
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('PET')}
                className="mt-2"
              >
                <ChevronLeft className="w-4 h-4" /> Volver a Mascotas
              </Button>
            </div>
          )}

          {/* STEP 4: DATE & TIME SLOT SELECTION */}
          {currentStep === 'DATETIME' && (
            <div className="space-y-4">
              {/* Date Input Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Selecciona la fecha deseada:
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => selectDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 [color-scheme:dark]"
                />
              </div>

              {/* Slots Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Turnos disponibles para {selectedVet?.name}:
                </label>

                {isLoadingSlots ? (
                  <div className="py-8 flex justify-center">
                    <Spinner size="md" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No hay turnos disponibles para esta fecha. Intenta seleccionando otro día.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          disabled={!slot.available}
                          onClick={() => selectSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                            !slot.available
                              ? 'bg-white/5 text-slate-500 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                              : 'bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 hover:border-brand-400/50 hover:bg-white/10'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" size="sm" onClick={() => setStep('VET')}>
                  <ChevronLeft className="w-4 h-4" /> Volver a Veterinario
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!selectedSlot}
                  onClick={() => setStep('CONFIRM')}
                >
                  Continuar a Confirmación <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION & CART INJECTION */}
          {currentStep === 'CONFIRM' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand-900/40 border border-brand-500/20 space-y-2.5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    Resumen de Cita Médica
                  </span>
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3" /> Turno Verificado
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Servicio:</span>
                    <span className="font-bold text-slate-100">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mascota:</span>
                    <span className="font-semibold text-slate-200">{selectedPet?.name} ({selectedPet?.breed})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Veterinario a cargo:</span>
                    <span className="font-semibold text-slate-200">{selectedVet?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha y Hora:</span>
                    <span className="font-bold text-brand-300">
                      {selectedSlot && formatDateTime(selectedSlot.startTime)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-brand-500/20 font-extrabold text-sm text-slate-100">
                    <span>Arancel Servicio:</span>
                    <span className="text-brand-300">
                      {selectedService && formatCurrency(selectedService.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notas o síntomas previos para el veterinario (Opcional):
                </label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Ej: Ha estado rascándose la oreja izquierda los últimos dos días..."
                  className="w-full text-xs rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep('DATETIME')}
                  className="flex-1"
                >
                  Modificar Horario
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinishBooking}
                  className="flex-1 gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
