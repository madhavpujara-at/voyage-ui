import { RecognitionEntity } from "./RecognitionEntity";
import { TrendingWordEntity } from "./TrendingWordEntity";
import { TrendingCategoryEntity } from "./TrendingCategoryEntity";

export class AnalyticsEntity {
    constructor(
        private readonly _topIndividuals: RecognitionEntity[],
        private readonly _topTeams: RecognitionEntity[],
        private readonly _trendingWords: TrendingWordEntity[],
        private readonly _trendingCategories: TrendingCategoryEntity[]
    ) {}

    get topIndividuals(): RecognitionEntity[] {
        return this._topIndividuals;
    }

    get topTeams(): RecognitionEntity[] {
        return this._topTeams;
    }

    get trendingWords(): TrendingWordEntity[] {
        return this._trendingWords;
    }

    get trendingCategories(): TrendingCategoryEntity[] {
        return this._trendingCategories;
    }
}
