export class KudoCardDetailsDto {
  readonly id: string;
  readonly recipientName: string;
  readonly teamId: string;
  readonly categoryId: string;
  readonly message: string;
  readonly authorId: string;
  readonly createdAt: Date;

  constructor(data: {
    id: string;
    recipientName: string;
    teamId: string;
    categoryId: string;
    message: string;
    authorId: string;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.recipientName = data.recipientName;
    this.teamId = data.teamId;
    this.categoryId = data.categoryId;
    this.message = data.message;
    this.authorId = data.authorId;
    this.createdAt = data.createdAt;
  }
}
