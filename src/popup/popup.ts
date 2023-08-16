import "./popup.scss";
import { StorageHelper } from "../helpers/storage-helper"
import { CommonHelper } from "../helpers/common-helper";
import { SearchHelper } from "../helpers/search-helper";

var _searchCache: { [key: string]: any } = {};

$('#addsite').click(() => {
    console.log('addsite');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].url) {
            StorageHelper.addSite(tabs[0].url).then((res: any) => {
                if (res && res.added)
                    $('#site-ranks').append(CommonHelper.createSiteElement(res.item));
            });
        }
    });
})

$('#refreshbtn').click(SearchHelper.refresh);

$('#btnOptions').click(() => {
    chrome.runtime.openOptionsPage();
})

sitesRefresh();

function sitesRefresh() {
    chrome.storage.sync.get('mysites', (data) => {
        if (data.mysites && data.mysites.length > 0) {
            CommonHelper.isGooglePage().then(val => {
                if (val) {
                    $('#addsite').hide();

                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        ///////// CHECK /////////
                        let googleurl = new URL(tabs[0].url!);
                        let keyword = SearchHelper.getKeywordFromUrl(googleurl);
                        if (keyword) {
                            if (_searchCache[keyword] !== undefined)
                                showSites(keyword, tabs[0].id!);
                            else
                                getRank(googleurl, function () {
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
            })
        }
    });
}

function showSites(query: string, tabId: number) {
    if (query && query.length > 0) {
        if (_searchCache[query] != undefined) {
            chrome.storage.sync.get('mysites', function (data) {
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

function getRank(googleurl: URL, callback: any) {
    let keyword = SearchHelper.getKeywordFromUrl(googleurl);
    // Throw an error if the keyword is null or undefined
    if (!keyword) throw new Error('Keyword not found');
    googleurl.searchParams.set('num', '100');
    if (_searchCache[keyword] === undefined) {
        _searchCache[keyword] = [];
        httpGetAsync(googleurl.href, (res: any) => {
            var element = document.createElement('html');
            element.innerHTML = res;
            var links = element.getElementsByTagName('cite');
            for (var i = 0; i < links.length; i++) {
                var el = links[i];
                var u = CommonHelper.getDomainNameFromUrl(el.innerText);
                _searchCache[keyword as string].push({ domain: u, rank: i + 1 });
            }

            if (callback) {
                callback();
            }
        })
    }
}

function httpGetAsync(theUrl: string, callback: any) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
