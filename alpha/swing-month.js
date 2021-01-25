let stocks;
const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
var request = require('axios');
const body = require('../tradingview/filter.json');
const utils = require('../utils/utils');

 getHistoryInfo = (stock, cache) => {
    const service = new Promise((resolve, reject) => {
        alpha.data.monthly(stock, 'full')
        .then(data => {
            const days = Object.keys(data['Monthly Adjusted Time Series']);
            
            resolve(days.map(day => {
                return data['Monthly Adjusted Time Series'][day];
            }))
        }).catch(error => {
            reject(error);
        });
    });
    return service;
}

const analisyHight = (close, historyData, stock) => {
    
    if(+close[0] > +historyData[0]['1. open']
        && +close[0] > +historyData[1]['2. high']
        && +close[0] > +historyData[2]['2. high']
        && +close[0] > +historyData[3]['2. high']
        && +close[0] > +historyData[4]['2. high']
        && +close[0] > +historyData[5]['2. high']
        && +close[0] > +historyData[6]['2. high']
        && +close[1] < +historyData[1]['1. open']){
        utils.writeFile('analisy high month -> ' + stock);

    }
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
            analisyHight(close, historyData, stock);
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
