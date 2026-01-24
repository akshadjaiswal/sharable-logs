import { create } from 'zustand';

interface DashboardFilters {
  context: string | null;
  search: string;
  page: number;
  setContext: (context: string | null) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export const useDashboardFilters = create<DashboardFilters>((set) => ({
  context: null,
  search: '',
  page: 1,
  setContext: (context) => set({ context, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ context: null, search: '', page: 1 }),
}));
