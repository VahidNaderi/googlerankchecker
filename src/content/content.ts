import "./content.scss";
import { StorageService } from "../shared/services/storage-service";
import { SerpHelper } from "../shared/helpers/serp-helper";

const storageService = new StorageService();
const serpHelper = new SerpHelper();

// An observer to observe DOM changes and work on infinite scroll style search results display
// There's some space for optimization because it's been called many times during DOM creation
const observer = new MutationObserver(async (mutationsList, observer) => {
    const sites = await storageService.getSites();
    if (sites) {
        const resultItems = serpHelper.getResultItems(document);
        let sitesWithRanksCount = 0;
        for (const site of sites) {
            for (let index = 0; index < resultItems.length; index++) {
                const resultItem = resultItems[index];

                if (resultItem.innerText.indexOf(site.hostname) > -1) {
                    const element = resultItem;
                    if (element != null) {
                        highlightLink(element);
                        sitesWithRanksCount++;
                    }
                }
                const pagePlacement = getPlacement(index + 1);
                resultItem.setAttribute('data-rank', pagePlacement.toString());
                showRankForResultItem(resultItem, pagePlacement);
            }
        }
        chrome.runtime.sendMessage({ sitesWithRanksCount }, (response) => { });
    }
});

const showRankForResultItem = (resultItem: any, rank: number) => {
    chrome.storage.sync.get('counter-enabled', data => {
        if (data['counter-enabled'] === true || data['counter-enabled'] === undefined) {
            resultItem.classList.add('serp-rank');
        }
    })
}
observer.observe(document, { childList: true, subtree: true });

const highlightLink = (element: Element): void => {
    chrome.storage.sync.get('highlighting-enabled', data => {
        if (data['highlighting-enabled'] === true || data['highlighting-enabled'] === undefined) {
            element.classList.add('serptrends-item');
        }
    })
}

const getPlacement = (itemIndexInPage: number): number => {
    const loc = new URLSearchParams(document.location.search);
    const skip = Number(loc.get('start')) ?? 0;
    return skip + itemIndexInPage;
}