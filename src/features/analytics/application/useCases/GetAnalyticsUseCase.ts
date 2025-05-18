import { AnalyticsDataDto } from "../dtos/AnalyticsDataDto";
import { IAnalyticsRepository } from "../../domain/interfaces/IAnalyticsRepository";
import { AnalyticsMapper } from "../mappers/AnalyticsMapper";
import { InvalidPeriodError } from "../../domain/errors/AnalyticsError";

export class GetAnalyticsUseCase {
    private validPeriods = ["Weekly", "Monthly", "Yearly"];

    constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

    async execute(period: string): Promise<AnalyticsDataDto> {
        // Validate the period
        if (!this.validPeriods.includes(period)) {
            throw new InvalidPeriodError(period);
        }

        // Get analytics from repository
        const analyticsEntity = await this.analyticsRepository.getAnalytics(
            period
        );

        // Map to DTO and return
        return AnalyticsMapper.toDto(analyticsEntity);
    }
}
