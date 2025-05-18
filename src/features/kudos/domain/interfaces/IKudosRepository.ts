import { KudoCard } from '../entities/KudoCard';

// Define a basic interface for API responses
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

export interface IKudosRepository {
  create(kudoCard: KudoCard): Promise<{ id: string }>;

  getAllKudosCard(): Promise<KudoCardApiResponse[]>;
}
