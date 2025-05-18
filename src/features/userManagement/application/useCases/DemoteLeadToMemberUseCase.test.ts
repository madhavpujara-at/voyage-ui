import { DemoteLeadToMemberUseCase } from './DemoteLeadToMemberUseCase';
import { UserRoleRepositorySpy } from '../../../../test/testDoubles/userRoleRepository/UserRoleRepositorySpy';

describe('DemoteLeadToMemberUseCase', () => {
  let userRoleRepositorySpy: UserRoleRepositorySpy;
  let demoteLeadToMemberUseCase: DemoteLeadToMemberUseCase;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    userRoleRepositorySpy = new UserRoleRepositorySpy();
    demoteLeadToMemberUseCase = new DemoteLeadToMemberUseCase(userRoleRepositorySpy);
    // Save original console.error
    originalConsoleError = console.error;
    // Mock console.error to prevent noise in test output
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should call repository demoteToMember method with correct userId', async () => {
    // Arrange
    const userId = 'test-user-id';

    // Act
    await demoteLeadToMemberUseCase.execute(userId);

    // Assert
    expect(userRoleRepositorySpy.wasDemoteToMemberCalled()).toBe(true);
    expect(userRoleRepositorySpy.getLastUserId()).toBe(userId);
  });

  it('should return the updated user id from the repository', async () => {
    // Arrange
    const userId = 'test-user-id';
    const expectedReturnValue = `updated-${userId}`;

    // Act
    const result = await demoteLeadToMemberUseCase.execute(userId);

    // Assert
    expect(result).toBe(expectedReturnValue);
  });

  it('should propagate errors from the repository', async () => {
    // Arrange
    const userId = 'test-user-id';
    const testError = new Error('Demotion failed');
    userRoleRepositorySpy.setError(testError);

    // Act & Assert
    await expect(demoteLeadToMemberUseCase.execute(userId)).rejects.toThrow(testError);
  });
});
