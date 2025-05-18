export interface IUserRoleRepository {
  promoteToLead(userId: string): Promise<string>;
  demoteToMember(userId: string): Promise<string>;
}
