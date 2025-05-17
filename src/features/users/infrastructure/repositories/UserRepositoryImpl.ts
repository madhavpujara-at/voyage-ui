import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { RegisterUserDto } from '../../application/dtos/RegisterUserDto';
import { UserRole } from '../../domain/entities/UserRole';
import { UserAlreadyExistsError } from '../../domain/errors/UserErrors';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly httpService: IHttpService, private readonly configService: IConfigService) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().register;

      // Call register endpoint
      const userData = await this.httpService.post<any>({
        path: apiPath,
        body: registerDto,
      });

      // Create and return user entity
      return User.create({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
      });
    } catch (error: any) {
      // Handle specific errors
      if (error.response?.status === 409) {
        throw new UserAlreadyExistsError(registerDto.email);
      }

      // Re-throw other errors
      throw error;
    }
  }
}
