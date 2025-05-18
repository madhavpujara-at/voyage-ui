/**
 * Creates a mock object with jest functions for all methods
 * @returns A mock object with all properties being jest.fn()
 */
export function createMock<T>(): jest.Mocked<T> {
  return new Proxy({} as jest.Mocked<T>, {
    get: (target, prop) => {
      if (prop === 'then') {
        return undefined;
      }
      if (!(prop in target)) {
        // We need to cast here because jest.fn() returns a complex type
        // that can't be easily represented in TypeScript
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target[prop as keyof jest.Mocked<T>] = jest.fn() as any;
      }
      return target[prop as keyof jest.Mocked<T>];
    },
  });
}
