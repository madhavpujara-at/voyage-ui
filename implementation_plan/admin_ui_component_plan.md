# Admin Feature UI Component Creation Plan

This plan outlines the creation of presentation layer components for the Admin feature, including login/logout functionality and an admin homepage with kudos display and user/lead lists. We will follow the provided folder structure.

## 1. Authentication Components

### Files to Create:

- **`src/pages/login.tsx`**

  - **Purpose:** Entry point for the login page.
  - **Content:** Will import and render the `AuthLayout` and `LoginForm` component.
  - **Logic:** Handles redirection after successful login (e.g., to `/admin`).

- **`src/pages/signup.tsx`**

  - **Purpose:** Entry point for the user registration page.
  - **Content:** Will import and render the `AuthLayout` and `SignupForm` component.

- **`src/components/layouts/AuthLayout.tsx`**

  - **Purpose:** Provides a consistent layout for authentication pages (Login, Signup).
  - **UI (referencing images):**
    - Centered content area (card-like as seen in login/signup images).
    - Includes the "Digital Kudos" logo at the top left (or centered above the form).

- **`src/features/auth/presentation/components/LoginForm.tsx`**

  - **Purpose:** Renders the login form and handles its submission.
  - **UI (referencing "Welcome back" image):**
    - "Welcome back" title and subtitle.
    - Email input field.
    - Password input field.
    - "Sign In" button.
    - Links for "Forgot your password?" and "Don't have an account? Sign up".
  - **Logic:**
    - Client-side validation.
    - On submit, will call an authentication service/hook.
    - Handles routing to the appropriate page (e.g., `/admin`) upon successful login.

- **`src/features/auth/presentation/components/SignupForm.tsx`**
  - **Purpose:** Renders the signup form and handles its submission.
  - **UI (referencing "Create an account" image):**
    - "Create an account" title and subtitle.
    - Full Name input field.
    - Email input field.
    - Role selection (Team Member / Tech Lead) using radio buttons.
    - Password input field.
    - Confirm Password input field.
    - "Create Account" button.
    - Link for "Already have an account? Sign in".
  - **Logic:** Client-side validation and form submission.

## 2. Admin Homepage & Layout Components

### Files to Create:

- **`src/pages/admin/index.tsx`**

  - **Purpose:** Entry point for the main admin dashboard/homepage.
  - **Content:** Will import and render `AdminLayout` and the main content for the admin homepage (e.g., `AdminDashboardView` or similar component housing the tabs).

- **`src/components/layouts/AdminLayout.tsx`**

  - **Purpose:** Provides the main layout structure for all authenticated admin pages.
  - **Content:**
    - Will import and render a `Navbar`.
    - Will render `children` props (the actual page content).
  - **Logic:**
    - Handles global state for admin section if needed.
    - Manages logout: The logout functionality will be triggered from the `Navbar` within this layout, clearing auth state and redirecting to `/login`.

- **`src/components/organisms/Navbar.tsx`** (Shared organism, used by `AdminLayout`)

  - **Purpose:** Top navigation bar for the application.
  - **UI (referencing "Kudos Wall" image header):**
    - "Digital Kudos" logo on the left.
    - Navigation links (e.g., "Dashboard").
    - Notification icon (bell).
    - User avatar and name dropdown (for profile/logout).
  - **Logic:** Contains the logout button/link that triggers the logout process.

- **`src/features/admin/presentation/pages/AdminDashboardView.tsx`** (or similar, to be rendered by `src/pages/admin/index.tsx`)
  - **Purpose:** Main content view for the admin homepage.
  - **Content:**
    - Will render `AdminTabs` component to switch between different admin sections.

## 3. Admin Homepage Content Components (Tabs & Lists)

### Files to Create:

- **`src/features/admin/presentation/components/AdminTabs.tsx`**

  - **Purpose:** Manages the tabbed navigation for the admin homepage (e.g., "Kudos Overview", "User Management", "Lead Management").
  - **UI:** Standard tab interface.
  - **Content:** Renders the content for the active tab.
    - Tab 1: Kudos display (using `KudosList` and `KudosCard`).
    - Tab 2: User List (using `UserListTable`).
    - Tab 3: Lead List (using `LeadListTable`).

- **`src/features/kudos/presentation/components/KudosCard.tsx`**

  - **Purpose:** Displays a single kudo item.
  - **UI (referencing "Kudos Wall" image cards):**
    - Recipient Name, Team/Category tags.
    - Kudo message.
    - Author ("From: ...").
    - Date.
    - Action icons (e.g., like, comment, share - though admin might have different actions like edit/delete).
  - **Note:** This component will be used on the admin homepage within a "Kudos" tab/section.

- **`src/features/kudos/presentation/components/KudosList.tsx`**

  - **Purpose:** Renders a list/grid of `KudosCard` components.
  - **UI (referencing "Kudos Wall" image):** A responsive grid layout for cards.

- **`src/features/users/presentation/components/UserListTable.tsx`**

  - **Purpose:** Displays a list/table of team members.
  - **UI:** Table or structured list with columns like Name, Email, Role, Actions (e.g., "Promote to Lead", "View Details", "Edit", "Delete").
  - **Content:** Will map over user data and render `UserListItem` for each.

- **`src/features/users/presentation/components/UserListItem.tsx`**

  - **Purpose:** Represents a single row or item in the `UserListTable`.
  - **UI:** Displays user information and action buttons/icons.

- **`src/features/users/presentation/components/LeadListTable.tsx`**

  - **Purpose:** Displays a list/table of tech leads.
  - **UI:** Similar to `UserListTable`, but for leads. Columns might include Name, Email, Actions (e.g., "Demote to User", "View Details", "Edit", "Delete").
  - **Content:** Will map over lead data and render `LeadListItem` for each.

- **`src/features/users/presentation/components/LeadListItem.tsx`**
  - **Purpose:** Represents a single row or item in the `LeadListTable`.
  - **UI:** Displays lead information and action buttons/icons.

## 4. Shared UI Atoms and Molecules

These are general-purpose UI building blocks that will be used across various components.

### Files to Create:

- **`src/components/atoms/Button.tsx`**

  - **Purpose:** A versatile button component.
  - **UI (referencing buttons in images):** Supports different styles (primary, secondary, link-style), sizes. E.g., "Create Account", "Sign In".

- **`src/components/atoms/Input.tsx`**

  - **Purpose:** A styled input field.
  - **UI (referencing input fields in images):** Standard text input styling.

- **`src/components/atoms/Label.tsx`**

  - **Purpose:** A styled label for form inputs.

- **`src/components/molecules/FormField.tsx`**

  - **Purpose:** A component that groups a `Label`, `Input`, and potentially validation messages for a form field.

- **`src/components/atoms/Radio.tsx`** (and potentially `RadioGroup.tsx`)

  - **Purpose:** For radio button selections.
  - **UI (referencing "Role" selection in signup):** Styled radio buttons.

- **`src/components/atoms/Logo.tsx`**

  - **Purpose:** Displays the "Digital Kudos" logo.
  - **UI (referencing logo in images):** The thumbs-up icon and "Digital Kudos" text.

- **`src/components/atoms/Card.tsx`**
  - **Purpose:** A generic card container for wrapping content like forms or kudos items.
  - **UI (referencing login/signup forms and kudo cards):** Provides the rounded corners, shadow, and padding.

## Next Steps

1.  Create the directory structure as per `folder-structure.mdc`.
2.  Implement each component file with basic JSX structure and styling based on the provided UI images.
3.  Implement client-side routing for login (to admin homepage) and logout (to login page).
4.  Placeholder data or mock services can be used initially for lists and cards until backend integration.
