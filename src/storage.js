'use strict'
function Storage() { };
Storage.prototype.addSite = function (urlString) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get('mysites', function (data) {
            let url = createUrlObject(urlString);
            if (!data.mysites) {
                data.mysites = [];
            }
            var foundUrl = data.mysites.find(u => u.hostname == url.hostname);
            if (!foundUrl) {
                var item = { hostname: url.hostname, origin: url.origin };
                data.mysites.push(item);
                resolve({ added: true, item: item });
            }
            chrome.storage.sync.set({ 'mysites': data.mysites });
        })
    })
}

Storage.prototype.removeSite = function (urlString) {
    chrome.storage.sync.get('mysites', function (data) {
        let url = createUrlObject(urlString);
        var foundUrl = data.mysites.find(u => u.hostname == url.hostname);
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