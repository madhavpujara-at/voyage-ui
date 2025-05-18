import { AnalyticsEntity } from "../entities/AnalyticsEntity";

export interface IAnalyticsRepository {
    /**
     * Retrieves analytics data for a specific time period
     * @param period The time period for the analytics data (e.g., 'Weekly', 'Monthly', 'Yearly')
     */
    getAnalytics(period: string): Promise<AnalyticsEntity>;
}
