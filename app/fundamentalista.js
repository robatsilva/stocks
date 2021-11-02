const alpha = require('alphavantage')({ key: 'C5897QEPYF5GF2VG' });
var request = require('axios');
const body = require('../tradingview/filter-fundamentalista.json');
const utils = require('../utils/utils');
const cheerio = require('cheerio');
const { sleep } = require('../utils/utils');

const getStatusInvestIndicators = (stock) => {
  try {
    return request.get(
      'https://statusinvest.com.br/acoes/' + stock.toLowerCase()
    );
  } catch (e) {
    utils.writeFile('Erro - By & hold -> ' + stock + ' ' + e);
  }
};

const buildSockInfo = async (stocks) => {
  for (let stock of stocks) {
    sleep(500);
    try {
      let response;
      response = await getStatusInvestIndicators(stock);
      const $ = cheerio.load(response.data);
      const dy = $(
        '#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div:nth-child(4) > div > div:nth-child(1) > strong'
      ).text();
      const pl = $(
        '#indicators-section > div.indicator-today-container > div > div:nth-child(1) > div > div:nth-child(2) > div > div > strong'
      ).text();
      const mebitda = $(
        '#indicators-section > div.indicator-today-container > div > div:nth-child(3) > div > div:nth-child(2) > div > div > strong'
      ).text();
      const crescimento = $(
        '#indicators-section > div.indicator-today-container > div > div:nth-child(5) > div > div:nth-child(2) > div > div > strong'
      ).text();
      const liquidez = $(
        '#main-2 > div:nth-child(4) > div > div:nth-child(4) > div > div > div:nth-child(3) > div > div > div > strong'
      ).text();
      const makeTD = (...indicators) => {
        indicators.forEach((indicator) => {
          utils.writeTable("<td class="+ indicator.name + ">", false);
          utils.writeTable(indicator.value);
          utils.writeTable('</td>', false);
        });
      };
      utils.writeTable('<tr>');
      makeTD(
        { value: stock, name: 'stock' },
        { value: dy, name: 'dy' },
        { value: pl, name: 'pl' },
        { value: mebitda, name: 'mebitda' },
        { value: crescimento, name: 'crescimento' },
        { value: liquidez, name: 'liquidez' }
      );
      utils.writeTable('</tr>');
    } catch (e) {
      utils.writeFile('Erro - By & hold -> ' + stock + ' ' + e);
      return;
    }
    utils.gitPush();
  }
};

//=======================================

const getStocksInTradingView = () => {
  request
    .post('https://scanner.tradingview.com/brazil/scan', body)
    .then(function (response) {
      const stocks = response.data.data
        .filter((stock) => !stock.d[12].includes('FII'))
        .map((stock) => stock.d[1])
        .filter((stock) => stock.indexOf('F') === -1);
      utils.writeTable(
        'Quantidade de papeis para analisar - ' + stocks.length
      );
      // buildSockInfo([stocks[0], stocks[1]]);
      buildSockInfo(stocks);
    });
};

const init = () => {
  utils.clearFile();
  utils.clearAnalisy();
  utils.writeTable(new Date().toDateString());
  utils.writeAnalisyLow(new Date().toDateString());

  getStocksInTradingView();
};

module.exports = { init };
