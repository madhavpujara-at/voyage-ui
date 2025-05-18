import { UserRole } from '@/features/users/domain/entities/UserRole';
import { User } from '../entities/User';

export interface IUserRepository {
  getAllUserList(role?: UserRole): Promise<User[]>;
}
