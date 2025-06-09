import { RankStorageModel } from "./rank-storage";

export class AddRankResponseModel {
    constructor() {
        this.item = new RankStorageModel();
    }
    added: boolean;
    item: RankStorageModel;
}