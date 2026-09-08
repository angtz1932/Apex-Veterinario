'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Stethoscope, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/context/ThemeProvider';

export default function RegisterPage() {
  const params = useParams<{ tenant?: string }>();
  const router = useRouter();
  const { setUser, clearError } = useAuthStore();
  const theme = useTheme();

  const tenant = params?.tenant || 'clinica-norte';
  const prefix = tenant ? `/${tenant}` : '/clinica-norte';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setError(null);

    if (form.password !== form.confirm) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': params.tenant ?? 'clinica-norte',
          },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? 'Error al crear la cuenta');
      }
      const data = await res.json();
      setUser({ ...data.user, tenantId: params.tenant }, data.token);
      router.push(`/${params.tenant}/services`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">
            {theme.clinicName ?? 'Apex Veterinario'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Crea tu cuenta de cliente</p>
        </div>

        <form onSubmit={handleSubmit} className="luxury-glass rounded-2xl p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {[
            { id: 'name', label: 'Nombre completo', type: 'text', Icon: User, placeholder: 'Juan Perez' },
            { id: 'email', label: 'Correo electronico', type: 'email', Icon: Mail, placeholder: 'tu@email.com' },
            { id: 'password', label: 'Contrasena', type: 'password', Icon: Lock, placeholder: '••••••••' },
            { id: 'confirm', label: 'Confirmar contrasena', type: 'password', Icon: Lock, placeholder: '••••••••' },
          ].map(({ id, label, type, Icon, placeholder }) => (
            <div key={id} className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide" htmlFor={id}>{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id={id}
                  type={type}
                  value={form[id as keyof typeof form]}
                  onChange={handleChange(id)}
                  required
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-sm hover:from-brand-500 hover:to-brand-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Ya tienes cuenta?{' '}
            <Link href={`/${params.tenant}/login`} className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Inicia sesion
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
