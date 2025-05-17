import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { UserAlreadyExistsError } from '../../domain/errors/AuthErrors';
import { RegisterUserRequestDto } from '../dtos/RegisterUserRequestDto';
import { RegisterUserResponseDto } from '../dtos/RegisterUserResponseDto';

export class RegisterUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(registerUserDto: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    try {
      // Register user through repository
      const result = await this.authRepository.register(registerUserDto);
      return result;
    } catch (error: unknown) {
      // Check if error is from API, indicating existing user
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      // Re-throw other errors
      throw error;
    }
  }
}
