import { SiteStorageModel } from "../models/site-storage";

const googleSearchPageRegex = new RegExp("google\..*/search");

export class CommonHelper {
    public static async isGooglePage(): Promise<boolean | null> {
        let url = await this.getCurrentUrl();
        // Return true if url exists and contains google search pages like 'google.com/search' or 'google.co.uk/search'
        return url && googleSearchPageRegex.test(url.href.toLowerCase());
    }

    public static async getCurrentTab(): Promise<chrome.tabs.Tab> {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        return tabs[0];
    }

    public static async getCurrentUrl(): Promise<URL | null> {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        // Return null if tabs is empty or tabs[0].url is falsy
        if (!tabs.length || !tabs[0].url) return null;
        return new URL(tabs[0].url);
    }

    public static createUrlObject(url: string): URL {
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

    public static getDomainNameFromUrl(url: string): string {
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

    public static createSiteElement(urlModel: SiteStorageModel, addDeleteButton?: boolean, rank?: number): JQuery<HTMLElement> {
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