import { useState, useEffect } from "react";
import { AnalyticsDataDto } from "../../application/dtos/AnalyticsDataDto";
import { GetAnalyticsUseCase } from "../../application/useCases/GetAnalyticsUseCase";
import { AnalyticsRepository } from "../../infrastructure/repositories/AnalyticsRepository";
import { AnalyticsApiClient } from "../../infrastructure/api/AnalyticsApiClient";

// Create dependencies
const analyticsApiClient = new AnalyticsApiClient();
const analyticsRepository = new AnalyticsRepository(analyticsApiClient);
const getAnalyticsUseCase = new GetAnalyticsUseCase(analyticsRepository);

export const useAnalyticsData = (period: string) => {
    const [data, setData] = useState<AnalyticsDataDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        // Use the use case to fetch data
        const fetchData = async () => {
            try {
                const analyticsData = await getAnalyticsUseCase.execute(period);
                setData(analyticsData);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
                console.error("Error fetching analytics data:", err);
            }
        };

        fetchData();

        // Cleanup
        return () => {
            // Any cleanup if needed
        };
    }, [period]);

    return { data, isLoading, error };
};
