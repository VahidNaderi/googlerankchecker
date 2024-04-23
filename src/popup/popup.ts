import "./popup.scss";
import { StorageService } from "../shared/services/storage-service"
import { CommonHelper } from "../shared/helpers/common-helper";
import { SearchHelper } from "../shared/helpers/search-helper";
import { SiteStorageModel } from "../shared/models/site-storage";
import { SerpHelper } from "../shared/helpers/serp-helper";

var _searchCache: { [key: string]: any } = {};
const storageService = new StorageService();
const serpHelper = new SerpHelper();

$('#addsite').on('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0].url) {
            
            const response = await storageService.addSite(tabs[0].url);
            if (response && response.added)
                $('#site-ranks').append(CommonHelper.createSiteElement(response.item));
        }
    });
})

$('#refreshbtn').on('click', SearchHelper.refresh);

$('#btnOptions').on('click', () => {
    chrome.runtime.openOptionsPage();
})

const sitesRefresh = (): void => {
    chrome.storage.sync.get('mysites', async (data) => {
        if (data.mysites && data.mysites.length > 0) {
            const isGoolePage = await CommonHelper.isGooglePage();
            if (isGoolePage) {
                $('#addsite').hide();

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    let googleurl = new URL(tabs[0].url!);
                    let keyword = SearchHelper.getKeywordFromUrl(googleurl);
                    if (keyword) {
                        if (_searchCache[keyword] !== undefined)
                            showSites(keyword, tabs[0].id!);
                        else
                            getRank(googleurl, () => {
                                showSites(keyword as string, tabs[0].id!);
                            });
                    }
                });
            } else {
                $('#addsite').show();
                for (var i = 0; i < data.mysites.length; i++) {
                    let sitename = data.mysites[i];

                    $('#site-ranks').append(CommonHelper.createSiteElement(sitename));
                }
            }

        }
    });
}

sitesRefresh();

const showSites = (query: string, tabId: number): void => {
    if (query && query.length > 0) {
        if (_searchCache[query] != undefined) {
            chrome.storage.sync.get('mysites', (data) => {
                if (data.mysites && data.mysites.length > 0) {
                    let rankCounter = 0;
                    for (var i = 0; i < data.mysites.length; i++) {
                        let sitename = data.mysites[i];

                        var rankinfo = _searchCache[query].find((c: any) => { return c.domain.toLowerCase() == sitename.hostname.toLowerCase(); })
                        var rank = 0;
                        if (rankinfo) {
                            rankCounter++;
                            rank = rankinfo.rank;
                        }
                        $('#site-ranks').append(CommonHelper.createSiteElement(sitename, false, rank));

                    }
                    if (rankCounter > 0) {
                        chrome.action.setBadgeText({ text: rankCounter.toString(), tabId: tabId });
                    }
                }
            });
        }
    }
}

const getRank = (googleurl: URL, callback: any): void => {
    let keyword = SearchHelper.getKeywordFromUrl(googleurl);
    // Throw an error if the keyword is null or undefined
    if (!keyword) throw new Error('Keyword not found');
    googleurl.searchParams.set('num', '100');
    if (_searchCache[keyword] === undefined) {
        _searchCache[keyword] = [];
        httpGetAsync(googleurl.href, (res: any) => {
            let element = document.createElement('html');
            element.innerHTML = res;

            let resultItems = serpHelper.getResultItems(element);
            for (let i = 0; i < resultItems.length; i++) {
                let url = serpHelper.getLinkFromResultItem(resultItems[i]);
                let domain = CommonHelper.getDomainNameFromUrl(url);
                _searchCache[keyword as string].push({ domain, rank: i + 1 });
            }

            if (callback) {
                callback();
            }
        })
    }
}

const httpGetAsync = (theUrl: string, callback: any): void => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
