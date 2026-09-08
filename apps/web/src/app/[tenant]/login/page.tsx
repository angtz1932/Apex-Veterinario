'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Stethoscope, Mail, Lock, AlertCircle, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/context/ThemeProvider';

export default function LoginPage() {
  const params = useParams<{ tenant?: string }>();
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const theme = useTheme();

  const tenant = params?.tenant || 'clinica-norte';
  const prefix = tenant ? `/${tenant}` : '/clinica-norte';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    clearError();
    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    try {
      await login(loginEmail, loginPass, tenant);
      // Redirigir según el usuario o al panel
      if (loginEmail.includes('valeria') || loginEmail.includes('admin')) {
        router.push(`${prefix}/admin`);
      } else {
        router.push(`${prefix}/pets`);
      }
    } catch {
      // error ya manejado en el store
    }
  };

  const fillAndLogin = (eMail: string, pass: string) => {
    setEmail(eMail);
    setPassword(pass);
    handleSubmit(undefined, eMail, pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Marca */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">
            {theme.clinicName ?? 'Apex Veterinario'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Inicia sesión en tu cuenta clínica</p>
        </div>

        {/* Acceso Rápido Demo */}
        <div className="luxury-glass p-4 rounded-2xl border border-gold-500/20 space-y-2.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Acceso Rápido de Demostración (1 Clic):
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillAndLogin('valeria@apexvet.com', 'demo1234')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/30 text-slate-200 hover:text-gold-300 font-medium transition-all text-left flex flex-col"
            >
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-gold-400" /> Dra. Valeria
              </span>
              <span className="text-[10px] text-slate-400">Veterinaria / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => fillAndLogin('carlos@example.com', 'demo1234')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/10 hover:border-brand-500/30 text-slate-200 hover:text-brand-300 font-medium transition-all text-left flex flex-col"
            >
              <span className="font-bold flex items-center gap-1">
                <User className="w-3 h-3 text-brand-400" /> Carlos M.
              </span>
              <span className="text-[10px] text-slate-400">Tutor de Mascota</span>
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="luxury-glass rounded-2xl p-8 space-y-5 border border-white/10"
        >
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide" htmlFor="email">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-sm hover:from-brand-500 hover:to-brand-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <p className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link
              href={`${prefix}/register`}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
