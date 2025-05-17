import { UserRole } from '../../domain/entities/UserRole';

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
