# Analytics Screen Development Plan (Frontend First with Mock Data & Context API)

This document outlines the plan for developing the analytics screen, prioritizing frontend implementation with mock data and using React Context API for state management, adhering to Clean Architecture principles. The backend API will be integrated later. Requirements are based on `digital_kudos_wall_prd.md`.

## I. Frontend Development (Priority)

This section details the creation of frontend components and state management for the analytics feature. It aligns with Clean Architecture by treating UI components as part of the Infrastructure/Presentation layer, interacting with application-like logic (even if initially mocked) through well-defined interfaces (Context API, hooks, DTOs).

1. **Data Structures (DTOs - Data Transfer Objects)**
    * **Location:** `src/features/analytics/application/dtos/` (Create this path if it doesn't exist. Even with a frontend-first approach, defining DTOs here clarifies their role as data contracts between Presentation and Application layers, as per Rule 3 of Clean Architecture).
    * **Purpose:** These objects define the shape of data exchanged. They are plain, serializable objects. For frontend, they ensure a consistent data structure for components and the context.
    * **Immutability (Rule 14):** Treat these DTOs as immutable. When creating mock data or handling state, always produce new instances rather than modifying existing ones.
    * **Definitions:**
        * `RecognitionStatDto.ts`: `export interface RecognitionStatDto { readonly id: string; readonly name: string; readonly kudosCount: number; }`
        * `TrendingWordDto.ts`: `export interface TrendingWordDto { readonly word: string; readonly frequency: number; }`
        * `TrendingCategoryDto.ts`: `export interface TrendingCategoryDto { readonly categoryName: string; readonly kudosCount: number; }`
        * `AnalyticsDataDto.ts`: `export interface AnalyticsDataDto { readonly topIndividuals: RecognitionStatDto[]; readonly topTeams: RecognitionStatDto[]; readonly trendingWords: TrendingWordDto[]; readonly trendingCategories: TrendingCategoryDto[]; }` (Period is managed by the Context Provider).

2. **Context API Setup (`src/features/analytics/presentation/contexts/`)**
    * **Purpose:** To provide global state for the analytics feature, avoiding prop drilling and centralizing state logic (DIP - components depend on this abstraction).
    * **Directory:** Create `src/features/analytics/presentation/contexts/`.
    * **`AnalyticsContext.tsx` (New File)**
        * **SRP (Rule 7):** Its single responsibility is to define the contract for the analytics state and provide a way to access it.
        * **`AnalyticsContextValue` Interface:**

            ```typescript
            import { AnalyticsDataDto } from '../../application/dtos/AnalyticsDataDto';

            export interface AnalyticsContextValue {
              readonly data: AnalyticsDataDto | null;
              readonly isLoading: boolean;
              readonly error: any; // Consider a more specific error type later
              readonly period: string; // e.g., 'Weekly', 'Monthly'
              readonly setPeriod: (newPeriod: string) => void;
            }
            ```

        * **Context Creation:**

            ```typescript
            import { createContext, useContext } from 'react';
            // ... AnalyticsContextValue definition
            export const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);
            ```

        * **`useAnalyticsContext` Custom Hook (ISP - Rule 10):** Consumers use this hook to access only what they need from the context.

            ```typescript
            export const useAnalyticsContext = () => {
              const context = useContext(AnalyticsContext);
              if (context === undefined) {
                throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
              }
              return context;
            };
            ```

    * **`AnalyticsProvider.tsx` (New File)**
        * **SRP (Rule 7):** Its single responsibility is to manage the analytics state (period selection, data fetching orchestration) and provide it to its children via the `AnalyticsContext`.
        * **Functionality:**
            1. Manages the `period` state (e.g., using `useState`).
            2. Calls the `useAnalyticsData` hook (see next section) with the current `period` to get `data`, `isLoading`, and `error`.
            3. Provides these values, along with `period` and `setPeriod`, through `AnalyticsContext.Provider`.
        * **Example Structure:**

            ```typescript
            import React, { useState, useMemo } from 'react';
            import { AnalyticsContext, AnalyticsContextValue } from './AnalyticsContext';
            import { useAnalyticsData } from '../hooks/useAnalyticsData';

            export const AnalyticsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
              const [period, setPeriod] = useState<string>('Monthly'); // Default period
              const { data, isLoading, error } = useAnalyticsData(period);

              const contextValue: AnalyticsContextValue = useMemo(() => ({
                data,
                isLoading,
                error,
                period,
                setPeriod,
              }), [data, isLoading, error, period]);

              return (
                <AnalyticsContext.Provider value={contextValue}>
                  {children}
                </AnalyticsContext.Provider>
              );
            };
            ```

3. **Hook for Data Fetching/Mocking (`src/features/analytics/presentation/hooks/useAnalyticsData.ts`)**
    * **Purpose:** Encapsulates the logic for retrieving (or, for now, mocking) analytics data. This acts as an abstraction that the `AnalyticsProvider` depends on (DIP - Rule 11).
    * **SRP (Rule 7):** Its responsibility is solely data fetching/mocking logic for analytics based on a period.
    * **Interface:** Accepts `period: string` as an argument. Returns an object: `{ data: AnalyticsDataDto | null, isLoading: boolean, error: any }`.
    * **Mock Implementation Details:**
        * Use `useState` and `useEffect` to simulate asynchronous fetching (e.g., with `setTimeout`).
        * Return different hardcoded `AnalyticsDataDto` objects based on the input `period` to allow testing of the UI with various data scenarios.
        * Manage `isLoading` state (true during simulation, false after).
        * Optionally simulate an error state for testing error display.

4. **Page (`src/pages/analytics/index.tsx`)**
    * **SRP (Rule 7):** Its primary responsibility is to structure the overall layout of the analytics page and host the `AnalyticsProvider`.
    * **Implementation:**
        * Import `AnalyticsProvider`.
        * Wrap the main content/components of the analytics section with `<AnalyticsProvider>`.
        * May include static layout elements like page titles or `AdminLayout`, `Navigation` as already present.
        * It delegates state management and data fetching concerns to the `AnalyticsProvider` and consuming components.

5. **Presentation Layer Components (`src/features/analytics/presentation/components/`)**
    * **General Principle:** These components are part of the Infrastructure/Presentation layer. They should be focused on UI and delegate business/application logic to hooks and context (DIP - Rule 11).
    * **Testing (Rule 12):** Each component should be testable in isolation by wrapping it with a mock `AnalyticsProvider` that provides specific context values for different test cases.

    * **`PeriodFilter.tsx`**:
        * **SRP (Rule 7):** Manages the UI for period selection.
        * **Context Usage:** Calls `useAnalyticsContext()` to get the current `period` and the `setPeriod` function.
        * **Implementation:** Renders a dropdown or segmented control. On change, calls `setPeriod` from the context.

    * **`TopRecognitionsCard.tsx`**:
        * **SRP (Rule 7):** Displays a list of top recognized items (individuals or teams).
        * **Props:** `title: string`, `dataType: 'individuals' | 'teams'`.
        * **Context Usage (ISP - Rule 10):** Calls `useAnalyticsContext()` to get `data`, `isLoading`, and `error`. Based on `dataType`, it accesses `data.topIndividuals` or `data.topTeams`.
        * **Implementation:** Renders the title. If `isLoading`, shows a spinner/placeholder. If `error`, shows an error message. If `data` is available, maps over the relevant array to display names and kudos counts.

    * **`TrendingWordsDisplay.tsx`**:
        * **SRP (Rule 7):** Displays trending words.
        * **Context Usage:** Calls `useAnalyticsContext()` to get `data.trendingWords`, `isLoading`, `error`.
        * **Implementation:** Similar to `TopRecognitionsCard` regarding loading/error states. If data is available, renders the list of words. Start with a simple styled list. (Optional Enhancement Later: word cloud or bar chart).

    * **`TrendingCategoriesDisplay.tsx`**:
        * **SRP (Rule 7):** Displays trending categories, ideally as a chart.
        * **Context Usage:** Calls `useAnalyticsContext()` to get `data.trendingCategories`, `isLoading`, `error`.
        * **Implementation:** Handles loading/error states. If data is available, renders a **Bar Chart** (e.g., using Recharts). The chart will map category names to bars representing kudos counts.

    * **Updating `AnalyticsPage` (`src/pages/analytics/index.tsx`)**:
        * Ensure all analytics-specific components (`PeriodFilter`, `TopRecognitionsCard`, etc.) are children (direct or indirect) of the `<AnalyticsProvider>`.
        * The page itself might only need to render these components in the desired layout, as they will get their data and actions from the context.
        * Global loading/error states for the entire analytics section can be handled by the `AnalyticsProvider` (e.g., rendering a full-page loader/error) or more granularly within each component based on context values.

## II. Implementation Steps (Frontend First with Context API)

1. **Define DTOs:** Create the `.ts` files and interfaces for `RecognitionStatDto`, `TrendingWordDto`, `TrendingCategoryDto`, and `AnalyticsDataDto` in `src/features/analytics/application/dtos/`.
2. **Implement `useAnalyticsData` Hook:** Create `useAnalyticsData.ts` in `src/features/analytics/presentation/hooks/`. Implement logic to return mock `AnalyticsDataDto` based on the input `period`, including simulated loading and error states.
3. **Set up Context:** Create `AnalyticsContext.tsx` and `AnalyticsProvider.tsx` in `src/features/analytics/presentation/contexts/`. The `AnalyticsProvider` will use the `useAnalyticsData` hook and manage the `period` state.
4. **Develop Core Page Structure:** Update `src/pages/analytics/index.tsx` to include the `AnalyticsProvider` wrapping the area where analytics components will reside.
5. **Develop `PeriodFilter` Component:** Create `PeriodFilter.tsx`. It should consume and update `period` via `useAnalyticsContext()`.
6. **Develop Data Display Components:**
    * Create `TopRecognitionsCard.tsx`.
    * Create `TrendingWordsDisplay.tsx`.
    * Create `TrendingCategoriesDisplay.tsx` (including basic Bar Chart setup with mock data from context).
    * Ensure all these components consume data and states (`isLoading`, `error`) from `useAnalyticsContext()`.
7. **Integrate Components into AnalyticsPage:** Place the components developed in step 5 & 6 within the `AnalyticsProvider` in `src/pages/analytics/index.tsx`.
8. **Refine and Test UI:** Thoroughly test the UI with different mock data scenarios triggered by changing the period. Test loading and error state displays. Style components using Shadcn UI principles as you go.
