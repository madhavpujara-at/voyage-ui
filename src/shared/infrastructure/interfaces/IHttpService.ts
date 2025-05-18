export interface IHttpRequestOptions {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface IHttpService {
  get<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T>;
  post<T>(options: IHttpRequestOptions): Promise<T>;
  put<T>(options: IHttpRequestOptions): Promise<T>;
  delete<T>(options: Omit<IHttpRequestOptions, 'body'>): Promise<T>;
  patch<T>(options: IHttpRequestOptions): Promise<T>;
}
