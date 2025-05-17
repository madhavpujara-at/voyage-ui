import { UserRole } from '../../domain/entities/UserRole';

// User data interface
export interface AuthUserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Auth data interface
export interface AuthData {
  token: string;
  user: AuthUserData;
}

// Constants for localStorage keys
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

/**
 * Gets the authentication token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Saves the authentication token and user data to localStorage
 */
export const saveAuthData = (authData: AuthData): void => {
  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
};

/**
 * Retrieves the user data from localStorage
 */
export const getUserData = (): AuthUserData | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Clears all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Checks if the user is authenticated (has a token)
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
