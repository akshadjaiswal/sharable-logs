import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Search, Plus } from 'lucide-react';

export interface EmptyStateProps {
  variant: 'no-logs' | 'no-results';
  onReset?: () => void;
}

export function EmptyState({ variant, onReset }: EmptyStateProps) {
  if (variant === 'no-logs') {
    return (
      <div className="text-center py-20">
        <FileText className="h-20 w-20 mx-auto text-muted-foreground opacity-50 mb-6" />
        <h3 className="text-2xl font-display font-semibold mb-3">No logs yet</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Create your first terminal log to get started. Paste your terminal output and generate a shareable link.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Log
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#download">Download Desktop App</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <Search className="h-20 w-20 mx-auto text-muted-foreground opacity-50 mb-6" />
      <h3 className="text-2xl font-display font-semibold mb-3">No logs found</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Try adjusting your filters or search query to find what you're looking for.
      </p>
      {onReset && (
        <Button variant="secondary" size="lg" onClick={onReset}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
