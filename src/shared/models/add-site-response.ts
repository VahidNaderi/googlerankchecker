import { SiteStorageModel } from "./site-storage";

export class AddSiteResponseModel {
    constructor() {
        this.item = new SiteStorageModel();
    }
    added: boolean;
    item: SiteStorageModel;
}