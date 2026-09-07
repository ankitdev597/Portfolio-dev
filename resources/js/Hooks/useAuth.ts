import { usePage } from '@/Hooks/usePage';
import type { RoleName } from '@/Types';

/**
 * Centralizes "can the current admin do X" role checks so pages/components
 * never inline `auth.roles.includes(...)` logic themselves.
 */
export function useAuth() {
    const { props } = usePage();
    const { user, roles } = props.auth;

    const hasRole = (role: RoleName) => roles.includes(role);
    const isSuperAdmin = hasRole('super_admin');
    const isEditor = hasRole('editor');

    return { user, roles, hasRole, isSuperAdmin, isEditor };
}
