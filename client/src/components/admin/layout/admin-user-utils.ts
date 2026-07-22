import type { AuthUser } from '@/lib/api/admin';

export function getUserInitials(user: AuthUser): string {
  if (user.name) {
    return user.name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
  return user.email[0]?.toUpperCase() ?? 'A';
}

export function getUserRoleLabel(role: AuthUser['role']): string {
  return role === 'ADMIN' ? 'Quản trị viên' : 'Biên tập viên';
}
