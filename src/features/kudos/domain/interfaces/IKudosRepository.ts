import { KudoCard } from '../entities/KudoCard';

export interface IKudosRepository {
  create(kudoCard: KudoCard): Promise<{ id: string }>;

  getAllKudosCard(): Promise<KudoCard[]>;
}
