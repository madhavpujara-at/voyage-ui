import { LoginUserDto } from '../../application/dtos/LoginUserDto';
import { RegisterUserRequestDto } from '../../application/dtos/RegisterUserRequestDto';
import { RegisterUserResponseDto } from '../../application/dtos/RegisterUserResponseDto';
import { LoginUserResponseDto } from '../../application/dtos/LoginUserResponseDto';

export interface IAuthRepository {
  login(credentials: LoginUserDto): Promise<LoginUserResponseDto>;
  register(registerData: RegisterUserRequestDto): Promise<RegisterUserResponseDto>;
}
