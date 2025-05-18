import { IHttpService, IHttpRequestOptions } from '../../../shared/infrastructure/interfaces/IHttpService';

export class FailingHttpServiceStub implements IHttpService {
  private error: string;
  private statusCode: number;

  constructor(error: string, statusCode = 500) {
    this.error = error;
    this.statusCode = statusCode;
  }

  private createErrorResponse(): never {
    const error: Error & { response?: { status: number } } = new Error(this.error);
    error.response = { status: this.statusCode };
    throw error;
  }

  // We're intentionally ignoring the options parameters since this stub always throws errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get<T>(_options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    return this.createErrorResponse();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async post<T>(_options: IHttpRequestOptions): Promise<T> {
    return this.createErrorResponse();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async put<T>(_options: IHttpRequestOptions): Promise<T> {
    return this.createErrorResponse();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete<T>(_options: Omit<IHttpRequestOptions, 'body'>): Promise<T> {
    return this.createErrorResponse();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch<T>(_options: IHttpRequestOptions): Promise<T> {
    return this.createErrorResponse();
  }
}
