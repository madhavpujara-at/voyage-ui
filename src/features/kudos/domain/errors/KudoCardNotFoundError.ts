export class KudoCardNotFoundError extends Error {
  constructor(id: string) {
    super(`Kudo card with ID ${id} not found`);
    this.name = 'KudoCardNotFoundError';
  }
}
