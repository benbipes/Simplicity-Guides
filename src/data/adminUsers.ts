import { AdminUser } from '../types';

export const PRIMARY_ADMIN_EMAIL = 'ben.bipes@simplicitygroup.com';

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-ben-bipes',
    name: 'Ben Bipes',
    email: PRIMARY_ADMIN_EMAIL,
    password: 'dept078LEES',
    role: 'Super Admin',
    isSuperAdmin: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    addedBy: 'System',
  },
];

const STORAGE_KEY = 'simplicity_admin_users_v1';
const CURRENT_ADMIN_KEY = 'simplicity_current_admin_v1';

/**
 * Load admin users from browser localStorage, guaranteeing the primary admin is always present
 */
export function loadAdminUsersFromStorage(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAdminUsersToStorage(DEFAULT_ADMIN_USERS);
      return DEFAULT_ADMIN_USERS;
    }
    const parsed: AdminUser[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveAdminUsersToStorage(DEFAULT_ADMIN_USERS);
      return DEFAULT_ADMIN_USERS;
    }

    // Ensure primary admin is always included and protected
    const hasPrimary = parsed.some(
      (u) => u.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
    );
    if (!hasPrimary) {
      const merged = [DEFAULT_ADMIN_USERS[0], ...parsed];
      saveAdminUsersToStorage(merged);
      return merged;
    }

    return parsed;
  } catch (err) {
    console.error('Error loading admin users from storage:', err);
    return DEFAULT_ADMIN_USERS;
  }
}

/**
 * Save admin users list to browser localStorage
 */
export function saveAdminUsersToStorage(users: AdminUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving admin users to storage:', err);
  }
}

/**
 * Load the current logged-in admin user from sessionStorage
 */
export function loadCurrentAdminFromStorage(allUsers: AdminUser[]): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_ADMIN_KEY);
    if (!raw) return null;
    const email = JSON.parse(raw);
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    return found || null;
  } catch {
    return null;
  }
}

/**
 * Save current logged-in admin user to sessionStorage
 */
export function saveCurrentAdminToStorage(user: AdminUser | null): void {
  try {
    if (!user) {
      sessionStorage.removeItem(CURRENT_ADMIN_KEY);
      sessionStorage.removeItem('simplicity_is_admin');
    } else {
      sessionStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(user.email));
      sessionStorage.setItem('simplicity_is_admin', 'true');
    }
  } catch (err) {
    console.error('Error saving current admin session:', err);
  }
}
