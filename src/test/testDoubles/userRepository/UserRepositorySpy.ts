import { IUserRepository } from '../../../features/userManagement/domain/interfaces/IUserRepository';
import { UserRole } from '../../../features/users/domain/entities/UserRole';
import { User } from '../../../features/userManagement/domain/entities/User';

export class UserRepositorySpy implements IUserRepository {
  private getAllUserListCalled = false;
  private lastRequestedRole: UserRole | undefined = undefined;
  private shouldFail = false;
  private error: Error | null = null;
  private users: User[] = [];

  constructor() {
    // Default test data with properly instantiated User objects
    const now = new Date();
    this.users = [
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
      new User({
        id: 'user3',
        name: 'Test User 3',
        email: 'user3@example.com',
        role: UserRole.ADMIN,
        createdAt: now,
        updatedAt: now,
      }),
    ];
  }

  reset(): void {
    this.getAllUserListCalled = false;
    this.lastRequestedRole = undefined;
    this.shouldFail = false;
    this.error = null;
  }

  setError(error: Error): void {
    this.shouldFail = true;
    this.error = error;
  }

  setUsers(users: User[]): void {
    this.users = users;
  }

  async getAllUserList(role?: UserRole): Promise<User[]> {
    this.getAllUserListCalled = true;
    this.lastRequestedRole = role;

    if (this.shouldFail) {
      throw this.error || new Error('Failed to get users');
    }

    if (role) {
      return this.users.filter((user) => user.role === role);
    }
    return [...this.users];
  }

  wasGetAllUserListCalled(): boolean {
    return this.getAllUserListCalled;
  }

  getLastRequestedRole(): UserRole | undefined {
    return this.lastRequestedRole;
  }
}
