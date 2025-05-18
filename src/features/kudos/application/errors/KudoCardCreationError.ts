export class KudoCardCreationError extends Error {
  constructor(message: string = 'Failed to create kudo card') {
    super(message);
    this.name = 'KudoCardCreationError';
  }
}
