import { IUserRoleRepository } from '../../../features/userManagement/domain/interfaces/IUserRoleRepository';

export class UserRoleRepositorySpy implements IUserRoleRepository {
  private promoteToLeadCalled = false;
  private demoteToMemberCalled = false;
  private userId: string | null = null;
  private shouldFail = false;
  private error: Error | null = null;

  reset(): void {
    this.promoteToLeadCalled = false;
    this.demoteToMemberCalled = false;
    this.userId = null;
    this.shouldFail = false;
    this.error = null;
  }

  setError(error: Error): void {
    this.shouldFail = true;
    this.error = error;
  }

  async promoteToLead(userId: string): Promise<string> {
    this.promoteToLeadCalled = true;
    this.userId = userId;

    if (this.shouldFail) {
      throw this.error || new Error('Promotion failed');
    }

    return `updated-${userId}`;
  }

  async demoteToMember(userId: string): Promise<string> {
    this.demoteToMemberCalled = true;
    this.userId = userId;

    if (this.shouldFail) {
      throw this.error || new Error('Demotion failed');
    }

    return `updated-${userId}`;
  }

  wasPromoteToLeadCalled(): boolean {
    return this.promoteToLeadCalled;
  }

  wasDemoteToMemberCalled(): boolean {
    return this.demoteToMemberCalled;
  }

  getLastUserId(): string | null {
    return this.userId;
  }
}
