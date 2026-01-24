import * as React from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Shield,
  Code2,
  MessageSquare,
  Search,
  Gauge,
} from 'lucide-react';

export function Features() {
  const features = [
    {
      title: 'Smart Context Detection',
      description:
        'Automatically identifies whether it\'s Next.js, Python, Docker, or one of 20+ frameworks and languages.',
      icon: Sparkles,
    },
    {
      title: 'Auto Redaction',
      description:
        'Removes API keys, tokens, passwords, and sensitive data automatically before sharing.',
      icon: Shield,
    },
    {
      title: 'Syntax Highlighting',
      description:
        'Beautiful code formatting with proper syntax highlighting matching your detected context.',
      icon: Code2,
    },
    {
      title: 'Line Comments',
      description:
        'Team members can comment on specific lines to discuss errors, ask questions, or suggest fixes.',
      icon: MessageSquare,
    },
    {
      title: 'Search History',
      description:
        'Find past logs instantly with full-text search, context filters, and date ranges.',
      icon: Search,
    },
    {
      title: 'Lightning Fast',
      description:
        'Server-side rendering with optimized caching. Large logs load in milliseconds.',
      icon: Gauge,
    },
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionLabel>FEATURES</SectionLabel>

        <div className="mt-4 mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything you need to share logs
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for developers who value beautiful tools and efficient workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group">
                <CardHeader>
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to upgrade your log sharing workflow?
          </p>
          <a
            href="#download"
            className="inline-block text-accent hover:underline font-medium"
          >
            Download LogShare for macOS →
          </a>
        </div>
      </div>
    </section>
  );
}
