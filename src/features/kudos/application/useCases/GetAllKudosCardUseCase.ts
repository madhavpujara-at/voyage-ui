import { IKudosRepository, KudoCardApiResponse } from '../../domain/interfaces/IKudosRepository';
import { FailedToRetrieveKudosError } from '../errors/FailedToRetrieveKudosError';

export class GetAllKudosCardUseCase {
  constructor(private readonly kudosRepository: IKudosRepository) {}

  async execute(): Promise<KudoCardApiResponse[]> {
    try {
      // Get all kudo cards from repository
      const kudoCards = await this.kudosRepository.getAllKudosCard();

      // Return raw response
      return kudoCards;
    } catch (error) {
      // Wrap error
      throw new FailedToRetrieveKudosError(
        error instanceof Error ? error.message : 'Unknown error retrieving kudo cards'
      );
    }
  }
}
