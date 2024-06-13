chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.sitesWithRanksCount)
            chrome.action.setBadgeText({ text: request.sitesWithRanksCount.toString(), tabId: sender.tab?.id });

        // Just return true to avoid an error appear in console saying:
        // Unchecked runtime.lastError: The message port closed before a response was received.
        // https://stackoverflow.com/a/59915897/1306720
        return true;
    }
);