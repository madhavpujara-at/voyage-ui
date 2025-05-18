// This file is executed before each test file
// Add any global test setup here

// Make TypeScript aware of Jest globals
import '@types/jest';

// This is needed for proper TypeScript path aliases
jest.mock('../../shared/infrastructure/interfaces/IHttpService', () => ({
  // Just re-export the actual implementation to make TypeScript happy
  ...jest.requireActual('../../shared/infrastructure/interfaces/IHttpService'),
}));

// Add global mocks if needed
