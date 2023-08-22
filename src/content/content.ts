import "./content.scss";
import { StorageService } from "../shared/services/storage-service";

const storageService = new StorageService();

window.onload = async () => {
    const sites = await storageService.getSites();
    if (sites) {
        const linksInPage = document.getElementsByTagName('cite');
        let sitesWithRanksCount = 0;
        for (const site of sites) {
            for (let index = 0; index < linksInPage.length; index++) {
                const link = linksInPage[index];

                if (link.innerText.indexOf(site.hostname) > -1) {
                    const element = link.closest('.g');
                    if (element != null) {
                        highlightLink(element);
                        const pagePlacement = getPlacement(index + 1);
                        element.setAttribute('data-rank', pagePlacement.toString());
                        sitesWithRanksCount++;
                    }
                }
            }
        }
        chrome.runtime.sendMessage({ sitesWithRanksCount }, (response) => { });
    }
}

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