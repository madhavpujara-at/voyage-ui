import { User } from '../../domain/entities/User';
import { IUserRoleRepository } from '../../domain/interfaces/IUserRoleRepository';
import { UserResponseDto } from '../dtos/UserResponseDto';
import { UserMapper } from '../mappers/UserMapper';

export class PromoteMemberToLeadUseCase {
  constructor(private userRepository: IUserRoleRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    try {
      // Promotion Logic
      const updatedUser: User = await this.userRepository.promoteToLead(userId);

      // Map the updatedUser to UserResponseDto and return
      return UserMapper.toDto(updatedUser);
    } catch (error) {
      // Re-throw the error to be handled by the presentation layer
      throw error;
    }
  }
}
