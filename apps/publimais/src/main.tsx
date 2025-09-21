import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TooltipProvider>
  </React.StrictMode>
);
