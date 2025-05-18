// Corrected path based on previous findings:
import { UserRole } from '@/features/users/domain/entities/UserRole';

export interface UserOutputDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
