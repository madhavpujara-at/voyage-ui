export class TrendingCategoryEntity {
    constructor(
        private readonly _categoryName: string,
        private readonly _kudosCount: number
    ) {
        if (!_categoryName) throw new Error("Category name is required");
        if (_kudosCount < 0)
            throw new Error("Kudos count must be a non-negative number");
    }

    get categoryName(): string {
        return this._categoryName;
    }

    get kudosCount(): number {
        return this._kudosCount;
    }
}
