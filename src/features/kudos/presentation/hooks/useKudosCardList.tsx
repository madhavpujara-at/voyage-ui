import { useState, useCallback, useMemo } from 'react';
import { KudosApiRepository } from '../../infrastructure/repositories/KudosApiRepository';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { GetAllKudosCardUseCase } from '../../application/useCases/GetAllKudosCardUseCase';
import { CreateKudoCardRequestDto } from '../../application/dtos/CreateKudoCardRequestDto';
import { CreateKudoCardResponseDto } from '../../application/dtos/CreateKudoCardResponseDto';
import { useCreateKudoCard } from './useCreateKudoCard';
import { FailedToRetrieveKudosError } from '../../application/errors/FailedToRetrieveKudosError';
import { KudoCardApiResponse } from '../../domain/interfaces/IKudosRepository';

export const useKudosCardList = (giverId: string) => {
  // State for the list of kudos
  const [kudos, setKudos] = useState<KudoCardApiResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Use the existing createKudoCard hook
  const { createKudoCard, isLoading: isCreating, error: createError, success: createSuccess } = useCreateKudoCard();

  // Initialize services - memoize to prevent recreation on every render
  const configService = useMemo(() => new ConfigService(), []);
  const httpService = useMemo(() => new HttpService(configService.getBaseUrl()), [configService]);
  const kudosRepository = useMemo(
    () => new KudosApiRepository(httpService, configService),
    [httpService, configService]
  );

  // Initialize use case - memoize to prevent recreation on every render
  const getAllKudosCardUseCase = useMemo(() => new GetAllKudosCardUseCase(kudosRepository), [kudosRepository]);

  // Function to fetch all kudos
  const fetchKudos = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);

    try {
      const kudoCards = await getAllKudosCardUseCase.execute();
      setKudos(kudoCards);
    } catch (error) {
      let errorMessage = 'Failed to fetch kudos';
      if (error instanceof FailedToRetrieveKudosError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setListError(errorMessage);
    } finally {
      setIsLoadingList(false);
    }
  }, [getAllKudosCardUseCase]);

  // Function to handle creating a new kudo card
  const handleCreateKudoCard = useCallback(
    async (data: CreateKudoCardRequestDto): Promise<CreateKudoCardResponseDto | null> => {
      const result = await createKudoCard(data, {
        giverId,
        giverName: '', // We might want to fetch this from a user context in a real app
        giverEmail: '', // We might want to fetch this from a user context in a real app
      });
      return result;
    },
    [createKudoCard, giverId]
  );

  return {
    kudos,
    isLoadingList,
    listError,
    isCreating,
    createError,
    createSuccess,
    createKudoCard: handleCreateKudoCard,
    fetchKudos, // Renamed from refreshKudos to make purpose clearer
  };
};
