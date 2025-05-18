import { ApiPaths, IConfigService } from '../../../shared/infrastructure/interfaces/IConfigService';

export class ConfigServiceStub implements IConfigService {
  private baseUrl = 'https://api.example.com';
  private apiPaths: ApiPaths = {
    register: '/auth/register',
    login: '/auth/login',
    users: '/users',
    kudoCards: '/kudocards',
  };

  getApiPaths(): ApiPaths {
    return this.apiPaths;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
