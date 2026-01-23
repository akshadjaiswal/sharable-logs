import * as React from 'react';
import { SectionLabel } from '@/components/ui/section-label';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Zap, Share2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Run in Background',
      description:
        'Install the menubar app and let it run silently. It stays ready whenever you need it.',
      icon: Download,
    },
    {
      number: '2',
      title: 'Hit the Hotkey',
      description:
        'Press Cmd+Shift+L or click the menu icon to instantly capture your terminal output.',
      icon: Zap,
    },
    {
      number: '3',
      title: 'Share the Link',
      description:
        'Get a shareable URL copied to your clipboard. Send it to your team, paste in Slack, or keep for later.',
      icon: Share2,
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <SectionLabel>HOW IT WORKS</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} accentTop className="relative">
                <CardContent className="pt-12 pb-8 px-6">
                  {/* Large number */}
                  <div className="absolute top-6 right-6 text-7xl font-display font-bold text-accent/10">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-accent" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-display font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-lg">
            No configuration required. Works with Terminal.app and iTerm2 out of the box.
          </p>
        </div>
      </div>
    </section>
  );
}
