import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { RegisterUserRequestDto } from '../../application/dtos/RegisterUserRequestDto';
import { RegisterUserUseCase } from '../../application/useCases/RegisterUserUseCase';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { UserAlreadyExistsError } from '../../domain/errors/AuthErrors';
import { SessionStorageService } from '@/shared/infrastructure/services/SessionStorageService';
import { UserRole } from '@/features/users/domain/entities/UserRole';
import { RegisterUserResponseDto } from '../../application/dtos/RegisterUserResponseDto';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Create instances of required services
  const configService = new ConfigService();
  const httpService = new HttpService(configService.getBaseUrl());
  const sessionStorageService = new SessionStorageService();

  // Create repository and use case
  const authRepository = new AuthRepositoryImpl(httpService, configService);
  const registerUserUseCase = new RegisterUserUseCase(authRepository);

  const register = async (registerData: RegisterUserRequestDto): Promise<RegisterUserResponseDto> => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerUserUseCase.execute(registerData);

      // Save the token from the API response
      sessionStorageService.saveToken(result?.data?.token);
      // Auto-login the user after successful registration
      login({
        token: result?.data?.token,
        user: {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
          role: result.data.role as UserRole,
        },
      });

      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        setError(`User with email ${registerData.email} already exists`);
      } else {
        setError('Registration failed. Please try again.');
        console.error('[useRegister] Error:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};
