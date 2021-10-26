let stocks;
const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
const fs = require('fs');
var request = require('axios');
const body = require('../tradingview/filter-bdr.json');

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

const analisyHight = (close, historyData, stock) => {
    
    if(+close[0] > +historyData[0]['1. open']
        && +close[0] > +historyData[1]['2. high']
        && +close[0] > +historyData[2]['2. high']
        && +close[0] > +historyData[3]['2. high']
        && +close[0] > +historyData[4]['2. high']
        && +close[0] > +historyData[5]['2. high']
        && +close[0] > +historyData[6]['2. high']
        && +close[1] < +historyData[1]['1. open']){
        writeFile('analisy high -> ' + stock);

    }
}

const main2 = () => {
    if(i >= stocks.length) return;
    sleep(11000);
    const stock = stocks[i];
    writeFile('\r\nexecutando ' + stock + ' ' + new Date().toLocaleString());
    getHistoryInfo(stock)
        .then(historyData => {
            writeStock(stock, historyData);
            const close = historyData.map(h => h['5. adjusted close']);
            analisyHight(close, historyData, stock);
            i++;
            main2();
        })
        .catch(error => {
            writeFile(error);
            i++;
            main2();
        });

}

const writeFile = (text) => {
    console.log(text);
    fs.appendFileSync('logs.txt', '\n' + parseIfObject(text), function (err) {
        if (err) return writeFile(err);
      });
}

const writeStock = (stockName, stockData) => {
    fs.writeFile('./stocks/' + stockName + '.json', parseIfObject(stockData), function (err) {
        if (err) return writeFile(err);
      });
}

const parseIfObject = (text) => {
    try{
        return JSON.stringify(text);
    } catch(e){
        return text;
    }
}




function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

//=======================================

const tradingView = () => {
    request.post(
        'https://scanner.tradingview.com/brazil/scan',
        body).then(
        function (response) {
            stocks = response.data.data.map(stock => stock.d[1] + '.SAO').filter(stock => stock.indexOf('F.SAO') === -1);
            main2();
            writeFile(stocks.length);
        }
    );
}

let i = 0;
tradingView();
