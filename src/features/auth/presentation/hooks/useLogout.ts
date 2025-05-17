import { useCallback, useMemo } from 'react';
import { LogoutUseCase } from '../../application/useCases/LogoutUseCase';
import { AuthTokenRepository } from '../../infrastructure/repositories/AuthTokenRepository';
import { LocalStorageService } from '../../../../shared/infrastructure/services/LocalStorageService';

/**
 * Hook for handling user logout
 * Implements the presentation layer logic for the logout feature
 */
export const useLogout = () => {
  // Initialize the use case with all dependencies
  const logoutUseCase = useMemo(() => {
    const storageService = new LocalStorageService();
    const tokenRepository = new AuthTokenRepository(storageService);
    return new LogoutUseCase(tokenRepository);
  }, []);

  // Handle logout with proper callbacks
  const logout = useCallback(
    (onLogoutSuccess?: () => void) => {
      logoutUseCase.execute({
        onSuccess: () => {
          if (onLogoutSuccess) {
            onLogoutSuccess();
          }
        },
        onError: (error) => {
          console.error('Logout failed:', error);
          // You could add additional error handling here (e.g., show a toast notification)
        },
      });
    },
    [logoutUseCase]
  );

  return { logout };
};
