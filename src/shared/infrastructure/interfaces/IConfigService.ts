export interface ApiPaths {
  register: string;
  login: string;
  users: string;
  kudoCards: string;
  // Other API paths
}

export interface IConfigService {
  getApiPaths(): ApiPaths;
  getBaseUrl(): string;
  // Other config methods
}
