
let stocks = require('./stocksObj.json');
const stocksCache = require('./stocksComplete.json');
const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
const utils = require('../utils/utils');

var ema = require('exponential-moving-average');
module.exports = {
    getHistoryInfo: (stock, cache) => {
       const service = new Promise((resolve, reject) => {
           if(cache){
               const path = require('path');
               const url = path.resolve(__dirname, `./stocks/${stock}.json`);   
               console.log(url);
               const data = require(url);
               
               resolve(data);
               return;
           }
           alpha.data.daily(stock, 'full')
           .then(data => {
               const days = Object.keys(data['Time Series (Daily)']);
               
               resolve(days.map(day => {
                   return data['Time Series (Daily)'][day];
               }))
           }).catch(error => {
               reject(error);
           });
       });
       return service;
   }
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
        utils.writeFile('analisy high -> ' + stock);

    }
}

const analisyLow = (close, historyData, stock) => {
    
    if(+close[0] < +historyData[0]['1. open']
        && +close[0] < +historyData[1]['3. low']
        && +close[0] < +historyData[2]['3. low']
        && +close[0] < +historyData[3]['3. low']
        && +close[0] < +historyData[4]['3. low']
        && +close[0] < +historyData[5]['3. low']
        && +close[0] < +historyData[6]['3. low']
        && +close[1] > +historyData[1]['1. open']){
        utils.writeFile('analisy low -> ' + stock);

    }
}

const analisyByHold = (close, volume, stock) => {
    const step = Math.floor(close.length/10);
    const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;

    if( +volume20 >= 100000 &&
        isMore(close, 0, step) &&
        isMore(close, step, step * 2) &&
        isMore(close, step * 2, step * 3) &&
        isMore(close, step * 3, step * 4) &&
        isMore(close, step * 4, step * 5) &&
        isMore(close, step * 5, step * 6) &&
        isMore(close, step * 6, step * 7) &&
        isMore(close, step * 7, step * 8) &&
        isMore(close, step * 8, step * 9) &&
        isMore(close, step * 9, close.length - 1) ){
        utils.writeFile('By & hold -> ' + stock);
    }
}

function isMore(close, i, j){
    return +close[i] > +close[j] ||
        +close[j] > +close[i] * 1.5;
}
const analisy1 = (close, volume, historyData, stock) => {
    const ema20 = ema(close, 20);
    const ema50 = ema(close, 50);
    const ema200 = ema(close, 200);
    
    const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;
    
    if(+ema20[0] >= +ema50[0] 
        && +ema50[0] >= +ema200[0] 
        && +volume20 >= 100000 
        && +close[0] >= +historyData[0]['1. open']
        && +close[0] >= +historyData[1]['2. high']
        && +close[1] <= +historyData[1]['1. open']){
        utils.writeFile('analisy 1 -> ' + stock);

    }
}

const analisy3 = (close, volume, stock) => {
    const ema20 = ema(close, 20);
    const ema50 = ema(close, 50);
    const ema200 = ema(close, 200);
    
    const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;
    
    if(+ema20[0] >= +ema50[0] 
        && +ema50[0] >= +ema200[0] 
        && +volume20 >= 100000){
        utils.writeFile('analisy 3 -> ' + stock);

    }
}

const analisy2 = (close, volume, stock) => {
    const ema20 = ema(close, 20);
    const ema50 = ema(close, 50);
    const ema200 = ema(close, 200);
    
    const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;
    
    if(+ema20[0] >= +ema50[0] 
        && +ema50[0] >= +ema200[0] 
        && +volume20 >= 100000
        && +ema20[0] >= +ema20[1]
        && +ema50[0] >= +ema50[1]
        && +ema200[0] >= +ema200[1]){
        utils.writeFile('analisy 2 -> ' + stock);

    }
}

const main2 = () => {
    if(i >= stocks.length) return;
    utils.sleep(11000);
    // const stock = stocks[i].bestMatches[0]['1. symbol'];
    // const stock = 'WEGE3.SAO';
    const stock = stocks[i];
    utils.writeFile('\r\nexecutando ' + stock + ' ' + new Date().toLocaleString());
    getHistoryInfo(stock)
        .then(historyData => {
            utils.writeStock(stock, historyData);
            const close = historyData.map(h => h['5. adjusted close']);
            const volume = historyData.map(h => h['6. volume']);
            analisyByHold(close, volume, stock);
            analisyHight(close, historyData, stock);
            analisyLow(close, historyData, stock);
            i++;
            main2();
        })
        .catch(error => {
            utils.writeFile(error);
            i++;
            main2();
        });

}

let i = 0;
main2();

