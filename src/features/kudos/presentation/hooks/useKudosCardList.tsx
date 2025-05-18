import { useState, useCallback, useMemo } from 'react';
import { KudosApiRepository } from '../../infrastructure/repositories/KudosApiRepository';
import { HttpService } from '../../../../shared/infrastructure/services/HttpService';
import { ConfigService } from '../../../../shared/infrastructure/services/ConfigService';
import { GetAllKudosCardUseCase } from '../../application/useCases/GetAllKudosCardUseCase';
import { KudoCardMapper } from '../../application/mappers/KudoCardMapper';
import { CreateKudoCardRequestDto } from '../../application/dtos/CreateKudoCardRequestDto';
import { CreateKudoCardResponseDto } from '../../application/dtos/CreateKudoCardResponseDto';
import { KudoCardDetailsDto } from '../../application/dtos/KudoCardDetailsDto';
import { useCreateKudoCard } from './useCreateKudoCard';
import { FailedToRetrieveKudosError } from '../../application/errors/FailedToRetrieveKudosError';
import { Kudos } from '../components/KudosList';

export const useKudosCardList = (authorId: string) => {
  // State for the list of kudos
  const [kudos, setKudos] = useState<Kudos[]>([]);
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
  const kudoCardMapper = useMemo(() => new KudoCardMapper(), []);

  // Initialize use case - memoize to prevent recreation on every render
  const getAllKudosCardUseCase = useMemo(
    () => new GetAllKudosCardUseCase(kudosRepository, kudoCardMapper),
    [kudosRepository, kudoCardMapper]
  );

  // Function to map KudoCardDetailsDto to Kudos interface
  const mapToKudos = useCallback((dto: KudoCardDetailsDto): Kudos => {
    // In a real application, you would fetch team and category names
    // For now, we'll just use the IDs
    return {
      id: dto.id,
      recipient: {
        name: dto.recipientName,
      },
      category: dto.categoryId, // In real app, replace with category name
      message: dto.message,
      from: {
        name: dto.authorId, // In real app, replace with author name
      },
      date: dto.createdAt.toLocaleDateString(),
      likes: 0, // Default values
      comments: 0, // Default values
    };
  }, []);

  // Function to fetch all kudos
  const fetchKudos = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);

    try {
      const kudoCardDetails = await getAllKudosCardUseCase.execute();
      const mappedKudos = kudoCardDetails.map(mapToKudos);
      setKudos(mappedKudos);
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
  }, [getAllKudosCardUseCase, mapToKudos]);

  // Function to handle creating a new kudo card
  const handleCreateKudoCard = useCallback(
    async (data: CreateKudoCardRequestDto): Promise<CreateKudoCardResponseDto | null> => {
      const result = await createKudoCard(data, authorId);
      return result;
    },
    [createKudoCard, authorId]
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
