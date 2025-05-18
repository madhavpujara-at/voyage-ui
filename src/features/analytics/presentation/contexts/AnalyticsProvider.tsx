import { useState, useMemo, ReactNode } from "react";
import { AnalyticsContext, AnalyticsContextValue } from "./AnalyticsContext";
import { useAnalyticsData } from "../hooks/useAnalyticsData";

interface AnalyticsProviderProps {
    children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
    const [period, setPeriod] = useState<string>("Monthly"); // Default period
    const { data, isLoading, error } = useAnalyticsData(period);

    const contextValue: AnalyticsContextValue = useMemo(
        () => ({
            data,
            isLoading,
            error,
            period,
            setPeriod,
        }),
        [data, isLoading, error, period]
    );

    return (
        <AnalyticsContext.Provider value={contextValue}>
            {children}
        </AnalyticsContext.Provider>
    );
};
