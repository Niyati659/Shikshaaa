'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from './providers/RoleProvider';
import { canAccessBlock, canAccessField, canAccessSchool } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { role } = useRole();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!role) {
    return null;
  }

  const menuItems = [
    {
      label: 'Block Overview',
      href: '/block',
      icon: '🏢',
      visible: canAccessBlock(role),
    },
    {
      label: 'Field Tasks',
      href: '/field',
      icon: '📋',
      visible: canAccessField(role),
    },
    {
      label: 'School Dashboard',
      href: '/school',
      icon: '🏫',
      visible: canAccessSchool(role),
    },
  ].filter(item => item.visible);

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-br from-accent to-primary text-white rounded-full shadow-lg md:hidden hover:shadow-xl md:hidden hover:from-accent/90 hover:to-primary/90"
      >
        Menu
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-sidebar to-sidebar text-sidebar-foreground shadow-lg transform transition-transform duration-300 md:translate-x-0 z-40 border-r border-border',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="pt-6 pb-4 px-4 border-b border-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">Menu</h2>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-base font-bold',
                isActive(item.href)
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg shadow-accent/50'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:shadow-md'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop spacing */}
      <div className="hidden md:block w-64" />
    </>
  );
}
