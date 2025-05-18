export class UserNotAuthorizedToCreateKudoError extends Error {
  constructor(
    message: string = 'User is not authorized to create kudos. Only Tech Leads and Admins can create kudos.'
  ) {
    super(message);
    this.name = 'UserNotAuthorizedToCreateKudoError';
  }
}
