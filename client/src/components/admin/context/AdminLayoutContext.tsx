'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface AdminLayoutContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const value = useMemo(() => ({ search, setSearch }), [search]);

  return (
    <AdminLayoutContext.Provider value={value}>{children}</AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
}
