import { useState } from 'react';
import { useRouter } from 'next/router';
import { LoginUserDto } from '../../application/dtos/LoginUserDto';
import { LoginUserResponseDto } from '../../application/dtos/LoginUserResponseDto';
import { LoginUserUseCase } from '../../application/useCases/LoginUserUseCase';
import { SessionStorageService } from '../../../../shared/infrastructure/services/SessionStorageService';
import { useAuth } from '../../../../contexts/AuthContext';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { AuthData } from '../../../users/presentation/utils/authUtils';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  // Initialize services
  const configService = new ConfigService();
  const httpService = new HttpService(configService.getBaseUrl());
  const sessionStorageService = new SessionStorageService();

  // Initialize repository
  const authRepository = new AuthRepositoryImpl(httpService, configService);

  // Initialize use case
  const loginUserUseCase = new LoginUserUseCase(authRepository);

  const login = async (credentials: LoginUserDto): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginUserResponseDto = await loginUserUseCase.execute(credentials);
      // Save token to session storage using instance method
      sessionStorageService.saveToken(response.data.token);

      // Update global auth context
      const authData: AuthData = {
        token: response.data.token,
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        },
      };
      authLogin(authData);

      setSuccess(true);
      router.push('/');
    } catch (err: unknown) {
      let errorMessage = 'An error occurred during login';

      const error = err as { name?: string; message?: string };

      if (error.name === 'InvalidCredentialsError') {
        errorMessage = 'Invalid email or password';
      } else if (error.name === 'UserNotFoundError') {
        errorMessage = 'User not found';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    success,
  };
};
