import { IUserRoleRepository } from '../../domain/interfaces/IUserRoleRepository';

export class PromoteMemberToLeadUseCase {
  constructor(private userRepository: IUserRoleRepository) {}

  async execute(userId: string): Promise<string> {
    try {
      // Promotion Logic
      const updatedUser: string = await this.userRepository.promoteToLead(userId);

      // Map the updatedUser to UserResponseDto and return
      return updatedUser;
    } catch (error) {
      // Re-throw the error to be handled by the presentation layer
      throw error;
    }
  }
}
