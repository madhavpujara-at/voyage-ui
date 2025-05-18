import { LoginUserUseCase } from './LoginUserUseCase';
import { HttpServiceSpy } from '../../../../test/testDoubles/httpService/HttpServiceSpy';
import { ConfigServiceStub } from '../../../../test/testDoubles/configService/ConfigServiceStub';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { InvalidCredentialsError, UserNotFoundError } from '../../domain/errors/AuthErrors';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';

describe('LoginUserUseCase', () => {
  let httpServiceSpy: HttpServiceSpy;
  let configServiceStub: ConfigServiceStub;
  let authRepository: IAuthRepository;
  let loginUserUseCase: LoginUserUseCase;

  beforeEach(() => {
    httpServiceSpy = new HttpServiceSpy({
      id: '123',
      email: 'test@example.com',
      token: 'test-token',
    });
    configServiceStub = new ConfigServiceStub();

    // Normally you would create a real AuthRepositoryImpl that uses the HTTP service
    // For simplicity, we'll mock the repository directly
    authRepository = {
      login: jest.fn().mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        token: 'test-token',
      }),
      register: jest.fn(),
    };

    loginUserUseCase = new LoginUserUseCase(
      authRepository,
      httpServiceSpy as unknown as IHttpService,
      configServiceStub as IConfigService
    );
  });

  it('should successfully login a user with valid credentials', async () => {
    // Arrange
    const loginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    const result = await loginUserUseCase.execute(loginUserDto);

    // Assert
    expect(authRepository.login).toHaveBeenCalledWith(loginUserDto);
    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      token: 'test-token',
    });
  });

  it('should throw InvalidCredentialsError when credentials are incorrect', async () => {
    // Arrange
    const loginUserDto = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    // Mock repository to throw with 401 status
    const error = new Error('Unauthorized');
    Object.defineProperty(error, 'response', {
      value: { status: 401 },
    });
    (authRepository.login as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginUserDto)).rejects.toThrow(InvalidCredentialsError);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    const loginUserDto = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    // Mock repository to throw with 404 status
    const error = new Error('Not Found');
    Object.defineProperty(error, 'response', {
      value: { status: 404 },
    });
    (authRepository.login as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginUserDto)).rejects.toThrow(UserNotFoundError);
  });

  it('should propagate other errors', async () => {
    // Arrange
    const loginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock repository to throw a generic error
    const error = new Error('Server error');
    (authRepository.login as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginUserDto)).rejects.toThrow('Server error');
  });
});
