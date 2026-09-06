import { PetDTO, MedicalRecordDTO, VaccinationDTO } from '@apex/shared';

export interface IPetRepository {
  findAllByOwner(ownerId: string): Promise<PetDTO[]>;
  findById(id: string): Promise<PetDTO | null>;
  create(data: Omit<PetDTO, 'id' | 'ageFormatted'>): Promise<PetDTO>;
  update(id: string, data: Partial<PetDTO>): Promise<PetDTO>;
  addMedicalRecord(data: Omit<MedicalRecordDTO, 'id'>): Promise<MedicalRecordDTO>;
  addVaccination(data: Omit<VaccinationDTO, 'id'>): Promise<VaccinationDTO>;
}
