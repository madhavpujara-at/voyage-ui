export class CreateKudoCardResponseDto {
  readonly id: string;
  readonly success: boolean;

  constructor(data: { id: string; success: boolean }) {
    this.id = data.id;
    this.success = data.success;
  }
}
