import { AddSiteResponseModel } from "../models/add-site-response";
import { SiteStorageModel } from "../models/site-storage";
import { CommonHelper } from "../helpers/common-helper";

export class StorageService {
    constructor() { }

    public addSite(urlString: string): Promise<AddSiteResponseModel> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('mysites', (data) => {
                let url = CommonHelper.createUrlObject(urlString);
                let domain = CommonHelper.getDomainNameFromUrl(urlString);
                if (!data.mysites) {
                    data.mysites = [];
                }
                var foundUrl = data.mysites.find((u: URL) => u.hostname == domain);
                if (!foundUrl) {
                    var item = { hostname: domain, origin: url.origin };
                    data.mysites.push(item);
                    resolve({ added: true, item: item });
                }
                chrome.storage.sync.set({ 'mysites': data.mysites });
            })
        })
    }

    public removeSite(name: string): void {
        chrome.storage.sync.get('mysites', (data) => {
            //let domain = getDomainNameFromUrl(urlString);
            var foundUrl = data.mysites.find((u: URL) => u.hostname == name);
            if (foundUrl) {
                var index = data.mysites.indexOf(foundUrl);
                data.mysites.splice(index, 1);

            }
            chrome.storage.sync.set({ 'mysites': data.mysites });
        })
    }

    public getSites(): Promise<SiteStorageModel[]> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('mysites', data => resolve(data.mysites) );
        })
    }
}
