import { PromoteMemberToLeadUseCase } from './PromoteMemberToLeadUseCase';
import { UserRoleRepositorySpy } from '../../../../test/testDoubles/userRoleRepository/UserRoleRepositorySpy';

describe('PromoteMemberToLeadUseCase', () => {
  let userRoleRepositorySpy: UserRoleRepositorySpy;
  let promoteMemberToLeadUseCase: PromoteMemberToLeadUseCase;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    userRoleRepositorySpy = new UserRoleRepositorySpy();
    promoteMemberToLeadUseCase = new PromoteMemberToLeadUseCase(userRoleRepositorySpy);
    // Save original console.error
    originalConsoleError = console.error;
    // Mock console.error to prevent noise in test output
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should call repository promoteToLead method with correct userId', async () => {
    // Arrange
    const userId = 'test-user-id';

    // Act
    await promoteMemberToLeadUseCase.execute(userId);

    // Assert
    expect(userRoleRepositorySpy.wasPromoteToLeadCalled()).toBe(true);
    expect(userRoleRepositorySpy.getLastUserId()).toBe(userId);
  });

  it('should return the updated user id from the repository', async () => {
    // Arrange
    const userId = 'test-user-id';
    const expectedReturnValue = `updated-${userId}`;

    // Act
    const result = await promoteMemberToLeadUseCase.execute(userId);

    // Assert
    expect(result).toBe(expectedReturnValue);
  });

  it('should propagate errors from the repository', async () => {
    // Arrange
    const userId = 'test-user-id';
    const testError = new Error('Promotion failed');
    userRoleRepositorySpy.setError(testError);

    // Act & Assert
    await expect(promoteMemberToLeadUseCase.execute(userId)).rejects.toThrow(testError);
  });
});
