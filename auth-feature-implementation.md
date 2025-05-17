# Authentication Feature Implementation: Register

This document outlines the implementation of the user registration feature following a layered architecture approach.

## Domain Layer

### User Role Enum (users/domain/entities/UserRole.ts)

```typescript
export enum UserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TECH_LEAD = 'TECH_LEAD',
  ADMIN = 'ADMIN',
}
```

### User Entity (users/domain/entities/User.ts)

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

  // Factory method - no longer generates ID, will be set from backend response
  public static create(props: { id: string; email: string; name: string; role?: UserRole }): User {
    return new User({
      id: props.id,
      email: props.email,
      name: props.name,
      role: props.role || UserRole.TEAM_MEMBER, // Default role for new users
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

### User Repository Interface (users/domain/interfaces/IUserRepository.ts)

```typescript
import { User } from '../entities/User';
import { RegisterUserDto } from '../../application/dtos/RegisterUserDto';

export interface IUserRepository {
  register(registerDto: RegisterUserDto): Promise<User>;
}
```

### Custom Domain Errors (users/domain/errors/UserErrors.ts)

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
```

## Application Layer

### DTOs (users/application/dtos/RegisterUserDto.ts)

```typescript
export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}
```

### User Response DTO (users/application/dtos/UserResponseDto.ts)

```typescript
import { UserRole } from '../../domain/entities/UserRole';

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
```

### User Mapper (users/application/mappers/UserMapper.ts)

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

### Register Use Case (users/application/useCases/RegisterUserUseCase.ts)

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

## Infrastructure Layer

### User Repository Implementation (users/infrastructure/repositories/UserRepositoryImpl.ts)

```typescript
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { RegisterUserDto } from '../../application/dtos/RegisterUserDto';
import { UserRole } from '../../domain/entities/UserRole';
import { UserAlreadyExistsError } from '../../domain/errors/UserErrors';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly httpService: any, private readonly configService: any) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    try {
      // Get API URL from config
      const apiUrl = this.configService.get('auth.apiUrl');

      // Call register endpoint
      const response = await this.httpService.post(`${apiUrl}/auth/register`, registerDto);

      // Extract user data from response
      const userData = response.data;

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

## Presentation Layer

### Register Form Component (users/presentation/components/RegisterForm.tsx)

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

### Register Page (pages/register.tsx)

```tsx
import React from 'react';
import RegisterForm from '../users/presentation/components/RegisterForm';

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

## Implementation Flow

1. The user navigates to the register page and fills out the form
2. When submitted, the data is sent directly to the backend API
3. In a real application using the layered architecture:
   - The form would call the RegisterUserUseCase
   - The use case would call the UserRepository
   - The repository implementation would handle the API call
   - The backend would generate the user ID
4. On success, the user is redirected to the login page with a success message
5. On failure, an error message is displayed on the register form

This implementation follows the layered architecture pattern:

- Domain layer contains the core User entity and repository interface
- Application layer handles the use cases and data transformation
- Infrastructure layer implements the repository interface by calling the API
- Presentation layer contains the UI components to interact with the user

The authentication is fully handled by the backend as specified, with the frontend only responsible for collecting user data and displaying responses.
