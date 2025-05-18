import { IHttpService, IHttpRequestOptions } from '../../../shared/infrastructure/interfaces/IHttpService';

type HttpResponseData = Record<string, unknown>;
type HttpParameters = IHttpRequestOptions | Omit<IHttpRequestOptions, 'body'>;

export class HttpServiceSpy implements IHttpService {
  private params: HttpParameters | null = null;
  private responseData: HttpResponseData;

  constructor(responseData: HttpResponseData = { success: true }) {
    this.responseData = responseData;
  }

  async get<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    this.params = options;
    return this.responseData as T;
  }

  async post<T>(options: IHttpRequestOptions): Promise<T> {
    this.params = options;
    return this.responseData as T;
  }

  async put<T>(options: IHttpRequestOptions): Promise<T> {
    this.params = options;
    return this.responseData as T;
  }

  async delete<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    this.params = options;
    return this.responseData as T;
  }

  async patch<T>(options: IHttpRequestOptions): Promise<T> {
    this.params = options;
    return this.responseData as T;
  }

  getParams(): HttpParameters | null {
    return this.params;
  }
}
