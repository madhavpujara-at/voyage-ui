export class RoleChangeFailedError extends Error {
  constructor(userId: string, message: string = 'Role change operation failed') {
    super(`${message} for user ${userId}`);
    this.name = 'RoleChangeFailedError';
  }
}
