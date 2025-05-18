import { RoleChangeFailedError } from './RoleChangeFailedError';

export class FailToDemoteLeadError extends RoleChangeFailedError {
  constructor(userId: string, message: string = 'Failed to demote tech lead to team member') {
    super(userId, message);
    this.name = 'FailToDemoteLeadError';
  }
}
