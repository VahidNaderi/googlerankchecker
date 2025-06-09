// SERP(Search Engine Result Page) helper
import { HttpHelper } from "../helpers/http-helper"
export class SerpHelper {
    private httpHelper = new HttpHelper();
    readonly Result_Item_Selector: string = 'div[jscontroller="SC7lYd"]';

    getResultItems(resultsContainer: any) {
        let resultItems = resultsContainer.querySelectorAll(this.Result_Item_Selector)

        return resultItems;
    }
    async getFullResaultItems(googleurl: URL) {
        if (googleurl.href.includes("google.") && googleurl.href.includes("/search")) {
            googleurl.searchParams.set('num', '100');
            googleurl.searchParams.set('start', '0');
            const res = await this.httpHelper.httpGetAsync(googleurl.href);
            let element = document.createElement('html');
            element.innerHTML = res;
            let resultItems = this.getResultItems(element);
            return resultItems;
        }
    }
    getLinkFromResultItem(resutlItem: any): string {
        let cite = resutlItem.getElementsByTagName('a')[0];
        console.log('cite:', cite)
        console.log('url:', cite.href)
        return cite.href;
    }
}