import { IAnalyticsRepository } from "../../domain/interfaces/IAnalyticsRepository";
import { AnalyticsEntity } from "../../domain/entities/AnalyticsEntity";
import { AnalyticsApiClient } from "../api/AnalyticsApiClient";
import { AnalyticsMapper } from "../../application/mappers/AnalyticsMapper";
import { AnalyticsDataNotFoundError } from "../../domain/errors/AnalyticsError";

export class AnalyticsRepository implements IAnalyticsRepository {
    constructor(private readonly apiClient: AnalyticsApiClient) {}

    async getAnalytics(period: string): Promise<AnalyticsEntity> {
        try {
            // Fetch data from API
            const analyticsDto = await this.apiClient.fetchAnalytics(period);

            // Check if data exists
            if (!analyticsDto) {
                throw new AnalyticsDataNotFoundError(period);
            }

            // Convert DTO to domain entity and return
            return AnalyticsMapper.toDomain(analyticsDto);
        } catch (error) {
            // If it's already a domain error, rethrow it
            if (error instanceof Error && error.name.includes("Error")) {
                throw error;
            }

            // Otherwise, wrap it in a generic error
            throw new Error(
                `Failed to fetch analytics data: ${(error as Error).message}`
            );
        }
    }
}
