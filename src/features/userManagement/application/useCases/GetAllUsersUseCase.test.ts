import { GetAllUsersUseCase } from './GetAllUsersUseCase';
import { UserRepositorySpy } from '../../../../test/testDoubles/userRepository/UserRepositorySpy';
import { UserRole } from '../../../users/domain/entities/UserRole';
import { User } from '../../domain/entities/User';

describe('GetAllUsersUseCase', () => {
  let userRepositorySpy: UserRepositorySpy;
  let getAllUsersUseCase: GetAllUsersUseCase;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    userRepositorySpy = new UserRepositorySpy();
    getAllUsersUseCase = new GetAllUsersUseCase(userRepositorySpy);
    // Save original console.error
    originalConsoleError = console.error;
    // Mock console.error to prevent noise in test output
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should call repository getAllUserList method', async () => {
    // Act
    await getAllUsersUseCase.execute();

    // Assert
    expect(userRepositorySpy.wasGetAllUserListCalled()).toBe(true);
  });

  it('should pass the role parameter to the repository when provided', async () => {
    // Arrange
    const role = UserRole.TECH_LEAD;

    // Act
    await getAllUsersUseCase.execute(role);

    // Assert
    expect(userRepositorySpy.wasGetAllUserListCalled()).toBe(true);
    expect(userRepositorySpy.getLastRequestedRole()).toBe(role);
  });

  it('should return all users when no role is specified', async () => {
    // Act
    const result = await getAllUsersUseCase.execute();

    // Assert
    expect(result.length).toBe(3); // Default test data has 3 users
  });

  it('should filter users by role when a role is specified', async () => {
    // Act
    const result = await getAllUsersUseCase.execute(UserRole.TEAM_MEMBER);

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].role).toBe(UserRole.TEAM_MEMBER);
  });

  it('should propagate errors from the repository', async () => {
    // Arrange
    const testError = new Error('Failed to get users');
    userRepositorySpy.setError(testError);

    // Act & Assert
    await expect(getAllUsersUseCase.execute()).rejects.toThrow(testError);
  });

  it('should return empty array when no users match the specified role', async () => {
    // Arrange
    const now = new Date();
    // Set custom users with no ADMIN role
    userRepositorySpy.setUsers([
      new User({
        id: 'user1',
        name: 'Test User 1',
        email: 'user1@example.com',
        role: UserRole.TEAM_MEMBER,
        createdAt: now,
        updatedAt: now,
      }),
      new User({
        id: 'user2',
        name: 'Test User 2',
        email: 'user2@example.com',
        role: UserRole.TECH_LEAD,
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    // Act
    const result = await getAllUsersUseCase.execute(UserRole.ADMIN);

    // Assert
    expect(result.length).toBe(0);
  });
});
