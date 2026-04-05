'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  mounted: boolean;
}

const defaultContextValue: RoleContextType = {
  role: null,
  setRole: () => {},
  mounted: false,
};

const RoleContext = createContext<RoleContextType>(defaultContextValue);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check sessionStorage for stored role
    const storedRole = sessionStorage.getItem('userRole');
    
    if (storedRole === 'BLOCK_OFFICER' || storedRole === 'SCHOOL' || storedRole === 'NGO') {
      setRoleState(storedRole as UserRole);
    }
    
    setMounted(true);
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      sessionStorage.setItem('userRole', newRole);
      if (newRole === 'BLOCK_OFFICER') {
        router.push('/block');
      } else if (newRole === 'SCHOOL') {
        router.push('/school');
      } else if (newRole === 'NGO') {
        router.push('/ngo/auth');
      }
    } else {
      sessionStorage.removeItem('userRole');
      router.push('/');
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, mounted }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  return useContext(RoleContext);
}
