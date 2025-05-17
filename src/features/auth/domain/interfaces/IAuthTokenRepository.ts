/**
 * Interface for auth token operations
 * Defines domain-specific operations for managing authentication tokens
 */
export interface IAuthTokenRepository {
  /**
   * Save authentication token
   * @param token - The auth token to save
   */
  saveToken(token: string): void;

  /**
   * Get the current authentication token
   * @returns The stored auth token or null if not found
   */
  getToken(): string | null;

  /**
   * Remove the authentication token
   */
  removeToken(): void;
}
