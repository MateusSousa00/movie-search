'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  return (
    <nav className="bg-card shadow-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            Movie Favorites
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
            >
              Search
            </Link>
            <Link
              href="/favorites"
              className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
            >
              Favorites
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
