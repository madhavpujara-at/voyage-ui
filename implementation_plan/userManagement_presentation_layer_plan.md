## User Role Management: Presentation Layer (React Hook) Implementation Plan

**Feature Name:** `userManagement` (extending existing feature)

**Objective:** Create a React custom hook to handle the UI logic for promoting a `TEAM_MEMBER` to `TECH_LEAD` and demoting a `TECH_LEAD` back to `TEAM_MEMBER`.

---

**1. Directory Structure (Conceptual - for the hook and related UI components)**

```
src/
└── features/
    └── userManagement/
        ├── application/
        │   └── useCases/           # UpdateUserRoleUseCase (assumed to exist)
        ├── components/             # UI components related to user management (e.g., UserListItem, RoleChangeModal)
        └── presentation/
            └── hooks/
                └── useUserRoleManagement.ts
            └── utils/                # Optional: UI specific utility functions
```

---

**2. Custom Hook: `useUserRoleManagement.ts`**

- **File Path:** `src/features/userManagement/presentation/hooks/useUserRoleManagement.ts`

- **Dependencies:**

  - `UpdateUserRoleUseCase` (from the application layer)
  - React's `useState` for managing loading and error states.
  - Potentially a notification service/toast library for user feedback.

- **State Management:**

  - `isLoading: boolean`: Tracks if a role change operation is in progress.
  - `error: string | null`: Stores any error message from the operation.
  - `successMessage: string | null`: Stores a success message upon completion.

- **Exposed Functions/Values:**

  - `promoteUser(userId: string): Promise<void>`
  - `demoteUser(userId: string): Promise<void>`
  - `isLoading: boolean`
  - `error: string | null`
  - `successMessage: string | null`
  - `clearMessages(): void` (to clear error/success messages manually)

- **Internal Logic:**

  - **`promoteUser(userId: string)`:**

    1. Set `isLoading` to `true`, clear `error` and `successMessage`.
    2. Instantiate `UpdateUserRoleUseCase` (dependency injection or direct instantiation if appropriate for the project setup).
    3. Call the use case: `updateUserRoleUseCase.execute(userId, { newRole: "TECH_LEAD" })`.
    4. **On Success:**
       - Set `isLoading` to `false`.
       - Set `successMessage` (e.g., "User promoted successfully.").
       - Optionally, trigger a refetch of user data if the UI needs to update immediately (e.g., via a callback or context update).
    5. **On Error:**
       - Set `isLoading` to `false`.
       - Set `error` with a user-friendly message based on the error type received from the use case (e.g., "User not found.", "Promotion failed. Invalid role transition.", "An unexpected error occurred.").
       - Log the actual error for debugging.

  - **`demoteUser(userId: string)`:**

    1. Set `isLoading` to `true`, clear `error` and `successMessage`.
    2. Instantiate `UpdateUserRoleUseCase`.
    3. Call the use case: `updateUserRoleUseCase.execute(userId, { newRole: "TEAM_MEMBER" })`.
    4. **On Success:**
       - Set `isLoading` to `false`.
       - Set `successMessage` (e.g., "User demoted successfully.").
       - Optionally, trigger a refetch of user data.
    5. **On Error:**
       - Set `isLoading` to `false`.
       - Set `error` with a user-friendly message.
       - Log the actual error.

  - **`clearMessages()`:**
    1. Set `error` to `null`.
    2. Set `successMessage` to `null`.

- **Constructor/Initialization (if hook needs setup, e.g., injecting use case):**
  - The hook function itself can take the `UpdateUserRoleUseCase` instance as an argument if dependency injection is preferred at the hook level, or it can instantiate it directly.

---

**3. UI Interaction (Conceptual)**

- UI components (e.g., a user list item with action buttons, a user profile page) would import and use `useUserRoleManagement`.
- **Example Usage:**

  ```tsx
  const { promoteUser, demoteUser, isLoading, error, successMessage, clearMessages } = useUserRoleManagement();

  // In a component:
  const handlePromote = async (userId) => {
    await promoteUser(userId);
    // Optionally show toast based on successMessage or error
  };

  const handleDemote = async (userId) => {
    await demoteUser(userId);
    // Optionally show toast
  };

  // Render loading indicators based on `isLoading`.
  // Display `error` or `successMessage` to the user (e.g., via alerts, toasts).
  ```

---

**4. Error Handling and User Feedback:**

- The hook should translate domain/application errors into user-friendly messages.
- `isLoading` state should be used to provide visual feedback (e.g., disabling buttons, showing spinners).
- Success messages should confirm the action was completed.
- Consider using a global notification/toast system for displaying these messages rather than just returning strings, to ensure consistent UI feedback.

---

**Considerations:**

- **Use Case Availability:** This plan assumes the `UpdateUserRoleUseCase` is implemented and available for the hook to consume.
- **State Management for User List:** The hook itself doesn't manage the user list. The calling component or a higher-level state management solution (like Zustand, Redux, React Query) would be responsible for fetching and updating the list of users. The hook can provide callbacks or integrate with such systems to trigger data refresh upon successful role change.
- **Dependency Injection:** Decide on how the `UpdateUserRoleUseCase` will be provided to the hook (e.g., instantiated directly, passed as a prop, or via a DI container if used in the project).

This plan provides a solid foundation for creating the `useUserRoleManagement` hook. The next step would be to implement this hook according to the plan.
