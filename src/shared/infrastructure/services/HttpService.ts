import { IHttpService, IHttpRequestOptions } from '../interfaces/IHttpService';

export class HttpService implements IHttpService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    const { path, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.getHeaders(headers),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  async post<T>(options: IHttpRequestOptions): Promise<T> {
    const { path, body, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(headers),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  async put<T>(options: IHttpRequestOptions): Promise<T> {
    const { path, body, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(headers),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  async delete<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    const { path, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(headers),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorData: { message?: string } = {};
    try {
      errorData = await response.json();
    } catch (error) {
      errorData = { message: 'Unknown error occurred' };
    }

    const responseError = new Error(errorData.message || 'API error');
    Object.defineProperty(responseError, 'response', { value: response });
    Object.defineProperty(responseError, 'data', { value: errorData });
    return responseError;
  }
}
