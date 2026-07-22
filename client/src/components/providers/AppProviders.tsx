'use client';

import { Toaster } from 'sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={3200}
        toastOptions={{
          className: 'mf-toast',
        }}
      />
    </>
  );
}
