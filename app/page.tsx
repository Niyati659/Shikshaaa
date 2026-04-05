'use client';

import React from 'react';
import { useRole } from '@/components/providers/RoleProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { role, setRole, mounted } = useRole();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !isClient) return;

    if (role === 'BLOCK_OFFICER') {
      router.push('/block');
    } else if (role === 'SCHOOL') {
      router.push('/school');
    } else if (role === 'NGO') {
      router.push('/ngo/auth');
    }
  }, [role, router, mounted, isClient]);

  const handleSelectRole = (selectedRole: 'BLOCK_OFFICER' | 'SCHOOL' | 'NGO') => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient Header */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary via-accent to-background" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={toggleTheme}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
      </div>

      {/* Hero Content */}
      <div className="max-w-2xl w-full text-center mb-12 relative z-10 pt-8">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl" />
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-primary mb-3 text-balance">
          Shiksha Shakti
        </h1>

        <p className="text-lg text-foreground/80 mb-8 text-pretty max-w-lg mx-auto">
          AI-powered decision support platform for government school management
        </p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-4xl relative z-10">
        <p className="text-center text-foreground font-semibold mb-8 text-lg">Select Your Role to Continue</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Block Officer */}
          <button
            onClick={() => handleSelectRole('BLOCK_OFFICER')}
            className="group relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-card p-6 text-left transition-all hover:border-accent hover:shadow-xl hover:shadow-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-2">Block Officer</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Monitor schools in your block and track local performance metrics
              </p>
              <ul className="text-xs text-foreground/60 space-y-1">
                <li>• Block overview</li>
                <li>• School monitoring</li>
                <li>• Field tasks</li>
              </ul>
            </div>
          </button>

          {/* School */}
          <button
            onClick={() => handleSelectRole('SCHOOL')}
            className="group relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-card p-6 text-left transition-all hover:border-accent hover:shadow-xl hover:shadow-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-2">School</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Manage school data, student records, and daily operations
              </p>
              <ul className="text-xs text-foreground/60 space-y-1">
                <li>• Student enrollment</li>
                <li>• Attendance tracking</li>
                <li>• Infrastructure</li>
              </ul>
            </div>
          </button>

          {/* NGO */}
          <button
            onClick={() => handleSelectRole('NGO')}
            className="group relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-card p-6 text-left transition-all hover:border-accent hover:shadow-xl hover:shadow-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-2">NGO</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Discover schools in need and contribute with documents and assessments
              </p>
              <ul className="text-xs text-foreground/60 space-y-1">
                <li>• Sign up / Login</li>
                <li>• Assign to schools</li>
                <li>• Upload activities</li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
