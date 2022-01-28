'use strict'

async function isGooglePage() {

    let url = await getCurrentUrl();
    console.log('url is ', url);
    if (url.href.toLowerCase().indexOf('google.com/search') > -1)
        return true;
    else
        return false;
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
}

async function getCurrentUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    console.log('The curent tab is:', tabs);
    return new URL(tabs[0].url);
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

function getDomainNameFromUrl(url) {
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
    var domain = u.hostname;
    if (domain.indexOf('www.') === 0)
        domain = domain.replace('www.', '');

    return domain;
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
