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

// Updated API response format to match the raw response
export interface KudoCardApiResponse {
  id: string;
  message: string;
  recipientName: string;
  giverId: string;
  giverEmail: string;
  teamId: string;
  teamName: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  giverName: string;
}

interface GetAllKudoCardsApiResponse {
  kudoCards: KudoCardApiResponse[];
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

  async getAllKudosCard(): Promise<KudoCardApiResponse[]> {
    try {
      // Get API endpoint from config
      const apiPath = this.configService.getApiPaths().kudoCards;

      // Call get all kudo cards endpoint
      const response = await this.httpService.get<GetAllKudoCardsApiResponse>({
        path: apiPath,
      });

      // Handle response format with wrapped kudoCards array
      const kudoCards = response.kudoCards || [];

      // Return raw API response instead of domain objects
      return kudoCards;
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
