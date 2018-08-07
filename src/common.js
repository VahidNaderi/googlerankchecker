'use strict'
function isGooglePage() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let url = new URL(tabs[0].url);
            if (url.href.toLowerCase().indexOf('google.com/search') > -1)
                resolve(true);
            else
                resolve(false);

        })
    })
}