// Using class-validator for validation (commented out as we don't know if it's installed)
// import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateKudoCardRequestDto {
  readonly recipientName: string;

  readonly teamId: string;

  readonly teamName?: string;

  readonly categoryId: string;

  readonly categoryName?: string;

  readonly message: string;

  constructor(data: {
    recipientName: string;
    teamId: string;
    teamName?: string;
    categoryId: string;
    categoryName?: string;
    message: string;
  }) {
    this.recipientName = data.recipientName;
    this.teamId = data.teamId;
    this.teamName = data.teamName;
    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName;
    this.message = data.message;
  }

  // Basic validation method if class-validator is not used
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.recipientName) {
      errors.push('Recipient name is required');
    } else if (this.recipientName.length < 1 || this.recipientName.length > 100) {
      errors.push('Recipient name must be between 1 and 100 characters');
    }

    if (!this.teamId) {
      errors.push('Team ID is required');
    }

    if (!this.categoryId) {
      errors.push('Category ID is required');
    }

    if (!this.message) {
      errors.push('Message is required');
    } else if (this.message.length < 1 || this.message.length > 500) {
      errors.push('Message must be between 1 and 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
