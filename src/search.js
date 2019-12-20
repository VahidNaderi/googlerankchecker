'use strict';

var _storage = new Storage();
var _searchCache = [];

function refresh() {
    storage.getSites().then(sites => {
        if (sites && sites.length > 0) {
            isGooglePage().then(isGoogle => {
                if (isGoogle) {
                    getCurrentTab().then(tab => {
                        let googleurl = new URL(tab.url);
                        let keyword = getKeywordFromUrl(googleurl);
                        if (_searchCache[keyword] == undefined)
                            renewRanks(googleurl)
                    })
                }
            })
        }
    })
}

function renewRanks(googleurl) {
    return new Promise((resolve, reject) => {
        let keyword = getKeywordFromUrl(googleurl);
        googleurl.searchParams.set('num', 100);
        if (_searchCache[keyword] == undefined) {
            _searchCache[keyword] = [];
            httpGetAsync2(googleurl.href).then(res => {
                parseGoogleResultAndUpdate(res, keyword);
                resolve(_searchCache[keyword]);
            })
        }
        else resolve(_searchCache[keyword]);
    })
}

function parseGoogleResultAndUpdate(googleResultPage, keyword) {
    let page = document.createElement('html');
    page.innerHTML = googleResultPage;
    let links = page.getElementsByTagName('cite');
    for (let i = 0; i < links.length; i++) {
        let el = links[i];
        let u = getDomainNameFromUrl(el.innerText);
        _searchCache[keyword].push({ domain: u, rank: i + 1 });
    }
}

function getKeywordFromUrl(url) {
    if (url.searchParams.has('q')) {
        let keyword = url.searchParams.get('q');
        return keyword;
    }
}

function httpGetAsync2(theUrl) {
    return new Promise(function (resolve, reject) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                resolve(xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    });

}