'use strict';

var _storage = new Storage();

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.status == 'complete') {
    isGooglePage().then(function (yes) {
      if (yes) {
        getCurrentUrl().then(url => {
          renewRanks(url).then(res => {
            _storage.getSites().then(sites => {
              let counter = 0;
              for (var i = 0; i < sites.length; i++) {
                var rankinfo = res.find(function (c) { return c.domain.toLowerCase() == sites[i].hostname.toLowerCase(); });
                if (rankinfo) {
                  counter++;
                }
              }
              chrome.browserAction.setBadgeText({ text: counter.toString(), tabId: tabId });

            })
          })
        }).catch(e => {
          console.log(e);
        })
      }
    })
  }
});