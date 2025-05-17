import { User } from '../../domain/entities/User';
import { UserResponseDto } from '../dtos/UserResponseDto';

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
