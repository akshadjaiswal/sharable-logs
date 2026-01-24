'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <FileText className="h-6 w-6 text-accent transition-transform group-hover:scale-110" />
          <span className="font-display text-xl font-semibold">LogShare</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/dashboard">View Logs</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="#download">Download for Mac</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
