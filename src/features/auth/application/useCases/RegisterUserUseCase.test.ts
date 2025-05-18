import { RegisterUserUseCase } from './RegisterUserUseCase';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { UserAlreadyExistsError } from '../../domain/errors/AuthErrors';

describe('RegisterUserUseCase', () => {
  let authRepository: IAuthRepository;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    // Mock the auth repository
    authRepository = {
      login: jest.fn(),
      register: jest.fn().mockResolvedValue({
        id: '123',
        email: 'newuser@example.com',
        token: 'new-user-token',
      }),
    };

    registerUserUseCase = new RegisterUserUseCase(authRepository);
  });

  it('should successfully register a new user', async () => {
    // Arrange
    const registerUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };

    // Act
    const result = await registerUserUseCase.execute(registerUserDto);

    // Assert
    expect(authRepository.register).toHaveBeenCalledWith(registerUserDto);
    expect(result).toEqual({
      id: '123',
      email: 'newuser@example.com',
      token: 'new-user-token',
    });
  });

  it('should propagate UserAlreadyExistsError', async () => {
    // Arrange
    const registerUserDto = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User',
    };

    // Mock repository to throw UserAlreadyExistsError
    const error = new UserAlreadyExistsError('existing@example.com');
    (authRepository.register as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(registerUserUseCase.execute(registerUserDto)).rejects.toThrow(UserAlreadyExistsError);
  });

  it('should propagate other errors', async () => {
    // Arrange
    const registerUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };

    // Mock repository to throw a generic error
    const error = new Error('Server error');
    (authRepository.register as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(registerUserUseCase.execute(registerUserDto)).rejects.toThrow('Server error');
  });
});
