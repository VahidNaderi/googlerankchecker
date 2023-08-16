import "./content.scss";
import { StorageHelper } from "../helpers/storage-helper";

window.onload = () => {
    StorageHelper.getSites().then((sites: any) => {
        console.log(sites);

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
                            console.log('placement is :', pagePlacement);
                            sitesWithRanksCount++;
                        }
                    }
                }
            }
            chrome.runtime.sendMessage({ sitesWithRanksCount }, function (response) {
                console.log(response);
            });
        }
    })
}

function highlightLink(element: Element) {
    chrome.storage.sync.get('highlighting-enabled', data => {
        if (data['highlighting-enabled'] === true || data['highlighting-enabled'] === undefined) {
            element.classList.add('serptrends-item');
        }
    })
}

function getPlacement(itemIndexInPage: number) {
    const loc = new URLSearchParams(document.location.search);
    const skip = Number(loc.get('start')) ?? 0;
    return skip + itemIndexInPage;
}