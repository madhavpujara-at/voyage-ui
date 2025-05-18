# Unit Testing Guide: From Test Doubles to Sociable Testing

## 1. Understanding Test Doubles

Test doubles replace real components in tests to isolate code and control test environments. They help create predictable environments for testing individual units of code.

### Types of Test Doubles

#### Dummy Objects

-   **Purpose**: Passed as required arguments but never used
-   **Behavior**: Return null or do nothing
-   **Example**:

```javascript
function createDummy() {
	return {};
}
```

#### Stub Objects

-   **Purpose**: Provide predetermined answers
-   **Behavior**: Return consistent values regardless of input
-   **Example**:

```typescript
class ConfigServiceStub {
	get(key: string): string {
		return 'https://api.example.com';
	}
}
```

#### Spy Objects

-   **Purpose**: Record how they were called
-   **Behavior**: Track method calls and arguments
-   **Example**:

```typescript
class NavigationSpy {
	private url: string;

	navigate(url: string): Promise<boolean> {
		this.url = url;
		return Promise.resolve(true);
	}

	getUrl(): string {
		return this.url;
	}
}
```

#### Mock Objects

-   **Purpose**: Verify expected behavior
-   **Behavior**: Include built-in verification methods
-   **Example**:

```typescript
// Using Jest mock creation utilities
function createMock<T = any>(): jest.Mocked<T> {
	return new Proxy({} as jest.Mocked<T>, {
		get: (target, prop) => {
			if (prop === 'then') {
				return undefined;
			}
			if (!(prop in target)) {
				target[prop as keyof jest.Mocked<T>] = jest.fn() as any;
			}
			return target[prop as keyof jest.Mocked<T>];
		}
	});
}
```

#### Fake Objects

-   **Purpose**: Simplified implementations of real components
-   **Behavior**: Contain actual business logic in simplified form
-   **Example**:

```typescript
class InMemoryRepository implements Repository {
	private items = new Map();

	async findById(id: string): Promise<any> {
		return this.items.get(id);
	}

	async save(id: string, item: any): Promise<void> {
		this.items.set(id, item);
	}
}
```

## 2. Testing Approaches

### 2.1 Solitary Testing

-   Tests a single unit in isolation
-   All dependencies are mocked/stubbed
-   Fast and focused
-   Good for testing complex logic within a single component

### 2.2 Sociable Testing

-   Uses real implementations for some dependencies
-   Mocks only external system boundaries
-   Tests how components work together
-   Verifies business rules across multiple layers

## 3. When to Use Each Approach

### 3.1 Use Sociable Tests When:

-   Verifying business rules that span layers
-   Testing integration points between components
-   Validating collaboration behaviors
-   Supporting safe refactoring
-   Testing complex business rules

### 3.2 Use Solitary Tests When:

-   Testing a single unit's logic in isolation
-   Scenarios where dependencies have complex behavior
-   When tests need to be fast and reliable
-   Testing edge cases in a specific component

## 4. Unit Test Structure

### 4.1 Basic Structure

```typescript
describe('Component or Feature Name', () => {
	// Dependencies
	let dependency1: Dependency1;
	let dependency2: Dependency2;
	let systemUnderTest: SystemUnderTest;

	// Setup
	beforeEach(() => {
		dependency1 = createMock<Dependency1>();
		dependency2 = createStub();

		systemUnderTest = new SystemUnderTest(dependency1, dependency2);
	});

	it('should do something specific when condition is met', async () => {
		// Arrange
		const input = {
			/* test input */
		};
		dependency1.method.mockResolvedValue({
			/* mock response */
		});

		// Act
		const result = await systemUnderTest.execute(input);

		// Assert
		expect(result).toBe(expectedValue);
	});
});
```

### 4.2 Key Components

-   **describe block**: Defines the test suite
-   **beforeEach**: Sets up fresh test doubles for each test
-   **it blocks**: Individual test cases with clear descriptions
-   **Arrange-Act-Assert pattern**: Clear separation of setup, execution, and verification

### 4.3 Creating Test Doubles

#### Creating Mocks/Spies

```typescript
// Using Jest
const mockService = jest.fn<Service, []>().mockImplementation(() => ({
	getData: jest.fn().mockResolvedValue({ data: 'test' }),
	processRequest: jest.fn().mockImplementation((request) => {
		return { processed: true, request };
	})
}));

// Generic mock creator
function createMock<T>(): jest.Mocked<T> {
	return new Proxy({} as jest.Mocked<T>, {
		get: (target, prop) => {
			if (prop === 'then') {
				return undefined;
			}
			if (!(prop in target)) {
				target[prop as keyof jest.Mocked<T>] = jest.fn() as any;
			}
			return target[prop as keyof jest.Mocked<T>];
		}
	});
}
```

## 5. Best Practices for Test Doubles

### 5.1 When to Use Each Test Double Type

-   **Dummies**: For required but unused dependencies
-   **Stubs**: To control inputs for specific test paths
-   **Spies**: To verify interactions with assertions in test
-   **Mocks**: When behavior verification is primary concern
-   **Fakes**: For simplified implementations of complex components

### 5.2 Implementation Guidelines

1. **Create Dedicated Test Double Classes** for reusable test components
2. **Keep Test Doubles Simple** and focused on test requirements
3. **Mock at Boundaries** (HTTP services, databases, external APIs)
4. **Use Helper Functions** for creating simple mocks/dummies
5. **Separate Test Data** into dedicated files for large test datasets

## 6. Best Practices for Unit Testing

### 6.1 Focus on Behavior

-   Test how the component behaves given certain inputs
-   Verify outputs and interactions with dependencies
-   Example:

```typescript
it('should navigate to the correct URL when data is processed', async () => {
	// Arrange
	const navigationSpy = new NavigationSpy();
	const service = new Service(navigationSpy, otherDependencies);

	// Act
	await service.processData({ id: '123', type: 'test' });

	// Assert
	expect(navigationSpy.getUrl()).toBe('/test/123');
});
```

### 6.2 Test Error Handling

-   Include tests for edge cases and error conditions
-   Verify error messages and error handling behavior
-   Example:

```typescript
it('should throw an error when input is invalid', async () => {
	// Arrange
	const service = new Service(dependencies);
	const invalidInput = null;

	// Act & Assert
	await expect(service.process(invalidInput)).rejects.toThrow('Invalid input');
});
```

### 6.3 Test Business Edge Cases

-   Cover various business scenarios
-   Test both happy paths and exceptional cases

### 6.4 Maintain Independence Between Tests

-   Each test should be independent from others
-   Use `beforeEach` to set up fresh dependencies for each test
-   Avoid shared state between tests

## 7. Common Testing Patterns

### 7.1 Arrange-Act-Assert

-   **Arrange**: Set up dependencies and test data
-   **Act**: Execute the method being tested
-   **Assert**: Verify expected outcomes

### 7.2 Test Double Creation Patterns

-   **Dedicated Classes**: Create custom spy/stub classes for complex behavior
-   **Helper Functions**: Use utility functions for simple mocks
-   **Response Fixtures**: Separate test responses in dedicated files

### 7.3 Dependency Injection

-   Design components with constructor injection
-   Makes it easy to provide test doubles

## 8. Testing Utility Functions

### 8.1 Creating Mock Objects

```typescript
function createMock<T>(): jest.Mocked<T> {
	return new Proxy({} as jest.Mocked<T>, {
		get: (target, prop) => {
			if (prop === 'then') {
				return undefined;
			}
			if (!(prop in target)) {
				target[prop as keyof jest.Mocked<T>] = jest.fn() as any;
			}
			return target[prop as keyof jest.Mocked<T>];
		}
	});
}
```

### 8.2 Creating Stub Objects

```typescript
function createStub<T>(implementation: Partial<T> = {}): T {
	return implementation as T;
}
```

## 9. Complete Example

```typescript
describe('OrderService', () => {
	let orderService: OrderService;
	let paymentGateway: jest.Mocked<PaymentGateway>;
	let orderRepository: jest.Mocked<OrderRepository>;
	let notificationService: jest.Mocked<NotificationService>;

	beforeEach(() => {
		// Setup test doubles
		paymentGateway = createMock<PaymentGateway>();
		orderRepository = createMock<OrderRepository>();
		notificationService = createMock<NotificationService>();

		// Setup system under test
		orderService = new OrderService(paymentGateway, orderRepository, notificationService);
	});

	describe('placeOrder', () => {
		it('should successfully place an order when payment succeeds', async () => {
			// Arrange
			const orderRequest = {
				customerId: 'customer-123',
				items: [{ productId: 'product-1', quantity: 2, price: 100 }],
				shippingAddress: { city: 'Test City', country: 'Test Country' }
			};

			paymentGateway.processPayment.mockResolvedValue({
				success: true,
				transactionId: 'tx-123'
			});

			orderRepository.save.mockResolvedValue({
				id: 'order-123',
				...orderRequest,
				status: 'CONFIRMED'
			});

			// Act
			const result = await orderService.placeOrder(orderRequest);

			// Assert
			expect(result.success).toBe(true);
			expect(result.orderId).toBe('order-123');
			expect(paymentGateway.processPayment).toHaveBeenCalledWith({
				amount: 200, // 2 items * $100
				customerId: 'customer-123'
			});
			expect(notificationService.sendOrderConfirmation).toHaveBeenCalledWith(
				'customer-123',
				expect.objectContaining({ id: 'order-123' })
			);
		});

		it('should handle payment failure correctly', async () => {
			// Arrange
			const orderRequest = {
				customerId: 'customer-123',
				items: [{ productId: 'product-1', quantity: 2, price: 100 }],
				shippingAddress: { city: 'Test City', country: 'Test Country' }
			};

			paymentGateway.processPayment.mockResolvedValue({
				success: false,
				error: 'INSUFFICIENT_FUNDS'
			});

			// Act
			const result = await orderService.placeOrder(orderRequest);

			// Assert
			expect(result.success).toBe(false);
			expect(result.error).toBe('PAYMENT_FAILED');
			expect(orderRepository.save).not.toHaveBeenCalled();
			expect(notificationService.sendOrderConfirmation).not.toHaveBeenCalled();
		});
	});
});
```

## 10. Summary

Effective unit testing requires a balance of techniques:

1. **Isolation**: Test components in isolation using test doubles
2. **Clear Structure**: Use describe/beforeEach/it blocks with Arrange-Act-Assert pattern
3. **Reusable Components**: Create dedicated test doubles for common dependencies
4. **Comprehensive Coverage**: Test both happy paths and error conditions
5. **Focus on Behavior**: Test what components do, not how they do it

By following these principles, your tests will be:

-   Easy to understand and maintain
-   Focused on business behavior
-   Resilient to implementation changes
-   Fast and reliable
