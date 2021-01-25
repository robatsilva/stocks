const fs = require('fs');
module.exports = {
    writeFile: (text) => {
        console.log(text);
        fs.appendFileSync('logs.txt', '\n' + parseIfObject(text), function (err) {
            if (err) return writeFile(err);
          });
    },
    
    writeStock: (stockName, stockData) => {
        fs.writeFile('./stocks/' + stockName + '.json', parseIfObject(stockData), function (err) {
            if (err) return writeFile(err);
          });
    },
    
    sleep: (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
}

const parseIfObject = (text) => {
    try{
        return JSON.stringify(text);
    } catch(e){
        return text;
    }
}