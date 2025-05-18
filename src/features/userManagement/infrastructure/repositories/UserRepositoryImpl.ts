import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserOutputDto } from '../../application/dtos/UserOutputDto';
import { User, UserRole } from '../../domain/entities/User'; // Adjusted path and added User
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';
import {
  InvalidRoleError,
  AdminAccessRequiredError,
  UserManagementServiceError,
} from '../../domain/errors/UserManagementErrors';

// Define a more specific type for HTTP errors
interface HttpErrorWithResponse {
  response?: {
    status: number;
    data?: { message?: string; [key: string]: unknown }; // data can have a message and other properties
  };
  message?: string; // For non-HTTP errors or errors without a response object
}

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly httpService: IHttpService, private readonly configService: IConfigService) {}

  async getAllUserList(role?: UserRole): Promise<User[]> {
    // Changed return type to User[]
    try {
      let path = `${this.configService.getApiPaths().users}`;

      if (role) {
        path += `?role=${role}`;
      }

      // The API is expected to return an object like { users: UserOutputDto[] }
      const response = await this.httpService.get<{ users: UserOutputDto[] }>({
        path: path,
      });

      // Map UserOutputDto[] to User[]
      return response.users.map((userDto) => new User(userDto));
    } catch (error: unknown) {
      // Changed error type from any to unknown
      const httpError = error as HttpErrorWithResponse; // Use the defined interface

      if (httpError.response) {
        switch (httpError.response.status) {
          case 400:
            throw new InvalidRoleError(httpError.response.data?.message || 'Invalid role specified.');
          case 401:
            throw new UserManagementServiceError('Authentication failed or JWT is missing.');
          case 403:
            throw new AdminAccessRequiredError(httpError.response.data?.message || 'Admin access required.');
          default:
            throw new UserManagementServiceError(
              httpError.response.data?.message || 'An unexpected server error occurred.'
            );
        }
      }

      // If it's not an HTTP error with a response object, or a different kind of error
      // Try to use error.message if available, otherwise a generic message.
      const errorMessage =
        error instanceof Error && error.message ? error.message : 'An unexpected error occurred while fetching users.';
      throw new UserManagementServiceError(errorMessage);
    }
  }
}
