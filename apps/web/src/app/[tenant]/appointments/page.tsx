'use client';

import { withAuth } from '@/components/hoc/withAuth';
import AppointmentsPage from '@/app/appointments/page';

export default withAuth(AppointmentsPage);
