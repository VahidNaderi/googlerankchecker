// SERP(Search Engine Result Page) helper
export class SerpHelper {

    readonly Result_Item_Selector: string = 'div[jscontroller="SC7lYd"]';

    getResultItems(resultsContainer: any) {
        let resultItems = resultsContainer.querySelectorAll(this.Result_Item_Selector)

        return resultItems;
    }
    getLinkFromResultItem(resutlItem: any): string {
        let cite = resutlItem.getElementsByTagName('a')[0];
        console.log('cite:',cite)
        console.log('url:', cite.href)
        return cite.href;
    }
}