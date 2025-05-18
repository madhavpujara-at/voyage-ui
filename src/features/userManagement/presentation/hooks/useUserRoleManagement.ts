import { useState } from 'react';
import { IUserRoleRepository } from '../../domain/interfaces/IUserRoleRepository';
import { InvalidRoleError } from '../../domain/errors/InvalidRoleError';
import { formatSuccessMessage, formatErrorMessage } from '../utils/userRoleMessages';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { UserRoleRepositoryImpl } from '../../infrastructure/repositories/UserRoleRepositoryImpl';
import { PromoteMemberToLeadUseCase } from '../../application/useCases/PromoteMemberToLeadUseCase';
import { DemoteLeadToMemberUseCase } from '../../application/useCases/DemoteLeadToMemberUseCase';

interface UserRoleManagementHook {
  promoteUser: (userId: string, userName?: string) => Promise<void>;
  demoteUser: (userId: string, userName?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  clearMessages: () => void;
}

export const useUserRoleManagement = (userRoleRepository: IUserRoleRepository): UserRoleManagementHook => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const promoteUser = async (userId: string, userName?: string): Promise<void> => {
    try {
      setIsLoading(true);
      clearMessages();

      const updateUserRoleUseCase = new PromoteMemberToLeadUseCase(userRoleRepository);
      await updateUserRoleUseCase.execute(userId);

      setSuccessMessage(formatSuccessMessage('promotion', userName));
    } catch (err) {
      handleError(err, 'promotion', userName);
    } finally {
      setIsLoading(false);
    }
  };

  const demoteUser = async (userId: string, userName?: string): Promise<void> => {
    try {
      setIsLoading(true);
      clearMessages();

      const updateUserRoleUseCase = new DemoteLeadToMemberUseCase(userRoleRepository);
      await updateUserRoleUseCase.execute(userId);

      setSuccessMessage(formatSuccessMessage('demotion', userName));
    } catch (err) {
      handleError(err, 'demotion', userName);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err: unknown, operation: 'promotion' | 'demotion', userName?: string): void => {
    console.error(`Error during user ${operation}:`, err);

    if (err instanceof InvalidRoleError) {
      setError(formatErrorMessage(operation, 'invalid_role', userName));
    } else if (err instanceof Error) {
      // Use the error message if available, otherwise use a generic message
      if (err.message.includes('not found') || err.message.includes('No user')) {
        setError(formatErrorMessage(operation, 'not_found', userName));
      } else if (err.message.includes('permission') || err.message.includes('unauthorized')) {
        setError(formatErrorMessage(operation, 'unauthorized', userName));
      } else {
        setError(err.message || formatErrorMessage(operation, 'unknown', userName));
      }
    } else {
      setError(formatErrorMessage(operation, 'unknown', userName));
    }
  };

  return {
    promoteUser,
    demoteUser,
    isLoading,
    error,
    successMessage,
    clearMessages,
  };
};

export const useUserRoleManagerWithServices = (): UserRoleManagementHook => {
  // Create services instances
  const configService = new ConfigService();
  const httpService = new HttpService(configService.getBaseUrl());
  const userRoleRepository = new UserRoleRepositoryImpl(httpService, configService);

  // Use the base hook with our repository
  return useUserRoleManagement(userRoleRepository);
};
