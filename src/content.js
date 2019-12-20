'use strict';

window.onload = function () {
    const storage = new Storage();

    storage.getSites().then(sites => {
        console.log(sites);

        if (sites) {
            const linksInPage = document.getElementsByTagName('cite');

            for (const site of sites) {
                for (let index = 0; index < linksInPage.length; index++) {
                    const link = linksInPage[index];

                    if (link.innerText.indexOf(site.hostname) > -1) {
                        const element = link.closest('.g');
                        element.classList.add('serptrends-item');
                        const pagePlacement = this.getPlacement(index + 1);
                        element.setAttribute('data-rank', pagePlacement);
                        console.log('placement is :', pagePlacement);
                    }
                }
            }

        }
    }

    )
}

function getPlacement(itemIndexInPage) {
    const loc = new URLSearchParams(document.location.search);
    let skip = parseInt(loc.get('start'));
    skip = skip == NaN ? 0 : skip;
    return skip + itemIndexInPage;
}