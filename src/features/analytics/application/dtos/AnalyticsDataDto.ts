import { RecognitionStatDto } from "./RecognitionStatDto";
import { TrendingWordDto } from "./TrendingWordDto";
import { TrendingCategoryDto } from "./TrendingCategoryDto";

export interface AnalyticsDataDto {
    readonly topIndividuals: RecognitionStatDto[];
    readonly topTeams: RecognitionStatDto[];
    readonly trendingWords: TrendingWordDto[];
    readonly trendingCategories: TrendingCategoryDto[];
}
