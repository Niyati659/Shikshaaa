import { UserRole } from './types';

export function getRoleFromQueryParams(): UserRole {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  
  if (role === 'BLOCK_OFFICER' || role === 'SCHOOL' || role === 'NGO') {
    return role;
  }
  
  return null;
}

export function setRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  
  if (role) {
    window.location.href = `?role=${role}`;
  } else {
    window.location.href = '/';
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'BLOCK_OFFICER':
      return 'Block Officer';
    case 'SCHOOL':
      return 'School';
    case 'NGO':
      return 'NGO';
    default:
      return 'Unknown Role';
  }
}

export function canAccessBlock(role: UserRole): boolean {
  return role === 'BLOCK_OFFICER';
}

export function canAccessField(role: UserRole): boolean {
  return role === 'BLOCK_OFFICER';
}

export function canAccessSchool(role: UserRole): boolean {
  return role === 'SCHOOL';
}

export function canAccessNGO(role: UserRole): boolean {
  return role === 'NGO';
}
