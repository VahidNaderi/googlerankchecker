chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.sitesWithRanksCount)
            chrome.action.setBadgeText({ text: request.sitesWithRanksCount.toString(), tabId: sender.tab?.id });
    }
);