import { LoginUserResponseDto } from '@/features/auth/application/dtos/LoginUserResponseDto';
import { UserRole } from './UserRole';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id: string;
  private _email: string;
  private _name: string;
  private _role: UserRole;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._name = props.name;
    this._role = props.role || UserRole.TEAM_MEMBER;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Factory method
  public static create(props: { id: string; email: string; name: string; role?: UserRole }): User {
    return new User({
      id: props.id,
      email: props.email,
      name: props.name,
      role: props.role || UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public toPrimitives(): UserProps {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
