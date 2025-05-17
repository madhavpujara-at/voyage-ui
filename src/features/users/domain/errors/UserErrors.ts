export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`${fieldName} is required`);
    this.name = 'RequiredFieldError';
  }
}
