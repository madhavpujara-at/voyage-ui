import { useState } from 'react';
import { CreateKudoCardUseCase } from '../../application/useCases/CreateKudoCardUseCase';
import { CreateKudoCardRequestDto } from '../../application/dtos/CreateKudoCardRequestDto';
import { CreateKudoCardResponseDto } from '../../application/dtos/CreateKudoCardResponseDto';
import { KudosApiRepository } from '../../infrastructure/repositories/KudosApiRepository';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { KudoCardCreationError } from '../../application/errors/KudoCardCreationError';
import { InvalidKudoCardPropertyError } from '../../domain/errors/InvalidKudoCardPropertyError';

export const useCreateKudoCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdCardId, setCreatedCardId] = useState<string | null>(null);

  // Initialize services
  const configService = new ConfigService();
  const httpService = new HttpService(configService.getBaseUrl());

  // Initialize repository
  const kudosRepository = new KudosApiRepository(httpService, configService);

  // Initialize use case
  const createKudoCardUseCase = new CreateKudoCardUseCase(kudosRepository);

  const createKudoCard = async (
    data: CreateKudoCardRequestDto,
    authorId: string
  ): Promise<CreateKudoCardResponseDto | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedCardId(null);

    try {
      const response: CreateKudoCardResponseDto = await createKudoCardUseCase.execute(data, authorId);

      setSuccess(true);
      setCreatedCardId(response.id); // Assuming response has an id
      return response;
    } catch (err: unknown) {
      let errorMessage = 'An error occurred while creating the kudo card.';
      if (err instanceof InvalidKudoCardPropertyError) {
        errorMessage = err.message;
      } else if (err instanceof KudoCardCreationError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setSuccess(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createKudoCard,
    isLoading,
    error,
    success,
    createdCardId,
  };
};
