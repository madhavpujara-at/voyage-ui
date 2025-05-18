import { IKudosRepository } from '../../domain/interfaces/IKudosRepository';
import { KudoCardDetailsDto } from '../dtos/KudoCardDetailsDto';
import { KudoCardMapper } from '../mappers/KudoCardMapper';
import { FailedToRetrieveKudosError } from '../errors/FailedToRetrieveKudosError';

export class GetAllKudosCardUseCase {
  constructor(private readonly kudosRepository: IKudosRepository, private readonly kudoCardMapper: KudoCardMapper) {}

  async execute(): Promise<KudoCardDetailsDto[]> {
    try {
      // Get all kudo cards from repository
      const kudoCards = await this.kudosRepository.getAllKudosCard();

      // Map domain entities to DTOs
      return KudoCardMapper.toDetailsDtoList(kudoCards);
    } catch (error) {
      // Wrap error
      throw new FailedToRetrieveKudosError(
        error instanceof Error ? error.message : 'Unknown error retrieving kudo cards'
      );
    }
  }
}
