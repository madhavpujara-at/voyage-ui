import { IConfigService, ApiPaths } from '../interfaces/IConfigService';

export class ConfigService implements IConfigService {
  private readonly config: {
    baseUrl: string;
    apiPaths: ApiPaths;
  };

  constructor() {
    // In a real app, these might come from environment variables
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      apiPaths: {
        register: '/auth/register',
        login: '/auth/login',
        // Other API paths if needed
      },
    };
  }

  getApiPaths(): ApiPaths {
    return this.config.apiPaths;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}
