/**
 * Utility functions for formatting user role management messages
 */

/**
 * Formats success messages for user role operations
 */
export const formatSuccessMessage = (operation: 'promotion' | 'demotion', userName?: string): string => {
  const action = operation === 'promotion' ? 'promoted to Tech Lead' : 'demoted to Team Member';
  return userName ? `${userName} was successfully ${action}.` : `User was successfully ${action}.`;
};

/**
 * Formats error messages for user role operations
 */
export const formatErrorMessage = (
  operation: 'promotion' | 'demotion',
  errorType: 'not_found' | 'invalid_role' | 'unauthorized' | 'unknown',
  userName?: string
): string => {
  const actionVerb = operation === 'promotion' ? 'promote' : 'demote';
  const userPrefix = userName ? `${userName}` : 'User';

  switch (errorType) {
    case 'not_found':
      return `${userPrefix} not found. Unable to ${actionVerb}.`;
    case 'invalid_role':
      return `Invalid role transition. Unable to ${actionVerb} ${userPrefix.toLowerCase()}.`;
    case 'unauthorized':
      return `You don't have permission to ${actionVerb} ${userPrefix.toLowerCase()}.`;
    case 'unknown':
    default:
      return `An unexpected error occurred while trying to ${actionVerb} ${userPrefix.toLowerCase()}. Please try again.`;
  }
};
