const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
var request = require('axios');
const body = require('../tradingview/filter-volume.json');
const utils = require('../utils/utils');
const cheerio = require('cheerio');

const getStatusInvestIndicators = async (stock) => {
    try{
        const response = await request.get('https://statusinvest.com.br/acoes/' + stock.toLowerCase());
        const $ = cheerio.load(response.data);
        const dy = $('#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div:nth-child(4) > div > div:nth-child(1) > strong').text();
        const pl = $('#indicators-section > div.indicator-today-container > div > div:nth-child(1) > div > div:nth-child(2) > div > div > strong').text();
        const mebitda = $('#indicators-section > div.indicator-today-container > div > div:nth-child(3) > div > div:nth-child(2) > div > div > strong').text();

        utils.writeFile('DY ' + dy);
        utils.writeFile('PL ' + pl);
        utils.writeFile('MEBITDA ' + mebitda);
    } catch (e){
        utils.writeFile('By & hold -> ' + stock);
    }
}

const buildSockInfo = (stocks) => {
    stocks.forEach((stock) => {
        utils.writeFile('\r\nAnálise ' + stock + ' ' + new Date().toLocaleString());
        getStatusInvestIndicators(stock);
    })
 
}

//=======================================

const getStocksInTradingView = () => {
    request.post(
        'https://scanner.tradingview.com/brazil/scan',
        body).then(
        function (response) {
            
            const stocks = response.data.data.map(stock => stock.d[1]).filter(stock => stock.indexOf('F') === -1);
            utils.writeFile(stocks.length);
            buildSockInfo(stocks);
        }
    );
}

const init = ()=>{
    utils.clearFile();
    utils.clearAnalisy();
    utils.writeAnalisyHight(new Date().toDateString());
    utils.writeAnalisyLow(new Date().toDateString());
    
    getStocksInTradingView();
}

module.exports = { init }