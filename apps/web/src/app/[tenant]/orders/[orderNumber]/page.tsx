'use client';

import { withAuth } from '@/components/hoc/withAuth';
import OrderSuccessPage from '@/app/orders/[orderNumber]/page';

export default withAuth(OrderSuccessPage);
