export class FailedToRetrieveKudosError extends Error {
  constructor(message: string = 'Failed to retrieve kudo cards') {
    super(message);
    this.name = 'FailedToRetrieveKudosError';
  }
}
