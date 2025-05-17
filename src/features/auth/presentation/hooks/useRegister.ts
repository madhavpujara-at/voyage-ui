import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { RegisterUserDto } from '../../../users/application/dtos/RegisterUserDto';
import { RegisterUserUseCase } from '../../../users/application/useCases/RegisterUserUseCase';
import { UserRepositoryImpl } from '../../../users/infrastructure/repositories/UserRepositoryImpl';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { UserAlreadyExistsError } from '../../../users/domain/errors/UserErrors';

// Adapter for HttpService to match the expected interface in RegisterUserUseCase
class HttpServiceAdapter {
  constructor(private httpService: HttpService) {}

  post<T>(url: string, data: any): Promise<any> {
    // Extract just the path part from the URL if it's a full URL
    const path = url.startsWith('http') ? new URL(url).pathname : url;
    return this.httpService.post<T>({ path, body: data });
  }
}

// Adapter for ConfigService to match the expected interface in RegisterUserUseCase
class ConfigServiceAdapter {
  constructor(private configService: ConfigService) {}

  get(key: string): string {
    // Simple implementation, in a real app this would handle nested keys
    if (key === 'auth.apiUrl') {
      return this.configService.getBaseUrl();
    }
    return '';
  }
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Create instances of required services
  const configService = new ConfigService();
  const httpService = new HttpService(configService.getBaseUrl());

  // Create adapters to match the interfaces expected by RegisterUserUseCase
  const httpServiceAdapter = new HttpServiceAdapter(httpService);
  const configServiceAdapter = new ConfigServiceAdapter(configService);

  // Create repository and use case
  const userRepository = new UserRepositoryImpl(httpService, configService);
  const registerUserUseCase = new RegisterUserUseCase(userRepository, httpServiceAdapter, configServiceAdapter);

  const register = async (registerData: RegisterUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerUserUseCase.execute(registerData);

      // Since UserResponseDto doesn't have a token field, we need to handle this differently
      // In a real app, the token would come from the API response
      // For now, we'll create a fake token for demo purposes
      const fakeToken = `demo-token-${Date.now()}`;

      // Auto-login the user after successful registration
      login({
        token: fakeToken,
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          role: result.role,
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
