import { createContext, useContext } from "react";
import { AnalyticsDataDto } from "../../application/dtos/AnalyticsDataDto";

export interface AnalyticsContextValue {
    readonly data: AnalyticsDataDto | null;
    readonly isLoading: boolean;
    readonly error: unknown; // Consider a more specific error type later
    readonly period: string; // e.g., 'Weekly', 'Monthly', 'Yearly'
    readonly setPeriod: (newPeriod: string) => void;
}

export const AnalyticsContext = createContext<
    AnalyticsContextValue | undefined
>(undefined);

export const useAnalyticsContext = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error(
            "useAnalyticsContext must be used within an AnalyticsProvider"
        );
    }
    return context;
};
