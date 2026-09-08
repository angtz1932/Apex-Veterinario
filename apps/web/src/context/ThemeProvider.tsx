'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

export interface TenantTheme {
  primaryColor?: string;  // CSS color, ej: "#7c3aed"
  accentColor?: string;   // CSS color, ej: "#a78bfa"
  logoUrl?: string;       // URL pública del logo
  clinicName?: string;    // Nombre de la clínica
}

/** Tema por defecto (paleta Apex original) */
const DEFAULT_THEME: TenantTheme = {
  primaryColor: '#7c3aed',
  accentColor: '#a78bfa',
  logoUrl: '',
  clinicName: 'Apex Veterinario',
};

const ThemeContext = createContext<TenantTheme>(DEFAULT_THEME);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: TenantTheme;
  children: ReactNode;
}) {
  // Aplicar las variables CSS globales cuando cambia el tema
  useEffect(() => {
    const root = document.documentElement;
    if (theme.primaryColor) root.style.setProperty('--brand-600', theme.primaryColor);
    if (theme.accentColor) root.style.setProperty('--brand-400', theme.accentColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ ...DEFAULT_THEME, ...theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): TenantTheme {
  return useContext(ThemeContext);
}
