let sitesDiv = document.getElementById('mysites');

chrome.storage.sync.get('mysites', function (data) {
    if (data.mysites && data.mysites.length > 0) {

        var addRank = isGooglePage();

        for (var i = 0; i < data.mysites.length; i++) {
            let sitename = data.mysites[i];
            var element = document.createElement('p');
            element.innerText = sitename + " delete";
            if (addRank) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    let url = new URL(tabs[0].url);
                    
                    element.innerText = element.innerText + 'rank:' + getRank(sitename);
                    sitesDiv.appendChild(element);
                });
            }else{
                sitesDiv.appendChild(element);
            }
        }
    }
});

function getRank(sitename, keyword) {
    return Math.floor(Math.random() * 100);
}

function getKeywordFromUrl() {

}

function isGooglePage() {
    return false;
}