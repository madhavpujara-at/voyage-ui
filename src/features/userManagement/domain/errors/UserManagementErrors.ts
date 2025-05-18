export class InvalidRoleError extends Error {
  constructor(message: string = 'Invalid role provided.') {
    super(message);
    this.name = 'InvalidRoleError';
  }
}

export class AdminAccessRequiredError extends Error {
  constructor(message: string = 'Administrator privileges are required to perform this action.') {
    super(message);
    this.name = 'AdminAccessRequiredError';
  }
}

// Generic error for other user management related issues if needed
export class UserManagementServiceError extends Error {
  constructor(message: string = 'An unexpected error occurred in the user management service.') {
    super(message);
    this.name = 'UserManagementServiceError';
  }
}
