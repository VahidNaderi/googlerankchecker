chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.sitesWithRanksCount)
            chrome.action.setBadgeText({ text: request.sitesWithRanksCount.toString(), tabId: sender.tab?.id });
    }
);