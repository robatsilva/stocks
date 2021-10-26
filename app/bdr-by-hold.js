let stocks;
const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
const fs = require('fs');
var request = require('axios');
const body = require('../tradingview/filter-bdr.json');
const utils = require('../utils/utils');

 getHistoryInfo = (stock, cache) => {
    const service = new Promise((resolve, reject) => {
        alpha.data.weekly_adjusted(stock, 'full')
        .then(data => {
            const days = Object.keys(data['Weekly Adjusted Time Series']);
            
            resolve(days.map(day => {
                return data['Weekly Adjusted Time Series'][day];
            }))
        }).catch(error => {
            reject(error);
        });
    });
    return service;
}

const analisyByHold = (close, stock) => {
    if  (   isMore(close, 0, close.length / 2) &&
            isMore(close, close.length / 2, close.length -1) 
        ){
        utils.writeFile('By & hold -> ' + stock);
    }
}

function isMore(close, i, j){
    return +close[i] > +close[j] ||
        +close[j] > +close[i] * 1.5;
}

const main2 = () => {
    if(i >= stocks.length) return;
    utils.sleep(11000);
    const stock = stocks[i];
    utils.writeFile('\r\nexecutando ' + stock + ' ' + new Date().toLocaleString());
    getHistoryInfo(stock)
        .then(historyData => {
            utils.writeStock(stock, historyData);
            const close = historyData.map(h => h['5. adjusted close']);
            analisyByHold(close, stock)
            i++;
            main2();
        })
        .catch(error => {
            utils.writeFile(error);
            i++;
            main2();
        });

}
//=======================================

const tradingView = () => {
    request.post(
        'https://scanner.tradingview.com/brazil/scan',
        body).then(
        function (response) {
            stocks = response.data.data.map(stock => stock.d[1] + '.SAO').filter(stock => stock.indexOf('F.SAO') === -1);
            main2();
            utils.writeFile(stocks.length);
        }
    );
}

let i = 0;
tradingView();
