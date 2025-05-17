# Login Feature Implementation Plan

This document outlines the files and their responsibilities for implementing the login feature, adhering to the layered architecture. The presentation layer is excluded for now.

## Feature Location

Following the `folder-structure.mdc` guidelines, the login feature components will reside primarily within `src/features/auth/` (assuming "auth" as the feature name for authentication) or `src/features/users/` if login is considered part of a broader user management feature. For this plan, we'll assume `src/features/auth/`.

## 1. Domain Layer

Location: `src/features/auth/domain/`

### 1.1. Entities

- **`User.ts`** (or a relevant subset if a more comprehensive User entity exists elsewhere for other features)
  - **Purpose:** Represents the core user information relevant to authentication.
  - **Properties:**
    - `id: string`
    - `email: string`
    - `name: string`
    - `role: string` (e.g., "TeamMember", "TechLead", "Admin")
    - `hashedPassword?: string` (The entity might not hold the password itself directly if it's only for comparison on the backend, but it's a core concept for login).
  - **Methods:** Basic getters, potentially a method to compare password if hashing/comparison logic were to reside here (though typically it's a service). For this plan, we assume the backend handles password comparison.

### 1.2. Interfaces (Repositories)

- **`IAuthRepository.ts`**
  - **Purpose:** Defines the contract for authentication operations. This is what the application layer will depend on for initiating login.
  - **Methods:**
    - `login(credentials: { email: string; password: string }): Promise<{ id: string; email: string; name: string; role: string; token: string } | null>`
      - Takes email and password.
      - Returns user details and a session token upon successful authentication, or `null` / throws error on failure.

### 1.3. Errors

- **`InvalidCredentialsError.ts`**
  - **Purpose:** Custom error for failed login attempts due to incorrect email or password.
  - Extends `Error`.
- **`UserNotFoundError.ts`**
  - **Purpose:** Custom error for when a user with the provided email does not exist.
  - Extends `Error`.

## 2. Application Layer

Location: `src/features/auth/application/`

### 2.1. DTOs (Data Transfer Objects)

- **`LoginUserDto.ts`**
  - **Purpose:** Carries the necessary data from the presentation layer (or client) to the login use case.
  - **Properties:**
    - `email: string`
    - `password: string`
- **`LoginUserResponseDto.ts`**
  - **Purpose:** Carries the data from the login use case back to the client upon successful login.
  - **Properties:**
    - `id: string`
    - `email: string`
    - `name: string`
    - `role: string`
    - `token: string` (Session token, e.g., JWT)

### 2.2. Use Cases

- **`LoginUserUseCase.ts`**
  - **Purpose:** Orchestrates the login process.
  - **Dependencies:**
    - `IAuthRepository` (injected)
  - **Method: `execute(loginDto: LoginUserDto): Promise<LoginUserResponseDto>`**
    - Receives `LoginUserDto`.
    - Calls the `login` method of the injected `IAuthRepository`.
    - The backend (via the repository implementation) will:
      - Find the user by email.
      - Verify the password.
      - Generate a session token.
    - If authentication is successful, the repository returns user details and the token.
    - The use case then maps this to `LoginUserResponseDto` and returns it.
    - Handles potential errors from the repository (e.g., `UserNotFoundError`, `InvalidCredentialsError`) and re-throws them or maps them to application-specific errors if necessary.

## 3. Infrastructure Layer

Location: `src/features/auth/infrastructure/`

### 3.1. Repositories

- **`AuthApiRepository.ts`** (implements `IAuthRepository`)
  - **Purpose:** Concrete implementation of `IAuthRepository` that interacts with the backend API for authentication.
  - **Dependencies:**
    - An HTTP client service/utility (e.g., Axios, Fetch API wrapper) for making API calls.
  - **Method: `async login(credentials: { email: string; password: string }): Promise<{ id: string; email: string; name: string; role: string; token: string }>`**
    - Makes a POST request to the backend login endpoint (e.g., `/api/auth/login`).
    - Sends `credentials.email` and `credentials.password` in the request body.
    - The backend handles user lookup, password verification (against stored hashed password), and JWT generation.
    - Receives a response from the backend containing user information (`id`, `email`, `name`, `role`) and the `token`.
    - If the backend returns an error (e.g., 401 for invalid credentials, 404 for user not found), this repository will catch the HTTP error and throw the corresponding domain error (`InvalidCredentialsError`, `UserNotFoundError`).
    - Returns the user data and token.

### 3.2. Services (Frontend-specific for Session Management)

- **`SessionStorageService.ts`** (This might be a global utility rather than feature-specific, e.g., `src/lib/services/SessionStorageService.ts`)
  - **Purpose:** Handles storing and retrieving the session token (JWT) from the browser's local/session storage. This service will be used by the presentation layer _after_ the `LoginUserUseCase` successfully returns the token.
  - **Methods:**
    - `saveToken(token: string): void`
    - `getToken(): string | null`
    - `removeToken(): void`

## Summary of Flow (Login)

1.  Presentation Layer (not detailed here) collects email and password.
2.  It creates a `LoginUserDto` and calls `LoginUserUseCase.execute(dto)`.
3.  `LoginUserUseCase` calls `IAuthRepository.login(credentials)`.
4.  `AuthApiRepository` (implementation of `IAuthRepository`) sends a request to the backend API.
5.  Backend authenticates, generates a JWT, and returns user info + token.
6.  `AuthApiRepository` returns this data to `LoginUserUseCase`.
7.  `LoginUserUseCase` returns `LoginUserResponseDto` (containing the token and user info) to the Presentation Layer.
8.  Presentation Layer uses `SessionStorageService` to store the token and updates the UI.

This structure separates concerns, making the system more testable and maintainable.
