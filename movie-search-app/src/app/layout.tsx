import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navigation from '@/components/Navigation';
import BackToTop from '@/components/BackToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Movie Favorites',
  description: 'Search movies and manage your favorites',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <BackToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
