import { KudoCard } from '../../domain/entities/KudoCard';
import { KudoCardDetailsDto } from '../dtos/KudoCardDetailsDto';

export class KudoCardMapper {
  /**
   * Maps a KudoCard domain entity to a KudoCardDetailsDto
   * @param entity The KudoCard domain entity
   * @returns A KudoCardDetailsDto
   */
  static toDetailsDto(entity: KudoCard): KudoCardDetailsDto {
    return new KudoCardDetailsDto({
      id: entity.id,
      recipientName: entity.recipientName,
      teamId: entity.teamId,
      teamName: entity.teamName,
      categoryId: entity.categoryId,
      categoryName: entity.categoryName,
      message: entity.message,
      giverId: entity.giverId,
      giverName: entity.giverName,
      giverEmail: entity.giverEmail,
      createdAt: entity.createdAt,
    });
  }

  /**
   * Maps an array of KudoCard domain entities to an array of KudoCardDetailsDto
   * @param entities The array of KudoCard domain entities
   * @returns An array of KudoCardDetailsDto
   */
  static toDetailsDtoList(entities: KudoCard[]): KudoCardDetailsDto[] {
    return entities.map((entity) => this.toDetailsDto(entity));
  }
}
