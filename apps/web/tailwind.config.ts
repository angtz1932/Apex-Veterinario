import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f9f0ff',
          100: '#f1dcfc',
          200: '#e2bdf8',
          300: '#cd91f1',
          400: '#b35ee9',
          500: '#9c32dd',
          600: '#8720c7',
          700: '#7419aa',
          800: '#61178c',
          900: '#511674',
          950: '#2b0940',
        },
        gold: {
          50: '#fefbeb',
          100: '#fdf3c7',
          200: '#fbe68a',
          300: '#f9d44e',
          400: '#f7c527',
          500: '#e8a817',
          600: '#c47f0e',
          700: '#9e5b10',
          800: '#834814',
          900: '#6f3b16',
        },
        surface: {
          DEFAULT: '#120524',
          light: '#1a0a30',
          lighter: '#210e3d',
          card: 'rgba(255, 255, 255, 0.03)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 25px -5px rgba(135, 32, 199, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'glow-brand': '0 0 20px rgba(156, 50, 221, 0.3), 0 0 60px rgba(156, 50, 221, 0.1)',
        'glow-gold': '0 0 20px rgba(247, 197, 39, 0.2), 0 0 60px rgba(247, 197, 39, 0.05)',
        'glow-sm': '0 0 10px rgba(156, 50, 221, 0.2)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(156, 50, 221, 0.1)',
      },
      backgroundImage: {
        'luxury-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'luxury-border': 'linear-gradient(135deg, rgba(205,145,241,0.3), rgba(247,197,39,0.2), rgba(205,145,241,0.1))',
        'luxury-shine': 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(156, 50, 221, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(156, 50, 221, 0.4)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
