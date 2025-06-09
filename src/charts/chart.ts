import "./chart.scss"
import Chart from 'chart.js/auto';
import { RankStorageModel } from "../shared/models/rank-storage";
let rankChartInstance: Chart | null = null;

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get("hostname", function (result) {
        if (result.hostname) {
            setupChartView(result.hostname);
            chrome.storage.local.remove("hostname");
        } else {
            throw Error("no host name found in storage");
        }
    })
})

$('#siteSelector').on('change', function () {
    const keywordSelector = document.getElementById('keywordSelector') as HTMLSelectElement | null;
    if (!keywordSelector) return;
    const hostname = String($(this).val() || '');
    chrome.storage.sync.get("myranks", data => {
        const mySites: RankStorageModel[] = data.myranks || [];
        const targetSite = mySites.find(site => site.hostname.toLowerCase() === hostname.toLowerCase());
        if (targetSite) {
            $('#keywordSelector').find('option').remove();
            if (targetSite.keywords) {
                for (var i = 0; i < targetSite.keywords.length; i++) {
                    let option = document.createElement('option');
                    if (i === 0)
                        option.selected = true;
                    option.value = targetSite.keywords[i].keyword;
                    option.textContent = targetSite.keywords[i].keyword;
                    keywordSelector.appendChild(option);
                }
            }
            drawChart(targetSite.keywords[0].rankHistory,targetSite.keywords[0].keyword,targetSite.hostname);
        }
    })
});
//With any change in the keywordSelector the chart will refresh
$('#keywordSelector').on('change', function () {
    const selectKwString = String($(this).val() || '');
    const selectSite = String($('#siteSelector').val() || '');
    if (selectKwString.length >= 1) {
        chrome.storage.sync.get("myranks", data => {
            const mysites: RankStorageModel[] = data.myranks || [];
            const targetSite = mysites.find((site) => site.hostname.toLowerCase() === selectSite.toLowerCase());
            const targetKw = targetSite?.keywords.find((kw) => kw.keyword === selectKwString);
            if (targetKw)
                drawChart(targetKw.rankHistory, targetKw?.keyword, selectSite);
        })
    }
})
//Initialize site and keyword selectors, retrieves stored ranking data, and updates the dropdown
function setupChartView(hostname: string) {
    const siteSelector = document.getElementById('siteSelector') as HTMLSelectElement | null;
    const keywordSelector = document.getElementById('keywordSelector') as HTMLSelectElement | null;
    if (!siteSelector || !keywordSelector) return;
    chrome.storage.sync.get("myranks", data => {
        const myranks: RankStorageModel[] = data.myranks || [];
        if (myranks.length > 0) {
            myranks.forEach((rank) => {
                let option = document.createElement('option');
                if (hostname.toLowerCase() === rank.hostname.toLowerCase()) {
                    option.selected = true;
                }
                option.value = rank.hostname;
                option.textContent = rank.hostname;
                siteSelector.appendChild(option);
            })
            const targetSite = myranks.find((site) => site.hostname.toLowerCase() === hostname.toLowerCase());
            if (!targetSite || targetSite.keywords.length === 0) {
                alert("Oops! Nothing to show yet. Try searching a few keywords to see who's ruling Google! 🚀");
                return;
            } else {
                for (var i = 0; i < targetSite.keywords.length; i++) {
                    let option = document.createElement('option');
                    if (i === 0)
                        option.selected = true;
                    option.value = targetSite.keywords[i].keyword;
                    option.textContent = targetSite.keywords[i].keyword;
                    keywordSelector.appendChild(option);
                }
                drawChart(targetSite.keywords[0].rankHistory, targetSite.keywords[0].keyword, targetSite.hostname);
            }
        } else {
            alert("Oops! Nothing to show yet. Try searching a few keywords to see who`s ruling Google! 🚀");
            return;
        }
    })
}
//Renders a ranking history chart for a keyword associated with a hostname
function drawChart(
    rankHistory: { date: string; rank: number }[],
    keyword: string,
    hostname: string) {
    const ctx = document.getElementById('rankChart') as HTMLCanvasElement;

    if (rankChartInstance) {
        rankChartInstance.destroy();
    }

    const labels = rankHistory.map(item => item.date);
    const data = rankHistory.map(item => item.rank);

    rankChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${hostname} - ${keyword}`,
                data: data,
                borderColor: '#C34D49',
                tension: 0.3,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    reverse: true,
                    title: {
                        display: true,
                        text: 'Rank'
                    }, ticks: {
                        stepSize: 1,
                        precision: 0

                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}