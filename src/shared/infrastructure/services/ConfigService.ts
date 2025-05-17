import { IConfigService, ApiPaths } from '../interfaces/IConfigService';

export class ConfigService implements IConfigService {
  private readonly config: {
    baseUrl: string;
    apiPaths: ApiPaths;
  };

  constructor() {
    this.config = {
      baseUrl: 'https://voyage-backend-gd3mz.kinsta.app/api',
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
