export class InvalidRoleError extends Error {
  constructor(
    message: string = 'The specified newRole is not valid for this operation. Valid roles are TECH_LEAD or TEAM_MEMBER.'
  ) {
    super(message);
    this.name = 'InvalidRoleError';
  }
}
