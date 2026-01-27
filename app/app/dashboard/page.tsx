'use client';

import * as React from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Filters } from '@/components/dashboard/filters';
import { LogList } from '@/components/dashboard/log-list';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Button } from '@/components/ui/button';
import { useDashboardFilters } from '@/lib/stores/dashboard-store';
import { Plus } from 'lucide-react';
import type { ListLogsResponse } from '@/lib/supabase/types';

export default function DashboardPage() {
  const { context, search, reset } = useDashboardFilters();

  // Fetch context options for filter dropdown
  const { data: contextData } = useQuery({
    queryKey: ['log-contexts'],
    queryFn: async () => {
      const response = await fetch('/api/logs/list?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch contexts');
      const data: ListLogsResponse = await response.json();

      // Extract unique contexts
      const contexts = new Set<string>();
      data.logs.forEach((log) => {
        if (log.detected_context) {
          contexts.add(log.detected_context);
        }
      });
      return Array.from(contexts).sort();
    },
  });

  // Fetch logs with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['logs', context, search],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '20',
        ...(context && { context }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/logs/list?${params}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json() as Promise<ListLogsResponse>;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.logs.length === lastPage.limit;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const logs = data?.pages.flatMap((page) => page.logs) || [];
  const total = data?.pages[0]?.total || 0;

  // Check if this is first visit (no logs at all)
  const isFirstVisit = !isLoading && total === 0 && !context && !search;

  if (isFirstVisit) {
    return (
      <div className="container mx-auto px-6 py-16">
        <EmptyState variant="no-logs" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-display font-bold mb-3">Your Logs</h1>
              <p className="text-lg text-muted-foreground">
                Browse and manage all your shared terminal logs
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/create">
                <Plus className="mr-2 h-5 w-5" />
                New Log
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Filters contextOptions={contextData || []} />

      {/* Log List */}
      <div className="container mx-auto px-6 py-12">
        <LogList
          logs={logs}
          isLoading={isLoading || isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          hasMore={hasNextPage || false}
          total={total}
          onReset={reset}
        />
      </div>
    </div>
  );
}
