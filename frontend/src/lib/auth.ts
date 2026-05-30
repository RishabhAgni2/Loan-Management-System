import { User } from '@/types';

export interface AuthSession {
  token: string;
  user: User;
}

const TOKEN_KEY = 'lms_token';
const USER_KEY = 'lms_user';
const ROLE_COOKIE = 'lms_role';
const TOKEN_COOKIE = 'lms_token';

export const dashboardRoles = ['admin', 'sales', 'sanction', 'disbursement', 'collection'];

export const saveSession = ({ token, user }: AuthSession) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/`;
  document.cookie = `${ROLE_COOKIE}=${user.role}; path=/`;
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const getHomePathForRole = (role?: string) => {
  if (!role) return '/login';
  return dashboardRoles.includes(role) ? '/dashboard' : '/apply/personal';
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; path=/`;
  document.cookie = `${ROLE_COOKIE}=; Max-Age=0; path=/`;
  window.location.href = '/login';
};
