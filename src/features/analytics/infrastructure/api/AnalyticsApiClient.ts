import { AnalyticsDataDto } from "../../application/dtos/AnalyticsDataDto";

// Mock data for different periods - this would be replaced with real API calls in production
const mockWeeklyData: AnalyticsDataDto = {
    topIndividuals: [
        { id: "1", name: "John Doe", kudosCount: 15 },
        { id: "2", name: "Jane Smith", kudosCount: 12 },
        { id: "3", name: "Robert Johnson", kudosCount: 10 },
        { id: "4", name: "Emily Davis", kudosCount: 8 },
        { id: "5", name: "Michael Brown", kudosCount: 7 },
    ],
    topTeams: [
        { id: "1", name: "Engineering", kudosCount: 42 },
        { id: "2", name: "Design", kudosCount: 28 },
        { id: "3", name: "Product", kudosCount: 23 },
        { id: "4", name: "Marketing", kudosCount: 18 },
        { id: "5", name: "Customer Support", kudosCount: 15 },
    ],
    trendingWords: [
        { word: "innovative", frequency: 24 },
        { word: "teamwork", frequency: 21 },
        { word: "helpful", frequency: 19 },
        { word: "creative", frequency: 16 },
        { word: "dedicated", frequency: 14 },
        { word: "supportive", frequency: 12 },
        { word: "reliable", frequency: 11 },
    ],
    trendingCategories: [
        { categoryName: "Collaboration", kudosCount: 32 },
        { categoryName: "Technical Excellence", kudosCount: 28 },
        { categoryName: "Innovation", kudosCount: 24 },
        { categoryName: "Customer Focus", kudosCount: 18 },
        { categoryName: "Leadership", kudosCount: 12 },
    ],
};

const mockMonthlyData: AnalyticsDataDto = {
    topIndividuals: [
        { id: "1", name: "Jane Smith", kudosCount: 45 },
        { id: "2", name: "John Doe", kudosCount: 39 },
        { id: "3", name: "Emily Davis", kudosCount: 36 },
        { id: "4", name: "Robert Johnson", kudosCount: 32 },
        { id: "5", name: "Sarah Miller", kudosCount: 28 },
    ],
    topTeams: [
        { id: "1", name: "Engineering", kudosCount: 120 },
        { id: "2", name: "Product", kudosCount: 95 },
        { id: "3", name: "Design", kudosCount: 88 },
        { id: "4", name: "Marketing", kudosCount: 72 },
        { id: "5", name: "Sales", kudosCount: 65 },
    ],
    trendingWords: [
        { word: "collaborative", frequency: 75 },
        { word: "innovative", frequency: 68 },
        { word: "supportive", frequency: 62 },
        { word: "dedicated", frequency: 57 },
        { word: "proactive", frequency: 52 },
        { word: "thoughtful", frequency: 48 },
        { word: "skilled", frequency: 45 },
    ],
    trendingCategories: [
        { categoryName: "Collaboration", kudosCount: 110 },
        { categoryName: "Innovation", kudosCount: 95 },
        { categoryName: "Technical Excellence", kudosCount: 88 },
        { categoryName: "Customer Focus", kudosCount: 75 },
        { categoryName: "Leadership", kudosCount: 62 },
    ],
};

const mockYearlyData: AnalyticsDataDto = {
    topIndividuals: [
        { id: "1", name: "John Doe", kudosCount: 185 },
        { id: "2", name: "Jane Smith", kudosCount: 172 },
        { id: "3", name: "Michael Brown", kudosCount: 163 },
        { id: "4", name: "Emily Davis", kudosCount: 145 },
        { id: "5", name: "Robert Johnson", kudosCount: 138 },
    ],
    topTeams: [
        { id: "1", name: "Engineering", kudosCount: 520 },
        { id: "2", name: "Product", kudosCount: 435 },
        { id: "3", name: "Design", kudosCount: 380 },
        { id: "4", name: "Marketing", kudosCount: 325 },
        { id: "5", name: "Sales", kudosCount: 290 },
    ],
    trendingWords: [
        { word: "innovative", frequency: 312 },
        { word: "collaborative", frequency: 289 },
        { word: "dedication", frequency: 265 },
        { word: "supportive", frequency: 241 },
        { word: "excellence", frequency: 220 },
        { word: "leadership", frequency: 195 },
        { word: "initiative", frequency: 182 },
    ],
    trendingCategories: [
        { categoryName: "Innovation", kudosCount: 425 },
        { categoryName: "Collaboration", kudosCount: 410 },
        { categoryName: "Technical Excellence", kudosCount: 385 },
        { categoryName: "Leadership", kudosCount: 310 },
        { categoryName: "Customer Focus", kudosCount: 275 },
    ],
};

export class AnalyticsApiClient {
    // In a real implementation, this would take an HttpClient or similar
    constructor(private readonly apiUrl: string = "/api/analytics") {}

    async fetchAnalytics(period: string): Promise<AnalyticsDataDto> {
        // In a real implementation, this would make an actual API call:
        // return await this.httpClient.get(`${this.apiUrl}?period=${period}`);

        // For now, return mock data based on period
        return await new Promise<AnalyticsDataDto>((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                switch (period) {
                    case "Weekly":
                        resolve(mockWeeklyData);
                        break;
                    case "Monthly":
                        resolve(mockMonthlyData);
                        break;
                    case "Yearly":
                        resolve(mockYearlyData);
                        break;
                    default:
                        // Default to Monthly
                        resolve(mockMonthlyData);
                        break;
                }
            }, 800);
        });
    }
}
