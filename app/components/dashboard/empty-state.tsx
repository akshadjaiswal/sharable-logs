import * as React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';

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
          Share your first terminal log to get started. Download the desktop app or use our API.
        </p>
        <Button variant="primary" size="lg" asChild>
          <a href="#download">Download Desktop App</a>
        </Button>
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
