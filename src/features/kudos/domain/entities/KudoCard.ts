import { InvalidKudoCardPropertyError } from '../errors/InvalidKudoCardPropertyError';

export interface KudoCardProps {
  id?: string;
  recipientName: string;
  teamId: string;
  teamName?: string;
  categoryId: string;
  categoryName?: string;
  message: string;
  giverId: string;
  giverName?: string;
  giverEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class KudoCard {
  private readonly _id: string;
  private _recipientName: string;
  private _teamId: string;
  private _teamName: string;
  private _categoryId: string;
  private _categoryName: string;
  private _message: string;
  private readonly _giverId: string;
  private readonly _giverName: string;
  private readonly _giverEmail: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: KudoCardProps) {
    this._id = props.id || '';
    this._recipientName = props.recipientName;
    this._teamId = props.teamId;
    this._teamName = props.teamName || '';
    this._categoryId = props.categoryId;
    this._categoryName = props.categoryName || '';
    this._message = props.message;
    this._giverId = props.giverId;
    this._giverName = props.giverName || '';
    this._giverEmail = props.giverEmail || '';
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get recipientName(): string {
    return this._recipientName;
  }

  get teamId(): string {
    return this._teamId;
  }

  get teamName(): string {
    return this._teamName;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get categoryName(): string {
    return this._categoryName;
  }

  get message(): string {
    return this._message;
  }

  get giverId(): string {
    return this._giverId;
  }

  get giverName(): string {
    return this._giverName;
  }

  get giverEmail(): string {
    return this._giverEmail;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Factory method for creating a new KudoCard
  public static create(props: {
    recipientName: string;
    teamId: string;
    teamName?: string;
    categoryId: string;
    categoryName?: string;
    message: string;
    giverId: string;
    giverName?: string;
    giverEmail?: string;
  }): KudoCard {
    // Validate recipientName
    if (!props.recipientName) {
      throw new InvalidKudoCardPropertyError('Recipient name is required');
    }

    if (props.recipientName.length < 1 || props.recipientName.length > 100) {
      throw new InvalidKudoCardPropertyError('Recipient name must be between 1 and 100 characters');
    }

    // Validate teamId
    if (!props.teamId) {
      throw new InvalidKudoCardPropertyError('Team ID is required');
    }

    // Validate categoryId
    if (!props.categoryId) {
      throw new InvalidKudoCardPropertyError('Category ID is required');
    }

    // Validate message
    if (!props.message) {
      throw new InvalidKudoCardPropertyError('Message is required');
    }

    if (props.message.length < 1 || props.message.length > 500) {
      throw new InvalidKudoCardPropertyError('Message must be between 1 and 500 characters');
    }

    // Validate giverId
    if (!props.giverId) {
      throw new InvalidKudoCardPropertyError('Giver ID is required');
    }

    return new KudoCard({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Factory method for reconstituting a KudoCard from persistence
  public static reconstitute(props: {
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
    updatedAt: Date;
  }): KudoCard {
    return new KudoCard(props);
  }

  // Method to convert the entity to a plain object
  public toPrimitives(): KudoCardProps {
    return {
      id: this._id,
      recipientName: this._recipientName,
      teamId: this._teamId,
      teamName: this._teamName,
      categoryId: this._categoryId,
      categoryName: this._categoryName,
      message: this._message,
      giverId: this._giverId,
      giverName: this._giverName,
      giverEmail: this._giverEmail,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
