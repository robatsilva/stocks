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
        const crescimento = $('#indicators-section > div.indicator-today-container > div > div:nth-child(5) > div > div:nth-child(2) > div > div > strong').text();
        utils.writeAnalisyHight('Análise ' + stock + ' ' + new Date().toLocaleString());
        utils.writeAnalisyHight('DY ' + dy);
        utils.writeAnalisyHight('PL ' + pl);
        utils.writeAnalisyHight('MEBITDA ' + mebitda);
        utils.writeAnalisyHight('Crescimento ' + crescimento);
        utils.writeAnalisyHight('');
    } catch (e){
        utils.writeFile('Erro - By & hold -> ' + stock);
    }
}

const buildSockInfo = (stocks) => {
    stocks.forEach((stock) => {
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
            utils.writeAnalisyHight('Quantidade de papeis para analisar - ' + stocks.length);
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