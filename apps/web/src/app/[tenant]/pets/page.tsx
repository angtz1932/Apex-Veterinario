'use client';

import { withAuth } from '@/components/hoc/withAuth';
// Re-export con proteccion de auth
import PetsPage from '@/app/pets/page';

export default withAuth(PetsPage);
