# Authentication Feature Implementation Plan

This document outlines the implementation of the authentication feature following the layered architecture approach defined in the architecture documentation.

## Project Structure

```
src/
├── features/
│   └── users/
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── User.ts
│       │   │   ├── User.test.ts
│       │   │   └── UserRole.ts
│       │   ├── interfaces/
│       │   │   └── IUserRepository.ts
│       │   └── errors/
│       │       └── UserErrors.ts
│       ├── application/
│       │   ├── dtos/
│       │   │   ├── RegisterUserDto.ts
│       │   │   ├── LoginUserDto.ts
│       │   │   └── UserResponseDto.ts
│       │   ├── mappers/
│       │   │   └── UserMapper.ts
│       │   └── useCases/
│       │       ├── RegisterUserUseCase.ts
│       │       └── LoginUserUseCase.ts
│       ├── infrastructure/
│       │   └── repositories/
│       │       └── UserRepositoryImpl.ts
│       └── presentation/
│           ├── components/
│           │   ├── RegisterForm.tsx
│           │   └── LoginForm.tsx
│           └── utils/
│               └── authUtils.ts
├── pages/
│   ├── login.tsx
│   └── register.tsx
└── contexts/
    └── AuthContext.tsx
```

## Implementation Details

### Domain Layer

#### User Role Enum (features/users/domain/entities/UserRole.ts)

```typescript
export enum UserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TECH_LEAD = 'TECH_LEAD',
  ADMIN = 'ADMIN',
}
```

#### User Entity (features/users/domain/entities/User.ts)

```typescript
import { UserRole } from './UserRole';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export class User {
  private readonly _id: string;
  private _email: string;
  private _name: string;
  private _role: UserRole;

  constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._name = props.name;
    this._role = props.role;
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get name(): string {
    return this._name;
  }
  get role(): UserRole {
    return this._role;
  }

  // Factory method
  public static create(props: { id: string; email: string; name: string; role?: UserRole }): User {
    return new User({
      id: props.id,
      email: props.email,
      name: props.name,
      role: props.role || UserRole.TEAM_MEMBER,
    });
  }

  public toPrimitives(): UserProps {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      role: this._role,
    };
  }
}
```

#### User Repository Interface (features/users/domain/interfaces/IUserRepository.ts)

```typescript
import { User } from '../entities/User';
import { RegisterUserDto } from '../../application/dtos/RegisterUserDto';

export interface IUserRepository {
  register(registerDto: RegisterUserDto): Promise<User>;
}
```

#### Domain Errors (features/users/domain/errors/UserErrors.ts)

```typescript
export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`${fieldName} is required`);
    this.name = 'RequiredFieldError';
  }
}
```

### Application Layer

#### DTOs (features/users/application/dtos/RegisterUserDto.ts)

```typescript
export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}
```

#### Login DTO (features/users/application/dtos/LoginUserDto.ts)

```typescript
export interface LoginUserDto {
  email: string;
  password: string;
}
```

#### User Response DTO (features/users/application/dtos/UserResponseDto.ts)

```typescript
import { UserRole } from '../../domain/entities/UserRole';

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
```

#### User Mapper (features/users/application/mappers/UserMapper.ts)

```typescript
import { User } from '../../domain/entities/User';
import { UserResponseDto } from '../dtos/UserResponseDto';

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
```

#### Register Use Case (features/users/application/useCases/RegisterUserUseCase.ts)

```typescript
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserAlreadyExistsError } from '../../domain/errors/UserErrors';
import { RegisterUserDto } from '../dtos/RegisterUserDto';
import { UserResponseDto } from '../dtos/UserResponseDto';
import { UserMapper } from '../mappers/UserMapper';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly httpService: any,
    private readonly configService: any
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    try {
      // Register user through repository
      const newUser = await this.userRepository.register(registerUserDto);

      // Return response DTO
      return UserMapper.toDto(newUser);
    } catch (error) {
      // Check if error is from API, indicating existing user
      if (error.response?.status === 409) {
        throw new UserAlreadyExistsError(registerUserDto.email);
      }
      // Re-throw other errors
      throw error;
    }
  }
}
```

### Infrastructure Layer

#### User Repository Implementation (features/users/infrastructure/repositories/UserRepositoryImpl.ts)

```typescript
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { RegisterUserDto } from '../../application/dtos/RegisterUserDto';
import { UserRole } from '../../domain/entities/UserRole';
import { UserAlreadyExistsError } from '../../domain/errors/UserErrors';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly httpService: IHttpService, private readonly configService: IConfigService) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().register;

      // Call register endpoint
      const userData = await this.httpService.post<any>({
        path: apiPath,
        body: registerDto,
      });

      // Create and return user entity
      return User.create({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
      });
    } catch (error) {
      // Handle specific errors
      if (error.response?.status === 409) {
        throw new UserAlreadyExistsError(registerDto.email);
      }

      // Re-throw other errors
      throw error;
    }
  }
}
```

### Shared Infrastructure Interfaces

#### HTTP Service Interface (shared/infrastructure/interfaces/IHttpService.ts)

```typescript
export interface IHttpRequestOptions {
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface IHttpService {
  get<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T>;
  post<T>(options: IHttpRequestOptions): Promise<T>;
  put<T>(options: IHttpRequestOptions): Promise<T>;
  delete<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T>;
}
```

#### Config Service Interface (shared/infrastructure/interfaces/IConfigService.ts)

```typescript
export interface ApiPaths {
  register: string;
  login: string;
  // Other API paths
}

export interface IConfigService {
  getApiPaths(): ApiPaths;
  getBaseUrl(): string;
  // Other config methods
}
```

### Presentation Layer

#### Auth Utils (features/users/presentation/utils/authUtils.ts)

```typescript
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
export const saveAuthData = (token: string, userData: any): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Retrieves the user data from localStorage
 */
export const getUserData = (): any | null => {
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
```

#### Register Form Component (features/users/presentation/components/RegisterForm.tsx)

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call the register API directly
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Register Account</h2>
      {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-700 mb-2'>
            Full Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 mb-2'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full p-2 border border-gray-300 rounded-md'
          />
        </div>
        <div className='mb-6'>
          <label htmlFor='password' className='block text-gray-700 mb-2'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
          <p className='text-xs text-gray-500 mt-1'>Password must be at least 8 characters long</p>
        </div>
        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className='mt-4 text-center'>
        <p className='text-gray-600'>
          Already have an account?{' '}
          <a href='/login' className='text-blue-600 hover:underline'>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
```

### Pages

#### Register Page (pages/register.tsx)

```tsx
import React from 'react';
import RegisterForm from '../features/users/presentation/components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Digital Kudos Wall</h1>
          <p className='mt-2 text-sm text-gray-600'>Create your account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
```

## Integration with DI Container (Optional)

For a complete implementation, you might want to consider using a dependency injection container to manage the instantiation and dependencies of your classes:

```typescript
// src/di-container.ts
import { container } from 'tsyringe';
import { UserRepositoryImpl } from './features/users/infrastructure/repositories/UserRepositoryImpl';
import { RegisterUserUseCase } from './features/users/application/useCases/RegisterUserUseCase';
import { IUserRepository } from './features/users/domain/interfaces/IUserRepository';
import { HttpService } from './shared/infrastructure/services/HttpService';
import { ConfigService } from './shared/infrastructure/services/ConfigService';
import { IHttpService } from './shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from './shared/infrastructure/interfaces/IConfigService';

// Register services
container.register<IHttpService>('HttpService', { useClass: HttpService });
container.register<IConfigService>('ConfigService', { useClass: ConfigService });

// Register repositories
container.register<IUserRepository>('UserRepository', {
  useClass: UserRepositoryImpl,
});

// Register use cases
container.register<RegisterUserUseCase>('RegisterUserUseCase', {
  useFactory: (dependencyContainer) => {
    const userRepository = dependencyContainer.resolve<IUserRepository>('UserRepository');
    const httpService = dependencyContainer.resolve<IHttpService>('HttpService');
    const configService = dependencyContainer.resolve<IConfigService>('ConfigService');

    return new RegisterUserUseCase(userRepository, httpService, configService);
  },
});

export { container };
```

## Implementation Steps

1. **Set up the folder structure** according to the above outline
2. **Implement the domain layer** first:
   - User entity with proper validation
   - Repository interfaces
   - Domain-specific errors
3. **Implement the application layer**:
   - DTOs for data transfer
   - Mappers between domain and DTOs
   - Use cases for registration and login
4. **Implement the infrastructure layer**:
   - HTTP service for API communication
   - Config service for application settings
   - Repository implementations
5. **Implement the presentation layer**:
   - Form components
   - Authentication utilities
   - Pages for login and registration
6. **Wire everything together** with proper dependency injection
7. **Test each layer** independently:
   - Unit tests for domain entities and use cases
   - Integration tests for repositories
   - Component tests for UI elements

This implementation plan follows the clean architecture principles, with clear separation of concerns between layers and dependencies flowing inward (domain ← application ← infrastructure/presentation).
