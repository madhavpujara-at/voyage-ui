import { IKudosRepository } from '../../domain/interfaces/IKudosRepository';
import { CreateKudoCardRequestDto } from '../dtos/CreateKudoCardRequestDto';
import { CreateKudoCardResponseDto } from '../dtos/CreateKudoCardResponseDto';
import { KudoCard } from '../../domain/entities/KudoCard';
import { KudoCardCreationError } from '../errors/KudoCardCreationError';
import { InvalidKudoCardPropertyError } from '../../domain/errors/InvalidKudoCardPropertyError';

// Interface for the ID generator service
// export interface IdGenerator {
// generate(): string;
// }

export class CreateKudoCardUseCase {
  constructor(private readonly kudosRepository: IKudosRepository) {}

  async execute(
    data: CreateKudoCardRequestDto,
    giverData: {
      giverId: string;
      giverName?: string;
      giverEmail?: string;
    }
  ): Promise<CreateKudoCardResponseDto> {
    try {
      // Validate input DTO
      const validation = data.validate();
      if (!validation.isValid) {
        throw new InvalidKudoCardPropertyError(validation.errors.join(', '));
      }

      // Create domain entity
      const kudoCard = KudoCard.create({
        recipientName: data.recipientName,
        teamId: data.teamId,
        teamName: data.teamName,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        message: data.message,
        giverId: giverData.giverId,
        giverName: giverData.giverName,
        giverEmail: giverData.giverEmail,
      });

      const result = await this.kudosRepository.create(kudoCard);

      // Return response
      return new CreateKudoCardResponseDto({
        id: result.id,
        success: true,
      });
    } catch (error) {
      // Handle specific errors
      if (error instanceof InvalidKudoCardPropertyError) {
        throw error;
      }

      // Wrap other errors
      throw new KudoCardCreationError(error instanceof Error ? error.message : 'Unknown error creating kudo card');
    }
  }
}
