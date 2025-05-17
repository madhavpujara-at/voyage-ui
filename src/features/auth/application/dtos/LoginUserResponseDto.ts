import { UserRole } from '@/features/users/domain/entities/UserRole';

export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface LoginUserResponseDto {
  status: string;
  data: {
    user: UserDto;
    token: string;
  };
}
