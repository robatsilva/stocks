let stocks;
const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
var request = require('axios');
const body = require('../tradingview/filter.json');
const bodyLow = require('../tradingview/filter-low.json');
const utils = require('../utils/utils')

var ema = require('exponential-moving-average');

const getAverage = (stock, period) => {
    utils.writeFile('executando media' + period);
    const service = new Promise((resolve, reject) => {
        alpha.technical.ema(stock, `daily`, period, `close`)
        .then(data => {
            const index = Object.keys(data['Technical Analysis: EMA'])[0];
            const ema = data['Technical Analysis: EMA'][index].EMA;
            resolve(ema);
        }).catch(error => {
            reject(error);
        });
    });
    utils.sleep(12000);
    return service;
}

const getInfo = (stock) => {
    utils.writeFile('Pegando informações');
    const service = new Promise((resolve, reject) => {
        alpha.data.quote(stock)
        .then(data => {
            utils.writeFile(data);
            const volume = data['Global Quote']['05. volume'];
            resolve(volume);
        }).catch(error => {
            reject(error);
        });
    });
    utils.sleep(12000);
    return service;
}

 getHistoryInfo = (stock, cache) => {
    const service = new Promise((resolve, reject) => {
        alpha.data.daily_adjusted(stock, 'full')
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


const getSymbol = () => {
    const stock = stocks[i];
    utils.writeFile('getting ' + stock);
    alpha.data.search(stock).then(data => utils.writeFile(data)).catch(error => utils.writeFile(error));   
    i++;
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
        utils.writeAnalisyHight('analisy high -> ' + stock);

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
        utils.writeAnalisyLow('analisy low -> ' + stock);

    }
}

// const analisy1 = (close, volume, historyData, stock) => {
//     const ema20 = ema(close, 20);
//     const ema50 = ema(close, 50);
//     const ema200 = ema(close, 200);
    
//     const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;
    
//     if(+ema20[0] >= +ema50[0] 
//         && +ema50[0] >= +ema200[0] 
//         && +volume20 >= 100000 
//         && +close[0] >= +historyData[0]['1. open']
//         && +close[0] >= +historyData[1]['2. high']
//         && +close[1] <= +historyData[1]['1. open']){
//         utils.writeFile('analisy 1 -> ' + stock);

//     }
// }

// const analisy3 = (close, volume, stock) => {
//     const ema20 = ema(close, 20);
//     const ema50 = ema(close, 50);
//     const ema200 = ema(close, 200);
    
//     const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;
    
//     if(+ema20[0] >= +ema50[0] 
//         && +ema50[0] >= +ema200[0] 
//         && +volume20 >= 100000){
//         utils.writeFile('analisy 3 -> ' + stock);

//     }
// }

// const analisy2 = (close, volume, stock) => {
//     const ema20 = ema(close, 20);
//     const ema50 = ema(close, 50);
//     const ema200 = ema(close, 200);
    
//     const volume20 = volume.slice(0, 19).reduce((a, b) => +a + +b, 0) / 20;
    
//     if(+ema20[0] >= +ema50[0] 
//         && +ema50[0] >= +ema200[0] 
//         && +volume20 >= 100000
//         && +ema20[0] >= +ema20[1]
//         && +ema50[0] >= +ema50[1]
//         && +ema200[0] >= +ema200[1]){
//         utils.writeFile('analisy 2 -> ' + stock);

//     }
// }

const main = () => {
    const stock = stocks[i].bestMatches[0]['1. symbol'];
    utils.writeFile('\r\nexecutando ' + stock);
    getInfo(stock)
    .then(volume => (volume > 100000 ? getAverage(stock, 20) : Promise.reject('volume abaixo de 100 mil'))
    .then(av20 => getAverage(stock, 50)
    .then(av50 => (av20 > av50 ? getAverage(stock, 200) : Promise.reject('média 200 não executada'))
    .then(av200 => {
        if(av20 > av50 && +av50 > av200){
            utils.writeFile('Papel com petencial ====================================> ;) ' + stock);
        } else {
            utils.writeFile('Papel sem potencial :(')
        }
        i++;
        main();
    }))))
    .catch(error => {
        utils.writeFile(error);
        i++;
        main();
    });

}

const main2 = () => {
    if(i >= stocks.length) {
        utils.gitPush();
        return;
    }

    utils.sleep(15000);
    // const stock = stocks[i].bestMatches[0]['1. symbol'];
    // const stock = 'WEGE3.SAO';
    const stock = stocks[i];
    utils.writeFile('\r\nexecutando ' + stock.name + ' ' + new Date().toLocaleString());
    getHistoryInfo(stock.name)
        .then(historyData => {
            utils.writeStock(stock.name, historyData);
            const close = historyData.map(h => h['5. adjusted close']); 
            if(stock.type === 'hight'){
                analisyHight(close, historyData, stock.name);
            } else if (stock.type === 'low'){
                analisyLow(close, historyData, stock.name);
            }
            i++;
            main2();
        })
        .catch(error => {
            utils.writeFile(error);
            i++;
            main2();
        });

}

function EMACalc(mArray,mRange) {
    var k = 2/(mRange + 1);
    // first item is just the same as the first item in the input
    emaArray = [mArray[0]];
    // for the rest of the items, they are computed with the previous one
    for (var i = 1; i < mArray.length; i++) {
        emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
}

var getEMA = (a,r) => a.reduce((p,n,i) => i ? p.concat(2*n/(r+1) + p[p.length-1]*(r-1)/(r+1)) : p, [a[0]]);

//=======================================
//https://www.tradingview.com/screener/
const tradingView = () => {
    request.post(
        'https://scanner.tradingview.com/brazil/scan',
        body).then(
        function (response) {
            stocks = response.data.data.map(stock => ({name: stock.d[1] + '.SAO', type: 'hight'})).filter(stock => stock.name.indexOf('F.SAO') === -1);
            request.post(
                'https://scanner.tradingview.com/brazil/scan',
                bodyLow).then(
                function (response) {
                    stocks = [...stocks, ...response.data.data.map(stock => ({name: stock.d[1] + '.SAO', type: 'low'})).filter(stock => stock.name.indexOf('F.SAO') === -1)];
                    utils.writeFile(stocks.length)
                    main2();
                }
            );
        }
    );
}

const isNewMax = (close, historyData) => {
    if(+close[0] >= +historyData[0]['1. open']
        && +close[0] >= +historyData[1]['2. high']
        && +close[1] <= +historyData[1]['1. open']){
        utils.writeFile('analisy 1 -> ' + stock);
    }
}


let i = 0;
// getSymbol();
// setInterval(() => {
//     getSymbol();
// }, 15000);
// main2();
// console.log('agendando 7 horas');
// setTimeout(() => {
    // }, 60000 * 60 * 7);
module.exports = {
    init: () => {
        init();
    }
}
const init = ()=>{
    utils.clearFile();
    utils.clearAnalisy();
    utils.writeAnalisyHight(new Date().toDateString());
    utils.writeAnalisyLow(new Date().toDateString());
    
    tradingView();
}

// init();
