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
      const makeTD = (...texts) => {
        texts.forEach((text) => {
          utils.writeAnalisyHight("<td class=''>", false);
          utils.writeAnalisyHight(text);
          utils.writeAnalisyHight('</td>', false);
        });
      };
      utils.writeAnalisyHight('<tr>');
      makeTD(
        { name: stock, class: 'stock' },
        { name: dy, class: 'dy' },
        { name: pl, class: 'pl' },
        { name: mebitda, class: 'mebitda' },
        { name: crescimento, class: 'crescimento' },
        { name: liquidez, class: 'liquidez' }
      );
      utils.writeAnalisyHight('</tr>');
    } catch (e) {
      utils.writeFile('Erro - By & hold -> ' + stock + ' ' + e);
      return;
    }
  }
};

//=======================================

const getStocksInTradingView = () => {
  request
    .post('https://scanner.tradingview.com/brazil/scan', body)
    .then(function (response) {
      const stocks = response.data.data
        .map((stock) => stock.d[1])
        .filter((stock) => stock.indexOf('F') === -1);
      utils.writeAnalisyHight(
        'Quantidade de papeis para analisar - ' + stocks.length
      );
      // buildSockInfo([stocks[0], stocks[1]]);
      buildSockInfo(stocks);
    });
};

const init = () => {
  utils.clearFile();
  utils.clearAnalisy();
  utils.writeAnalisyHight(new Date().toDateString());
  utils.writeAnalisyLow(new Date().toDateString());

  getStocksInTradingView();
};

module.exports = { init };
