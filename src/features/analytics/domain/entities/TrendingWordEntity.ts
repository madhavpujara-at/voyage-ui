export class TrendingWordEntity {
    constructor(
        private readonly _word: string,
        private readonly _frequency: number
    ) {
        if (!_word) throw new Error("Word is required");
        if (_frequency < 0)
            throw new Error("Frequency must be a non-negative number");
    }

    get word(): string {
        return this._word;
    }

    get frequency(): number {
        return this._frequency;
    }
}
