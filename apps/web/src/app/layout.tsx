import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MixedCartDrawer } from '@/components/modules/cart/MixedCartDrawer';
import { BookingWizardModal } from '@/components/modules/appointments/BookingWizardModal';
import { ToastContainer } from '@/components/shared/ToastContainer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Apex Veterinario | Clínica & Boutique de Alta Gama',
  description:
    'Plataforma integral de salud y bienestar animal: consultas veterinarias, vacunación, grooming, farmacia y alimentos premium.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MixedCartDrawer />
          <BookingWizardModal />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
