import { RoleChangeFailedError } from './RoleChangeFailedError';

export class FailToPromoteMemberError extends RoleChangeFailedError {
  constructor(userId: string, message: string = 'Failed to promote team member to tech lead') {
    super(userId, message);
    this.name = 'FailToPromoteMemberError';
  }
}
