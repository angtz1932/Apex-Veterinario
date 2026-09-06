'use client';

import React, { useState } from 'react';
import { Species, Sex } from '@apex/shared';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { apiClient } from '@/lib/api-client';

export const PetFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: Species.DOG,
    breed: '',
    birthDate: '',
    weightKg: '',
    sex: Sex.MALE,
    microchip: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.birthDate || !formData.weightKg) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/pets', {
        ...formData,
        weightKg: parseFloat(formData.weightKg),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error registrando la mascota');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nueva Mascota"
      description="Ingresa los datos para crear su carnet clínico y asociarla a tus citas."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <Input
          label="Nombre de la mascota *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Max, Luna, Toby..."
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Especie *"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value as Species })}
          >
            <option value={Species.DOG}>🐶 Canino (Perro)</option>
            <option value={Species.CAT}>🐱 Felino (Gato)</option>
            <option value={Species.BIRD}>🦜 Ave</option>
            <option value={Species.RODENT}>🐹 Roedor</option>
            <option value={Species.OTHER}>🐾 Otra especie</option>
          </Select>

          <Select
            label="Sexo *"
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value as Sex })}
          >
            <option value={Sex.MALE}>Macho</option>
            <option value={Sex.FEMALE}>Hembra</option>
          </Select>
        </div>

        <Input
          label="Raza *"
          value={formData.breed}
          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          placeholder="Ej: Golden Retriever, Siamés, Mestizo..."
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Fecha de Nacimiento *"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            required
          />

          <Input
            label="Peso aproximado (kg) *"
            type="number"
            step="0.1"
            value={formData.weightKg}
            onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
            placeholder="Ej: 12.5"
            required
          />
        </div>

        <Input
          label="Número de Microchip (Opcional)"
          value={formData.microchip}
          onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
          placeholder="Ej: 985141002348190"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notas de salud o cuidados (Opcional):
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Alergias, comportamiento ante otros animales, etc."
            className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} className="flex-1">
            Guardar Mascota
          </Button>
        </div>
      </form>
    </Modal>
  );
};
