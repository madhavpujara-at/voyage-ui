export class InvalidRoleTransitionError extends Error {
  constructor(userId: string, fromRole: string, toRole: string) {
    super(`Cannot change role for user ${userId} from ${fromRole} to ${toRole}`);
    this.name = 'InvalidRoleTransitionError';
  }
}
