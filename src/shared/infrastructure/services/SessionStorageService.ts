export class SessionStorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly EXPIRATION_KEY = 'auth_token_expiration';
  private readonly THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      const expirationTime = new Date().getTime() + this.THIRTY_DAYS_IN_MS;
      sessionStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.setItem(this.EXPIRATION_KEY, expirationTime.toString());
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem(this.TOKEN_KEY);
      const expirationTime = sessionStorage.getItem(this.EXPIRATION_KEY);

      if (token && expirationTime) {
        const now = new Date().getTime();
        if (now < parseInt(expirationTime, 10)) {
          return token;
        } else {
          // Token expired, remove it
          this.removeToken();
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Removes the authentication token and its expiration from session storage
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.EXPIRATION_KEY);
    }
  }

  /**
   * Checks if a valid (non-expired) token exists in session storage
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}
