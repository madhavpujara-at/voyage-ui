import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserOutputDto } from '../dtos/UserOutputDto';
import { UserRole } from '../../domain/entities/User'; // Adjusted path
// Potentially import domain errors if specific error handling is needed here
// import { InvalidRoleError } from '../../domain/errors/UserManagementErrors';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(role?: UserRole): Promise<UserOutputDto[]> {
    // Example of specific validation or logic if needed in the use case:
    // if (role && !Object.values(UserRole).includes(role)) {
    //   throw new InvalidRoleError(`Invalid role: ${role}`);
    // }

    // The primary responsibility of fetching data is delegated to the repository.
    // Additional business logic, orchestrating multiple repositories, or calling domain services would go here.
    return this.userRepository.getAllUserList(role);
  }
}
