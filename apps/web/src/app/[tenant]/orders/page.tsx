'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { withAuth } from '@/components/hoc/withAuth';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Badge } from '@/components/shared/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ShoppingBag, ArrowRight, Package, Calendar } from 'lucide-react';

interface OrderSummary {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

function OrdersPage() {
  const params = useParams<{ tenant: string }>();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<OrderSummary[]>('/orders')
      .then((res) => setOrders(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="pb-6 border-b border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
            Historial de Compras
          </span>
          <h1 className="text-3xl font-serif font-extrabold text-white mt-1">Mis Ordenes</h1>
          <p className="text-xs text-slate-400 mt-2">
            Revisa tus compras y reservas anteriores.
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No tienes ordenes aun"
            description="Cuando realices una compra o reserves un servicio, apareceran aqui."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/${params.tenant}/orders/${order.orderNumber}`}
                className="luxury-glass luxury-glass-hover rounded-2xl p-6 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(order.createdAt)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.itemCount} articulo(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-serif font-bold text-gold-300">{formatCurrency(order.total)}</p>
                    <Badge variant="success" size="sm" className="mt-1">{order.status}</Badge>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(OrdersPage);
