export class RecognitionEntity {
    constructor(
        private readonly _id: string,
        private readonly _name: string,
        private readonly _kudosCount: number
    ) {
        if (!_id) throw new Error("Recognition ID is required");
        if (!_name) throw new Error("Recognition name is required");
        if (_kudosCount < 0)
            throw new Error("Kudos count must be a non-negative number");
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get kudosCount(): number {
        return this._kudosCount;
    }
}
