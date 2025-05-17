import { User } from '@/features/users/domain/entities/User';
import { LoginUserResponseDto } from '../dtos/LoginUserResponseDto';
import { RegisterUserResponseDto } from '../dtos/RegisterUserResponseDto';

export class AuthMapper {
  static toLoginResponseDto(user: User, token: string): LoginUserResponseDto {
    return {
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token: token,
      },
    };
  }

  static toRegisterResponseDto(user: User, token: string): RegisterUserResponseDto {
    return {
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toString(),
        createdAt: user.createdAt.toISOString(),
        token: token,
      },
    };
  }
}
