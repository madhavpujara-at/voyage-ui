## User Role Management (Promotion/Demotion): Implementation Plan

**Feature Name:** `userManagement` (extending existing feature)

**Objective:** Implement functionality for an `ADMIN` to promote a `TEAM_MEMBER` to `TECH_LEAD` and demote a `TECH_LEAD` back to `TEAM_MEMBER`. This will be handled via the `PATCH /users/:userId/role` API endpoint.

---

**1. Directory Structure (Conceptual - No Change from existing `userManagement` feature)**

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

---

**2. Domain Layer (`src/features/userManagement/domain/`)**

- **Entities:**

  - `User.ts`:
    - **Properties:**
      - `id` (string, UUID)
      - `name` (string)
      - `email` (string)
      - `password` (string, hashed)
      - `role` (enum: `UserRole { ADMIN = "ADMIN", TECH_LEAD = "TECH_LEAD", TEAM_MEMBER = "TEAM_MEMBER" }`)
      - `createdAt` (Date)
      - `updatedAt` (Date)

- **Interfaces (Contracts):**

  - `IUserRoleRepository.ts`:
    - `promoteToLead(userId: string): Promise<User>` (Promotes user to TECH_LEAD, returns updated user)
    - `demoteToMember(userId: string): Promise<User>` (Demotes user to TEAM_MEMBER, returns updated user)

- **Errors:**
  - `UserNotFoundError.ts` (If API indicates user for promotion/demotion not found)
  - `InvalidRoleError.ts` (If `newRole` in DTO is not `TECH_LEAD` or `TEAM_MEMBER` - for defensive coding in use case)
  - `InvalidRoleTransitionError.ts` (If API indicates the requested role change is not permissible, e.g., trying to promote a non-member)
  - `RoleChangeFailedError.ts` (Generic error for API call failures during role change)
  - `FailToPromoteMemberError.ts` (Specific error if promotion API call fails)
  - `FailToDemoteLeadError.ts` (Specific error if demotion API call fails)

---

**3. Application Layer (`src/features/userManagement/application/`)**

- **DTOs (Data Transfer Objects):**

  - `UpdateUserRoleDto.ts`:
    - `newRole: "TECH_LEAD" | "TEAM_MEMBER"` (Required: The target role)
  - `UserResponseDto.ts`:
    - `id: string`
    - `name: string`
    - `email: string`
    - `role: string` (e.g., "TECH_LEAD", "TEAM_MEMBER")
    - `createdAt: string` (ISO date string)
    - `updatedAt: string` (ISO date string)

- **Mappers:**

  - `UserMapper.ts`:
    - `static toDto(user: User): UserResponseDto`

- **Use Cases:**

  - `UpdateUserRoleUseCase.ts`:
    - **Dependencies:** `IUserRoleRepository`
    - **Input:** `userId: string`, `dto: UpdateUserRoleDto`
    - **Output:** `Promise<UserResponseDto>`
    - **Logic:**
      1. (Authorization check: Ensure current user is ADMIN - typically done by middleware).
      2. Declare `updatedUser: User`.
      3. **Promotion Logic:**
         If `dto.newRole === "TECH_LEAD"`:
         - `updatedUser = await this.userRepository.promoteToLead(userId)`.
      4. **Demotion Logic:**
         Else if `dto.newRole === "TEAM_MEMBER"`:
         - `updatedUser = await this.userRepository.demoteToMember(userId)`.
      5. **Invalid newRole (Defensive Check):**
         Else:
         - Throw `InvalidRoleError("The specified newRole is not valid for this operation. Valid roles are TECH_LEAD or TEAM_MEMBER.")`.
      6. Handle potential specific errors from repository methods (e.g., `UserNotFoundError`, `InvalidRoleTransitionError`, `FailToPromoteMemberError`, `FailToDemoteLeadError`) and rethrow or wrap them as `RoleChangeFailedError` if desired.
      7. Map the `updatedUser` to `UserResponseDto` using `UserMapper.toDto(updatedUser)`.
      8. Return the `UserResponseDto`.

---

**4. Infrastructure Layer (`src/features/userManagement/infrastructure/`)**

- **Repositories:**

  - `UserApiRepository.ts` (implements `IUserRoleRepository`):

    - Constructor: `(private httpClient: IHttpService, private configService: IConfigService)`
    - **API Endpoint for Role Change:** `PATCH /users/:userId/role`

    - `async promoteToLead(userId: string): Promise<User>`:

      - **Action:** Change user's role to `TECH_LEAD`.
      - **HTTP Call:** `PATCH` to endpoint `/users/${userId}/role`.
      - **Request Body:** `{ "newRole": "TECH_LEAD" }`
      - **Logic:**
        - Makes the HTTP PATCH request.
        - On success (e.g., 200 OK), the API should return the updated user data.
        - Transforms the API response data into a `User` domain entity.
        - Handles API errors (e.g., 400 for invalid transition, 401, 403, 404 for user not found, 500) and maps them to appropriate domain errors (`UserNotFoundError`, `InvalidRoleTransitionError`, `FailToPromoteMemberError`, or a generic `RoleChangeFailedError`).
        - Returns the updated `User` entity.

    - `async demoteToMember(userId: string): Promise<User>`:
      - **Action:** Change user's role to `TEAM_MEMBER`.
      - **HTTP Call:** `PATCH` to endpoint `/users/${userId}/role`.
      - **Request Body:** `{ "newRole": "TEAM_MEMBER" }`
      - **Logic:**
        - Makes the HTTP PATCH request.
        - On success (e.g., 200 OK), the API should return the updated user data.
        - Transforms the API response data into a `User` domain entity.
        - Handles API errors (e.g., 400 for invalid transition, 401, 403, 404 for user not found, 500) and maps them to appropriate domain errors (`UserNotFoundError`, `InvalidRoleTransitionError`, `FailToDemoteLeadError`, or a generic `RoleChangeFailedError`).
        - Returns the updated `User` entity.

---

This plan focuses _only_ on adding the promotion and demotion capabilities. Ensure that API contracts for success and error responses are clearly defined and handled robustly in the `UserApiRepository`. The backend API at `PATCH /users/:userId/role` is assumed to handle the validation of whether the role transition is permissible based on the user's current role and the provided `newRole`.
