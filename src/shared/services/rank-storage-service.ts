import { AddRankResponseModel } from "../models/add-rank-response";
import { RankStorageModel } from "../models/rank-storage";
import { SiteStorageModel } from "../models/site-storage";
import { SerpHelper } from "../helpers/serp-helper";
import { CommonHelper } from "../helpers/common-helper";

export class RankStorageService {
    private serpHelper = new SerpHelper();
    constructor() { };
    public addRank(rankStorageList: RankStorageModel[]): Promise<AddRankResponseModel[]> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('myranks', (data) => {
                const updatedRanks = [...(data.myranks || [])];

                let addedResult: AddRankResponseModel[] = [];

                rankStorageList.forEach(newRank => {
                    const site = this.findOrCreateRankHistory(updatedRanks, newRank.hostname);
                    const result = this.addRankToKeyword(site, newRank)
                    addedResult.push(result);
                });
                chrome.storage.sync.set({ 'myranks': updatedRanks }, () => {
                    resolve(addedResult);
                });
            });
        });
    }
    //find an existing site in the ranks list by the hostname.
    //or create a new one with an empty keyword list if it doesn't exist.
    private findOrCreateRankHistory(updatedRanks: RankStorageModel[], hostname: string): RankStorageModel {
        let targetSite: RankStorageModel | undefined = updatedRanks.find(item => item.hostname.toLowerCase() === hostname.toLowerCase());
        if (!targetSite) {
            targetSite = { hostname, keywords: [] };
            updatedRanks.push(targetSite);
        }
        return targetSite;
    }
    // If the keyword doesn't exist it creates it and adds the new rank.
    // If the keyword exists it checks whether today's rank already exists to decide whether to add a new one.
    private addRankToKeyword(site: RankStorageModel, saveAbleRank: RankStorageModel): AddRankResponseModel {
        var today = new Date().toISOString().split('T')[0];
        var targetWithKeyword = site.keywords.find(kw => kw.keyword === saveAbleRank.keywords[0].keyword);
        if (targetWithKeyword) {
            var todayRank = targetWithKeyword.rankHistory.find(rankHistory => rankHistory.date === today);

            if (!todayRank) {
                targetWithKeyword.rankHistory.push({ date: today, rank: saveAbleRank.keywords[0].rankHistory[0].rank });
                return ({ added: true, item: { hostname: saveAbleRank.hostname, keywords: [targetWithKeyword] } });
            } else {
                return ({ added: false, item: { hostname: saveAbleRank.hostname, keywords: [targetWithKeyword] } });
            }
        } else {
            site.keywords.push({
                keyword: saveAbleRank.keywords[0].keyword,
                rankHistory: [...saveAbleRank.keywords[0].rankHistory]
            });
            return ({ added: true, item: { hostname: saveAbleRank.hostname, keywords: [{ keyword: saveAbleRank.keywords[0].keyword, rankHistory: saveAbleRank.keywords[0].rankHistory }] } });
        }
    }
    public removeRanks(name: string): void {
        chrome.storage.sync.get('myranks', (data) => {
            const mySites: RankStorageModel[] = data.myranks || [];

            var targetSite = mySites.find(site => site.hostname === name);
            if (targetSite) {
                var index = data.myranks.indexOf(targetSite);
                data.myranks.splice(index, 1);
            }
            chrome.storage.sync.set({ 'myranks': data.myranks });
        })
    }
    public findRanks(resultItems: Element[], keyword: any): Promise<RankStorageModel[]> {
        return new Promise((resolve, reject) => {
            var rankStorageList: RankStorageModel[] = [];
            chrome.storage.sync.get('mysites', (data) => {
                if (data.mysites && data.mysites.length > 0) {
                    const mysites: SiteStorageModel[] = data.mysites;
                    const today = new Date().toISOString().split("T")[0];
                    // return if the keyword is null or undefined
                    if (!keyword)
                        return;
                    for (let i = 0; i < resultItems.length; i++) {
                        let url = this.serpHelper.getLinkFromResultItem(resultItems[i]);
                        let domain = CommonHelper.getDomainNameFromUrl(url);
                        const targetSite = mysites.find(site => site.hostname.toLowerCase() === domain.toLowerCase())
                        if (targetSite) {
                            if (!rankStorageList.find(item => item.hostname.toLowerCase() === targetSite.hostname.toLowerCase())) {
                                rankStorageList.push({ hostname: domain, keywords: [{ keyword: keyword, rankHistory: [{ date: today, rank: i + 1 }] }] })
                            }
                        }
                    }
                }
            })
            resolve(rankStorageList);
        })
    }
}