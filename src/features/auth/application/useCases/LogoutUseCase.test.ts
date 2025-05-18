import { LogoutUseCase } from './LogoutUseCase';
import { AuthTokenRepositorySpy } from '../../../../test/testDoubles/authTokenRepository/AuthTokenRepositorySpy';

describe('LogoutUseCase', () => {
  let authTokenRepositorySpy: AuthTokenRepositorySpy;
  let logoutUseCase: LogoutUseCase;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    authTokenRepositorySpy = new AuthTokenRepositorySpy();
    logoutUseCase = new LogoutUseCase(authTokenRepositorySpy);
    // Save original console.error
    originalConsoleError = console.error;
    // Mock console.error to prevent noise in test output
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should remove the auth token when executed', () => {
    // Arrange
    authTokenRepositorySpy.saveToken('test-token');

    // Act
    logoutUseCase.execute();

    // Assert
    expect(authTokenRepositorySpy.wasRemoveTokenCalled()).toBe(true);
    expect(authTokenRepositorySpy.getToken()).toBeNull();
  });

  it('should call onSuccess callback when logout is successful', () => {
    // Arrange
    const onSuccessMock = jest.fn();

    // Act
    logoutUseCase.execute({ onSuccess: onSuccessMock });

    // Assert
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should call onError callback when an error occurs', () => {
    // Arrange
    const onErrorMock = jest.fn();
    const error = new Error('Test error');

    // Mock authTokenRepository to throw an error
    jest.spyOn(authTokenRepositorySpy, 'removeToken').mockImplementation(() => {
      throw error;
    });

    // Act
    logoutUseCase.execute({ onError: onErrorMock });

    // Assert
    expect(onErrorMock).toHaveBeenCalledWith(error);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle the case when callbacks are not provided', () => {
    // Arrange
    jest.spyOn(authTokenRepositorySpy, 'removeToken').mockImplementation(() => {
      throw new Error('Test error');
    });

    // Act & Assert - no error should be thrown
    expect(() => logoutUseCase.execute()).not.toThrow();
    expect(console.error).toHaveBeenCalled();
  });
});
