import { User } from '../entities/User';

export interface IUserRoleRepository {
  promoteToLead(userId: string): Promise<User>;
  demoteToMember(userId: string): Promise<User>;
}
