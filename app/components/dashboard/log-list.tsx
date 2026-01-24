'use client';

import * as React from 'react';
import { LogListItem } from './log-list-item';
import { EmptyState } from './empty-state';
import { Button } from '@/components/ui/button';
import type { Log } from '@/lib/supabase/types';

export interface LogListProps {
  logs: Log[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  total: number;
  onReset?: () => void;
}

export function LogList({
  logs,
  isLoading,
  onLoadMore,
  hasMore,
  total,
  onReset,
}: LogListProps) {
  if (isLoading && logs.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return <EmptyState variant="no-results" onReset={onReset} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Showing {logs.length} of {total.toLocaleString()} logs
      </div>

      {/* Log Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logs.map((log) => (
          <LogListItem key={log.id} log={log} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
