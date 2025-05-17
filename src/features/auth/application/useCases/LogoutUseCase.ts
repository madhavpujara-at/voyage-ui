import { IAuthTokenRepository } from '../../domain/interfaces/IAuthTokenRepository';

/**
 * Use case for handling user logout
 */
export class LogoutUseCase {
  constructor(private readonly authTokenRepository: IAuthTokenRepository) {}

  /**
   * Execute the logout process
   * Removes the authentication token and performs any additional logout actions
   * @param callbacks - Optional callback functions to execute after logout
   */
  execute(callbacks?: { onSuccess?: () => void; onError?: (error: Error) => void }): void {
    try {
      // Remove the authentication token
      this.authTokenRepository.removeToken();

      // Call the success callback if provided
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    } catch (error) {
      console.error('Error during logout:', error);

      // Call the error callback if provided
      if (callbacks?.onError && error instanceof Error) {
        callbacks.onError(error);
      }
    }
  }
}
