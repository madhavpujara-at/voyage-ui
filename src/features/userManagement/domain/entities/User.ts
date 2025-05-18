export enum UserRole {
  ADMIN = 'ADMIN',
  TECH_LEAD = 'TECH_LEAD',
  TEAM_MEMBER = 'TEAM_MEMBER',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
