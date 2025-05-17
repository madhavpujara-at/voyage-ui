import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserAlreadyExistsError } from '../../domain/errors/UserErrors';
import { RegisterUserDto } from '../dtos/RegisterUserDto';
import { UserResponseDto } from '../dtos/UserResponseDto';
import { UserMapper } from '../mappers/UserMapper';

// Define interfaces for the services
interface IHttpService {
  post<T>(url: string, data: any): Promise<any>;
}

interface IConfigService {
  get(key: string): string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly httpService: IHttpService,
    private readonly configService: IConfigService
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    try {
      // Register user through repository
      const newUser = await this.userRepository.register(registerUserDto);

      // Return response DTO
      return UserMapper.toDto(newUser);
    } catch (error: any) {
      // Check if error is from API, indicating existing user
      if (error.response?.status === 409) {
        throw new UserAlreadyExistsError(registerUserDto.email);
      }
      // Re-throw other errors
      throw error;
    }
  }
}
