import { IStorageService } from '../interfaces/IStorageService';

/**
 * Implementation of IStorageService using browser's localStorage
 */
export class LocalStorageService implements IStorageService {
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data in localStorage:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
