import { IAuthTokenRepository } from '../../../features/auth/domain/interfaces/IAuthTokenRepository';

export class AuthTokenRepositorySpy implements IAuthTokenRepository {
  private token: string | null = null;
  private removeTokenCalled = false;
  private saveTokenCalled = false;

  saveToken(token: string): void {
    this.token = token;
    this.saveTokenCalled = true;
  }

  getToken(): string | null {
    return this.token;
  }

  removeToken(): void {
    this.token = null;
    this.removeTokenCalled = true;
  }

  wasSaveTokenCalled(): boolean {
    return this.saveTokenCalled;
  }

  wasRemoveTokenCalled(): boolean {
    return this.removeTokenCalled;
  }
}
