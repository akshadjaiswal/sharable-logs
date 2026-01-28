'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HorizontalRule } from '@/components/ui/horizontal-rule';
import { ArrowRight, Download } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-balance">
            Share Terminal Logs{' '}
            <span className="text-accent block mt-2">Beautifully</span>
          </h1>

          {/* Decorative rule */}
          <HorizontalRule variant="offset" className="max-w-md mx-auto" />

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Stop copy-pasting messy logs. Share formatted, collaborative links instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" asChild>
              <Link href="/create">
                <Download className="mr-2 h-5 w-5" />
                Create Your First Log
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Tertiary CTA */}
          <p className="text-sm text-muted-foreground mt-4">
            Or{' '}
            <Link href="#download" className="text-accent hover:underline">
              download the desktop app
            </Link>
            {' '}for macOS
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center pt-8">
            <span className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
              Syntax Highlighting
            </span>
            <span className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
              Auto Redaction
            </span>
            <span className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
              Line Comments
            </span>
            <span className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
              Instant Sharing
            </span>
          </div>
        </div>

        {/* Screenshot placeholder */}
        <div className="mt-20 relative">
          <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
            <div className="bg-muted border-b border-border p-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-muted-foreground font-mono">
                  logshare.app/log/abc123
                </span>
              </div>
            </div>
            <div className="p-6 font-mono text-sm bg-background">
              <div className="space-y-1">
                <div className="flex">
                  <span className="text-muted-foreground mr-4">1</span>
                  <span className="text-accent">$ npm run dev</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground mr-4">2</span>
                  <span className="text-foreground">
                    <span className="text-green-600">&gt;</span> next dev
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground mr-4">3</span>
                  <span className="text-muted-foreground">
                    ▲ Next.js 15.0.0
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground mr-4">4</span>
                  <span className="text-muted-foreground">
                    - Local: http://localhost:3000
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground mr-4">5</span>
                  <span className="text-green-600">✓ Ready in 2.1s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute -inset-4 -z-10 bg-gradient-to-t from-accent/20 to-transparent blur-2xl" />
        </div>
      </div>
    </section>
  );
}
