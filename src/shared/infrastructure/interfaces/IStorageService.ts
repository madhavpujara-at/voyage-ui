/**
 * Interface for storage operations
 * Abstracts the storage mechanism (localStorage, sessionStorage, etc.)
 */
export interface IStorageService {
  /**
   * Store a value in storage
   * @param key - The key to store the value under
   * @param value - The value to store
   */
  setItem(key: string, value: string): void;

  /**
   * Retrieve a value from storage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null;

  /**
   * Remove an item from storage
   * @param key - The key to remove
   */
  removeItem(key: string): void;

  /**
   * Clear all items from storage
   */
  clear(): void;
}
