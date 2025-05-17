import { IAuthTokenRepository } from '../../domain/interfaces/IAuthTokenRepository';
import { IStorageService } from '../../../../shared/infrastructure/interfaces/IStorageService';

/**
 * Implementation of IAuthTokenRepository using the StorageService
 */
export class AuthTokenRepository implements IAuthTokenRepository {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private readonly storageService: IStorageService) {}

  saveToken(token: string): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.storageService.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
  }
}
