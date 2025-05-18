export class KudoCardDetailsDto {
  readonly id: string;
  readonly recipientName: string;
  readonly teamId: string;
  readonly teamName: string;
  readonly categoryId: string;
  readonly categoryName: string;
  readonly message: string;
  readonly giverId: string;
  readonly giverName: string;
  readonly giverEmail: string;
  readonly createdAt: Date;

  constructor(data: {
    id: string;
    recipientName: string;
    teamId: string;
    teamName: string;
    categoryId: string;
    categoryName: string;
    message: string;
    giverId: string;
    giverName: string;
    giverEmail: string;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.recipientName = data.recipientName;
    this.teamId = data.teamId;
    this.teamName = data.teamName;
    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName;
    this.message = data.message;
    this.giverId = data.giverId;
    this.giverName = data.giverName;
    this.giverEmail = data.giverEmail;
    this.createdAt = data.createdAt;
  }
}
