import { CommonHelper } from "./common-helper";
import { StorageService } from "../services/storage-service";
import { SerpHelper } from "./serp-helper";

export class SearchHelper {
    private static _searchCache: { [key: string]: any } = {};
    private static readonly serpHelper = new SerpHelper();

    constructor() { }

    public static refresh(): void {
        const storageService = new StorageService();
        storageService.getSites().then((sites: any[]) => {
            if (sites && sites.length > 0) {
                CommonHelper.isGooglePage().then(isGoogle => {
                    if (isGoogle) {
                        CommonHelper.getCurrentTab().then(tab => {
                            if (tab.url) {
                                let googleurl = new URL(tab.url);
                                let keyword = this.getKeywordFromUrl(googleurl) as string;
                                if (this._searchCache[keyword] == undefined)
                                    this.renewRanks(googleurl)
                            }
                        })
                    }
                })
            }
        })
    }

    public static renewRanks(googleurl: URL): Promise<unknown> {
        return new Promise((resolve, reject) => {
            let keyword = this.getKeywordFromUrl(googleurl);
            // Throw an error if the keyword is null or undefined
            if (!keyword) throw new Error('Keyword not found');

            googleurl.searchParams.set('num', '100');

            if (this._searchCache[keyword] == undefined) {
                this._searchCache[keyword] = [];
                fetch(googleurl.href).then(async res => {
                    const bodyStr = await new Response(res.body).text();
                    this.parseGoogleResultAndUpdate(bodyStr, keyword as string);
                    resolve(this._searchCache[keyword as string]);
                })
            }

            else resolve(this._searchCache[keyword]);
        })
    }

    public static parseGoogleResultAndUpdate(googleResultPage: string, keyword: string): void {
        let page = document.createElement('html');
        page.innerHTML = googleResultPage;
        let resultItems = this.serpHelper.getResultItems(page);
        for (let i = 0; i < resultItems.length; i++) {
            let url = this.serpHelper.getLinkFromResultItem(resultItems[i]);
            let domain = CommonHelper.getDomainNameFromUrl(url);
            this._searchCache[keyword].push({ domain, rank: i + 1 });
        }
    }

    public static getKeywordFromUrl(url: URL): string | null {
        if (!url.searchParams.has('q')) return null;
        let keyword = url.searchParams.get('q');
        return keyword;
    }

    public static httpGetAsync2(theUrl: string | URL): Promise<unknown> {
        return new Promise((resolve, reject) => {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                }
            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous 
            xmlHttp.send(null);
        });

    }
}