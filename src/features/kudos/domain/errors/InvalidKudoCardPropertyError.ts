export class InvalidKudoCardPropertyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKudoCardPropertyError';
  }
}
