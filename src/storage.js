'use strict'
function Storage() { };
Storage.prototype.addSite = function (urlString) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get('mysites', function (data) {
            let url = createUrlObject(urlString);
            let domain = getDomainNameFromUrl(urlString);
            if (!data.mysites) {
                data.mysites = [];
            }
            var foundUrl = data.mysites.find(u => u.hostname == domain);
            if (!foundUrl) {
                var item = { hostname: domain, origin: url.origin };
                data.mysites.push(item);
                resolve({ added: true, item: item });
            }
            chrome.storage.sync.set({ 'mysites': data.mysites });
        })
    })
}

Storage.prototype.removeSite = function (name) {
    chrome.storage.sync.get('mysites', function (data) {
        //let domain = getDomainNameFromUrl(urlString);
        var foundUrl = data.mysites.find(u => u.hostname == name);
        if (foundUrl) {
            var index = data.mysites.indexOf(foundUrl);
            data.mysites.splice(index, 1);

        }
        chrome.storage.sync.set({ 'mysites': data.mysites });
    })
}

Storage.prototype.getSites = function () {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get('mysites', data => resolve(data.mysites));
    })
}