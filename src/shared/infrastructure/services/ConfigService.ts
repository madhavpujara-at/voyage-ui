import { IConfigService, ApiPaths } from '../interfaces/IConfigService';

export class ConfigService implements IConfigService {
  private readonly config: {
    baseUrl: string;
    apiPaths: ApiPaths;
  };

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL as string,
      apiPaths: {
        register: '/auth/register',
        login: '/auth/login',
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
