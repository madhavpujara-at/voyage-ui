import { UserRole } from '../../domain/entities/User';
import { FailToDemoteLeadError } from '../../domain/errors/FailToDemoteLeadError';
import { FailToPromoteMemberError } from '../../domain/errors/FailToPromoteMemberError';
import { InvalidRoleTransitionError } from '../../domain/errors/InvalidRoleTransitionError';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { IUserRoleRepository } from '../../domain/interfaces/IUserRoleRepository';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';
import { IConfigService } from '../../../../shared/infrastructure/interfaces/IConfigService';

interface UserApiResponse {
  data: {
    id: string;
    email: string;
    role: string;
    updatedAt: string;
  };
  success: boolean;
}

export class UserRoleRepositoryImpl implements IUserRoleRepository {
  constructor(private readonly httpService: IHttpService, private readonly configService: IConfigService) {}

  // private mapResponseToUser(response: UserApiResponse): User {
  //   return new User(
  //     response.id,
  //     response.name,
  //     response.email,
  //     '', // Password is not returned from API
  //     response.role as UserRole,
  //     new Date(response.createdAt),
  //     new Date(response.updatedAt)
  //   );
  // }

  async promoteToLead(userId: string): Promise<string> {
    try {
      // Get base URL from config
      const path = `/users/${userId}/role`;

      const response = await this.httpService.patch<UserApiResponse>({
        path,
        body: { newRole: UserRole.TECH_LEAD },
      });

      console.log('response', response);

      return response.data.id;
    } catch (error: unknown) {
      // Handle specific errors
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 404) {
        throw new UserNotFoundError(userId);
      }
      if (httpError.response?.status === 400) {
        throw new InvalidRoleTransitionError(userId, 'TEAM_MEMBER', 'TECH_LEAD');
      }

      // Specific error for promotion failure
      throw new FailToPromoteMemberError(userId);
    }
  }

  async demoteToMember(userId: string): Promise<string> {
    try {
      // Get base URL from config
      const path = `/users/${userId}/role`;

      // Call API endpoint
      const response = await this.httpService.patch<UserApiResponse>({
        path,
        body: { newRole: 'TEAM_MEMBER' },
      });

      return response.data.id;
    } catch (error: unknown) {
      // Handle specific errors
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 404) {
        throw new UserNotFoundError(userId);
      }
      if (httpError.response?.status === 400) {
        throw new InvalidRoleTransitionError(userId, 'TECH_LEAD', 'TEAM_MEMBER');
      }

      // Specific error for demotion failure
      throw new FailToDemoteLeadError(userId);
    }
  }
}
