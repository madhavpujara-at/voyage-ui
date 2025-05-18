export class AnalyticsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AnalyticsError";
    }
}

export class InvalidPeriodError extends AnalyticsError {
    constructor(period: string) {
        super(
            `Invalid analytics period: ${period}. Expected Weekly, Monthly, or Yearly.`
        );
        this.name = "InvalidPeriodError";
    }
}

export class AnalyticsDataNotFoundError extends AnalyticsError {
    constructor(period: string) {
        super(`Analytics data not found for period: ${period}`);
        this.name = "AnalyticsDataNotFoundError";
    }
}
