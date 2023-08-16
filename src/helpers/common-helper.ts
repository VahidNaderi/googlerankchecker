export class CommonHelper {
    public static async isGooglePage() {
        let url = await this.getCurrentUrl();
        console.log('url is ', url);
        // Return true if url exists and contains 'google.com/search'
        return url && url.href.toLowerCase().includes('google.com/search');
    }

    public static async getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        return tabs[0];
    }

    public static async getCurrentUrl() {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        console.log('The curent tab is:', tabs);
        // Return null if tabs is empty or tabs[0].url is falsy
        if (!tabs.length || !tabs[0].url) return null;
        return new URL(tabs[0].url);
    }
    
    public static createUrlObject(url: string) {
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
    
    public static getDomainNameFromUrl(url: string) {
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
    
    public static createSiteElement(urlModel: URL, addDeleteButton?: boolean, rank?: number) {
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
    
}