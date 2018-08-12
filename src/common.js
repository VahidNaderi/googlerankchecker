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

function createUrlObject(url) {
    let u = null;
    try {
        u = new URL(url);
    }
    catch (error) {
        url = url.split(' ')[0];
        if (!(url.startsWith('http://') || url.startsWith('https://')))
            u = new URL('http://' + url);
        else
            u = new URL(url);
    }
    // var domain = u.hostname;
    // if (domain.indexOf('www.') === 0)
    //     domain = domain.replace('www.', '');

    return u;
}

function createSiteElement(urlModel, addDeleteButton, rank) {
    var $element = $('<li><img src="' +
        urlModel.origin +
        '/favicon.ico" class="favicon"/><span class="site-name">' +
        urlModel.hostname +
        '</span></li>');
    if (addDeleteButton) {
        $element.wrapInner('<a href="" target="_blank"></a>');
        $element.prepend('<span class="btn-delete" data-hostname="' +
            urlModel.hostname +
            '">X</span>');
    }
    if (rank) {
        $element.append('<span class="rank-badge">' + rank + '</span>');
    }

    return $element;
}
