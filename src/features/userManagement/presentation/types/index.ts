/**
 * Shared types for the presentation layer
 */

/**
 * User interface representing a user in the UI
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEAM_MEMBER' | 'TECH_LEAD';
  avatarUrl?: string;
}
