import React from 'react';
import { Toaster } from 'sonner';
import Menu from '../src/pages/Customer/Menu'

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors closeButton toastOptions={{ classNames: { toast: 'font-body border-espresso-500 bg-espresso-700 text-parchment' } }} />
      <Menu />
    </>
  );
}