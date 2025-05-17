# Authentication Presentation Layer Implementation Plan

This plan outlines how to implement the authentication presentation layer that will connect the React components to the application layer use cases, focusing exclusively on the registration functionality.

## Implementation Structure

```
src/
├── features/
│   └── auth/
│       └── presentation/
│           ├── hooks/
│           │   └── useRegister.ts              # Hook for user registration
│           └── utils/
│               └── authFormUtils.ts            # Form utilities for auth forms
│
├── contexts/
│   └── AuthContext.tsx                         # Global auth context provider (already exists)
│
└── shared/
    └── infrastructure/
        ├── services/
        │   ├── HttpService.ts                  # HTTP service implementation (to create)
        │   └── ConfigService.ts                # Config service implementation (to create)
        └── interfaces/
            ├── IHttpService.ts                 # HTTP service interface (already exists)
            └── IConfigService.ts               # Config service interface (already exists)
```

## Implementation Tasks

### 1. Implement Infrastructure Services

#### HttpService Implementation

Create an implementation of the IHttpService interface to handle API requests:

```typescript
// src/shared/infrastructure/services/HttpService.ts
import { IHttpService, IHttpRequestOptions } from '../interfaces/IHttpService';

export class HttpService implements IHttpService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    const { path, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.getHeaders(headers),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  async post<T>(options: IHttpRequestOptions): Promise<T> {
    const { path, body, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(headers),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  async put<T>(options: IHttpRequestOptions): Promise<T> {
    const { path, body, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(headers),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  async delete<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    const { path, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(headers),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'Unknown error occurred' };
    }

    const error = new Error(errorData.message || 'API error');
    (error as any).response = response;
    (error as any).data = errorData;
    return error;
  }
}
```

#### ConfigService Implementation

Create an implementation of the IConfigService interface:

```typescript
// src/shared/infrastructure/services/ConfigService.ts
import { IConfigService, ApiPaths } from '../interfaces/IConfigService';

export class ConfigService implements IConfigService {
  private readonly config: {
    baseUrl: string;
    apiPaths: ApiPaths;
  };

  constructor() {
    // In a real app, these might come from environment variables
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      apiPaths: {
        register: '/auth/register',
        // Other API paths if needed...
      },
    };
  }

  getApiPaths(): ApiPaths {
    return this.config.apiPaths;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}
```

### 2. Create Authentication Hooks

#### Registration Hook

Create a hook that uses the RegisterUserUseCase to handle registration:

```typescript
// src/features/auth/presentation/hooks/useRegister.ts
import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { RegisterUserDto } from '../../../users/application/dtos/RegisterUserDto';
import { RegisterUserUseCase } from '../../../users/application/useCases/RegisterUserUseCase';
import { UserRepositoryImpl } from '../../../users/infrastructure/repositories/UserRepositoryImpl';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { UserAlreadyExistsError } from '../../../users/domain/errors/UserErrors';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Create instances of required services
  const configService = new ConfigService();
  const httpService = new HttpService(configService.getBaseUrl());

  // Create repository and use case
  const userRepository = new UserRepositoryImpl(httpService, configService);
  const registerUserUseCase = new RegisterUserUseCase(userRepository, httpService, configService);

  const register = async (registerData: RegisterUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerUserUseCase.execute(registerData);

      // Auto-login the user after successful registration
      login({
        token: result.token,
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
```

#### Auth Form Hook for Registration

Create a hook to handle form state and validation specifically for registration:

```typescript
// src/features/auth/presentation/hooks/useRegisterForm.ts
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

interface FormField {
  value: string;
  error: string | null;
}

interface RegisterFields {
  name: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
}

interface UseRegisterFormProps {
  initialFields?: RegisterFields;
  onSubmit: (formData: Omit<Record<keyof RegisterFields, string>, 'confirmPassword'>) => Promise<unknown>;
  redirectPath: string;
}

export const useRegisterForm = ({
  initialFields = {
    name: { value: '', error: null },
    email: { value: '', error: null },
    password: { value: '', error: null },
    confirmPassword: { value: '', error: null },
  },
  onSubmit,
  redirectPath,
}: UseRegisterFormProps) => {
  const [fields, setFields] = useState<RegisterFields>(initialFields);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof RegisterFields],
        value,
        error: null, // Clear field-specific error on change
      },
    }));

    // Clear general error when user starts correcting the form
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    // Basic validation - required fields
    Object.entries(newFields).forEach(([key, field]) => {
      if (!field.value.trim()) {
        newFields[key as keyof RegisterFields] = {
          ...field,
          error: `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
        };
        isValid = false;
      }
    });

    // Email validation
    if (newFields.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFields.email.value)) {
      newFields.email.error = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (newFields.password.value && newFields.password.value.length < 8) {
      newFields.password.error = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (
      newFields.password.value &&
      newFields.confirmPassword.value &&
      newFields.confirmPassword.value !== newFields.password.value
    ) {
      newFields.confirmPassword.error = 'Passwords do not match';
      isValid = false;
    }

    setFields(newFields);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // Convert fields to raw values for submission and remove confirmPassword
      const { confirmPassword, ...registerData } = Object.entries(fields).reduce<Record<string, string>>(
        (acc, [key, field]) => {
          acc[key] = field.value;
          return acc;
        },
        {}
      );

      await onSubmit(registerData as any);
      router.push(redirectPath);
    } catch (error) {
      console.error('Registration form submission error:', error);
      setGeneralError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields,
    handleChange,
    handleSubmit,
    isSubmitting,
    generalError,
    setGeneralError,
  };
};
```

### 3. Integrating with Register Form Component

Connect the existing RegisterForm component with our hooks:

```typescript
// src/features/auth/presentation/components/RegisterForm.tsx (updates)
import { useRegister } from '../hooks/useRegister';
import { useRegisterForm } from '../hooks/useRegisterForm';

export const RegisterForm = () => {
  const { register, loading, error } = useRegister();

  const { fields, handleChange, handleSubmit, isSubmitting, generalError } = useRegisterForm({
    onSubmit: async (registerData) => {
      return register(registerData);
    },
    redirectPath: '/',
  });

  // Render form (assuming it already exists)
  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {generalError && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-4'>
          <p className='text-red-700'>{generalError}</p>
        </div>
      )}

      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Name
        </label>
        <div className='mt-1'>
          <input
            id='name'
            name='name'
            type='text'
            required
            value={fields.name.value}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 border ${
              fields.name.error ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {fields.name.error && <p className='mt-2 text-sm text-red-600'>{fields.name.error}</p>}
        </div>
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email
        </label>
        <div className='mt-1'>
          <input
            id='email'
            name='email'
            type='email'
            required
            value={fields.email.value}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 border ${
              fields.email.error ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {fields.email.error && <p className='mt-2 text-sm text-red-600'>{fields.email.error}</p>}
        </div>
      </div>

      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Password
        </label>
        <div className='mt-1'>
          <input
            id='password'
            name='password'
            type='password'
            required
            value={fields.password.value}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 border ${
              fields.password.error ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {fields.password.error && <p className='mt-2 text-sm text-red-600'>{fields.password.error}</p>}
        </div>
      </div>

      <div>
        <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
          Confirm Password
        </label>
        <div className='mt-1'>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            value={fields.confirmPassword.value}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 border ${
              fields.confirmPassword.error ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {fields.confirmPassword.error && <p className='mt-2 text-sm text-red-600'>{fields.confirmPassword.error}</p>}
        </div>
      </div>

      <div>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};
```

## Testing Plan

1. Unit tests for hooks

   - Test `useRegister` hook with mocked use cases
   - Test `useRegisterForm` with different form scenarios
   - Test form validation logic

2. Unit tests for services

   - Test `HttpService` with mocked fetch responses
   - Test `ConfigService` configuration values

3. Integration tests

   - Test register form submission flow
   - Test authentication state management after registration
   - Test error handling in register form and hooks

4. E2E tests
   - Test complete registration flow
   - Test validation error handling in registration form

## Implementation Notes

1. **Dependency Injection**: Consider using a dependency injection container for better testability instead of directly instantiating services in hooks.

2. **Error Handling**: Implement comprehensive error handling for registration failures.

3. **Form Validation**: For more complex validation scenarios, consider using a form library like Formik or React Hook Form.

4. **Loading States**: Ensure proper loading states are displayed in the UI during registration.

5. **Service Initialization**: Services should only be initialized once, not on every hook call. Consider using a singleton pattern or context for service instances.
