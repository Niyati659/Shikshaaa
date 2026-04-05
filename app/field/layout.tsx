import React from 'react';
import { Navbar } from '@/components/Navbar';

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
