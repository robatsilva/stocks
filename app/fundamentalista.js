const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
var request = require('axios');
const body = require('../tradingview/filter-volume.json');
const utils = require('../utils/utils');
const cheerio = require('cheerio');
const { sleep } = require('../utils/utils');

const getStatusInvestIndicators = (stock) => {
    try{
        return request.get('https://statusinvest.com.br/acoes/' + stock.toLowerCase());
    } catch (e){
        utils.writeFile('Erro - By & hold -> ' + stock);
    }
}

const buildSockInfo = async (stocks) => {
    utils.writeAnalisyHight('<table>');
    utils.writeAnalisyHight('<tr>');
    utils.writeAnalisyHight('<th>');
    utils.writeAnalisyHight('Papel');
    utils.writeAnalisyHight('</th>');
    utils.writeAnalisyHight('<th>');
    utils.writeAnalisyHight('DY');
    utils.writeAnalisyHight('</th>');
    utils.writeAnalisyHight('<th>');
    utils.writeAnalisyHight('PL');
    utils.writeAnalisyHight('</th>');
    utils.writeAnalisyHight('<th>');
    utils.writeAnalisyHight('MEBITDA');
    utils.writeAnalisyHight('</th>');
    utils.writeAnalisyHight('<th>');
    utils.writeAnalisyHight('Crescimento');
    utils.writeAnalisyHight('</th>');
    utils.writeAnalisyHight('<th>');
    utils.writeAnalisyHight('Liquidez média diária');
    utils.writeAnalisyHight('</th>');
    utils.writeAnalisyHight('</th>');
    for(let stock of stocks){
        sleep(1000);
        let response;
        try{
            response = await getStatusInvestIndicators(stock);
        } catch (e){
            utils.writeFile('Erro - By & hold -> ' + stock);
            return;
        }
        const $ = cheerio.load(response.data);
        const dy = $('#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div:nth-child(4) > div > div:nth-child(1) > strong').text();
        const pl = $('#indicators-section > div.indicator-today-container > div > div:nth-child(1) > div > div:nth-child(2) > div > div > strong').text();
        const mebitda = $('#indicators-section > div.indicator-today-container > div > div:nth-child(3) > div > div:nth-child(2) > div > div > strong').text();
        const crescimento = $('#indicators-section > div.indicator-today-container > div > div:nth-child(5) > div > div:nth-child(2) > div > div > strong').text();
        const liquidez = $('#main-2 > div:nth-child(4) > div > div:nth-child(4) > div > div > div:nth-child(3) > div > div > div > strong').text();
        
        utils.writeAnalisyHight('<tr>');
        utils.writeAnalisyHight('<td>');
        utils.writeAnalisyHight(stock);
        utils.writeAnalisyHight('</td>');
        utils.writeAnalisyHight('<td>');
        utils.writeAnalisyHight(dy);
        utils.writeAnalisyHight('</td>');
        utils.writeAnalisyHight('<td>');
        utils.writeAnalisyHight(pl);
        utils.writeAnalisyHight('</td>');
        utils.writeAnalisyHight('<td>');
        utils.writeAnalisyHight(mebitda);
        utils.writeAnalisyHight('</td>');
        utils.writeAnalisyHight('<td>');
        utils.writeAnalisyHight(crescimento);
        utils.writeAnalisyHight('</td>');
        utils.writeAnalisyHight('<td>');
        utils.writeAnalisyHight(liquidez);
        utils.writeAnalisyHight('</td>');
        utils.writeAnalisyHight('</tr>');
    }
    utils.writeAnalisyHight('</table>');
 
}

//=======================================

const getStocksInTradingView = () => {
    request.post(
        'https://scanner.tradingview.com/brazil/scan',
        body).then(
        function (response) {
            
            const stocks = response.data.data.map(stock => stock.d[1]).filter(stock => stock.indexOf('F') === -1);
            utils.writeAnalisyHight('Quantidade de papeis para analisar - ' + stocks.length);
            buildSockInfo([stocks[0], stocks[1]]);
            // buildSockInfo(stocks);
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