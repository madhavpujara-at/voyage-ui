export enum UserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TECH_LEAD = 'TECH_LEAD',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Add other properties if they become relevant, like createdAt, isActive etc.
}

export class User {
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;

  constructor(props: UserProps) {
    // Basic validation can be added here if needed
    if (!props.id) throw new Error('User ID is required.'); // Or a custom domain error
    if (!props.name) throw new Error('User name is required.');
    if (!props.email) throw new Error('User email is required.');
    // Add email format validation if necessary
    if (!props.role) throw new Error('User role is required.');

    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
  }

  // Example business logic method (can be expanded)
  public changeRole(newRole: UserRole): void {
    // Add any domain-specific logic for changing roles if applicable
    this.role = newRole;
  }

  public toPrimitives(): UserProps {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  // Static factory method if needed for creation patterns
  public static create(props: { name: string; email: string; role: UserRole }, idGenerator: () => string): User {
    return new User({
      id: idGenerator(),
      name: props.name,
      email: props.email,
      role: props.role,
    });
  }
}
