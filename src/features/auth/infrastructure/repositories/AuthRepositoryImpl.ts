import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { LoginUserDto } from '../../application/dtos/LoginUserDto';
import { RegisterUserRequestDto } from '../../application/dtos/RegisterUserRequestDto';
import { RegisterUserResponseDto } from '../../application/dtos/RegisterUserResponseDto';
import { User } from '@/features/users/domain/entities/User';
import { UserRole } from '@/features/users/domain/entities/UserRole';
import { InvalidCredentialsError, UserNotFoundError, UserAlreadyExistsError } from '../../domain/errors/AuthErrors';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';
import { LoginUserResponseDto } from '../../application/dtos/LoginUserResponseDto';

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private readonly httpService: IHttpService, private readonly configService: IConfigService) {}

  async login(credentials: LoginUserDto): Promise<LoginUserResponseDto> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().login;

      // Call login endpoint
      const response = await this.httpService.post<LoginUserResponseDto>({
        path: apiPath,
        body: credentials,
      });

      return response;
    } catch (error: unknown) {
      // Handle specific errors
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 401) {
        throw new InvalidCredentialsError();
      }
      if (httpError.response?.status === 404) {
        throw new UserNotFoundError(credentials.email);
      }

      // Re-throw other errors
      throw error;
    }
  }

  async register(registerData: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().register;

      // Call register endpoint
      const response = await this.httpService.post<RegisterUserResponseDto>({
        path: apiPath,
        body: registerData,
      });

      return response;
    } catch (error: unknown) {
      // Handle specific errors
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 409) {
        throw new UserAlreadyExistsError(registerData.email);
      }

      // Re-throw other errors
      throw error;
    }
  }
}
