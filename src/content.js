'use strict';

window.onload = function () {
    const storage = new Storage();

    storage.getSites().then(sites => {
        console.log(sites);

        if (sites) {
            const linksInPage = document.getElementsByTagName('cite');
            let sitesWithRanksCount = 0;
            for (const site of sites) {
                for (let index = 0; index < linksInPage.length; index++) {
                    const link = linksInPage[index];

                    if (link.innerText.indexOf(site.hostname) > -1) {
                        const element = link.closest('.g');
                        highlightLink(element);
                        const pagePlacement = this.getPlacement(index + 1);
                        element.setAttribute('data-rank', pagePlacement);
                        console.log('placement is :', pagePlacement);
                        sitesWithRanksCount++;
                    }
                }
            }
            chrome.runtime.sendMessage({ sitesWithRanksCount }, function (response) {
                console.log(response);
            });
        }
    })
}

function highlightLink(element) {
    chrome.storage.sync.get('highlighting-enabled', data => {
        if (data['highlighting-enabled'] === true || data['highlighting-enabled'] === undefined) {
            element.classList.add('serptrends-item');
        }
    })
}

function getPlacement(itemIndexInPage) {
    const loc = new URLSearchParams(document.location.search);
    let skip = parseInt(loc.get('start'));
    skip = isNaN(skip) ? 0 : skip;
    return skip + itemIndexInPage;
}