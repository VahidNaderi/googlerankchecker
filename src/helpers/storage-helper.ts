import { CommonHelper } from "./common-helper";

export class StorageHelper {
    constructor() { }

    public static addSite(urlString: string) {
        console.log('adding site!');
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

    public static removeSite(name: string) {
        chrome.storage.sync.get('mysites', function (data) {
            //let domain = getDomainNameFromUrl(urlString);
            var foundUrl = data.mysites.find((u: URL) => u.hostname == name);
            if (foundUrl) {
                var index = data.mysites.indexOf(foundUrl);
                data.mysites.splice(index, 1);

            }
            chrome.storage.sync.set({ 'mysites': data.mysites });
        })
    }

    public static getSites(): Promise<string[]> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get('mysites', data => resolve(data.mysites));
        })
    }
}
