let sitesDiv = document.getElementById('site-ranks');
let addSiteBtn = document.getElementById('addsite');

var _searchCache = [];

addSiteBtn.onclick = function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = new URL(tabs[0].url);
        addSite(url);
    });
}

chrome.storage.sync.get('mysites', function (data) {
    if (data.mysites && data.mysites.length > 0) {
        if (isGooglePage()) {
            addSiteBtn.style.display = 'none';
        } else {
            addSiteBtn.style.display = 'block';
        }

        if (isGooglePage()) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let googleurl = new URL(tabs[0].url);
                let keyword = getKeywordFromUrl(googleurl);
                if (_searchCache[keyword] !== undefined)
                    showSites(keyword);
                else
                    getRank(googleurl, function () {
                        showSites(keyword);
                    });
            });
        }
    }
});

function showSites(query) {
    if (query && query.length > 0) {
        if (_searchCache[query] != undefined) {
            chrome.storage.sync.get('mysites', function (data) {
                if (data.mysites && data.mysites.length > 0) {
                    let rankCounter = 0;
                    for (var i = 0; i < data.mysites.length; i++) {
                        let sitename = data.mysites[i];
                        var element = document.createElement('p');
                        element.innerText = sitename + " delete";
                        var rankinfo = _searchCache[query].find(function (c) { return c.domain.toLowerCase() == sitename.toLowerCase(); })
                        if (rankinfo) {
                            element.innerText = element.innerText + 'rank: ' + rankinfo.rank;
                            rankCounter++;
                        }
                        sitesDiv.appendChild(element);

                    }
                    if (rankCounter > 0) {
                        chrome.browserAction.setBadgeText({ text: rankCounter.toString() });
                    }
                }
            });
        }
    }
}

function addSite(url) {
    chrome.storage.sync.get('mysites', function (data) {
        let domainname = getDomainNameFromUrl(url);
        if (!data.mysites) {
            data.mysites = [domainname];
        } else {
            if (data.mysites.indexOf(domainname) === -1)
                data.mysites.push(domainname);
        }
        chrome.storage.sync.set({ 'mysites': data.mysites });
    })
}

function removeSite(url) {
    let domainname = getDomainNameFromUrl(url);
    if (data.mysites.indexOf(domainname) !== -1)
        data.mysites.pop(domainname);
}

function getRank(googleurl, callback) {
    let keyword = getKeywordFromUrl(googleurl);
    googleurl.searchParams.set('num', 100);
    if (_searchCache[keyword] === undefined) {
        _searchCache[keyword] = [];
        httpGetAsync(googleurl.href, function (res) {
            var el = document.createElement('html');
            el.innerHTML = res;
            var links = el.getElementsByTagName('cite');
            for (var i = 0; i < links.length; i++) {
                var el = links[i];
                var u = getDomainNameFromUrl(el.innerText);
                _searchCache[keyword].push({ domain: u, rank: i + 1 });
            }

            if (callback) {
                callback();
            }
        })
    }
}

function getKeywordFromUrl(url) {
    if (url.searchParams.has('q')) {
        let keyword = url.searchParams.get('q');
        return keyword;
    }
}

function isGooglePage() {
    return true;
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getDomainNameFromUrl(url) {
    let u = null;
    try {
        u = new URL(url);
    }
    catch (error) {
        url = url.split(' ')[0];
        if (!(url.startsWith('http://') || url.startsWith('https://')))
            u = new URL('http://' + url);
    }
    var domain = u.hostname;
    if (domain.indexOf('www.') === 0)
        domain = domain.replace('www.', '');

    return domain;
}