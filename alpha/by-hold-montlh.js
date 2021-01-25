let stocks;
const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
const fs = require('fs');
var request = require('axios');
const body = require('../tradingview/filter.json');
const utils = require('../utils/utils');
const cheerio = require('cheerio');

 getHistoryInfo = (stock, cache) => {
    const service = new Promise((resolve, reject) => {
        alpha.data.monthly_adjusted(stock, 'full')
        .then(data => {
            const days = Object.keys(data['Monthly Adjusted Time Series']);
            
            resolve(days.map(day => {
                return data['Monthly Adjusted Time Series'][day];ç
            }))
        }).catch(error => {
            reject(error);
        });
    });
    return service;
}

const analisyByHold = (close, stock) => {
    if  (   isMore(close, 0, close.length / 6) &&
            isMore(close, close.length / 6, close.length / 6 * 2 ) &&
            isMore(close, close.length / 6 * 2, close.length / 6 * 3 ) &&
            isMore(close, close.length / 6 * 3, close.length / 6 * 4 ) &&
            isMore(close, close.length / 6 * 4, close.length / 6 * 5 ) &&
            isMore(close, close.length / 6 * 5, close.length -1 ) 
        ){
            getDy(stock);
        }
}

const getDy = async (stock) => {
    try{
        const response = await request.get('https://statusinvest.com.br/acoes/' + stock.replace('.SAO', '').toLowerCase());
        const $ = cheerio.load(response.data);
        const dy = $('#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div:nth-child(4) > div > div:nth-child(1) > strong').text();

        utils.writeFile('By & hold -> ' + stock + ' Dy ' + dy);
    } catch (e){
        utils.writeFile('By & hold -> ' + stock);
    }
}

function isMore(close, i, j){
    return +close[i] > +close[j];
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
// setTimeout(() => {
// }, 60000 * 60 * 8);
tradingView();
