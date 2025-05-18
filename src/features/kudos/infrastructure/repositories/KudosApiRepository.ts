import { IKudosRepository } from '../../domain/interfaces/IKudosRepository';
import { KudoCard } from '../../domain/entities/KudoCard';
import { IHttpService } from '../../../../shared/infrastructure/interfaces/IHttpService';

import { InvalidKudoCardPropertyError } from '../../domain/errors/InvalidKudoCardPropertyError';
import { IConfigService } from '@/shared/infrastructure/interfaces/IConfigService';

// Interface for API responses to avoid any type
interface CreateKudoCardApiResponse {
  id: string;
  success: boolean;
}

interface KudoCardApiItem {
  id: string;
  recipientName: string;
  teamId: string;
  categoryId: string;
  message: string;
  authorId: string;
  createdAt: string; // API returns dates as strings
  updatedAt: string; // API returns dates as strings
}

interface GetAllKudoCardsApiResponse {
  kudoCards: KudoCardApiItem[];
  total: number;
}

export class KudosApiRepository implements IKudosRepository {
  constructor(private readonly httpService: IHttpService, private readonly configService: IConfigService) {}

  async create(kudoCard: KudoCard): Promise<{ id: string }> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().kudoCards;

      // Prepare request body
      const requestBody = {
        recipientName: kudoCard.recipientName,
        teamId: kudoCard.teamId,
        categoryId: kudoCard.categoryId,
        message: kudoCard.message,
      };
      // Call create kudo card endpoint
      const response = await this.httpService.post<CreateKudoCardApiResponse>({
        path: apiPath,
        body: requestBody,
      });

      // Return the ID
      return { id: response.id };
    } catch (error: unknown) {
      // Handle specific errors
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 400) {
        throw new InvalidKudoCardPropertyError('Invalid kudo card data');
      }

      // Re-throw other errors
      throw error;
    }
  }

  async getAllKudosCard(): Promise<KudoCard[]> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().kudoCards;

      // Call get all kudo cards endpoint
      const response = await this.httpService.get<GetAllKudoCardsApiResponse>({
        path: apiPath,
      });

      // Handle response format with wrapped kudoCards array
      const kudoCards = response.kudoCards || [];

      // Map API response to domain entities
      return kudoCards.map((item) =>
        KudoCard.reconstitute({
          id: item.id,
          recipientName: item.recipientName,
          teamId: item.teamId,
          categoryId: item.categoryId,
          message: item.message,
          authorId: item.authorId,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })
      );
    } catch (error: unknown) {
      // Handle specific errors if needed
      const httpError = error as { response?: { status: number } };

      if (httpError.response?.status === 404) {
        // Return empty array if no kudos found
        return [];
      }

      // Re-throw other errors
      throw error;
    }
  }
}
