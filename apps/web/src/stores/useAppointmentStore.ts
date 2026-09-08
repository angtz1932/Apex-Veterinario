import { create } from 'zustand';
import { ServiceDTO, PetDTO, VeterinarianDTO, AppointmentSlotDTO } from '@apex/shared';

export type BookingStep = 'SERVICE' | 'PET' | 'VET' | 'DATETIME' | 'CONFIRM';

interface AppointmentStore {
  tenantId: string;
  isWizardOpen: boolean;
  currentStep: BookingStep;

  // Seleccionados
  selectedService: ServiceDTO | null;
  selectedPet: PetDTO | null;
  selectedVet: VeterinarianDTO | null;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: AppointmentSlotDTO | null;
  clientNotes: string;

  // Actions
  setTenant: (id: string) => void;
  openWizard: (initialService?: ServiceDTO) => void;
  closeWizard: () => void;
  setStep: (step: BookingStep) => void;
  selectService: (service: ServiceDTO) => void;
  selectPet: (pet: PetDTO) => void;
  selectVet: (vet: VeterinarianDTO) => void;
  selectDate: (date: string) => void;
  selectSlot: (slot: AppointmentSlotDTO) => void;
  setClientNotes: (notes: string) => void;
  resetWizard: () => void;
}

const getTodayString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  tenantId: '',
  isWizardOpen: false,
  currentStep: 'SERVICE',

  selectedService: null,
  selectedPet: null,
  selectedVet: null,
  selectedDate: getTodayString(),
  selectedSlot: null,
  clientNotes: '',

  /** Cambia de tenant y resetea el wizard para evitar datos cruzados. */
  setTenant: (id) => {
    const { tenantId } = get();
    if (tenantId !== id) {
      get().resetWizard();
      set({ tenantId: id });
    }
  },

  openWizard: (initialService) =>
    set({
      isWizardOpen: true,
      currentStep: initialService ? 'PET' : 'SERVICE',
      selectedService: initialService || null,
    }),

  closeWizard: () => set({ isWizardOpen: false }),

  setStep: (currentStep) => set({ currentStep }),

  selectService: (selectedService) => set({ selectedService, currentStep: 'PET' }),

  selectPet: (selectedPet) => set({ selectedPet, currentStep: 'VET' }),

  selectVet: (selectedVet) => set({ selectedVet, currentStep: 'DATETIME' }),

  selectDate: (selectedDate) => set({ selectedDate, selectedSlot: null }),

  selectSlot: (selectedSlot) => set({ selectedSlot }),

  setClientNotes: (clientNotes) => set({ clientNotes }),

  resetWizard: () =>
    set({
      isWizardOpen: false,
      currentStep: 'SERVICE',
      selectedService: null,
      selectedPet: null,
      selectedVet: null,
      selectedDate: getTodayString(),
      selectedSlot: null,
      clientNotes: '',
    }),
}));
