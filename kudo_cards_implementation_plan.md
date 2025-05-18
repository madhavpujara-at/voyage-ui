# Kudo Cards Feature: Implementation Plan

This document outlines the implementation plan for the Kudo Cards feature, focusing on the "Create Kudo Card" and "Get All Kudo Cards" functionalities. It follows a layered architecture.

## 1. Feature Overview

The Kudo Cards feature allows authorized users to create and view messages of appreciation (kudos) for their colleagues.

**Target Directory:** `src/features/kudos/` (Assuming "kudos" as the feature name, aligning with PRD's "Kudos directory" mention. The user query mentioned `/kudoCards` for the module, which will be the API endpoint base path).

## 2. Core Functionalities

### 2.1. Domain Layer (`src/features/kudos/domain/`)

#### 2.1.1. Entities

- **`KudoCard.ts`**
  - Properties:
    - `id` (string, uuid): Unique identifier for the kudo card.
    - `recipientName` (string): Name of the person receiving the kudo.
      - Validation: Min 1 character, Max 100 characters.
    - `teamId` (string, uuid): ID of the team the recipient belongs to.
    - `categoryId` (string, uuid): ID of the category for this kudo.
    - `message` (string): The kudo message content.
      - Validation: Min 1 character, Max 500 characters.
    - `authorId` (string, uuid): ID of the user who created the kudo (Tech Lead or Admin).
    - `createdAt` (Date): Timestamp of creation.
    - `updatedAt` (Date): Timestamp of last update.
  - Methods:
    - Static factory method `create(props: { recipientName: string, teamId: string, categoryId: string, message: string, authorId: string }, idGenerator: () => string): KudoCard` for instantiation and initial validation.
    - Static factory method `reconstitute(props: { id: string, recipientName: string, teamId: string, categoryId: string, message: string, authorId: string, createdAt: Date, updatedAt: Date }): KudoCard` for creating an entity from persisted data.
    - Getters for properties.

#### 2.1.2. Interfaces (Repositories)

- **`IKudosRepository.ts`**
  - Defines the contract for kudo card data persistence operations.
  - Methods:
    - `create(kudoCard: KudoCard): Promise<{ id: string }>`: Saves a new kudo card and returns its ID.
    - `getAllKudosCard(): Promise<KudoCard[]>`: Retrieves all kudo cards. (Note: PRD mentions filtering/sorting for the Kudos Wall; this might be added later as parameters to this method or as separate methods).

#### 2.1.3. Value Objects (Optional)

- Consider if `recipientName` or `message` require more complex validation or behavior that would justify creating them as value objects. For now, basic string validation within the entity might suffice.

#### 2.1.4. Domain Errors

- **`src/features/kudos/domain/errors/`**
  - `InvalidKudoCardPropertyError.ts`: For errors related to invalid entity properties (e.g., message too long).
  - `KudoCardNotFoundError.ts`: If a specific kudo card isn't found (relevant for future findById operations).

### 2.2. Application Layer (`src/features/kudos/application/`)

#### 2.2.1. DTOs (Data Transfer Objects)

- **`src/features/kudos/application/dtos/`**
  - `CreateKudoCardRequestDto.ts` (Input for Use Case / API Controller for creation):
    - `recipientName` (string)
    - `teamId` (string, uuid)
    - `categoryId` (string, uuid)
    - `message` (string)
    - _(Validation decorators, e.g., using `class-validator`, should be applied here)_
  - `CreateKudoCardResponseDto.ts` (Output from Use Case / API Controller after creation):
    - `id` (string, uuid)
    - `success` (boolean)
  - `KudoCardDetailsDto.ts` (Represents a single kudo card item for list views, output by `GetAllKudosCardUseCase`):
    - `id` (string, uuid)
    - `recipientName` (string)
    - `teamId` (string, uuid) // Consider mapping to teamName if readily available
    - `categoryId` (string, uuid) // Consider mapping to categoryName if readily available
    - `message` (string)
    - `authorId` (string, uuid) // Consider mapping to authorName if readily available
    - `createdAt` (Date)

#### 2.2.2. Use Cases

- **`src/features/kudos/application/useCases/CreateKudoCardUseCase.ts`**

  - Constructor: Injects `IKudosRepository`, an `IdGenerator` service, and potentially an authorization service (or relies on role check in controller/middleware before calling).
  - `execute(data: CreateKudoCardRequestDto, authorId: string /*, userRoles: string[] - role check might be upstream */): Promise<CreateKudoCardResponseDto>`
    - **Authorization Check**: Ensure the `authorId` corresponds to a user with `TECH_LEAD` or `ADMIN` role (this check might be done by upstream middleware calling the use case, passing already validated `authorId` and roles, or the use case might need access to a role-checking service).
    - **Validation**: DTO validation should handle most input checks. Additional application-level validation if any.
    - **Entity Creation**: Create a `KudoCard` domain entity instance using `KudoCard.create({...data, authorId }, idGenerator)`. The `idGenerator` provides a new UUID.
    - **Persistence**: Call `const { id } = await kudosRepository.create(kudoCardEntity)`.
    - **Response**: Return `{ id, success: true }`.
    - **Error Handling**: Catch domain errors or repository errors and map them to application-specific errors.

- **`src/features/kudos/application/useCases/GetAllKudosCardUseCase.ts`**
  - Constructor: Injects `IKudosRepository` and `KudoCardMapper`.
  - `execute(): Promise<KudoCardDetailsDto[]>`
    - **Data Retrieval**: Call `const kudoCards = await kudosRepository.getAllKudosCard()`.
    - **Mapping**: Transform `KudoCard[]` (domain entities) to `KudoCardDetailsDto[]` using `kudoCardMapper.toDetailsDtoList(kudoCards)`.
    - **Response**: Return the list of DTOs.
    - **Error Handling**: Catch repository errors and map them.

#### 2.2.3. Mappers

- **`src/features/kudos/application/mappers/KudoCardMapper.ts`**
  - `static toDetailsDto(entity: KudoCard): KudoCardDetailsDto`: Maps a `KudoCard` domain entity to a `KudoCardDetailsDto`.
  - `static toDetailsDtoList(entities: KudoCard[]): KudoCardDetailsDto[]`: Maps an array of `KudoCard` entities to an array of `KudoCardDetailsDto`.

#### 2.2.4. Application Errors

- **`src/features/kudos/application/errors/`** (or reuse global application errors)
  - `KudoCardCreationError.ts`
  - `UserNotAuthorizedToCreateKudoError.ts`
  - `FailedToRetrieveKudosError.ts`

### 2.3. Infrastructure Layer (`src/features/kudos/infrastructure/`)

#### 2.3.1. Repositories (Implementation)

- **`src/features/kudos/infrastructure/repositories/KudosApiRepository.ts`** (implements `IKudosRepository`, follows `AuthRepositoryImpl.ts` pattern)
  - Constructor: Injects `IHttpService` (from shared infrastructure) and `IConfigService` (from shared infrastructure).
  - `async create(kudoCard: KudoCard): Promise<{ id: string }>`:
    - Retrieves the API path for creating kudo cards from `configService` (e.g., `this.configService.getApiPaths().createKudoCard`).
    - Constructs the request body: `{ recipientName: kudoCard.recipientName, teamId: kudoCard.teamId, categoryId: kudoCard.categoryId, message: kudoCard.message }`. (Note: `authorId` is part of the `KudoCard` domain entity but is not sent in the request body, as the backend API is expected to derive it from the authenticated user's JWT).
    - Makes a `POST` request using `httpService.post<{ id: string, success: boolean }>(...)`.
    - Returns `{ id: response.id }` from the API response.
    - Handles errors from `httpService` (e.g., 400, 500 series) and potentially maps them to specific application or domain errors, similar to `AuthRepositoryImpl.ts`.
  - `async getAllKudosCard(): Promise<KudoCard[]>`:
    - Retrieves the API path for getting all kudo cards from `configService` (e.g., `this.configService.getApiPaths().getAllKudoCards`).
    - Makes a `GET` request using `httpService.get<ApiKudoCardItem[]>(...)`, where `ApiKudoCardItem` is the expected raw structure of a kudo card from the API (e.g., `{ id, recipientName, teamId, categoryId, message, authorId, createdAt, updatedAt }`).
    - Maps each item in the API response array to a `KudoCard` domain entity using `KudoCard.reconstitute(...)`. Dates received as strings from the API should be converted to `Date` objects.
    - Handles errors from `httpService`.

## 3. Folder Structure (Kudos Feature)

```
src/
└── features/
    └── kudos/
        ├── application/
        │   ├── dtos/
        │   │   ├── CreateKudoCardRequestDto.ts
        │   │   ├── CreateKudoCardResponseDto.ts
        │   │   └── KudoCardDetailsDto.ts
        │   ├── mappers/
        │   │   └── KudoCardMapper.ts
        │   ├── useCases/
        │   │   ├── CreateKudoCardUseCase.ts
        │   │   └── GetAllKudosCardUseCase.ts
        │   └── errors/
        │       ├── KudoCardCreationError.ts
        │       ├── UserNotAuthorizedToCreateKudoError.ts
        │       └── FailedToRetrieveKudosError.ts
        ├── domain/
        │   ├── entities/
        │   │   └── KudoCard.ts
        │   ├── interfaces/
        │   │   └── IKudosRepository.ts
        │   └── errors/
        │       ├── InvalidKudoCardPropertyError.ts
        │       └── KudoCardNotFoundError.ts
        └── infrastructure/
            └── repositories/
                └── KudosApiRepository.ts
```

## 4. Next Steps (Not covered in this initial plan)

- Presentation Layer (UI components, pages).
- Detailed analytics dashboard implementation.
- Admin functionalities for managing Teams and Categories.
- Automated testing for each layer.
- Refinement of filtering/sorting for `getAllKudosCard`.
- Implementation of `IdGenerator` service and its injection.
- Configuration of API paths in `IConfigService` (e.g., `createKudoCard`, `getAllKudoCards`).
