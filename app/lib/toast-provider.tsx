'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#1A1A1A',
          border: '1px solid #E8E4DF',
          padding: '16px',
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#B8860B',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
}
