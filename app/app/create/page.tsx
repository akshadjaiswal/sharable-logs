import * as React from 'react';
import Link from 'next/link';
import { CreateLogForm } from '@/components/create-log/create-log-form';
import { HorizontalRule } from '@/components/ui/horizontal-rule';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Create New Log | LogShare',
  description: 'Create and share a new terminal log',
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Create New Log
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Paste your terminal output to generate a shareable link with syntax highlighting
          </p>
          <HorizontalRule variant="default" className="max-w-md" />
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <CreateLogForm />
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-display font-semibold text-lg mb-3">
            What happens when you create a log?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your log content is analyzed to detect the framework/language context</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Sensitive information (API keys, passwords, emails) is automatically redacted</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Syntax highlighting is applied based on the detected context</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>A unique shareable link is generated that you can send to anyone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Viewers can add line-by-line comments to discuss specific parts of the log</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
