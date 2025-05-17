import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { LoginUserResponseDto } from '../dtos/LoginUserResponseDto';
import { AuthMapper } from '../mappers/AuthMapper';
import { InvalidCredentialsError, UserNotFoundError } from '../../domain/errors/AuthErrors';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';

export class LoginUserUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly httpService: IHttpService,
    private readonly configService: IConfigService
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    try {
      // Login user through repository
      const userWithToken = await this.authRepository.login(loginUserDto);

      return userWithToken;
    } catch (error: unknown) {
      // Handle specific errors
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 401) {
        throw new InvalidCredentialsError();
      }
      if (httpError.response?.status === 404) {
        throw new UserNotFoundError(loginUserDto.email);
      }
      // Re-throw other errors
      throw error;
    }
  }
}
