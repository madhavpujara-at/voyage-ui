import { AnalyticsDataDto } from "../dtos/AnalyticsDataDto";
import { RecognitionStatDto } from "../dtos/RecognitionStatDto";
import { TrendingWordDto } from "../dtos/TrendingWordDto";
import { TrendingCategoryDto } from "../dtos/TrendingCategoryDto";
import { AnalyticsEntity } from "../../domain/entities/AnalyticsEntity";
import { RecognitionEntity } from "../../domain/entities/RecognitionEntity";
import { TrendingWordEntity } from "../../domain/entities/TrendingWordEntity";
import { TrendingCategoryEntity } from "../../domain/entities/TrendingCategoryEntity";

export class AnalyticsMapper {
    static toDto(entity: AnalyticsEntity): AnalyticsDataDto {
        return {
            topIndividuals: entity.topIndividuals.map(this.recognitionToDto),
            topTeams: entity.topTeams.map(this.recognitionToDto),
            trendingWords: entity.trendingWords.map(this.trendingWordToDto),
            trendingCategories: entity.trendingCategories.map(
                this.trendingCategoryToDto
            ),
        };
    }

    static toDomain(dto: AnalyticsDataDto): AnalyticsEntity {
        return new AnalyticsEntity(
            dto.topIndividuals.map(this.recognitionToDomain),
            dto.topTeams.map(this.recognitionToDomain),
            dto.trendingWords.map(this.trendingWordToDomain),
            dto.trendingCategories.map(this.trendingCategoryToDomain)
        );
    }

    private static recognitionToDto(
        entity: RecognitionEntity
    ): RecognitionStatDto {
        return {
            id: entity.id,
            name: entity.name,
            kudosCount: entity.kudosCount,
        };
    }

    private static recognitionToDomain(
        dto: RecognitionStatDto
    ): RecognitionEntity {
        return new RecognitionEntity(dto.id, dto.name, dto.kudosCount);
    }

    private static trendingWordToDto(
        entity: TrendingWordEntity
    ): TrendingWordDto {
        return {
            word: entity.word,
            frequency: entity.frequency,
        };
    }

    private static trendingWordToDomain(
        dto: TrendingWordDto
    ): TrendingWordEntity {
        return new TrendingWordEntity(dto.word, dto.frequency);
    }

    private static trendingCategoryToDto(
        entity: TrendingCategoryEntity
    ): TrendingCategoryDto {
        return {
            categoryName: entity.categoryName,
            kudosCount: entity.kudosCount,
        };
    }

    private static trendingCategoryToDomain(
        dto: TrendingCategoryDto
    ): TrendingCategoryEntity {
        return new TrendingCategoryEntity(dto.categoryName, dto.kudosCount);
    }
}
