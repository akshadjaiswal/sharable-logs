'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDashboardFilters } from '@/lib/stores/dashboard-store';
import { useDebounce } from '@/lib/hooks/use-debounce';

export interface FiltersProps {
  contextOptions: string[];
}

export function Filters({ contextOptions }: FiltersProps) {
  const { context, search, setContext, setSearch, reset } = useDashboardFilters();
  const [searchInput, setSearchInput] = React.useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  React.useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const hasActiveFilters = context !== null || search !== '';

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Context Filter */}
          <div className="w-full md:w-auto">
            <select
              value={context || ''}
              onChange={(e) => setContext(e.target.value || null)}
              className="w-full md:w-[200px] h-11 px-4 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Contexts</option>
              {contextOptions.map((ctx) => (
                <option key={ctx} value={ctx}>
                  {ctx}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-10"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
