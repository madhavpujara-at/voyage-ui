## User Management Feature: Implementation Plan

This document outlines the backend implementation plan for user management functionalities, adhering to a layered architecture.

**Feature Name:** `userManagement`

**1. Directory Structure (Conceptual)**

Following the established folder structure:

```
src/
└── features/
    └── userManagement/
        ├── domain/
        │   ├── entities/
        │   ├── interfaces/
        │   └── errors/
        ├── application/
        │   ├── dtos/
        │   ├── mappers/
        │   └── useCases/
        └── infrastructure/
            └── repositories/
```

**2. Domain Layer (`src/features/userManagement/domain/`)**

- **Entities:**

  - `User.ts`:
    - Properties: `id` (string, UUID), `name` (string), `email` (string), `password` (string, should be handled securely, e.g., hashed by the backend, not stored as plaintext in frontend domain entities if this plan is for frontend), `role` (enum: `TEAM_MEMBER`, `TECH_LEAD`, `ADMIN`), `createdAt` (Date), `updatedAt` (Date).
    - Methods: Constructor, getters, methods to update editable properties (e.g., `changeName`, `changeEmail`), method to `promoteToLead()`. Business rules like email format validation will reside here.

- **Interfaces (Contracts):**

  - `IUserRepository.ts`:
    - `addToTeamMember(user: User): Promise<User>` (Adds a new user, returns the created user)
    - `promoteMemberToLead(userId: string, newRole: "TECH_LEAD"): Promise<User>` (Promotes a user, returns the updated user)
    - `UpdateMemberUser(userId: string, userData: Partial<User>): Promise<User>` (Updates user details, returns the updated user)
    - `DeleteMember(userId: string): Promise<void>`
    - `getAllListofMember(): Promise<User[]>`
    - `findById(id: string): Promise<User | null>` (Retaining for fetching specific user details if needed by use cases)
    - `findByEmail(email: string): Promise<User | null>` (Retaining for email uniqueness checks)

- **Errors:**
  - `UserNotFoundError.ts` (extends Error)
  - `EmailAlreadyExistsError.ts` (extends Error)
  - `FailToAddToTeamMemberError.ts` (extends Error)
  - `FailToPromoteMemberError.ts` (extends Error)
  - `FailToUpdateMemberUserError.ts` (extends Error)
  - `FailToDeleteMemberError.ts` (extends Error)
  - `FailToGetAllMembersError.ts` (extends Error)
  - `InvalidRoleError.ts` (extends Error, e.g., if an invalid role is assigned during promotion)
  - `CannotDeleteSelfError.ts` (extends Error, if applicable for admins)

**3. Application Layer (`src/features/userManagement/application/`)**

- **DTOs (Data Transfer Objects):**

  - `CreateUserDto.ts`:
    - `name: string`
    - `email: string`
    - `password: string` (Changed from role to password)
  - `UpdateUserDto.ts`: (For general user detail updates by admin)
    - `name?: string`
    - `email?: string`
  - `PromoteToLeadDto.ts`: (Used for the `PATCH /users/:userId/role` endpoint logic by an Admin)
    - `userId: string` (This DTO is specific for the promotion action by an Admin)
    - `newRole: "TECH_LEAD"` (as per API_DOCUMENT.md)
  - `UserResponseDto.ts`:
    - `id: string`
    - `name: string`
    - `email: string`
    - `role: string`
    - `createdAt: string` (ISO date string)
    - `updatedAt: string` (ISO date string)

- **Mappers:**

  - `UserMapper.ts`:
    - `static toDto(user: User): UserResponseDto`
    - `static createUserToDomain(dto: CreateUserDto): Partial<UserProps>` (For creating User entity)
    - `static updateUserToDomain(dto: UpdateUserDto): Partial<UserProps>` (For updating User entity)

- **Use Cases:**
  - `CreateUserUseCase.ts` (Admin action to add a new team member):
    - Input: `CreateUserDto`
    - Output: `Promise<UserResponseDto>`
    - Logic: Validates DTO, checks for existing email via `IUserRepository.findByEmail`, creates `User` entity (default role e.g. `TEAM_MEMBER`), calls `IUserRepository.addToTeamMember`, maps to `UserResponseDto`.
  - `UpdateUserUseCase.ts` (Admin action to update member details):
    - Input: `userId: string`, `UpdateUserDto`
    - Output: `Promise<UserResponseDto>`
    - Logic: Fetches user via `IUserRepository.findById`, maps `UpdateUserDto` to domain changes, calls `IUserRepository.UpdateMemberUser`, maps to `UserResponseDto`.
  - `DeleteUserUseCase.ts` (Admin action to delete a member):
    - Input: `userId: string`
    - Output: `Promise<void>`
    - Logic: Checks if user exists via `IUserRepository.findById`, calls `IUserRepository.DeleteMember`. Handles potential errors.
  - `PromoteUserToLeadUseCase.ts` (Admin action):
    - Input: `PromoteToLeadDto` (contains `userId` and `newRole: "TECH_LEAD"`)
    - Output: `Promise<UserResponseDto>`
    - Logic: Calls `IUserRepository.promoteMemberToLead` with `dto.userId` and `dto.newRole`, maps to `UserResponseDto`.
  - `GetUserByIdUseCase.ts`:
    - Input: `userId: string`
    - Output: `Promise<UserResponseDto | null>`
    - Logic: Calls `IUserRepository.findById`, maps to DTO.
  - `ListUsersUseCase.ts`:
    - Input: (Optional filters, e.g., `role?: string`)
    - Output: `Promise<UserResponseDto[]>`
    - Logic: Calls `IUserRepository.getAllListofMember`, maps to DTOs.

**4. Infrastructure Layer (`src/features/userManagement/infrastructure/`)**

- **Repositories:**
  - `UserApiRepository.ts` (implements `IUserRepository`):
    - Constructor will receive an HTTP client (e.g., an instance of `IHttpService` like in `ListingRepositoryImpl`) and potentially a configuration service for API paths.
    - **API Endpoint Mapping (Illustrative):**
      - `addToTeamMember(user: User)` -> `POST /users` (request body derived from `user` entity, matching `CreateUserDto` structure on backend)
      - `getAllListofMember()` -> `GET /users`
      - `findById(id: string)` -> `GET /users/:userId`
      - `findByEmail(email: string)` -> `GET /users?email={email}` (assuming API supports email filter)
      - `UpdateMemberUser(userId: string, userData: Partial<User>)` -> `PUT /users/:userId` (request body derived from `userData`)
      - `promoteMemberToLead(userId: string, newRole: "TECH_LEAD")` -> `PATCH /users/:userId/role` (request body: `{ "newRole": "TECH_LEAD" }`)
      - `DeleteMember(userId: string)` -> `DELETE /users/:userId`
    - Methods will handle HTTP requests, responses, and error mapping (e.g., 404 to `UserNotFoundError`, 409 to `EmailAlreadyExistsError`).
    - It will transform data between domain entities/primitives and the structure expected by the API.

---

This plan provides a foundational structure. Specific implementation details, error handling strategies, and interactions with other services/modules will be further refined during development.
